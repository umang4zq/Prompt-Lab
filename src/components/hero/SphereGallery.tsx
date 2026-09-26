import React, { useEffect, useRef } from 'react';
import './SphereGallery.css';

interface SphereGalleryProps {
  items: React.ReactNode[];
  title?: React.ReactNode;
}

export default function SphereGallery({ 
  items, 
  title = "AI Skills Showcase" 
}: SphereGalleryProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    dragX: 0, dragY: 0, velX: 0, velY: 0,
    spin: 0, tilt: -4, camZ: 0,
    isDragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0,
    dragTouchValid: false
  });

  const cardsData = useRef<any[]>([]);
  const R_ref = useRef(0);

  // 1. Generate Fibonacci sphere data
  useEffect(() => {
    const N = items.length;
    const GA = Math.PI * (3 - Math.sqrt(5));
    cardsData.current = [];
    
    for (let i = 0; i < N; i++) {
      let y = 1 - (i / (N - 1)) * 2;
      let rad = Math.sqrt(Math.max(0, 1 - y * y));
      let theta = i * GA;
      let x = Math.cos(theta) * rad;
      let z = Math.sin(theta) * rad;
      let lat = (Math.asin(y) * 180) / Math.PI;
      let lon = (Math.atan2(x, z) * 180) / Math.PI;
      cardsData.current.push({ x, y, z, lat, lon, d: -1, fade: -1 });
    }
  }, [items]);

  // 2. Setup ResizeObserver for responsive layout
  useEffect(() => {
    const relayout = (w: number, h: number) => {
      let hr = w <= 380 ? 0.38 : w <= 640 ? 0.42 : 0.46;
      let wr = w <= 380 ? 0.48 : w <= 640 ? 0.52 : 0.58;
      let floor = w <= 380 ? 108 : w <= 640 ? 120 : 155;
      let R = Math.max(floor, Math.min(480, h * hr, w * wr));
      R_ref.current = R;

      let scale = w <= 380 ? 0.44 : w <= 640 ? 0.46 : 0.47;
      let cw = Math.round(Math.max(72, R * scale));
      let persp = w <= 380 ? 620 : w <= 640 ? 760 : w <= 900 ? 920 : 1150;
      
      if (stageRef.current) {
        stageRef.current.style.setProperty('--persp', `${persp}px`);
      }

      if (orbRef.current) {
        const children = orbRef.current.children;
        for (let i = 0; i < children.length; i++) {
          let cd = cardsData.current[i];
          if (!cd) continue;
          let el = children[i] as HTMLElement;
          let cardW = cw;
          let cardH = cw / 0.75; // aspect 3:4 portrait
          let mL = -cardW / 2;
          let mT = -cardH / 2;
          let scaleFactor = cardW / 600;

          el.style.width = cardW + 'px';
          el.style.height = cardH + 'px';
          el.style.marginLeft = mL + 'px';
          el.style.marginTop = mT + 'px';
          el.style.setProperty('--scale-factor', scaleFactor.toString());
          el.style.transform = `translate3d(${cd.x * R}px, ${-cd.y * R}px, ${cd.z * R}px) rotateY(${cd.lon}deg) rotateX(${cd.lat}deg)`;
        }
      }
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        relayout(entry.contentRect.width, entry.contentRect.height);
      }
    });

    if (stageRef.current) {
      resizeObserver.observe(stageRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [items]);

  // 3. Animation loop for dragging and 3D rotation
  useEffect(() => {
    let animationId: number;
    const loop = () => {
      const st = dragState.current;
      const R = R_ref.current;

      // Inertia / momentum
      st.dragX += st.velX;
      st.dragY += st.velY;
      
      // Auto-rotation when not dragging
      if (!st.isDragging && Math.abs(st.velX) < 0.05) {
        st.dragX += 0.05;
      }

      st.velX *= 0.94;
      st.velY *= 0.94;
      if (Math.abs(st.velX) < 0.002) st.velX = 0;
      if (Math.abs(st.velY) < 0.002) st.velY = 0;
      
      // Clamp vertical tilt
      let nextTilt = st.tilt + st.dragY;
      if (nextTilt > 32) { st.dragY = 32 - st.tilt; st.velY = 0; }
      if (nextTilt < -32) { st.dragY = -32 - st.tilt; st.velY = 0; }
      
      let sx = st.tilt + st.dragY;
      let sy = st.spin + st.dragX;

      if (worldRef.current && headlineRef.current) {
        worldRef.current.style.transform = `translateZ(${st.camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
        headlineRef.current.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${R * 0.62}px)`;
      }

      let perspStr = stageRef.current?.style.getPropertyValue('--persp') || '1150px';
      let persp = parseInt(perspStr, 10);
      let near = persp * 0.66;
      let syRad = sy * Math.PI / 180, sxRad = sx * Math.PI / 180;
      let cosSy = Math.cos(syRad), sinSy = Math.sin(syRad);
      let cosSx = Math.cos(sxRad), sinSx = Math.sin(sxRad);

      if (orbRef.current) {
        const children = orbRef.current.children;
        for (let i = 0; i < children.length; i++) {
          let cd = cardsData.current[i];
          if (!cd) continue;
          let vx0 = cd.x, vy0 = -cd.y, vz0 = cd.z;
          let vx1 = vx0 * cosSy + vz0 * sinSy;
          let vy1 = vy0;
          let vz1 = -vx0 * sinSy + vz0 * cosSy;
          
          let vx2 = vx1;
          let vy2 = vy1 * cosSx - vz1 * sinSx;
          let vz2 = vy1 * sinSx + vz1 * cosSx;
          let zf = vz2;
      
          let base = 0.14 + 0.86 * Math.pow((zf + 1)/2, 0.85);
          let dim = 1 - base;
          if (dim > 1) dim = 1;
          
          let absZ = zf * R + st.camZ;
          let fade = 1;
          if (absZ > near) fade = Math.max(0, 1 - (absZ - near) / 190);
      
          let el = children[i] as HTMLElement;
          let fig = el.firstChild as HTMLElement;
          
          if (Math.abs(cd.d - dim) > 0.005) {
            fig.style.setProperty('--d', dim.toString());
            cd.d = dim;
          }
          if (Math.abs(cd.fade - fade) > 0.005) {
            el.style.opacity = fade.toString();
            cd.fade = fade;
            // Disable pointer events when faded out completely
            el.style.pointerEvents = fade < 0.1 ? 'none' : 'auto';
          }
        }
      }

      animationId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // 4. Pointer events
  const handlePointerDown = (e: React.PointerEvent) => {
    const st = dragState.current;
    st.isDragging = true;
    st.startX = e.clientX;
    st.startY = e.clientY;
    st.lastX = st.startX;
    st.lastY = st.startY;

    if (e.pointerType === 'touch') {
      st.dragTouchValid = false;
    } else {
      st.dragTouchValid = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const st = dragState.current;
    if (!st.isDragging) return;

    let dx = e.clientX - st.lastX;
    let dy = e.clientY - st.lastY;

    if (e.pointerType === 'touch' && !st.dragTouchValid) {
      let totX = Math.abs(e.clientX - st.startX);
      let totY = Math.abs(e.clientY - st.startY);
      if (totX > 10 || totY > 10) {
        if (totY > totX * 1.15) {
          st.isDragging = false;
          return;
        } else {
          st.dragTouchValid = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
      } else {
        return;
      }
    }

    if (st.dragTouchValid) {
      st.velX = dx * 0.13;
      st.velY = dy * 0.13;
      st.dragX += st.velX;
      st.dragY += st.velY;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const st = dragState.current;
    if (!st.isDragging) return;
    st.isDragging = false;
    if (st.dragTouchValid) {
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch (err) {}
    }
  };

  const handlePointerCancel = () => {
    dragState.current.isDragging = false;
  };

  return (
    <div 
      className="sphere-stage" 
      ref={stageRef} 
      onPointerDown={handlePointerDown} 
      onPointerMove={handlePointerMove} 
      onPointerUp={handlePointerUp} 
      onPointerCancel={handlePointerCancel}
    >
      <div className="sphere-world" ref={worldRef}>
        <div className="sphere-orb" ref={orbRef}>
          {items.map((node, idx) => (
            <div key={idx} className="sphere-card">
              <figure className="sphere-figure">
                <div className="absolute top-0 left-0 overflow-hidden pointer-events-none origin-top-left" style={{ width: '600px', height: '800px', transform: 'scale(var(--scale-factor, 1))' }}>
                    {node}
                </div>
              </figure>
            </div>
          ))}
        </div>
        <div className="sphere-headline" ref={headlineRef}>
          <div className="sphere-inner">{title}</div>
        </div>
      </div>
    </div>
  );
}
