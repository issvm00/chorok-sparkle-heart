import { useEffect, useRef } from "react";

const AuroraCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    // Aurora ribbons
    const ribbons = [
      { color: "270, 60%, 55%", yBase: 0.3, amplitude: 60, frequency: 0.003, speed: 0.0004, width: 200 },
      { color: "320, 50%, 50%", yBase: 0.5, amplitude: 80, frequency: 0.002, speed: 0.0003, width: 150 },
      { color: "45, 80%, 55%", yBase: 0.7, amplitude: 40, frequency: 0.004, speed: 0.0005, width: 120 },
      { color: "220, 80%, 60%", yBase: 0.4, amplitude: 50, frequency: 0.0025, speed: 0.00035, width: 100 },
    ];

    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, w(), h());

      ribbons.forEach((ribbon) => {
        ctx.beginPath();
        const y0 = h() * ribbon.yBase;

        for (let x = 0; x <= w(); x += 4) {
          const y = y0 +
            Math.sin(x * ribbon.frequency + time * ribbon.speed * 60) * ribbon.amplitude +
            Math.sin(x * ribbon.frequency * 1.5 + time * ribbon.speed * 40) * ribbon.amplitude * 0.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Create gradient stroke
        const grad = ctx.createLinearGradient(0, y0 - ribbon.width, 0, y0 + ribbon.width);
        grad.addColorStop(0, `hsla(${ribbon.color}, 0)`);
        grad.addColorStop(0.3, `hsla(${ribbon.color}, 0.06)`);
        grad.addColorStop(0.5, `hsla(${ribbon.color}, 0.12)`);
        grad.addColorStop(0.7, `hsla(${ribbon.color}, 0.06)`);
        grad.addColorStop(1, `hsla(${ribbon.color}, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-60"
    />
  );
};

export default AuroraCanvas;
