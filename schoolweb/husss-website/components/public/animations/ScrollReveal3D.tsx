"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "scale-down"
  | "flip-x"
  | "flip-y"
  | "rotate-in"
  | "slide-up-3d"
  | "slide-down-3d"
  | "perspective-reveal";

interface ScrollReveal3DProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Advanced 3D scroll reveal component with multiple animation types.
 * Supports true 3D transforms (rotateX, rotateY, perspective) for premium feel.
 */
export default function ScrollReveal3D({
  children,
  type = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.15,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  className = "",
  style,
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!visible) {
            setTimeout(() => setVisible(true), delay);
          }
          if (once) {
            observer.disconnect();
            setHasAnimated(true);
          }
        } else if (!once && hasAnimated) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold, rootMargin, once, visible, hasAnimated]);

  // Define transform styles for each animation type
  const getTransform = (isVisible: boolean) => {
    const base = visible ? "0" : "1";
    const opacity = visible ? "1" : "0";

    switch (type) {
      case "fade-up":
        return { opacity, transform: visible ? "translateY(0)" : "translateY(40px)" };
      case "fade-down":
        return { opacity, transform: visible ? "translateY(0)" : "translateY(-40px)" };
      case "fade-left":
        return { opacity, transform: visible ? "translateX(0)" : "translateX(40px)" };
      case "fade-right":
        return { opacity, transform: visible ? "translateX(0)" : "translateX(-40px)" };
      case "scale-up":
        return { opacity, transform: visible ? "scale(1)" : "scale(0.85)" };
      case "scale-down":
        return { opacity, transform: visible ? "scale(1)" : "scale(1.15)" };
      case "flip-x":
        return {
          opacity,
          transform: visible
            ? "perspective(1000px) rotateX(0deg)"
            : "perspective(1000px) rotateX(-90deg)",
          transformOrigin: "center bottom",
        };
      case "flip-y":
        return {
          opacity,
          transform: visible
            ? "perspective(1000px) rotateY(0deg)"
            : "perspective(1000px) rotateY(90deg)",
          transformOrigin: "center center",
        };
      case "rotate-in":
        return {
          opacity,
          transform: visible
            ? "rotate(0deg) scale(1)"
            : "rotate(-12deg) scale(0.8)",
        };
      case "slide-up-3d":
        return {
          opacity,
          transform: visible
            ? "perspective(1000px) rotateX(0deg) translateY(0)"
            : "perspective(1000px) rotateX(15deg) translateY(60px)",
          transformOrigin: "center bottom",
        };
      case "slide-down-3d":
        return {
          opacity,
          transform: visible
            ? "perspective(1000px) rotateX(0deg) translateY(0)"
            : "perspective(1000px) rotateX(-15deg) translateY(-60px)",
          transformOrigin: "center top",
        };
      case "perspective-reveal":
        return {
          opacity,
          transform: visible
            ? "perspective(1000px) rotateY(0deg) translateZ(0)"
            : "perspective(1000px) rotateY(-30deg) translateZ(-100px)",
        };
      default:
        return { opacity, transform: visible ? "translateY(0)" : "translateY(40px)" };
    }
  };

  const transformStyles = getTransform(visible);

  const transitionStyle = {
    opacity: transformStyles.opacity,
    transform: transformStyles.transform,
    transformOrigin: transformStyles.transformOrigin,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    ...style,
  };

  // Respect prefers-reduced-motion
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={ref}
      className={className}
      style={prefersReducedMotion ? { opacity: 1, transform: "none" } : transitionStyle}
      data-reveal={type}
    >
      {children}
    </div>
  );
}

/**
 * Staggered reveal wrapper for multiple children
 */
export function StaggeredReveal({
  children,
  staggerDelay = 100,
  ...props
}: ScrollReveal3DProps & { staggerDelay?: number; children: React.ReactNode }) {
  const childArray = React.Children.toArray(children);

  return (
    <>
      {childArray.map((child, index) =>
        React.isValidElement(child) ? (
          React.cloneElement(child as React.ReactElement<any>, {
            key: child.key ?? index,
            delay: (props.delay || 0) + index * staggerDelay,
          })
        ) : (
          <ScrollReveal3D key={index} delay={(props.delay || 0) + index * staggerDelay} {...props}>
            {child}
          </ScrollReveal3D>
        )
      )}
    </>
  );
}