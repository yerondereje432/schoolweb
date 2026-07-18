"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealType = "chars" | "words" | "lines" | "clip" | "blur";

type TextRevealElement = "span" | "p" | "h1" | "h2" | "h3" | "div";

interface TextRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  stagger?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  as?: TextRevealElement;
}

/**
 * Premium text reveal with multiple animation types:
 * - chars: character-by-character with 3D rotation
 * - words: word-by-word with slide/fade
 * - lines: line-by-line with clip-path
 * - clip: horizontal clip reveal
 * - blur: blur to sharp
 */
export default function TextReveal({
  children,
  type = "chars",
  delay = 0,
  stagger = 30,
  duration = 800,
  threshold = 0.15,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  className = "",
  as: Component = "span",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const elementRef = ref as React.RefObject<any>;
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

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return <Component className={className} style={{ opacity: 1 }}>{children}</Component>;
  }

  const text = typeof children === "string" ? children : String(children);

  const getSplitText = () => {
    switch (type) {
      case "chars":
        return text.split("").map((char, i) => ({
          content: char === " " ? "\u00A0" : char,
          delay: i * stagger,
        }));
      case "words":
        return text.split(" ").map((word, i) => ({
          content: word,
          delay: i * stagger * 3,
        }));
      case "lines":
        return text.split("\n").map((line, i) => ({
          content: line,
          delay: i * stagger * 5,
        }));
      default:
        return [{ content: text, delay: 0 }];
    }
  };

  const items = getSplitText();

  const getItemStyle = (index: number, itemDelay: number) => {
    const itemVisible = visible;
    const itemDuration = duration;
    const transitionDelay = `${itemDelay}ms`;

    const baseTransition = `opacity ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    switch (type) {
      case "chars":
        return {
          opacity: itemVisible ? 1 : 0,
          transform: itemVisible
            ? "rotateX(0) rotateY(0) translateY(0)"
            : "rotateX(-90deg) rotateY(15deg) translateY(30px)",
          transformOrigin: "center bottom",
          transition: baseTransition,
          transitionDelay,
          display: "inline-block",
          willChange: "opacity, transform",
        };
      case "words":
        return {
          opacity: itemVisible ? 1 : 0,
          transform: itemVisible ? "translateY(0)" : "translateY(40px)",
          transition: baseTransition,
          transitionDelay,
          display: "inline-block",
          willChange: "opacity, transform",
        };
      case "lines":
        return {
          opacity: itemVisible ? 1 : 0,
          transform: itemVisible ? "translateX(0)" : "translateX(-60px)",
          transition: baseTransition,
          transitionDelay,
          display: "block",
          willChange: "opacity, transform",
        };
      case "clip":
        return {
          opacity: itemVisible ? 1 : 0,
          WebkitClipPath: itemVisible ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
          clipPath: itemVisible ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
          transition: `opacity ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1), clip-path ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay,
          display: "inline-block",
          willChange: "opacity, clip-path",
        };
      case "blur":
        return {
          opacity: itemVisible ? 1 : 0,
          filter: itemVisible ? "blur(0)" : "blur(8px)",
          transform: itemVisible ? "translateY(0)" : "translateY(20px)",
          transition: `opacity ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${itemDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay,
          display: "inline-block",
          willChange: "opacity, filter, transform",
        };
      default:
        return { opacity: itemVisible ? 1 : 0, transition: baseTransition, transitionDelay };
    }
  };

  return (
    <Component ref={elementRef} className={className} style={{ display: "inline" }}>
      {items.map((item, index) => (
        <span key={index} style={getItemStyle(index, item.delay)}>
          {item.content}
          {type === "words" && index < items.length - 1 && "\u00A0"}
        </span>
      ))}
    </Component>
  );
}

/**
 * Gradient text with animated shimmer
 */
export function GradientText({
  children,
  className = "",
  colors = ["#f5a800", "#ffc233", "#f5a800"],
  duration = 4000,
  ...props
}: {
  children: ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  const bgSize = `${colors.length * 100}% 100%`;

  return (
    <span
      className={className}
      style={{
        background: gradient,
        backgroundSize: bgSize,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `shimmer ${duration}ms linear infinite`,
        ...props.style,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </span>
  );
}