import { forwardRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";

interface Props {
  revealed: boolean;
}

interface WishStar {
  id: number;
  emoji: string;
  wish: string;
  unlocked: boolean;
  angle: number; // position on circle
}

const WISHES = [
  { emoji: "🎓", wish: "النجاح فكل خطوة" },
  { emoji: "💛", wish: "السعادة اللي ما عندها حدود" },
  { emoji: "💪", wish: "الصحة و العافية ديما" },
  { emoji: "⭐", wish: "تحقيق كل حلم عندك" },
  { emoji: "🌙", wish: "راحة البال و الطمأنينة" },
  { emoji: "🔥", wish: "الحماس و الإرادة القوية" },
];

const WishLanterns = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [stars, setStars] = useState<WishStar[]>(
    WISHES.map((w, i) => ({
      id: i,
      ...w,
      unlocked: false,
      angle: (360 / WISHES.length) * i - 90,
    }))
  );
  const [allDone, setAllDone] = useState(false);
  const [activeWish, setActiveWish] = useState<string | null>(null);

  const unlock = useCallback((id: number) => {
    setStars((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, unlocked: true } : s));
      const wish = prev.find((s) => s.id === id)?.wish || "";
      setActiveWish(wish);
      setTimeout(() => setActiveWish(null), 2200);

      if (updated.every((s) => s.unlocked)) {
        setTimeout(() => {
          setAllDone(true);
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"],
          });
        }, 600);
      }
      return updated;
    });

    confetti({
      particleCount: 18,
      spread: 50,
      origin: { x: 0.5, y: 0.45 },
      colors: ["#fbbf24", "#a78bfa"],
      startVelocity: 15,
      ticks: 35,
      gravity: 0.6,
      scalar: 0.7,
    });
  }, []);

  const radius = 120;

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start"
    >
      <div
        className={`w-full max-w-md mx-auto transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-panorama text-4xl gradient-text mb-2">أمنيات لك</h3>
          <p className="font-panorama text-sm text-muted-foreground/40">
            إضغط على كل نجمة باش تكشف الأمنية ✨
          </p>
        </div>

        {/* Active wish toast */}
        <div className="h-12 flex items-center justify-center mb-4">
          {activeWish && (
            <p
              className="font-panorama text-lg text-center animate-fade-in-up"
              style={{ color: "hsl(var(--secondary) / 0.9)" }}
              dir="rtl"
            >
              {activeWish}
            </p>
          )}
        </div>

        {/* Circle of stars */}
        <div className="relative mx-auto" style={{ width: radius * 2 + 80, height: radius * 2 + 80 }}>
          {/* Center glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-3xl transition-opacity duration-1000"
            style={{
              background: "radial-gradient(circle, hsl(var(--gold) / 0.3), transparent)",
              opacity: allDone ? 1 : 0.15,
            }}
          />

          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="font-panorama text-xs text-muted-foreground/30">
              {stars.filter((s) => s.unlocked).length}/{stars.length}
            </p>
          </div>

          {stars.map((star, i) => {
            const rad = (star.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <button
                key={star.id}
                onClick={() => !star.unlocked && unlock(star.id)}
                disabled={star.unlocked}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-all duration-500"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  transitionDelay: revealed ? `${i * 100}ms` : "0ms",
                  opacity: revealed ? 1 : 0,
                  scale: revealed ? "1" : "0",
                }}
              >
                <div className="relative group">
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-full blur-lg transition-all duration-500"
                    style={{
                      background: star.unlocked
                        ? "hsl(var(--gold) / 0.3)"
                        : "hsl(var(--primary) / 0.1)",
                      transform: star.unlocked ? "scale(2)" : "scale(1)",
                    }}
                  />

                  {/* Star orb */}
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      !star.unlocked ? "cursor-pointer active:scale-90" : ""
                    }`}
                    style={{
                      background: star.unlocked
                        ? "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--primary) / 0.2))"
                        : "hsl(var(--card) / 0.6)",
                      border: `1px solid ${
                        star.unlocked
                          ? "hsl(var(--gold) / 0.4)"
                          : "hsl(var(--border) / 0.3)"
                      }`,
                      boxShadow: star.unlocked
                        ? "0 0 20px hsl(var(--gold) / 0.2), inset 0 0 10px hsl(var(--gold) / 0.1)"
                        : "0 4px 20px hsl(0 0% 0% / 0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span className={`text-2xl transition-transform duration-500 ${star.unlocked ? "scale-110" : "group-active:scale-125"}`}>
                      {star.emoji}
                    </span>
                  </div>

                  {/* Pulse for unlocked */}
                  {!star.unlocked && (
                    <div
                      className="absolute inset-0 rounded-full animate-pulse opacity-20"
                      style={{ border: "1px solid hsl(var(--secondary) / 0.3)" }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* All done */}
        {allDone && (
          <div className="text-center mt-8 animate-fade-in-up">
            <p className="font-panorama text-2xl" style={{ color: "hsl(var(--secondary) / 0.85)" }}>
              كل الأمنيات ليك يا شروق 🌟
            </p>
            <p className="font-panorama text-sm text-muted-foreground/40 mt-2">
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
