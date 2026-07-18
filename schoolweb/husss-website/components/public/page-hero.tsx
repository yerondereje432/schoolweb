"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import ThreeDBackground from "./animations/ThreeDBackground";
import ScrollReveal3D, { StaggeredReveal } from "./animations/ScrollReveal3D";

/**
 * Premium interior-page hero banner with 3D background, animated badge,
 * and staggered reveal animations for text elements.
 */
export default function PageHero({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const stage = stageRef.current;
    const badge = badgeRef.current;
    if (!stage || !badge) return;

    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    badge.style.transform = `rotateY(${px * 30}deg) rotateX(${-py * 30}deg) translateZ(20px)`;
  }

  function handleLeave() {
    if (prefersReducedMotion) return;
    const badge = badgeRef.current;
    if (!badge) return;
    badge.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)";
  }

  return (
    <section className="relative bg-husss-green-950 text-white py-20 md:py-28 overflow-hidden">
      {/* 3D Background with floating geometry */}
      <ThreeDBackground colorScheme="green-gold" intensity="medium" />

      {/* Radial vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-husss-green-950/60 via-husss-green-900/20 to-husss-green-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-husss-green-950)_0%,_transparent_70%)]" />

      {/* Decorative orbiting rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-husss-gold-500/10 animate-rotate-y-slow pointer-events-none" style={{ animationDuration: "60s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-husss-gold-500/05 animate-rotate-x-slow pointer-events-none" style={{ animationDuration: "45s" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Enhanced 3D Badge with magnetic hover */}
        <div
          ref={stageRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="tilt-stage mb-6"
          style={{ perspective: "800px" }}
        >
          <div
            ref={badgeRef}
            className="tilt-badge"
            style={{
              transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face */}
            <div className="tilt-badge-face" style={{ transform: "translateZ(20px)" }}>
              <div className="tilt-badge-ring" style={{ animation: "rotate-y-slow 30s linear infinite" }} />
              <div className="tilt-badge-icon" style={{ filter: "drop-shadow(0 4px 12px rgba(245, 168, 0, 0.4))" }}>
                {icon}
              </div>
            </div>
            {/* Edge/depth */}
            <div className="tilt-badge-edge" aria-hidden style={{ transform: "translateZ(0px)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }} />
            {/* Back face for true 3D */}
            <div
              className="tilt-badge-face"
              style={{
                transform: "translateZ(-20px) rotateY(180deg)",
                background: "radial-gradient(circle at 32% 28%, #0d3818, #123f1f 72%)",
                border: "1px solid rgba(245, 168, 0, 0.2)",
              }}
            >
              <div className="tilt-badge-ring" />
            </div>
          </div>
        </div>

        {/* Staggered text reveals */}
        <StaggeredReveal staggerDelay={120}>
          <ScrollReveal3D type="fade-up" duration={700}>
            <span className="eyebrow text-husss-gold-400 animate-shimmer-3d bg-clip-text text-transparent bg-gradient-to-r from-husss-gold-400 via-husss-gold-200 to-husss-gold-400 bg-[length:200%_100%]">
              {eyebrow}
            </span>
          </ScrollReveal3D>

          <ScrollReveal3D type="slide-up-3d" duration={800} delay={100}>
            <h1 className="font-display mt-3 text-3xl md:text-[2.75rem] lg:text-[3.5rem] font-semibold leading-tight text-gradient-3d">
              {title}
            </h1>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" duration={700} delay={200}>
            <p className="text-white/65 mt-4 max-w-xl leading-relaxed text-lg">{subtitle}</p>
          </ScrollReveal3D>
        </StaggeredReveal>

        {/* Scroll indicator with 3D bounce */}
        <ScrollReveal3D type="fade-up" delay={600} duration={600}>
          <div className="mt-10 flex items-center gap-2 text-white/40 animate-scroll-bounce-3d">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs uppercase tracking-widest">Scroll</span>
          </div>
        </ScrollReveal3D>
      </div>
    </section>
  );
}