import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "star" | "glow" | "spark";
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  "rgba(167, 139, 250, ",  // violet
  "rgba(251, 191, 36, ",   // gold
  "rgba(244, 114, 182, ",  // pink
  "rgba(96, 165, 250, ",   // blue
  "rgba(52, 211, 153, ",   // emerald
];

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1 });

  const createParticle = useCallback((x: number, y: number, type: Particle["type"] = "star"): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = type === "spark" ? Math.random() * 8 + 4 : Math.random() * 1.5 + 0.3;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (type === "star" ? 0.5 : 0),
      life: 1,
      maxLife: type === "spark" ? 40 + Math.random() * 30 : 80 + Math.random() * 120,
      size: type === "spark" ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }, []);

  const spawnBurst = useCallback((x: number, y: number, count: number = 30) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(x, y, "spark"));
    }
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Ambient particle spawner
    let spawnTimer = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnTimer++;

      // Spawn ambient particles
      if (spawnTimer % 8 === 0) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particlesRef.current.push(createParticle(x, y, Math.random() > 0.7 ? "glow" : "star"));
      }

      // Touch/mouse trail particles
      if (mouseRef.current.x > 0) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(
            createParticle(
              mouseRef.current.x + (Math.random() - 0.5) * 20,
              mouseRef.current.y + (Math.random() - 0.5) * 20,
              "glow"
            )
          );
        }
      }

      // Update & draw
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 1 / p.maxLife;
        if (p.life <= 0) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gentle gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        const alpha = p.life;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        if (p.type === "glow") {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
          gradient.addColorStop(0, p.color + "0.8)");
          gradient.addColorStop(1, p.color + "0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "star") {
          ctx.fillStyle = p.color + `${alpha})`; 
          drawStar(ctx, 0, 0, 4, p.size * 1.5, p.size * 0.6);
        } else {
          ctx.fillStyle = p.color + `${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Spark trail
          ctx.strokeStyle = p.color + `${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-p.vx * 3, -p.vy * 3);
          ctx.stroke();
        }

        ctx.restore();
        return true;
      });

      // Keep particle count manageable
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-150);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Touch/mouse handlers
    const handleMove = (x: number, y: number) => {
      mouseRef.current = { x, y };
    };
    const handleEnd = () => {
      mouseRef.current = { x: -1, y: -1 };
    };
    const handleTap = (x: number, y: number) => {
      spawnBurst(x, y, 15);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      handleMove(t.clientX, t.clientY);
    };
    const onMouseUp = () => handleEnd();
    const onTouchEnd = () => handleEnd();
    const onClick = (e: MouseEvent) => handleTap(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      handleTap(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [createParticle, spawnBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
    />
  );
};

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

export default ParticleCanvas;
export { ParticleCanvas };
