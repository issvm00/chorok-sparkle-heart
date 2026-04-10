import { forwardRef, useState, useEffect, useMemo } from "react";

interface Props {
  revealed: boolean;
}

const MESSAGE_LINES = [
  "يا شروق، كل عام و أنت بألف خير",
  "عقبال 100 سنة مليانة بالنجاح",
  "و الفرح و الصحة و راحة البال",
  "ديما كون بخير يا صاحبي 🤝",
];

// Generate random scratch patch positions for each line
const generatePatches = () => {
  const patches: { lineIdx: number; startPct: number; widthPct: number; revealAt: number }[] = [];
  MESSAGE_LINES.forEach((_, lineIdx) => {
    // 3-4 patches per line covering ~70% of the text
    const count = 3 + Math.floor(Math.random() * 2);
    const segWidth = 100 / count;
    for (let j = 0; j < count; j++) {
      patches.push({
        lineIdx,
        startPct: j * segWidth + Math.random() * 4,
        widthPct: segWidth - 2 + Math.random() * 4,
        revealAt: Math.floor(Math.random() * 3) + 1, // reveal at click 1, 2, or 3
      });
    }
  });
  return patches;
};

const HandwrittenMessage = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [confettiCount, setConfettiCount] = useState(0);
  const patches = useMemo(() => generatePatches(), []);

  const allBlown = candlesBlown >= 3;

  const handleCandleClick = (index: number) => {
    if (index !== candlesBlown) return; // must blow in order
    setCandlesBlown((p) => p + 1);
    setConfettiCount((p) => p + 1);

    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];
    import("canvas-confetti").then((mod) => {
      mod.default({
        particleCount: 60 + candlesBlown * 20,
        spread: 80,
        origin: { x: 0.5, y: 0.65 },
        colors,
      });
    });
  };

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start"
    >
      <div
        className={`w-full max-w-sm mx-auto transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, hsl(40 25% 94%), hsl(38 18% 89%))",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 3px rgba(255,255,255,0.6), inset 0 -1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {/* Gold foil top strip */}
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(45 90% 58%), hsl(40 80% 50%), hsl(45 90% 58%), transparent)",
            }}
          />

          <div className="p-8">
            {/* Paper texture */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Corners */}
            <div className="absolute top-5 right-5 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-[hsl(45,80%,45%)] opacity-25 rounded-tr-md" />
            <div className="absolute bottom-5 left-5 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-[hsl(45,80%,45%)] opacity-25 rounded-bl-md" />

            <div className="relative" dir="rtl">
              {/* Header */}
              <div className="text-center mb-6">
                <span className="text-3xl">💌</span>
                <h3 className="font-arabic text-lg text-[hsl(260,30%,25%)] font-bold mt-2 tracking-wide">
                  رسالة من صاحبك
                </h3>
                <div className="w-10 h-px mx-auto mt-3 bg-gradient-to-r from-transparent via-[hsl(45,80%,50%)] to-transparent opacity-50" />
              </div>

              {/* Message with scratch overlay */}
              <div className="space-y-4 min-h-[160px]">
                {MESSAGE_LINES.map((line, i) => (
                  <div key={i} className="relative">
                    <p
                      className="font-arabic text-base leading-relaxed"
                      style={{ color: "hsl(260, 25%, 30%)" }}
                    >
                      {line}
                    </p>
                    {/* Scratch patches */}
                    <div className="absolute inset-0 pointer-events-none flex">
                      {patches
                        .filter((p) => p.lineIdx === i)
                        .map((patch, pi) => {
                          const isRevealed = candlesBlown >= patch.revealAt;
                          return (
                            <div
                              key={pi}
                              className="absolute top-0 h-full transition-all duration-700 ease-out rounded-sm"
                              style={{
                                right: `${patch.startPct}%`,
                                width: `${patch.widthPct}%`,
                                background: isRevealed
                                  ? "transparent"
                                  : "linear-gradient(135deg, hsl(260 20% 55% / 0.85), hsl(270 25% 45% / 0.9))",
                                backdropFilter: isRevealed ? "none" : "blur(6px)",
                                opacity: isRevealed ? 0 : 1,
                                transform: isRevealed ? "scale(0.8)" : "scale(1)",
                              }}
                            />
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Signature */}
              <div
                className={`mt-6 text-center transition-all duration-700 ${
                  allBlown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="w-8 h-px mx-auto bg-gradient-to-r from-transparent via-[hsl(45,80%,50%)] to-transparent opacity-40 mb-3" />
                <p className="font-arabic text-sm text-[hsl(260,25%,40%)] font-medium">
                  من صديقك الغالي 🤝
                </p>
              </div>
            </div>
          </div>

          {/* Gold foil bottom strip */}
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(45 90% 58%), hsl(40 80% 50%), hsl(45 90% 58%), transparent)",
            }}
          />
        </div>

        {/* Candles section */}
        <div className="text-center mt-10">
          {/* Hint */}
          {!allBlown && (
            <p className="font-arabic text-xs text-secondary/50 mb-4 animate-pulse">
              🕯️ نفخ الشمعات باش تكشف الرسالة
            </p>
          )}

          {/* Three candles */}
          <div className="flex items-end justify-center gap-8 mb-6">
            {[0, 1, 2].map((i) => {
              const isLit = i >= candlesBlown;
              const isNext = i === candlesBlown;
              return (
                <button
                  key={i}
                  onClick={() => handleCandleClick(i)}
                  disabled={!isNext}
                  className={`group relative flex flex-col items-center transition-all duration-300 focus:outline-none ${
                    isNext ? "cursor-pointer scale-110" : isLit ? "cursor-default opacity-60" : "cursor-default"
                  }`}
                  aria-label={`Candle ${i + 1}`}
                >
                  {/* Flame */}
                  {isLit && (
                    <div className="relative mb-1">
                      <div
                        className="w-3 h-4 rounded-full animate-pulse"
                        style={{
                          background: "radial-gradient(circle at 50% 70%, hsl(45 100% 65%), hsl(30 100% 50%), transparent)",
                          filter: "drop-shadow(0 0 8px hsl(45 90% 58%)) drop-shadow(0 0 16px hsl(30 100% 50% / 0.5))",
                        }}
                      />
                      {isNext && (
                        <div className="absolute -inset-3 rounded-full bg-secondary/10 animate-ping" />
                      )}
                    </div>
                  )}
                  {!isLit && (
                    <div className="mb-1 h-4 flex items-center">
                      <span className="text-xs">💨</span>
                    </div>
                  )}
                  {/* Candle body */}
                  <div
                    className="w-3 h-10 rounded-t-sm rounded-b-md transition-all"
                    style={{
                      background: isLit
                        ? `linear-gradient(to bottom, ${
                            i === 0 ? "hsl(320 60% 65%)" : i === 1 ? "hsl(270 60% 65%)" : "hsl(200 60% 65%)"
                          }, ${
                            i === 0 ? "hsl(320 50% 50%)" : i === 1 ? "hsl(270 50% 50%)" : "hsl(200 50% 50%)"
                          })`
                        : "linear-gradient(to bottom, hsl(0 0% 60%), hsl(0 0% 45%))",
                      boxShadow: isLit ? "0 0 12px rgba(168,85,247,0.2)" : "none",
                    }}
                  />
                  {/* Base */}
                  <div className="w-5 h-1.5 rounded-b-sm bg-secondary/30 mt-0.5" />

                  {/* Number label */}
                  <span className="mt-2 text-[10px] font-arabic text-muted-foreground/40">
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cake */}
          <div className="text-5xl select-none">🎂</div>

          {/* Progress indicator */}
          <div className="flex gap-1.5 justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: candlesBlown > i ? "24px" : "8px",
                  background:
                    candlesBlown > i
                      ? "hsl(var(--secondary))"
                      : "hsl(var(--muted-foreground) / 0.2)",
                }}
              />
            ))}
          </div>

          {allBlown && (
            <p className="mt-4 font-arabic text-sm text-secondary/70 animate-fade-in font-medium">
              🎉 نفختي الشمعات! تمنى أمنية
            </p>
          )}

          {confettiCount > 0 && !allBlown && (
            <p className="mt-3 font-arabic text-xs text-muted-foreground/40">
              {3 - candlesBlown} شمعات باقيين...
            </p>
          )}
        </div>
      </div>
    </section>
  );
});

HandwrittenMessage.displayName = "HandwrittenMessage";
export default HandwrittenMessage;
