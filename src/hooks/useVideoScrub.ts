import { useEffect, useRef, useState } from 'react';
import * as MP4Box from 'mp4box';

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 60000;

export function useVideoScrub(videoSrc: string, getProgress: () => number) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const stateRef = useRef({
    bank: [] as { ts: number, blob: Blob }[],
    lru: new Map<number, ImageBitmap | null>(),
    current: 0,
    target: 0,
    ready: false,
    reverted: false,
    painted: false,
    building: false,
    dur: 0,
    lastTime: performance.now(),
    watchdogStart: performance.now(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }
  }, []);

  useEffect(() => {
    let active = true;
    const state = stateRef.current;
    if (state.building || state.ready || state.reverted) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof window.VideoDecoder === 'undefined') {
      state.reverted = true;
      return;
    }

    state.building = true;
    state.watchdogStart = performance.now();

    let decoder: VideoDecoder;
    let file = MP4Box.createFile();
    let videoTrack: any = null;

    const buildBank = async () => {
      try {
        const response = await fetch(videoSrc);
        if (!response.body) throw new Error('No response body');
        
        const reader = response.body.getReader();
        let offset = 0;
        
        file.onReady = (info: any) => {
          videoTrack = info.videoTracks[0];
          if (!videoTrack) {
            state.reverted = true;
            return;
          }
          state.dur = videoTrack.duration / videoTrack.timescale;
          
          let description = new Uint8Array(0);
          if (videoTrack.codec.startsWith('avc1')) {
             const track = file.getTrackById(videoTrack.id);
             // @ts-ignore
             if (track && track.mdia && track.mdia.minf && track.mdia.minf.stbl && track.mdia.minf.stbl.stsd && track.mdia.minf.stbl.stsd.entries[0].avcC) {
               // @ts-ignore
               description = track.mdia.minf.stbl.stsd.entries[0].avcC.box; // simplistic extraction, might need to parse properly
             }
          }
          // We can just rely on the codec string and hope the browser can configure it if description is missing or hard to extract manually
          
          file.setExtractionOptions(videoTrack.id, null, { nbSamples: 10000 });
          file.start();
        };

        file.onSamples = (id: number, user: any, samples: any[]) => {
          if (!active) return;
          
          decoder = new VideoDecoder({
            output: async (frame) => {
              const ts = frame.timestamp;
              const offscreen = new OffscreenCanvas(frame.codedWidth, frame.codedHeight);
              const ctx = offscreen.getContext('2d');
              ctx?.drawImage(frame, 0, 0);
              frame.close();
              
              const blob = await offscreen.convertToBlob({ type: 'image/webp', quality: 0.82 });
              state.bank.push({ ts, blob });
              state.bank.sort((a, b) => a.ts - b.ts);
              
              if (state.bank.length > 30 && !state.ready) {
                state.ready = true;
              }
            },
            error: (e) => {
              console.warn('VideoDecoder error', e);
              state.reverted = true;
            }
          });
          
          const config: VideoDecoderConfig = {
            codec: videoTrack.codec,
          };
          
          // Basic check for avc1
          if (videoTrack.codec.startsWith('avc1')) {
            // WebCodecs typically needs the description (avcC) for avc1
            const trak = file.getTrackById(videoTrack.id);
            try {
              // @ts-ignore
              config.description = trak.mdia.minf.stbl.stsd.entries[0].avcC.write(); // simplified write if available
            } catch(e) {}
          }

          decoder.configure(config);

          samples.forEach((s) => {
            const chunk = new EncodedVideoChunk({
              type: s.is_sync ? 'key' : 'delta',
              timestamp: (s.cts / videoTrack.timescale) * 1e6,
              duration: (s.duration / videoTrack.timescale) * 1e6,
              data: s.data
            });
            decoder.decode(chunk);
          });
          decoder.flush();
        };

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;
          // @ts-ignore
          value.fileStart = offset;
          offset += value.length;
          file.appendBuffer(value.buffer as ArrayBuffer);
        }
        file.flush();

      } catch (err) {
        console.warn('Error building frame bank', err);
        state.reverted = true;
      }
    };
    buildBank();

    return () => {
      active = false;
      if (decoder) decoder.close();
    };
  }, [videoSrc]);

  useEffect(() => {
    let rafId: number;
    const state = stateRef.current;
    
    // Watchdog
    const watchdogInterval = setInterval(() => {
      if (!state.ready && performance.now() - state.watchdogStart > WATCHDOG) {
        state.reverted = true;
      }
    }, 1000);

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - state.lastTime) / 1000);
      state.lastTime = now;
      
      const p = getProgress();
      setScrollProgress(p);

      const video = videoRef.current;
      const dur = video?.duration || state.dur;

      if (dur > 0) {
        state.target = p * dur;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
          state.current = state.target;
        } else {
          state.current += (state.target - state.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(state.target - state.current) < SNAP) {
            state.current = state.target;
          }
        }

        if (state.ready && !state.reverted) {
          const targetTs = state.current * 1e6;
          // Binary search for nearest frame
          let l = 0; let r = state.bank.length - 1;
          let nearestIndex = 0;
          let minDiff = Infinity;
          while (l <= r) {
            const m = Math.floor((l + r) / 2);
            const diff = Math.abs(state.bank[m].ts - targetTs);
            if (diff < minDiff) {
              minDiff = diff;
              nearestIndex = m;
            }
            if (state.bank[m].ts < targetTs) l = m + 1;
            else r = m - 1;
          }

          // Warm LRU
          for (let i = Math.max(0, nearestIndex - 1); i <= Math.min(state.bank.length - 1, nearestIndex + 2); i++) {
            if (!state.lru.has(i)) {
              state.lru.set(i, null); // Loading
              createImageBitmap(state.bank[i].blob).then(bmp => {
                if (state.lru.has(i)) state.lru.set(i, bmp);
              });
            }
          }

          // Evict
          if (state.lru.size > LRU_MAX) {
            const keys = Array.from(state.lru.keys());
            for (const k of keys) {
              if (Math.abs(k - nearestIndex) > 5) {
                const bmp = state.lru.get(k);
                if (bmp) bmp.close();
                state.lru.delete(k);
              }
              if (state.lru.size <= LRU_MAX) break;
            }
          }

          // Draw
          const bmp = state.lru.get(nearestIndex);
          if (bmp && ctxRef.current) {
            ctxRef.current.drawImage(bmp, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
            if (!state.painted) {
              state.painted = true;
              setCanvasLive(true);
            }
          }
        } else {
          // Fallback
          if (video && Math.abs(video.currentTime - state.current) > 0.01) {
             video.currentTime = state.current;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(watchdogInterval);
    };
  }, [getProgress]);

  return { videoRef, canvasRef, scrollProgress, canvasLive };
}
