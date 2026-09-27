"use client";

import React, { useEffect, useRef, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { NOTIF_BLUE } from '@/lib/bot/decor';
import { BotEngine, type BotFrame } from '@/lib/bot/engine';
import { clamp, easings } from '@/lib/bot/math';
import { lookTarget, TURN_TIME, type GazeScript } from '@/lib/ui/gaze';
import { DEFAULT_EXPRESSION, EXPRESSION_BY_ID } from '@/lib/bot/expressions';
import { COLOR_BY_ID, DEFAULT_COLOR, DEFAULT_SHAPE, SHAPE_BY_ID, mixHex } from '@/lib/bot/skins';
import { blockAt, defaultCycle, offsetOf, type Block } from '@/lib/bot/cycles';
import { DEMI_VIEWBOX, RAYON } from '@/lib/bot/repere';
import { STATE_BY_ID, type StateId } from '@/lib/bot/states';

export interface BloubBotProps {
  size?: number;
  shape?: string;
  color?: string;
  expression?: string;
  paper?: string;
  frozenAt?: number;
  cycle?: Block[];
  follow?: boolean;
  gaze?: GazeScript | null;
  block?: number;
  state?: StateId;
  playing?: boolean;
  onBlockChange?: (block: number) => void;
  onStateChange?: (state: StateId) => void;
  onElapsedChange?: (elapsed: number) => void;
}

export interface BloubBotRef {
  seek: (index: number, offset?: number) => void;
  rendAt: (t: number) => void;
}

const R = RAYON;
const VB = DEMI_VIEWBOX;

export const BloubBot = forwardRef<BloubBotRef, BloubBotProps>((props, ref) => {
  const {
    size = 320,
    shape = DEFAULT_SHAPE,
    color = DEFAULT_COLOR,
    expression = DEFAULT_EXPRESSION,
    paper = 'transparent',
    frozenAt,
    cycle = defaultCycle().blocks,
    follow = false,
    gaze = null,
    block = 0,
    state = 'idle',
    playing = false,
    onBlockChange,
    onStateChange,
    onElapsedChange,
  } = props;

  const shapeRadii = useMemo(() => SHAPE_BY_ID.get(shape)?.radii ?? null, [shape]);
  const ink = useMemo(() => COLOR_BY_ID.get(color)?.hex ?? '#0a0a0c', [color]);
  const botExpression = useMemo(() => EXPRESSION_BY_ID.get(expression) ?? null, [expression]);

  const engineRef = useRef(new BotEngine(R, state, shapeRadii, botExpression));
  const engine = engineRef.current;

  const [frame, setFrame] = useState<BotFrame>(engine.sample(frozenAt ?? 0));
  const rawId = React.useId();
  const uid = useMemo(() => rawId.replace(/:/g, ''), [rawId]);
  const maskId = `bot-mask-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);

  const varsRef = useRef({
    nextAt: Infinity,
    last: 0,
    clock: 0,
    blockStart: 0,
    pendingOffset: 0,
    dernierBloc: -1,
    pointer: null as { x: number; y: number } | null,
    aiming: false,
    turnSince: 0,
    gazeSince: 0,
    scripted: false,
  });

  const v = varsRef.current;

  const apply = (i: number, from = 0) => {
    const b = cycle[i];
    if (!b) {
      v.nextAt = Infinity;
      return;
    }
    v.blockStart = v.clock - from;
    onElapsedChange?.(from);
    onStateChange?.(b.state);
    engine.setState(b.state, v.clock);
    v.nextAt = playing ? v.blockStart + b.duration : Infinity;
  };

  const goToBlock = (i: number) => {
    onBlockChange?.(i);
    apply(i);
  };

  useImperativeHandle(ref, () => ({
    seek(index: number, offset = 0) {
      if (block === index) {
        apply(index, offset);
        return;
      }
      v.pendingOffset = offset;
      onBlockChange?.(index);
    },
    rendAt(t: number) {
      const blocs = cycle;
      if (!blocs.length) return;
      const { index } = blockAt(blocs, t);
      if (index !== v.dernierBloc) {
        const b = blocs[index]!;
        onStateChange?.(b.state);
        if (index < v.dernierBloc) engine.reset(b.state, offsetOf(blocs, index));
        else engine.setState(b.state, offsetOf(blocs, index));
        v.dernierBloc = index;
      }
      setFrame(engine.sample(t));
    }
  }));

  const release = () => {
    if (!v.aiming) return;
    engine.setLook(null, v.clock, TURN_TIME);
    v.aiming = false;
  };

  const aim = () => {
    if (!STATE_BY_ID.get(state)?.baseFace) {
      release();
      return;
    }
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return;
    if (!v.aiming) v.turnSince = v.clock;
    const demiLargeur = Math.max(1, window.innerWidth / 2);
    const demiHauteur = Math.max(1, window.innerHeight / 2);
    engine.setLook(
      lookTarget({
        nx: v.pointer ? clamp((v.pointer.x - (box.left + box.width / 2)) / demiLargeur, -1, 1) : 0,
        ny: v.pointer ? clamp((v.pointer.y - (box.top + box.height / 2)) / demiHauteur, -1, 1) : 0,
        tour: easings.easeOutQuint(clamp((v.clock - v.turnSince) / TURN_TIME)),
        pointer: v.pointer !== null
      }),
      v.clock
    );
    v.aiming = true;
  };

  const SCRIPT_MORPH = 1 / 60;

  const scriptedGaze = (run: GazeScript) => {
    engine.setLook(run(v.clock - v.gazeSince), v.clock, SCRIPT_MORPH);
  };

  useEffect(() => {
    if (gaze) {
      v.gazeSince = v.clock;
      v.scripted = true;
      engine.setLook(gaze(0), v.clock - SCRIPT_MORPH, SCRIPT_MORPH);
    } else if (v.scripted) {
      engine.setLook(null, v.clock);
      v.scripted = false;
    }
  }, [gaze, engine, v]);

  useEffect(() => {
    const tick = (ms: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = v.last ? Math.min((ms - v.last) / 1000, 0.064) : 0;
      v.last = ms;
      v.clock += dt;

      if (playing) {
        if (v.clock >= v.nextAt && cycle.length) {
          goToBlock((block + 1) % cycle.length);
        } else {
          onElapsedChange?.(v.clock - v.blockStart);
        }
      }

      if (follow) aim();
      else if (gaze) scriptedGaze(gaze);

      setFrame(engine.sample(v.clock));
    };

    if (frozenAt !== undefined) return;
    apply(block, 0 /* elapsed */);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // Only mount once

  const redrawFrozen = () => {
    if (frozenAt === undefined) return;
    setFrame(engine.sample(frozenAt));
  };

  useEffect(() => {
    apply(block, v.pendingOffset);
    v.pendingOffset = 0;
  }, [block]);

  useEffect(() => {
    if (engine.state === state) return;
    engine.setState(state, v.clock);
    redrawFrozen();
  }, [state]);

  useEffect(() => {
    if (playing) apply(block, 0);
    else v.nextAt = Infinity;
  }, [playing]);

  useEffect(() => {
    engine.setShape(shapeRadii, v.clock);
    redrawFrozen();
  }, [shapeRadii]);

  useEffect(() => {
    engine.setExpression(botExpression, v.clock);
    redrawFrozen();
  }, [botExpression]);

  useEffect(() => {
    redrawFrozen();
  }, [frozenAt]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      v.pointer = { x: e.clientX, y: e.clientY };
    };
    const onPointerLeave = () => {
      v.pointer = null;
    };

    if (follow && frozenAt === undefined) {
      window.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerleave', onPointerLeave);
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
      };
    } else {
      release();
    }
  }, [follow, frozenAt, v]);

  const dotAttrs = (dot: BotFrame['dots'][number]) => {
    const fill = dot.color ?? (dot.depth === undefined ? ink : mixHex(paper === 'transparent' ? '#ffffff' : paper, ink, dot.depth));
    const common = { fill, opacity: dot.opacity };
    return dot.d
      ? {
          ...common,
          d: dot.d,
          transform: `translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`
        }
      : { ...common, cx: dot.x, cy: dot.y, r: dot.r };
  };

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
      role="img"
      aria-label="Bot"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-VB}
          y={-VB}
          width={VB * 2}
          height={VB * 2}
        >
          <path d={frame.bodyPath} fill="#fff" />
          {frame.eyes.map((eye, i) => (
            <path
              key={i}
              d={eye.d}
              transform={eye.matrix}
              opacity={eye.alpha}
              fill="#000"
            />
          ))}
          {frame.notch && (
            <circle
              cx={frame.notch.x}
              cy={frame.notch.y}
              r={frame.notch.r}
              fill="#000"
            />
          )}
        </mask>

        {frame.arcs.map((arc) => (
          <linearGradient
            key={arc.id}
            id={`${uid}-${arc.id}`}
            gradientUnits="userSpaceOnUse"
            x1={arc.grad.x1}
            y1={arc.grad.y1}
            x2={arc.grad.x2}
            y2={arc.grad.y2}
          >
            {arc.grad.stops.map((c, i) => (
              <stop
                key={i}
                offset={i / (arc.grad.stops.length - 1)}
                stopColor={c}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`b${arc.id}`}
            d={arc.back}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>

      {frame.dotsBehind && (
        <g>
          {frame.dots.map((dot, i) =>
            dot.d ? (
              <path key={`pb${i}`} {...dotAttrs(dot) as any} />
            ) : (
              <circle key={`pb${i}`} {...dotAttrs(dot) as any} />
            )
          )}
        </g>
      )}

      <g opacity={frame.bodyAlpha}>
        {paper !== 'transparent' && <path d={frame.bodyPath} fill={paper} />}
        <g mask={`url(#${maskId})`}>
          <rect x={-VB} y={-VB} width={VB * 2} height={VB * 2} fill={ink} />
        </g>
      </g>

      {!frame.dotsBehind && (
        <g>
          {frame.dots.map((dot, i) =>
            dot.d ? (
              <path key={`pf${i}`} {...dotAttrs(dot) as any} />
            ) : (
              <circle key={`pf${i}`} {...dotAttrs(dot) as any} />
            )
          )}
        </g>
      )}

      {frame.notif && (
        <circle
          cx={frame.notif.x}
          cy={frame.notif.y}
          r={frame.notif.r}
          fill={NOTIF_BLUE}
        />
      )}

      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`f${arc.id}`}
            d={arc.front}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>
    </svg>
  );
});
BloubBot.displayName = 'BloubBot';
