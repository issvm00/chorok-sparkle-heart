import { forwardRef, useEffect, useRef } from "react";

interface Props {
  revealed: boolean;
}

const FinaleSection = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fireworksRef = useRef<Firework[]>([]);

  interface Spark {
    x: number; y: number; vx: number; vy: number;
    life: number; color: string; size: number;
    trail: { x: number; y: number }[];
  }

  interface Firework {
    sparks: Spark[];
    born: number;
  }

  useEffect(() => {
    if (!revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const colors = [
      "rgba(167, 139, 250,", "rgba(251, 191, 36,",
      "rgba(244, 114, 182,", "rgba(96, 165, 250,", "rgba(52, 211, 153,",
    ];

    const createFirework = () => {
      const cx = Math.random() * w() * 0.6 + w() * 0.2;
      const cy = Math.random() * h() * 0.4 + h() * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 40 + Math.floor(Math.random() * 30);
      const sparks: Spark[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 1 + Math.random() * 3;
        sparks.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
          size: 1 + Math.random() * 2,
          trail: [],
        });
      }
      fireworksRef.current.push({ sparks, born: Date.now() });
    };

    // Launch fireworks periodically
    let launchCount = 0;
    const launchInterval = setInterval(() => {
      createFirework();
      launchCount++;
      if (launchCount > 20) clearInterval(launchInterval);
    }, 800);

    // Initial burst
    setTimeout(createFirework, 100);
    setTimeout(createFirework, 300);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, w(), h());

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        fw.sparks = fw.sparks.filter((s) => {
          s.life -= 0.008;
          if (s.life <= 0) return false;

          s.trail.push({ x: s.x, y: s.y });
          if (s.trail.length > 6) s.trail.shift();

          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.03;
          s.vx *= 0.99;

          // Draw trail
          for (let t = 0; t < s.trail.length; t++) {
            const alpha = (t / s.trail.length) * s.life * 0.3;
            ctx.beginPath();
            ctx.arc(s.trail[t].x, s.trail[t].y, s.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}${alpha})`;
            ctx.fill();
          }

          // Draw spark
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${s.life})`;
          ctx.fill();

          return true;
        });
        return fw.sparks.length > 0;
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(launchInterval);
      window.removeEventListener("resize", resize);
    };
  }, [revealed]);

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] py-24 px-4 snap-start"
    >
      {/* Fireworks canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
      />

      <div className={`relative text-center transition-all duration-[2000ms] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="w-16 h-[1px] mx-auto mb-8 animate-shimmer rounded-full" />

        <p className="font-script text-4xl md:text-5xl gradient-text mb-4">
          Best Friends
        </p>
        <p className="font-script text-3xl md:text-4xl gradient-text-warm">
          Forever
        </p>

        <div className="mt-6 font-arabic text-secondary/50 text-lg font-medium">
          🤝
        </div>

        <p className="mt-8 text-[10px] text-muted-foreground/20 tracking-[0.5em] uppercase">
          2026 · صنع بكل حب 💛
        </p>
      </div>
    </section>
  );
});

FinaleSection.displayName = "FinaleSection";
export default FinaleSection;
