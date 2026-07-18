"use client";

import { useEffect, useRef, useMemo } from "react";

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  sizeRange?: [number, number];
  speedRange?: [number, number];
  opacityRange?: [number, number];
  className?: string;
  shape?: "circle" | "square" | "triangle" | "mixed";
  interactive?: boolean;
}

/**
 * Lightweight CSS-based floating particles for ambient background decoration.
 * No Three.js - pure HTML/CSS for maximum performance.
 */
export default function FloatingParticles({
  count = 20,
  color = "rgba(245, 168, 0, 0.15)",
  sizeRange = [4, 24],
  speedRange = [15, 35],
  opacityRange = [0.05, 0.2],
  className = "",
  shape = "mixed",
  interactive = true,
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      const duration = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
      const delay = Math.random() * -duration;
      const opacity = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);
      const startX = Math.random() * 100;
      const startY = 100 + Math.random() * 50;
      const endY = -50 - Math.random() * 50;
      const driftX = (Math.random() - 0.5) * 30;

      let borderRadius = "50%";
      let clipPath = "none";
      if (shape === "square") borderRadius = "0";
      else if (shape === "triangle") {
        borderRadius = "0";
        clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      } else if (shape === "mixed") {
        const r = Math.random();
        if (r < 0.33) borderRadius = "0";
        else if (r < 0.66) {
          borderRadius = "0";
          clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
        }
      }

      arr.push({
        id: i,
        size,
        duration,
        delay,
        opacity,
        startX,
        startY,
        endY,
        driftX,
        borderRadius,
        clipPath,
      });
    }
    return arr;
  }, [count, sizeRange, speedRange, opacityRange, shape]);

  useEffect(() => {
    if (!interactive || !containerRef.current) return;

    const container = containerRef.current;
    let animationFrame: number | undefined;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        const p = particles[index];
        const dx = mouseX - (p.startX / 100) * rect.width;
        const dy = mouseY - (p.startY / 100) * rect.height;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 30;
          const angle = Math.atan2(dy, dx);
          particle.style.transform += ` translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [interactive, particles]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          ref={(el) => { if (el) particlesRef.current[p.id] = el; }}
          className="absolute will-change-transform"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            background: color,
            borderRadius: p.borderRadius,
            clipPath: p.clipPath,
            opacity: p.opacity,
            transform: `translateY(0) translateX(0)`,
            animation: `float-${p.id} ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <style jsx>{`
            @keyframes float-${p.id} {
              0% {
                transform: translateY(0) translateX(0);
                opacity: ${p.opacity};
              }
              50% {
                transform: translateY(${((p.endY - p.startY) / 2)}%) translateX(${p.driftX}px);
                opacity: ${p.opacity * 1.5};
              }
              100% {
                transform: translateY(${p.endY - p.startY}%) translateX(${p.driftX * 2}px);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}

/**
 * Golden dust particles - premium subtle effect
 */
export function GoldenDust({ className = "", count = 30 }: { className?: string; count?: number }) {
  return (
    <FloatingParticles
      count={count}
      color="rgba(245, 168, 0, 0.2)"
      sizeRange={[2, 8]}
      speedRange={[20, 40]}
      opacityRange={[0.03, 0.15]}
      shape="circle"
      className={className}
    />
  );
}

/**
 * Green geometric particles - for academic sections
 */
export function GreenGeometric({ className = "", count = 15 }: { className?: string; count?: number }) {
  return (
    <FloatingParticles
      count={count}
      color="rgba(30, 123, 52, 0.1)"
      sizeRange={[8, 32]}
      speedRange={[25, 45]}
      opacityRange={[0.04, 0.12]}
      shape="mixed"
      className={className}
    />
  );
}