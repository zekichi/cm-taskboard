import { useEffect, useRef } from "react";

const CONFIG = {
  login: {
    particles: 64,
    alpha: 0.58,
    maxDistance: 138,
    speed: 0.24,
    pointerForce: 46,
  },
  app: {
    particles: 30,
    alpha: 0.28,
    maxDistance: 118,
    speed: 0.16,
    pointerForce: 28,
  },
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCompactViewport() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

export default function InteractiveBackground({ variant = "app", className = "" }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const reducedMotion = prefersReducedMotion();
    const compactViewport = isCompactViewport();

    if (reducedMotion || compactViewport) {
      root.dataset.motion = "reduced";
      return undefined;
    }

    root.dataset.motion = "active";
    const config = CONFIG[variant] || CONFIG.app;
    const context = canvas.getContext("2d", { alpha: true });
    let width = 0;
    let height = 0;
    let frameId = 0;
    let particles = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const density = width < 1024 ? 0.62 : 1;
      const count = Math.max(12, Math.round(config.particles * density));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles = Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * config.speed * (0.6 + Math.random()),
          vy: Math.sin(angle) * config.speed * (0.6 + Math.random()),
          radius: 1 + Math.random() * 1.6,
        };
      });
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < config.pointerForce && distance > 0) {
            const push = (config.pointerForce - distance) / config.pointerForce;
            particle.vx += (dx / distance) * push * 0.018;
            particle.vy += (dy / distance) * push * 0.018;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.992;
        particle.vy *= 0.992;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4
        );
        gradient.addColorStop(0, `rgba(33, 212, 253, ${config.alpha})`);
        gradient.addColorStop(1, "rgba(166, 108, 255, 0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        context.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < config.maxDistance) {
            const opacity = (1 - distance / config.maxDistance) * config.alpha * 0.22;
            context.strokeStyle = `rgba(132, 220, 255, ${opacity})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      frameId = window.requestAnimationFrame(draw);
    };

    const updatePointer = (event) => {
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      root.style.setProperty("--cursor-x", `${pointer.x}px`);
      root.style.setProperty("--cursor-y", `${pointer.y}px`);
      root.style.setProperty("--cursor-opacity", variant === "login" ? "0.58" : "0.26");
    };

    const clearPointer = () => {
      pointer.active = false;
      root.style.setProperty("--cursor-opacity", "0");
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    root.addEventListener("pointermove", updatePointer);
    root.addEventListener("pointerleave", clearPointer);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      root.removeEventListener("pointermove", updatePointer);
      root.removeEventListener("pointerleave", clearPointer);
    };
  }, [variant]);

  return (
    <div
      ref={rootRef}
      className={`interactive-background ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
      <div className="interactive-cursor-glow" />
    </div>
  );
}
