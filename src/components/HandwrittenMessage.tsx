import { forwardRef, useState, useMemo } from "react";

interface Props {
  revealed: boolean;
}

const MESSAGE_LINES = [
  "يا شروق، كل عام و أنت بألف خير",
  "عقبال 100 سنة مليانة بالنجاح",
  "و الفرح و الصحة و راحة البال",
  "ديما كون بخير يا صاحبي 🤝",
  "",
  "ما تسمح لحد يقلل من قيمتك",
  "أنت قادر على كلشي يا الكبير 💪",
];

// Generate random scratch patches to cover the text
const generatePatches = () => {
  const patches: { row: number; col: number; revealAt: number }[] = [];
  const rows = 8;
  const cols = 5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      patches.push({
        row: r,
        col: c,
        revealAt: Math.ceil(Math.random() * 3), // reveal at candle 1, 2, or 3
      });
    }
  }
  return patches;
};

const HandwrittenMessage = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const patches = useMemo(() => generatePatches(), []);

  const allBlown = candlesBlown >= 3;

  const handleCandleClick = (index: number) => {
    if (index !== candlesBlown) return;
    setCandlesBlown((p) => p + 1);
    import("canvas-confetti").then((mod) => {
      mod.default({
        particleCount: 50 + candlesBlown * 30,
        spread: 80,
        origin: { x: 0.5, y: 0.75 },
        colors: ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"],
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
            background: "hsl(var(--card) / 0.6)",
            border: "1px solid hsl(var(--border) / 0.25)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 30px 80px hsl(0 0% 0% / 0.5), 0 0 40px hsl(var(--primary) / 0.06), inset 0 1px 0 hsl(var(--foreground) / 0.04)",
          }}
        >
          {/* Top accent line */}
          <div
            className="h-[1.5px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, hsl(var(--primary) / 0.5) 35%, hsl(var(--gold) / 0.6) 50%, hsl(var(--primary) / 0.5) 65%, transparent 90%)",
            }}
          />

          <div className="relative p-7" dir="rtl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-[1px]"
                  style={{ background: "linear-gradient(to right, transparent, hsl(var(--gold) / 0.4))" }}
                />
                <span className="text-xl">✉️</span>
                <div
                  className="w-8 h-[1px]"
                  style={{ background: "linear-gradient(to left, transparent, hsl(var(--gold) / 0.4))" }}
                />
              </div>
              <h3 className="font-panorama text-2xl text-foreground/85 tracking-wide">
                رسالة من صاحبك
              </h3>
            </div>

            {/* Divider */}
            <div
              className="w-full h-[1px] mb-5 opacity-15"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), hsl(var(--gold) / 0.4), hsl(var(--primary) / 0.5), transparent)",
              }}
            />

            {/* Message area with scratch overlay */}
            <div className="relative min-h-[220px]">
              {/* Actual text */}
              <div className="space-y-3">
                {MESSAGE_LINES.map((line, i) => (
                  <p
                    key={i}
                    className="font-panorama text-lg leading-relaxed text-foreground/80"
                    style={{ minHeight: line ? undefined : "0.75rem" }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Scratch overlay grid */}
              <div className="absolute inset-0 grid grid-rows-[repeat(8,1fr)] grid-cols-[repeat(5,1fr)] pointer-events-none">
                {patches.map((patch, i) => {
                  const isRevealed = candlesBlown >= patch.revealAt;
                  return (
                    <div
                      key={i}
                      className="transition-all duration-700 ease-out"
                      style={{
                        gridRow: patch.row + 1,
                        gridCol: patch.col + 1,
                        background: isRevealed
                          ? "transparent"
                          : "hsl(var(--card) / 0.95)",
                        backdropFilter: isRevealed ? "none" : "blur(8px)",
                        opacity: isRevealed ? 0 : 1,
                        transform: isRevealed ? "scale(0.8)" : "scale(1)",
                        transitionDelay: isRevealed ? `${(i % 7) * 50}ms` : "0ms",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Signature */}
            <div
              className={`mt-6 text-center transition-all duration-700 ${
                allBlown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div
                className="w-10 h-[1px] mx-auto mb-2 opacity-25"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)" }}
              />
              <p className="font-panorama text-base text-secondary/60">
                صديقك الغالي 🤝
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div
            className="h-[1.5px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, hsl(var(--accent) / 0.4) 35%, hsl(var(--gold) / 0.5) 50%, hsl(var(--primary) / 0.4) 65%, transparent 90%)",
            }}
          />
        </div>

        {/* Candles */}
        <div className="text-center mt-10">
          {!allBlown && (
            <div className="mb-4 animate-pulse">
              <p className="font-panorama text-sm text-muted-foreground/40">
                🕯️ طفي الشمعات باش تكشف الرسالة
              </p>
            </div>
          )}

          <div className="relative inline-flex flex-col items-center">
            <div className="flex items-end justify-center gap-10 mb-2">
              {[0, 1, 2].map((i) => {
                const isLit = i >= candlesBlown;
                const isNext = i === candlesBlown;
                const colors = [
                  { body: "hsl(var(--accent))", glow: "hsl(var(--accent) / 0.3)" },
                  { body: "hsl(var(--primary))", glow: "hsl(var(--primary) / 0.3)" },
                  { body: "hsl(var(--neon-blue))", glow: "hsl(var(--neon-blue) / 0.3)" },
                ];
                const c = colors[i];

                return (
                  <button
                    key={i}
                    onClick={() => handleCandleClick(i)}
                    disabled={!isNext}
                    className={`group relative flex flex-col items-center transition-all duration-300 focus:outline-none ${
                      isNext ? "cursor-pointer scale-110" : isLit ? "cursor-default opacity-40" : "cursor-default"
                    }`}
                  >
                    {/* Flame */}
                    {isLit ? (
                      <div className="relative mb-1">
                        <div
                          className="w-3 h-5 rounded-[50%] animate-candle-flicker"
                          style={{
                            background:
                              "radial-gradient(ellipse at 50% 80%, hsl(50 100% 90%), hsl(45 100% 65%) 40%, hsl(25 100% 50%) 70%, transparent)",
                            filter:
                              "drop-shadow(0 0 8px hsl(var(--gold))) drop-shadow(0 0 16px hsl(30 100% 50% / 0.3))",
                          }}
                        />
                        {isNext && (
                          <div
                            className="absolute -inset-3 rounded-full animate-ping opacity-15"
                            style={{ background: c.glow }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="mb-1 h-5 flex items-center">
                        <span className="text-sm opacity-50">💨</span>
                      </div>
                    )}

                    {/* Candle body */}
                    <div
                      className="w-3 h-11 rounded-t-sm rounded-b-md transition-all"
                      style={{
                        background: isLit ? c.body : "hsl(var(--muted-foreground) / 0.2)",
                        boxShadow: isLit ? `0 0 12px ${c.glow}` : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-4xl select-none mt-1">🎂</div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: candlesBlown > i ? "24px" : "8px",
                  background:
                    candlesBlown > i
                      ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))"
                      : "hsl(var(--muted-foreground) / 0.12)",
                }}
              />
            ))}
          </div>

          {allBlown && (
            <p className="mt-4 font-panorama text-base text-secondary/70 animate-fade-in">
              🎉 مبروك عليك! تمنى أمنية
            </p>
          )}

          {!allBlown && candlesBlown > 0 && (
            <p className="mt-3 font-panorama text-xs text-muted-foreground/30">
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
