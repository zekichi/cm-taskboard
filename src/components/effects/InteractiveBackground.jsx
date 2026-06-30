import { useEffect, useRef } from "react";

const CONFIG = {
  login: {
    particles: 76,
    alpha: 0.66,
    maxDistance: 148,
    drift: 18,
    orbit: 34,
    pointerRadius: 150,
    cursorOpacity: 0.58,
  },
  app: {
    particles: 36,
    alpha: 0.34,
    maxDistance: 122,
    drift: 12,
    orbit: 22,
    pointerRadius: 112,
    cursorOpacity: 0.24,
  },
};

const TAU = Math.PI * 2;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCompactViewport() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

function wrap(value, min, max) {
  if (value < min) return max;
  if (value > max) return min;
  return value;
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
    let lastTime = performance.now();
    let particles = [];
    const pointer = { x: -9999, y: -9999, active: false, strength: 0 };

    const createParticle = (index, count) => {
      const direction = (index / count) * TAU + Math.random() * 0.8;
      const speed = 0.12 + Math.random() * 0.38;
      const glow = 0.62 + Math.random() * 0.78;
      const radius = 0.85 + Math.random() * 1.95;

      return {
        cx: Math.random() * width,
        cy: Math.random() * height,
        driftX: Math.cos(direction) * speed,
        driftY: Math.sin(direction) * speed,
        angle: Math.random() * TAU,
        angleSpeed: (0.18 + Math.random() * 0.42) * (Math.random() > 0.5 ? 1 : -1),
        orbitX: config.orbit * (0.45 + Math.random() * 1.35),
        orbitY: config.orbit * (0.3 + Math.random() * 1.05),
        wobble: 6 + Math.random() * config.drift,
        wobbleSpeed: 0.3 + Math.random() * 0.9,
        phase: Math.random() * TAU,
        radius,
        glow,
        alpha: config.alpha * (0.42 + Math.random() * 0.72),
        x: 0,
        y: 0,
      };
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const density = width < 1024 ? 0.68 : 1;
      const count = Math.max(14, Math.round(config.particles * density));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = Array.from({ length: count }, (_, index) =>
        createParticle(index, count)
      );
    };

    const updateParticle = (particle, elapsed, delta) => {
      particle.cx = wrap(particle.cx + particle.driftX * delta * 60, -40, width + 40);
      particle.cy = wrap(particle.cy + particle.driftY * delta * 60, -40, height + 40);
      particle.angle += particle.angleSpeed * delta;

      const orbitX = Math.cos(particle.angle) * particle.orbitX;
      const orbitY = Math.sin(particle.angle * 0.86 + particle.phase) * particle.orbitY;
      const wobbleX = Math.sin(elapsed * particle.wobbleSpeed + particle.phase) * particle.wobble;
      const wobbleY = Math.cos(elapsed * (particle.wobbleSpeed * 0.74) + particle.phase) * particle.wobble;

      let cursorX = 0;
      let cursorY = 0;

      if (pointer.active || pointer.strength > 0.01) {
        const dx = pointer.x - (particle.cx + orbitX);
        const dy = pointer.y - (particle.cy + orbitY);
        const distance = Math.max(1, Math.hypot(dx, dy));

        if (distance < config.pointerRadius) {
          const falloff = (1 - distance / config.pointerRadius) * pointer.strength;
          const direction = variant === "login" ? 1 : -1;
          cursorX = (dx / distance) * falloff * config.orbit * 0.72 * direction;
          cursorY = (dy / distance) * falloff * config.orbit * 0.72 * direction;
        }
      }

      particle.x = particle.cx + orbitX + wobbleX + cursorX;
      particle.y = particle.cy + orbitY + wobbleY + cursorY;
    };

    const drawParticle = (particle, elapsed) => {
      const pulse = 0.76 + Math.sin(elapsed * particle.wobbleSpeed + particle.phase) * 0.24;
      const drawRadius = particle.radius * (4.4 + pulse * 2.2);
      const opacity = particle.alpha * pulse * particle.glow;
      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        drawRadius
      );

      gradient.addColorStop(0, `rgba(33, 212, 253, ${opacity})`);
      gradient.addColorStop(0.38, `rgba(166, 108, 255, ${opacity * 0.42})`);
      gradient.addColorStop(1, "rgba(33, 212, 253, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(particle.x, particle.y, drawRadius, 0, TAU);
      context.fill();
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < config.maxDistance) {
            const opacity =
              (1 - distance / config.maxDistance) *
              config.alpha *
              0.24 *
              ((a.glow + b.glow) / 2);
            context.strokeStyle = `rgba(132, 220, 255, ${opacity})`;
            context.lineWidth = 0.85;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
    };

    const draw = (time = performance.now()) => {
      const delta = Math.min(0.034, Math.max(0.001, (time - lastTime) / 1000));
      const elapsed = time * 0.001;
      lastTime = time;
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        updateParticle(particle, elapsed, delta);
      }

      drawConnections();

      for (const particle of particles) {
        drawParticle(particle, elapsed);
      }

      frameId = window.requestAnimationFrame(draw);
    };

    const updatePointer = (event) => {
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      pointer.x = x;
      pointer.y = y;
      pointer.active = inside;
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
      root.style.setProperty("--cursor-opacity", inside ? String(config.cursorOpacity) : "0");
    };

    const clearPointer = () => {
      pointer.active = false;
      root.style.setProperty("--cursor-opacity", "0");
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    window.addEventListener("blur", clearPointer);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("blur", clearPointer);
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
