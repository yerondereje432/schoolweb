"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  maxDistance?: number;
  scaleOnHover?: number;
  rotateOnHover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Wrapper that adds magnetic attraction to any child element.
 * Element follows cursor within its bounds with 3D rotation.
 */
export default function MagneticElement({
  children,
  className = "",
  strength = 0.3,
  maxDistance = 150,
  scaleOnHover = 1.03,
  rotateOnHover = true,
  onClick,
  style,
}: MagneticElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [distance, setDistance] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    setDistance(dist);

    if (dist < maxDistance) {
      const force = (1 - dist / maxDistance) * strength;
      setMousePos({ x: deltaX * force, y: deltaY * force });
    } else {
      setMousePos({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setDistance(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveContainer = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
    setDistance(0);
  };

  const rotateX = rotateOnHover ? (-mousePos.y / 20) : 0;
  const rotateY = rotateOnHover ? (mousePos.x / 20) : 0;
  const scale = isHovered ? scaleOnHover : 1;

  const transform = `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

  return (
    <div
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveContainer}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      className={`transform-gpu transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        ...style,
        transform,
        transformStyle: "preserve-3d",
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {children}
    </div>
  );
}