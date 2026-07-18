"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium cursor glow/follower effect with trailing particles.
 * Creates a magnetic cursor aura that follows mouse with smooth easing.
 */
export default function CursorGlow({
  enabled = true,
  color = "rgba(245, 168, 0, 0.4)",
  size = 300,
  intensity = "medium",
}: {
  enabled?: boolean;
  color?: string;
  size?: number;
  intensity?: "low" | "medium" | "high";
}) {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const trailRef = useRef<Array<{ x: number; y: number; life: number }>>([]);

  const config = {
    low: { trailLength: 5, trailSpeed: 0.15, glowOpacity: 0.15 },
    medium: { trailLength: 12, trailSpeed: 0.12, glowOpacity: 0.25 },
    high: { trailLength: 20, trailSpeed: 0.08, glowOpacity: 0.35 },
  }[intensity];

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enabled]);

  // Smooth animation loop for trail
  useEffect(() => {
    if (!enabled) return;

    function animate() {
      animationRef.current = requestAnimationFrame(animate);

      // Smooth follow
      position.x += (targetRef.current.x - position.x) * 0.15;
      position.y += (targetRef.current.y - position.y) * 0.15;

      // Update trail
      if (visible) {
        trailRef.current.unshift({ x: position.x, y: position.y, life: 1 });
        if (trailRef.current.length > config.trailLength) {
          trailRef.current.pop();
        }
      }

      // Decay trail
      trailRef.current = trailRef.current.map((p) => ({
        ...p,
        life: p.life - config.trailSpeed,
      })).filter((p) => p.life > 0);

      setPosition({ ...position });
    }

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enabled, visible, config.trailLength, config.trailSpeed]);

  if (!enabled || !visible) return null;

  return (
    <>
      {/* Main glow */}
      <div
        className="fixed pointer-events-none -z-10 transition-opacity duration-300"
        style={{
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          opacity: config.glowOpacity,
          filter: "blur(60px)",
          transform: "translateZ(0)",
          willChange: "left, top, opacity",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Trail particles */}
      {trailRef.current.map((p, i) => (
        <div
          key={i}
          className="fixed pointer-events-none -z-10"
          style={{
            left: p.x - (size * 0.15) / 2,
            top: p.y - (size * 0.15) / 2,
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: "50%",
            background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
            opacity: config.glowOpacity * p.life * 0.5,
            filter: "blur(20px)",
            transform: `scale(${p.life})`,
            transition: "opacity 100ms ease, transform 100ms ease",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      ))}

      {/* CSS-based alternative for better performance */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .cursor-glow { display: none !important; }
        }
      `}</style>
    </>
  );
}