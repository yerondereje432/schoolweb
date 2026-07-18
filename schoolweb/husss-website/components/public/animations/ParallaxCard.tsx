"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  maxTilt?: number;
  perspective?: number;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

/**
 * Premium 3D parallax card with magnetic hover effect.
 * Responds to mouse movement with smooth 3D transforms.
 */
export default function ParallaxCard({
  children,
  className = "",
  hoverScale = 1.02,
  maxTilt = 12,
  perspective = 1000,
  glow = true,
  glowColor = "rgba(245, 168, 0, 0.3)",
  onClick,
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const rotateY = deltaX * maxTilt;
    const rotateX = -deltaY * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${hoverScale}, ${hoverScale}, ${hoverScale})`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      className={`
        relative transform-gpu transition-all duration-500 ease-out
        will-change-transform
        ${className}
      `}
      style={{
        transform,
        boxShadow: isHovered && glow
          ? `0 25px 50px -12px ${glowColor}, 0 0 0 1px rgba(245, 168, 0, 0.1)`
          : undefined,
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {/* Glow layer behind content */}
      {glow && isHovered && (
        <div
          className="absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}