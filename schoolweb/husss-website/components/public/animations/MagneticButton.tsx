"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  magneticStrength?: number;
  scaleOnHover?: number;
  glow?: boolean;
  glowColor?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Premium magnetic button with 3D attraction effect.
 * Button follows cursor magnetically within its bounds.
 */
export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  magneticStrength = 0.3,
  scaleOnHover = 1.05,
  glow = true,
  glowColor = "rgba(245, 168, 0, 0.4)",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const element = buttonRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveContainer = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: 600,
    borderRadius: "9999px",
    transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, box-shadow",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    userSelect: "none",
  } as React.CSSProperties;

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #1e7b34 0%, #1a642e 100%)",
      color: "#fff",
      boxShadow: "0 4px 14px -4px rgba(30, 123, 52, 0.5)",
    },
    secondary: {
      background: "linear-gradient(135deg, #f5a800 0%, #d99400 100%)",
      color: "#0d3818",
      boxShadow: "0 4px 14px -4px rgba(245, 168, 0, 0.5)",
    },
    outline: {
      background: "transparent",
      color: "#1e7b34",
      border: "2px solid #1e7b34",
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: "#1e7b34",
      boxShadow: "none",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.5rem 1.25rem", fontSize: "0.875rem" },
    md: { padding: "0.75rem 1.75rem", fontSize: "1rem" },
    lg: { padding: "1rem 2.25rem", fontSize: "1.125rem" },
  };

  const computedStyle: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: disabled ? 0.5 : 1,
    transform: `translate(${mousePos.x * magneticStrength}px, ${mousePos.y * magneticStrength}px) scale(${isHovered ? scaleOnHover : 1})`,
    boxShadow: isHovered && glow
      ? `${variantStyles[variant].boxShadow}, 0 0 0 1px ${glowColor}, 0 20px 40px -12px ${glowColor}`
      : variantStyles[variant].boxShadow,
  };

  const Element = href ? "a" : "button";

  return (
    <Element
      ref={buttonRef as unknown as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
      href={href}
      type={href ? undefined : type}
      onClick={disabled ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeaveCapture={handleMouseLeaveContainer}
      disabled={disabled && !href}
      className={className}
      style={computedStyle}
      aria-disabled={disabled}
    >
      {children}
      {/* Ripple effect */}
      <span
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
          opacity: isHovered ? 0.5 : 0,
          transform: `scale(${isHovered ? 1 : 0})`,
          transition: "opacity 200ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </Element>
  );
}
