import { forwardRef, useState, useMemo, useCallback } from "react";

interface Props {
  revealed: boolean;
}

const MESSAGE_LINES = [
  "اليوم،  اكتملَ  عقدُكِ  التاسع  عشر حبةً  حبة،  ليُعلنَ  ولادةَ  فصلٍ  جديد  من  فصولِ  حكايتكِ  الفريدة.  في  عينيكِ  بريقُ  الذكاء،  وفي  روحكِ  هدوءُ  الواثقين.  لا تقبلي  بأقل  من  النجومِ  مَسكناً،  ولا  ترضي  بغيرِ  التميزِ  عنواناً.  كل  عام  وأنتِ  الغيمةُ  التي  تُمطرُ خيراً  أينما  حلّت،  والجوهرةُ  التي  تزدادُ  بريقاً  مع  كل  عام ",
];

const HandwrittenMessage = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const allBlown = candlesBlown >= 3;

  // Generate stable random values for wipe strips
  const strips = useMemo(() => {
    const result: { id: number; revealAt: number; delay: number; angle: number }[] = [];
    for (let i = 0; i < 18; i++) {
      result.push({
        id: i,
        revealAt: Math.ceil((i % 3) + 1), // distribute evenly: 1,2,3
        delay: Math.random() * 400,
        angle: -3 + Math.random() * 6,
      });
    }
    // Shuffle revealAt
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = result[i].revealAt;
      result[i].revealAt = result[j].revealAt;
      result[j].revealAt = tmp;
    }
    return result;
  }, []);

  const handleCandleClick = useCallback(
    (index: number) => {
      if (index !== candlesBlown) return;
      setCandlesBlown((p) => p + 1);
      import("canvas-confetti").then((mod) => {
        mod.default({
          particleCount: 60 + candlesBlown * 40,
          spread: 90,
          origin: { x: 0.5, y: 0.7 },
          colors: ["#c084fc", "#fbbf24", "#f472b6", "#60a5fa", "#facc15"],
        });
      });
    },
    [candlesBlown],
  );

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-3 py-16 snap-start"
    >
      <div
        className={`w-full max-w-md mx-auto transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(165deg, hsl(270 30% 14%) 0%, hsl(260 35% 10%) 40%, hsl(280 25% 8%) 100%)",
            border: "1.5px solid hsl(45 80% 55% / 0.2)",
            boxShadow:
              "0 0 60px hsl(270 60% 40% / 0.15), 0 25px 60px hsl(0 0% 0% / 0.6), inset 0 1px 0 hsl(45 80% 60% / 0.08)",
          }}
        >
          {/* Top gold border */}
          <div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(45 90% 65% / 0.6) 30%, hsl(45 100% 75% / 0.9) 50%, hsl(45 90% 65% / 0.6) 70%, transparent 95%)",
            }}
          />

          {/* Corner ornaments */}
          <div
            className="absolute top-3 left-3 w-6 h-6 border-t border-l rounded-tl-sm"
            style={{ borderColor: "hsl(45 80% 55% / 0.2)" }}
          />
          <div
            className="absolute top-3 right-3 w-6 h-6 border-t border-r rounded-tr-sm"
            style={{ borderColor: "hsl(45 80% 55% / 0.2)" }}
          />
          <div
            className="absolute bottom-3 left-3 w-6 h-6 border-b border-l rounded-bl-sm"
            style={{ borderColor: "hsl(45 80% 55% / 0.2)" }}
          />
          <div
            className="absolute bottom-3 right-3 w-6 h-6 border-b border-r rounded-br-sm"
            style={{ borderColor: "hsl(45 80% 55% / 0.2)" }}
          />

          <div className="relative p-8 pt-6" dir="rtl">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-[1px]"
                  style={{ background: "linear-gradient(to right, transparent, hsl(45 90% 65% / 0.5))" }}
                />
                <span className="text-2xl">💌</span>
                <div
                  className="w-10 h-[1px]"
                  style={{ background: "linear-gradient(to left, transparent, hsl(45 90% 65% / 0.5))" }}
                />
              </div>
              <h3 className="font-panorama text-2xl tracking-wide" style={{ color: "hsl(45 80% 75%)" }}>
                رسالة من القلب
              </h3>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="flex-1 h-[1px]"
                style={{ background: "linear-gradient(to right, transparent, hsl(45 80% 55% / 0.3))" }}
              />
              <span className="text-xs" style={{ color: "hsl(45 80% 55% / 0.4)" }}>
                ✦
              </span>
              <div
                className="flex-1 h-[1px]"
                style={{ background: "linear-gradient(to left, transparent, hsl(45 80% 55% / 0.3))" }}
              />
            </div>

            {/* Message area with full overlay */}
            <div className="relative min-h-[250px]">
              {/* Actual text underneath */}
              <div className="space-y-3 px-1">
                {MESSAGE_LINES.map((line, i) => (
                  <p
                    key={i}
                    className="font-panorama text-xl text-center leading-loose"
                    style={{
                      minHeight: line ? undefined : "0.75rem",
                      color: "hsl(45 40% 88%)",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Full overlay - horizontal strips that wipe away */}
              <div className="absolute inset-0 flex flex-col overflow-hidden rounded-lg pointer-events-none">
                {strips.map((strip) => {
                  const isRevealed = candlesBlown >= strip.revealAt;
                  return (
                    <div
                      key={strip.id}
                      className="flex-1 relative"
                      style={{
                        transition: `opacity 0.8s ease-out, transform 1s ease-out`,
                        transitionDelay: isRevealed ? `${strip.delay}ms` : "0ms",
                        opacity: isRevealed ? 0 : 1,
                        transform: isRevealed
                          ? `translateX(${strip.id % 2 === 0 ? "110%" : "-110%"}) rotate(${strip.angle}deg)`
                          : "translateX(0) rotate(0deg)",
                      }}
                    >
                      {/* Main cover */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(${90 + strip.angle}deg, hsl(270 25% 12%) 0%, hsl(265 30% 14%) 50%, hsl(275 20% 11%) 100%)`,
                        }}
                      />
                      {/* Shimmer texture */}
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `repeating-linear-gradient(${strip.angle}deg, transparent, transparent 3px, hsl(45 80% 55% / 0.04) 3px, hsl(45 80% 55% / 0.04) 4px)`,
                        }}
                      />
                      {/* Edge highlight */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[1px]"
                        style={{ background: "hsl(45 80% 55% / 0.06)" }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Initial hint overlay - golden shimmer */}
              {candlesBlown === 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 25% 12% / 0.5), transparent, hsl(270 25% 12% / 0.5))",
                  }}
                >
                  <div className="text-center animate-pulse">
                    <span className="text-3xl block mb-2">🎁</span>
                    <p className="font-panorama text-sm" style={{ color: "hsl(45 80% 65% / 0.7)" }}>
                      طفي الشمعات باش تكشف الرسالة
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Signature - appears after all candles blown */}
            <div
              className={`mt-7 text-center transition-all duration-1000 ${
                allBlown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="flex-1 max-w-[40px] h-[1px]"
                  style={{ background: "linear-gradient(to right, transparent, hsl(45 80% 55% / 0.3))" }}
                />
                <span className="text-xs" style={{ color: "hsl(45 80% 55% / 0.3)" }}>
                  ✦
                </span>
                <div
                  className="flex-1 max-w-[40px] h-[1px]"
                  style={{ background: "linear-gradient(to left, transparent, hsl(45 80% 55% / 0.3))" }}
                />
              </div>
              <p className="font-panorama text-base" style={{ color: "hsl(45 70% 65% / 0.7)" }}>
                We can’t change the past. What we can do is choose how we move forward
              </p>
            </div>
          </div>

          {/* Bottom gold border */}
          <div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, hsl(45 90% 65% / 0.6) 30%, hsl(45 100% 75% / 0.9) 50%, hsl(45 90% 65% / 0.6) 70%, transparent 95%)",
            }}
          />
        </div>

        {/* Candles section */}
        <div className="text-center mt-10">
          {!allBlown && candlesBlown === 0 && (
            <div className="mb-5 animate-pulse">
              <p className="font-panorama text-sm" style={{ color: "hsl(45 60% 65% / 0.5)" }}>
                🕯️ اضغط على الشمعات وحدة وحدة
              </p>
            </div>
          )}

          <div className="relative inline-flex flex-col items-center">
            <div className="flex items-end justify-center gap-12 mb-2">
              {[0, 1, 2].map((i) => {
                const isLit = i >= candlesBlown;
                const isNext = i === candlesBlown;
                const candleColors = [
                  { body: "hsl(320 50% 55%)", glow: "hsl(320 60% 50% / 0.35)" },
                  { body: "hsl(270 60% 60%)", glow: "hsl(270 70% 55% / 0.35)" },
                  { body: "hsl(200 70% 55%)", glow: "hsl(200 80% 50% / 0.35)" },
                ];
                const c = candleColors[i];

                return (
                  <button
                    key={i}
                    onClick={() => handleCandleClick(i)}
                    disabled={!isNext}
                    className={`group relative flex flex-col items-center transition-all duration-300 focus:outline-none ${
                      isNext ? "cursor-pointer scale-110" : isLit ? "cursor-default opacity-30" : "cursor-default"
                    }`}
                    aria-label={`شمعة ${i + 1}`}
                  >
                    {/* Flame */}
                    {isLit ? (
                      <div className="relative mb-1">
                        <div
                          className="w-3.5 h-6 rounded-[50%] animate-candle-flicker"
                          style={{
                            background:
                              "radial-gradient(ellipse at 50% 80%, hsl(50 100% 92%), hsl(45 100% 65%) 40%, hsl(25 100% 50%) 75%, transparent)",
                            filter:
                              "drop-shadow(0 0 10px hsl(45 100% 60%)) drop-shadow(0 0 20px hsl(30 100% 50% / 0.4))",
                          }}
                        />
                        {isNext && (
                          <>
                            <div
                              className="absolute -inset-4 rounded-full animate-ping opacity-20"
                              style={{ background: c.glow }}
                            />
                            <div
                              className="absolute -inset-2 rounded-full animate-pulse opacity-10"
                              style={{ background: `radial-gradient(circle, ${c.glow}, transparent)` }}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="mb-1 h-6 flex items-center">
                        <span className="text-base opacity-40">💨</span>
                      </div>
                    )}

                    {/* Candle body */}
                    <div
                      className="w-3.5 h-12 rounded-t-sm rounded-b-md transition-all duration-500"
                      style={{
                        background: isLit
                          ? `linear-gradient(180deg, ${c.body}, hsl(0 0% 90% / 0.15) 50%, ${c.body})`
                          : "hsl(var(--muted-foreground) / 0.15)",
                        boxShadow: isLit ? `0 0 15px ${c.glow}` : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-4xl select-none mt-1">🎂</div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2.5 justify-center mt-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: candlesBlown > i ? "28px" : "8px",
                  background:
                    candlesBlown > i
                      ? "linear-gradient(90deg, hsl(45 90% 60%), hsl(45 100% 75%))"
                      : "hsl(var(--muted-foreground) / 0.1)",
                  boxShadow: candlesBlown > i ? "0 0 8px hsl(45 90% 60% / 0.4)" : "none",
                }}
              />
            ))}
          </div>

          {allBlown && (
            <p className="mt-5 font-panorama text-base animate-fade-in" style={{ color: "hsl(45 80% 70%)" }}>
              🎉 مبروك عليك! تمنى أمنية
            </p>
          )}

          {!allBlown && candlesBlown > 0 && (
            <p className="mt-3 font-panorama text-xs" style={{ color: "hsl(var(--muted-foreground) / 0.35)" }}>
              {3 - candlesBlown === 1 ? "شمعة وحدة باقية..." : `${3 - candlesBlown} شمعات باقيين...`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
});

HandwrittenMessage.displayName = "HandwrittenMessage";
export default HandwrittenMessage;
