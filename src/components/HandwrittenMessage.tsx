import { forwardRef, useState, useMemo } from "react";

interface Props {
  revealed: boolean;
}

const MESSAGE_LINES = [
  "يا شروق، كل عام و أنت بألف خير",
  "عقبال 100 سنة مليانة بالنجاح",
  "و الفرح و الصحة و راحة البال",
  "ديما كون بخير يا صاحبي 🤝",
];

const generatePatches = () => {
  const patches: { lineIdx: number; startPct: number; widthPct: number; revealAt: number }[] = [];
  MESSAGE_LINES.forEach((_, lineIdx) => {
    const count = 3 + Math.floor(Math.random() * 2);
    const segWidth = 100 / count;
    for (let j = 0; j < count; j++) {
      patches.push({
        lineIdx,
        startPct: j * segWidth + Math.random() * 4,
        widthPct: segWidth - 2 + Math.random() * 4,
        revealAt: Math.floor(Math.random() * 3) + 1,
      });
    }
  });
  return patches;
};

const HandwrittenMessage = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const patches = useMemo(() => generatePatches(), []);

  const allBlown = candlesBlown >= 3;

  const handleCandleClick = (index: number) => {
    if (index !== candlesBlown) return;
    setCandlesBlown((p) => p + 1);

    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];
    import("canvas-confetti").then((mod) => {
      mod.default({
        particleCount: 60 + candlesBlown * 25,
        spread: 90,
        origin: { x: 0.5, y: 0.7 },
        colors,
      });
    });
  };

  const candleColors = [
    { body: "hsl(340 70% 60%)", tip: "hsl(340 60% 45%)" },
    { body: "hsl(270 65% 60%)", tip: "hsl(270 55% 45%)" },
    { body: "hsl(200 65% 55%)", tip: "hsl(200 55% 40%)" },
  ];

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
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(165deg, hsl(260 30% 8%), hsl(270 25% 12%), hsl(260 20% 6%))",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px hsl(270 60% 55% / 0.08), inset 0 1px 1px hsl(270 40% 30% / 0.3)",
          }}
        >
          {/* Top decorative border — gradient line */}
          <div className="h-[2px] w-full" style={{
            background: "linear-gradient(90deg, transparent 5%, hsl(270 60% 55% / 0.6) 30%, hsl(45 90% 58% / 0.7) 50%, hsl(320 60% 55% / 0.6) 70%, transparent 95%)",
          }} />

          {/* Inner content */}
          <div className="relative p-8 pt-7">
            {/* Subtle mesh gradient background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                background: `radial-gradient(circle at 20% 20%, hsl(270 60% 55%), transparent 50%),
                             radial-gradient(circle at 80% 80%, hsl(45 80% 55%), transparent 50%)`,
              }}
            />

            {/* Corner ornaments */}
            <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
              <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: "linear-gradient(to left, hsl(45 80% 55%), transparent)" }} />
              <div className="absolute top-0 right-0 h-full w-[1px]" style={{ background: "linear-gradient(to bottom, hsl(45 80% 55%), transparent)" }} />
            </div>
            <div className="absolute bottom-4 left-4 w-8 h-8 opacity-20">
              <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: "linear-gradient(to right, hsl(45 80% 55%), transparent)" }} />
              <div className="absolute bottom-0 left-0 h-full w-[1px]" style={{ background: "linear-gradient(to top, hsl(45 80% 55%), transparent)" }} />
            </div>

            <div className="relative" dir="rtl">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-8 h-[1px]" style={{ background: "linear-gradient(to right, transparent, hsl(45 80% 55% / 0.5))" }} />
                  <span className="text-2xl">✉️</span>
                  <div className="w-8 h-[1px]" style={{ background: "linear-gradient(to left, transparent, hsl(45 80% 55% / 0.5))" }} />
                </div>
                <h3 className="font-panorama text-2xl text-foreground/90 tracking-wide">
                  رسالة من صاحبك
                </h3>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] mb-6 opacity-20" style={{
                background: "linear-gradient(90deg, transparent, hsl(270 60% 55% / 0.6), hsl(45 80% 55% / 0.5), hsl(270 60% 55% / 0.6), transparent)"
              }} />

              {/* Message with scratch overlay */}
              <div className="space-y-4 min-h-[160px]">
                {MESSAGE_LINES.map((line, i) => (
                  <div key={i} className="relative">
                    <p className="font-panorama text-lg leading-relaxed text-foreground/85">
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
                                  : "linear-gradient(135deg, hsl(270 30% 15% / 0.92), hsl(260 25% 10% / 0.95))",
                                backdropFilter: isRevealed ? "none" : "blur(8px)",
                                opacity: isRevealed ? 0 : 1,
                                transform: isRevealed ? "scaleY(0.5)" : "scaleY(1)",
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
                className={`mt-8 text-center transition-all duration-700 ${
                  allBlown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="w-12 h-[1px] mx-auto mb-3 opacity-30" style={{
                  background: "linear-gradient(90deg, transparent, hsl(45 80% 55%), transparent)"
                }} />
                <p className="font-panorama text-base text-secondary/70">
                  من صديقك الغالي 🤝
                </p>
              </div>
            </div>
          </div>

          {/* Bottom decorative border */}
          <div className="h-[2px] w-full" style={{
            background: "linear-gradient(90deg, transparent 5%, hsl(320 60% 55% / 0.5) 30%, hsl(45 90% 58% / 0.6) 50%, hsl(270 60% 55% / 0.5) 70%, transparent 95%)",
          }} />
        </div>

        {/* Candles section */}
        <div className="text-center mt-12">
          {/* Hint */}
          {!allBlown && (
            <div className="mb-5 animate-pulse">
              <p className="font-panorama text-sm text-muted-foreground/50">
                🕯️ نفخ الشمعات باش تكشف الرسالة
              </p>
            </div>
          )}

          {/* Three candles on a cake base */}
          <div className="relative inline-flex flex-col items-center">
            <div className="flex items-end justify-center gap-10 mb-3">
              {[0, 1, 2].map((i) => {
                const isLit = i >= candlesBlown;
                const isNext = i === candlesBlown;
                const color = candleColors[i];
                return (
                  <button
                    key={i}
                    onClick={() => handleCandleClick(i)}
                    disabled={!isNext}
                    className={`group relative flex flex-col items-center transition-all duration-300 focus:outline-none ${
                      isNext ? "cursor-pointer scale-110" : isLit ? "cursor-default opacity-50" : "cursor-default"
                    }`}
                    aria-label={`Candle ${i + 1}`}
                  >
                    {/* Flame */}
                    {isLit && (
                      <div className="relative mb-1">
                        <div
                          className="w-3.5 h-5 rounded-[50%] animate-candle-flicker"
                          style={{
                            background: "radial-gradient(ellipse at 50% 80%, hsl(50 100% 90%), hsl(45 100% 65%) 40%, hsl(25 100% 50%) 70%, transparent)",
                            filter: "drop-shadow(0 0 10px hsl(45 90% 58%)) drop-shadow(0 0 20px hsl(30 100% 50% / 0.4))",
                          }}
                        />
                        {isNext && (
                          <div className="absolute -inset-4 rounded-full animate-ping opacity-20"
                            style={{ background: `radial-gradient(circle, ${color.body}, transparent)` }}
                          />
                        )}
                      </div>
                    )}
                    {!isLit && (
                      <div className="mb-1 h-5 flex items-center">
                        <span className="text-sm opacity-60">💨</span>
                      </div>
                    )}
                    {/* Candle body */}
                    <div
                      className="w-3.5 h-12 rounded-t-sm rounded-b-md transition-all"
                      style={{
                        background: isLit
                          ? `linear-gradient(to bottom, ${color.body}, ${color.tip})`
                          : "linear-gradient(to bottom, hsl(0 0% 50%), hsl(0 0% 35%))",
                        boxShadow: isLit ? `0 0 16px ${color.body.replace(")", " / 0.25)")}` : "none",
                      }}
                    />
                    {/* Wax drip */}
                    {isLit && (
                      <div className="w-2 h-1 rounded-b-full opacity-50"
                        style={{ background: color.body }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cake */}
            <div className="text-5xl select-none mt-1">🎂</div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mt-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: candlesBlown > i ? "28px" : "8px",
                  background: candlesBlown > i
                    ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))"
                    : "hsl(var(--muted-foreground) / 0.15)",
                }}
              />
            ))}
          </div>

          {allBlown && (
            <p className="mt-5 font-panorama text-base text-secondary/80 animate-fade-in">
              🎉 نفختي الشمعات! تمنى أمنية
            </p>
          )}

          {!allBlown && candlesBlown > 0 && (
            <p className="mt-4 font-panorama text-xs text-muted-foreground/35">
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
