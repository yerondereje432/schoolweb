"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * A premium 3D background with floating geometric shapes that respond to mouse movement.
 * Uses Three.js for true 3D rendering but stays lightweight.
 */
export default function ThreeDBackground({
  className = "",
  colorScheme = "green-gold",
  intensity = "medium",
}: {
  className?: string;
  colorScheme?: "green-gold" | "dark" | "light";
  intensity?: "low" | "medium" | "high";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const config = useMemo(() => {
    const base = {
      particleCount: intensity === "low" ? 30 : intensity === "high" ? 80 : 50,
      floatSpeed: intensity === "low" ? 0.15 : intensity === "high" ? 0.35 : 0.25,
      mouseInfluence: intensity === "low" ? 0.03 : intensity === "high" ? 0.08 : 0.05,
    };
    return base;
  }, [intensity]);

  const colors = useMemo(() => {
    switch (colorScheme) {
      case "green-gold":
        return {
          bg: 0x0d3818,
          primary: 0x1e7b34,
          secondary: 0xf5a800,
          accent: 0xffc233,
        };
      case "dark":
        return {
          bg: 0x0a0a0a,
          primary: 0x1a1a2e,
          secondary: 0x16213e,
          accent: 0xe94560,
        };
      case "light":
        return {
          bg: 0xfbf7ef,
          primary: 0xe3f2e7,
          secondary: 0xfff3d6,
          accent: 0xf5a800,
        };
    }
  }, [colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(colors.bg, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Create floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1, 1),
    ];

    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: colors.primary,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.15,
        transmission: 0.1,
        thickness: 0.5,
      }),
      new THREE.MeshPhysicalMaterial({
        color: colors.secondary,
        metalness: 0.4,
        roughness: 0.3,
        transparent: true,
        opacity: 0.12,
        transmission: 0.15,
        thickness: 0.5,
      }),
      new THREE.MeshPhysicalMaterial({
        color: colors.accent,
        metalness: 0.5,
        roughness: 0.2,
        transparent: true,
        opacity: 0.1,
        transmission: 0.2,
        thickness: 0.5,
      }),
    ];

    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < config.particleCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)].clone();

      const mesh = new THREE.Mesh(geometry, material);

      // Random position in 3D space
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120
      );

      // Random scale
      const scale = 0.3 + Math.random() * 1.5;
      mesh.scale.setScalar(scale);

      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Store animation properties
      (mesh as any).userData = {
        originalPosition: mesh.position.clone(),
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.0005 + Math.random() * 0.0015,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.002,
        },
      };

      particles.push(mesh);
      scene.add(mesh);
    }

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light for depth
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Add point lights for color accents
    const pointLight1 = new THREE.PointLight(colors.secondary, 20, 100);
    pointLight1.position.set(-30, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colors.accent, 15, 80);
    pointLight2.position.set(30, -20, -10);
    scene.add(pointLight2);

    // Mouse move handler
    function onMouseMove(event: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    canvas.addEventListener("mousemove", onMouseMove);

    // Animation loop
    function animate(time: number) {
      animationRef.current = requestAnimationFrame(animate);

      // Smooth mouse follow
      targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
      targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;

      // Camera subtle follow
      camera.position.x += (targetRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (targetRef.current.y * 3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Animate particles
      particles.forEach((particle, index) => {
        const data = particle.userData;

        // Floating motion
        particle.position.y =
          data.originalPosition.y +
          Math.sin(time * data.floatSpeed + data.floatOffset) * 3;

        particle.position.x =
          data.originalPosition.x +
          Math.cos(time * data.floatSpeed * 0.7 + data.floatOffset) * 2;

        particle.position.z =
          data.originalPosition.z +
          Math.sin(time * data.floatSpeed * 0.5 + data.floatOffset) * 2;

        // Mouse influence
        particle.position.x += targetRef.current.x * config.mouseInfluence * (index % 5 + 1);
        particle.position.y += targetRef.current.y * config.mouseInfluence * (index % 5 + 1);

        // Rotation
        particle.rotation.x += data.rotationSpeed.x;
        particle.rotation.y += data.rotationSpeed.y;
        particle.rotation.z += data.rotationSpeed.z;
      });

      // Animate point lights
      pointLight1.position.x = Math.sin(time * 0.0003) * 40;
      pointLight1.position.y = Math.cos(time * 0.0002) * 30;
      pointLight2.position.x = Math.cos(time * 0.00025) * 35;
      pointLight2.position.y = Math.sin(time * 0.00035) * 25;

      renderer.render(scene, camera);
    }

    animate(0);

    // Handle resize
    function onResize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onResize);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      // Cleanup Three.js objects
      particles.forEach((p) => {
        p.geometry.dispose();
        if (Array.isArray(p.material)) {
          p.material.forEach((m) => m.dispose());
        } else {
          p.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [config.particleCount, config.floatSpeed, config.mouseInfluence, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
