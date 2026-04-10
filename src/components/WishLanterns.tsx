import { forwardRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";

interface Props {
  revealed: boolean;
}

interface Lantern {
  id: number;
  emoji: string;
  wish: string;
  released: boolean;
  x: number;
  color: string;
}

const LANTERN_DATA = [
  { emoji: "🎓", wish: "النجاح فكلشي", color: "hsl(45 80% 55%)" },
  { emoji: "😊", wish: "السعادة ديما", color: "hsl(320 50% 50%)" },
  { emoji: "💪", wish: "الصحة و العافية", color: "hsl(270 60% 55%)" },
  { emoji: "⭐", wish: "تحقيق الأحلام", color: "hsl(220 80% 60%)" },
];

const WishLanterns = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [lanterns, setLanterns] = useState<Lantern[]>(
    LANTERN_DATA.map((d, i) => ({
      id: i,
      ...d,
      released: false,
      x: 15 + (i % 2) * 55 + Math.random() * 15,
    }))
  );
  const [allReleased, setAllReleased] = useState(false);

  const releaseLantern = useCallback((id: number) => {
    setLanterns((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, released: true } : l));
      if (updated.every((l) => l.released)) {
        setTimeout(() => setAllReleased(true), 500);
        confetti({ particleCount: 60, spread: 80, origin: { x: 0.5, y: 0.5 }, colors: ["#a78bfa", "#fbbf24", "#f472b6"] });
      }
      return updated;
    });

    confetti({
      particleCount: 12,
      spread: 30,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#fbbf24", "#f59e0b"],
      startVelocity: 12,
      ticks: 40,
      gravity: 0.5,
      scalar: 0.6,
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start"
    >
      <div className={`w-full max-w-sm mx-auto transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="font-panorama text-4xl gradient-text mb-3">أمنيات لك</h3>
          <p className="font-panorama text-base text-muted-foreground/50">إضغط على كل فانوس باش يطير 🏮</p>
        </div>

        {/* Lanterns grid */}
        <div className="relative h-80">
          {lanterns.map((lantern, i) => (
            <button
              key={lantern.id}
              onClick={() => !lantern.released && releaseLantern(lantern.id)}
              disabled={lantern.released}
              className={`absolute transition-all focus:outline-none ${
                lantern.released
                  ? "duration-[3000ms] ease-out"
                  : "duration-500 cursor-pointer active:scale-110"
              }`}
              style={{
                left: `${lantern.x}%`,
                top: lantern.released ? "-120%" : `${20 + i * 18}%`,
                opacity: lantern.released ? 0 : revealed ? 1 : 0,
                transform: revealed && !lantern.released ? "scale(1)" : lantern.released ? "scale(0.5)" : "scale(0.6)",
                transitionDelay: revealed && !lantern.released ? `${i * 200}ms` : "0ms",
              }}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className="absolute -inset-4 rounded-full blur-xl animate-pulse"
                  style={{ background: `${lantern.color.replace(")", " / 0.25)")}` }}
                />
                <div
                  className="relative w-20 h-24 rounded-2xl flex flex-col items-center justify-center glass-card"
                  style={{
                    border: `1px solid ${lantern.color.replace(")", " / 0.4)")}`,
                    boxShadow: `0 0 20px ${lantern.color.replace(")", " / 0.15)")}`,
                  }}
                >
                  <span className="text-3xl mb-1">{lantern.emoji}</span>
                  <span className="font-panorama text-[11px] text-foreground/80 leading-tight text-center px-1" dir="rtl">
                    {lantern.wish}
                  </span>
                </div>
                <div className="relative mt-[-2px]">
                  <div className="w-2 h-3 rounded-full animate-pulse" style={{ background: "hsl(var(--secondary))", filter: `drop-shadow(0 0 6px ${lantern.color})` }} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* All released message */}
        {allReleased && (
          <div className="text-center animate-fade-in-up mt-4">
            <p className="font-panorama text-2xl font-bold" style={{ color: "hsl(var(--secondary) / 0.8)" }}>
              كل الأمنيات طارت ليك 🌟
            </p>
            <p className="font-panorama text-base text-muted-foreground/50 mt-2">
              إن شاء الله تتحقق كاملة ✨
            </p>
          </div>
        )}
      </div>
    </section>
  );
});

WishLanterns.displayName = "WishLanterns";
export default WishLanterns;
