import React, { useRef, useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import protegoLogo from '../assets/images/protego_shield_logo_1791520495337.jpg';

export const InteractiveHeroTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse tracking with requestAnimationFrame
  const currentRotation = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const targetRotation = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    let animId: number;
    let autoAngle = 0;

    const updateTilt = () => {
      if (!isHovered) {
        // Subtle floating idle motion when mouse isn't hovering
        autoAngle += 0.02;
        targetRotation.current.x = Math.sin(autoAngle) * 3;
        targetRotation.current.y = Math.cos(autoAngle * 0.7) * 4;
        targetRotation.current.tx = Math.sin(autoAngle * 0.5) * 4;
        targetRotation.current.ty = Math.cos(autoAngle * 0.6) * 3;
      }

      // Smooth interpolation toward target
      const ease = isHovered ? 0.12 : 0.05;
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * ease;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * ease;
      currentRotation.current.tx += (targetRotation.current.tx - currentRotation.current.tx) * ease;
      currentRotation.current.ty += (targetRotation.current.ty - currentRotation.current.ty) * ease;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${currentRotation.current.x.toFixed(2)}deg) rotateY(${currentRotation.current.y.toFixed(2)}deg) translate3d(${currentRotation.current.tx.toFixed(1)}px, ${currentRotation.current.ty.toFixed(1)}px, 0)`,
        transformStyle: 'preserve-3d',
      });

      animId = requestAnimationFrame(updateTilt);
    };

    animId = requestAnimationFrame(updateTilt);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized from -1 to 1
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    // Invert X/Y for natural 3D tilt facing cursor
    targetRotation.current.y = normX * 18; // Max 18 deg yaw
    targetRotation.current.x = -normY * 16; // Max 16 deg pitch
    targetRotation.current.tx = normX * 14;
    targetRotation.current.ty = normY * 10;

    setCoords({ x: normX, y: normY });
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative select-none cursor-pointer py-4 px-6 mx-auto max-w-4xl"
      style={{ perspective: 1200 }}
    >
      {/* 3D Animated Card Container */}
      <div
        style={tiltStyle}
        className="relative transition-shadow duration-300"
      >
        {/* Dynamic Specular Sheen Layer that follows mouse */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl opacity-60 transition-opacity duration-300 -z-10"
          style={{
            background: `radial-gradient(circle 320px at ${sheenPos.x}% ${sheenPos.y}%, rgba(6, 182, 212, 0.22), transparent 70%)`,
          }}
        />

        {/* Ambient Backing Glow */}
        <div
          className="absolute -inset-4 rounded-3xl bg-cyan-500/15 blur-2xl opacity-50 transition-opacity duration-500 -z-20"
          style={{
            transform: `translate3d(${-coords.x * 20}px, ${-coords.y * 15}px, -20px)`,
          }}
        />

        {/* Targeting corner reticles */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl transition-transform duration-300" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr transition-transform duration-300" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl transition-transform duration-300" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br transition-transform duration-300" />

        {/* Hologram Badge & 3D Metallic Emblem */}
        <div className="flex flex-col items-center justify-center gap-3 mb-4">
          {/* 3D Floating Metallic Emblem */}
          <div
            className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-[#091122]/90 border border-cyan-400/50 p-1 shadow-[0_0_35px_rgba(6,182,212,0.5)] group hover:border-cyan-300 transition-all duration-300"
            style={{ transform: 'translateZ(65px)' }}
          >
            {/* Pulsing orbital rings */}
            <div className="absolute -inset-2 rounded-2xl border border-cyan-400/30 border-dashed animate-[spin_12s_linear_infinite] pointer-events-none" />
            <div className="absolute -inset-4 rounded-3xl border border-blue-500/20 border-dotted animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

            <img
              src={protegoLogo}
              alt="Protego Maxima Official Emblem"
              className="h-full w-full object-contain rounded-xl drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3.5 py-1 text-[11px] font-mono text-cyan-300 shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>BAYORA ADAPTIVE ZERO-TRUST PLATFORM</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-semibold">EST. 2026</span>
          </div>
        </div>

        {/* MAIN TITLE: PROTEGO MAXIMA */}
        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-none text-center font-sans drop-shadow-[0_10px_25px_rgba(6,182,212,0.3)]"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <span className="bg-gradient-to-b from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
            PROTEGO
          </span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent underline decoration-cyan-500/30 decoration-wavy decoration-2">
            MAXIMA
          </span>
        </h1>

        {/* Subtitle with slight 3D elevation */}
        <p
          className="mt-4 text-base sm:text-xl font-medium text-slate-300 tracking-wide text-center max-w-2xl mx-auto"
          style={{
            transform: 'translateZ(25px)',
          }}
        >
          Adaptive Zero-Trust Infrastructure for Adversarial AI Safety Testing
        </p>

        {/* Hover direction indicator */}
        <div
          className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-cyan-400/70"
          style={{ transform: 'translateZ(15px)' }}
        >
          <span>PITCH: {(-coords.y * 15).toFixed(1)}°</span>
          <span>·</span>
          <span>YAW: {(coords.x * 18).toFixed(1)}°</span>
          <span>·</span>
          <span>HOLOGRAPHIC PARALLAX</span>
        </div>
      </div>
    </div>
  );
};
