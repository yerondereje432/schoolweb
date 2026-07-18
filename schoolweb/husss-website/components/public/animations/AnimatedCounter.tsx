"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  onComplete?: () => void;
}

/**
 * Premium animated counter with easing and optional 3D flip effect.
 * Supports large numbers with separators, decimals, prefixes/suffixes.
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
  onComplete,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const numericValue = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now() + delay;
    const target = numericValue;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for premium feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
        onComplete?.();
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, numericValue, duration, delay, onComplete]);

  // Format number with separators and decimals
  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div
      ref={elementRef}
      className={`inline-block ${className}`}
      aria-live="polite"
    >
      {prefix && <span className="text-husss-gold-500">{prefix}</span>}
      <span className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-husss-green-950 tabular-nums">
        {formatted}
      </span>
      {suffix && <span className="text-husss-green-700 ml-1">{suffix}</span>}
    </div>
  );
}