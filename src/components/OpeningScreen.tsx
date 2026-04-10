import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";

interface Props {
  onOpen: () => void;
}

const OpeningScreen = ({ onOpen }: Props) => {
  const [phase, setPhase] = useState<"idle" | "seal-cracking" | "envelope-opening" | "letter-rising" | "transitioning">("idle");
  const [sealCracks, setSealCracks] = useState(0);
  const [tapHint, setTapHint] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([]);
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

    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random(),
    }));

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      starsRef.current.forEach((s) => {
        s.opacity += Math.sin(Date.now() * 0.001 * s.speed) * 0.01;
        s.opacity = Math.max(0.1, Math.min(1, s.opacity));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * 0.6})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSealTap = useCallback(() => {
    if (phase !== "idle" && phase !== "seal-cracking") return;

    const newCracks = sealCracks + 1;
    setSealCracks(newCracks);
    setTapHint(false);
    setPhase("seal-cracking");

    confetti({
      particleCount: 8,
      spread: 40,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#c9a44a", "#8b6914", "#d4a843"],
      startVelocity: 15,
      ticks: 60,
      gravity: 1.5,
      scalar: 0.6,
    });

    if (newCracks >= 3) {
      setTimeout(() => {
        setPhase("envelope-opening");
        const colors = ["#c9a44a", "#fbbf24", "#f59e0b", "#d97706", "#a78bfa"];
        confetti({ particleCount: 100, spread: 100, origin: { x: 0.5, y: 0.5 }, colors, startVelocity: 35 });
      }, 300);

      setTimeout(() => setPhase("letter-rising"), 1400);
      setTimeout(() => {
        setPhase("transitioning");
        const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa", "#34d399"];
        const end = Date.now() + 1200;
        const frame = () => {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }, 2800);
      setTimeout(onOpen, 3800);
    }
  }, [phase, sealCracks, onOpen]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Ambient aurora */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(270 60% 55% / 0.4), transparent 70%)",
            top: "-20%",
            left: "-20%",
            animation: "orbFloat 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(320 50% 50% / 0.4), transparent 70%)",
            bottom: "-15%",
            right: "-15%",
            animation: "orbFloat 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Envelope */}
      <div className="relative z-10">
        <div
          className={`relative transition-all duration-1000 ease-out ${
            phase === "envelope-opening" || phase === "letter-rising" || phase === "transitioning"
              ? "scale-110"
              : "scale-100"
          }`}
        >
          <div
            className={`relative w-72 h-48 md:w-96 md:h-60 rounded-2xl transition-all duration-700 ${
              phase === "transitioning" ? "opacity-0 scale-75" : ""
            }`}
            style={{
              background: "linear-gradient(145deg, hsl(var(--card)), hsl(260 25% 6%))",
              border: "1px solid hsl(var(--border))",
              boxShadow: phase === "envelope-opening" || phase === "letter-rising"
                ? "0 0 80px hsl(var(--gold) / 0.3), 0 20px 60px rgba(0,0,0,0.5)"
                : "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Envelope flap */}
            <div
              className="absolute top-0 left-0 right-0 h-24 md:h-32 origin-top transition-all duration-1000"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, hsl(260 25% 15%), hsl(var(--card)))",
                borderBottom: "1px solid hsl(var(--border))",
                transform: phase === "envelope-opening" || phase === "letter-rising" || phase === "transitioning"
                  ? "rotateX(-180deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
                perspective: "800px",
              }}
            />

            {/* Letter peeking out */}
            <div
              className="absolute left-4 right-4 rounded-t-lg transition-all duration-1000 ease-out"
              style={{
                background: "linear-gradient(to bottom, hsl(260 20% 14%), hsl(260 20% 10%))",
                bottom: phase === "letter-rising" || phase === "transitioning" ? "60%" : "30%",
                height: "70%",
                opacity: phase === "envelope-opening" || phase === "letter-rising" || phase === "transitioning" ? 1 : 0,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <div className="p-4 pt-6 text-center">
                <p className="font-panorama text-foreground/80 text-xl">
                  عيد ميلاد سعيد
                </p>
                <p className="font-panorama text-secondary/60 text-base mt-1">
                  يا شروق ✨
                </p>
              </div>
            </div>

            {/* Wax seal */}
            <button
              onClick={handleSealTap}
              className={`absolute left-1/2 -translate-x-1/2 -bottom-8 z-20 focus:outline-none transition-all duration-300
                ${phase === "envelope-opening" || phase === "letter-rising" || phase === "transitioning" ? "opacity-0 scale-0" : ""}
                ${sealCracks >= 2 ? "animate-[shake_0.3s_ease-in-out]" : ""}
              `}
              disabled={phase === "envelope-opening" || phase === "letter-rising" || phase === "transitioning"}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full opacity-20 blur-xl animate-pulse"
                  style={{ background: "hsl(var(--gold))" }}
                />
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(0 60% 45%), hsl(0 50% 30%))",
                    boxShadow: "0 4px 20px rgba(139, 0, 0, 0.5), inset 0 1px 3px rgba(255,255,255,0.2)",
                  }}
                >
                  {sealCracks >= 1 && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute top-1/2 left-1/4 w-[2px] h-6 bg-[hsl(0,40%,20%)] rotate-[30deg]" />
                    </div>
                  )}
                  {sealCracks >= 2 && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute top-1/3 right-1/4 w-[2px] h-5 bg-[hsl(0,40%,20%)] rotate-[-45deg]" />
                      <div className="absolute bottom-1/3 left-1/3 w-[2px] h-4 bg-[hsl(0,40%,20%)] rotate-[60deg]" />
                    </div>
                  )}
                  <span className="text-2xl select-none drop-shadow-lg">
                    {sealCracks >= 2 ? "💔" : "💌"}
                  </span>
                </div>

                {phase === "idle" && (
                  <>
                    <div className="absolute inset-[-8px] rounded-full border border-[hsl(0,50%,40%)] photo-ring" />
                    <div className="absolute inset-[-8px] rounded-full border photo-ring" style={{ borderColor: "hsl(var(--gold))", animationDelay: "1s" }} />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={`text-center mt-14 transition-all duration-500 ${
          phase !== "idle" && phase !== "seal-cracking" ? "opacity-0" : "opacity-100"
        }`}>
          {tapHint ? (
            <p className="font-panorama text-muted-foreground/60 text-lg animate-pulse">
              إكسر الختم لفتح الرسالة 🔓
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < sealCracks
                      ? "scale-110"
                      : ""
                  }`}
                  style={{
                    background: i < sealCracks ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground) / 0.2)",
                    boxShadow: i < sealCracks ? "0 0 10px hsl(var(--gold))" : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transitioning overlay */}
      {phase === "transitioning" && (
        <div className="absolute inset-0 animate-fade-in z-30" style={{ background: "hsl(var(--background))" }} />
      )}
    </div>
  );
};

export default OpeningScreen;
