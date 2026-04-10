import { forwardRef, useState, useEffect } from "react";

interface Props {
  revealed: boolean;
}

const MESSAGE_LINES = [
  "يا شروق، كل عام و أنت بألف خير",
  "عقبال 100 سنة مليانة بالنجاح",
  "و الفرح و الصحة و راحة البال",
  "ديما كون بخير يا صاحبي 🤝",
];

const HandwrittenMessage = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!revealed) return;

    // Show lines one by one with typewriter effect
    const lineTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= MESSAGE_LINES.length) {
          clearInterval(lineTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(lineTimer);
  }, [revealed]);

  // Character reveal for current line
  useEffect(() => {
    if (visibleLines === 0) return;
    setCharIndex(0);
    const currentLine = MESSAGE_LINES[visibleLines - 1];
    if (!currentLine) return;

    let i = 0;
    const charTimer = setInterval(() => {
      i++;
      setCharIndex(i);
      if (i >= currentLine.length) clearInterval(charTimer);
    }, 35);

    return () => clearInterval(charTimer);
  }, [visibleLines]);

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start"
    >
      <div className={`w-full max-w-sm mx-auto transition-all duration-1000 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        {/* Paper card */}
        <div
          className="relative rounded-3xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(45 20% 92%), hsl(40 15% 88%))",
            boxShadow: "0 25px 80px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          {/* Paper texture noise */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Decorative corner */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[hsl(45,80%,40%)] opacity-30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[hsl(45,80%,40%)] opacity-30 rounded-bl-lg" />

          {/* Content */}
          <div className="relative" dir="rtl">
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-4xl">💌</span>
              <h3 className="font-arabic text-xl text-[hsl(260,30%,25%)] font-bold mt-2">
                رسالة من صاحبك
              </h3>
              <div className="w-12 h-[1px] mx-auto mt-3 bg-[hsl(45,80%,50%)] opacity-40" />
            </div>

            {/* Message lines */}
            <div className="space-y-4 min-h-[160px]">
              {MESSAGE_LINES.map((line, i) => {
                const isCurrentLine = i === visibleLines - 1;
                const isVisible = i < visibleLines;

                return (
                  <p
                    key={i}
                    className={`font-arabic text-base leading-relaxed transition-opacity duration-500 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ color: "hsl(260, 25%, 30%)" }}
                  >
                    {isCurrentLine
                      ? line.slice(0, charIndex)
                      : isVisible
                      ? line
                      : ""}
                    {isCurrentLine && charIndex < line.length && (
                      <span className="inline-block w-[2px] h-4 bg-[hsl(260,30%,40%)] ml-0.5 animate-pulse align-text-bottom" />
                    )}
                  </p>
                );
              })}
            </div>

            {/* Signature */}
            {visibleLines >= MESSAGE_LINES.length && (
              <div className="mt-6 text-center animate-fade-in">
                <div className="w-8 h-[1px] mx-auto bg-[hsl(45,80%,50%)] opacity-40 mb-3" />
                <p className="font-arabic text-sm text-[hsl(260,25%,40%)] font-medium">
                  من صديقك الغالي 🤝
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive cake below */}
        <CakeInteraction />
      </div>
    </section>
  );
});

HandwrittenMessage.displayName = "HandwrittenMessage";

// Sub-component: Interactive cake
const CakeInteraction = () => {
  const [clicks, setClicks] = useState(0);
  const [candlesLit, setCandlesLit] = useState([true, true, true]);

  const handleCakeClick = () => {
    setClicks((p) => p + 1);

    // Blow out a candle
    setCandlesLit((prev) => {
      const next = [...prev];
      const litIndex = next.findIndex((c) => c);
      if (litIndex !== -1) next[litIndex] = false;
      return next;
    });

    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];
    import("canvas-confetti").then((mod) => {
      mod.default({ particleCount: 50, spread: 70, origin: { x: 0.5, y: 0.7 }, colors });
    });
  };

  const allBlownOut = candlesLit.every((c) => !c);

  return (
    <div className="text-center mt-10">
      <button
        onClick={handleCakeClick}
        className="group relative inline-flex flex-col items-center focus:outline-none"
        aria-label="Blow out candles"
      >
        <div className="absolute -inset-8 rounded-full bg-secondary/5 blur-2xl group-hover:bg-secondary/10 transition-all" />

        {/* Candles */}
        <div className="relative flex gap-4 mb-2">
          {candlesLit.map((lit, i) => (
            <div key={i} className="flex flex-col items-center">
              {lit && (
                <div className="w-2 h-3 rounded-full bg-secondary mb-1 animate-pulse"
                  style={{ filter: "drop-shadow(0 0 6px hsl(45 90% 58%))" }}
                />
              )}
              <div className="w-1.5 h-5 rounded-full bg-accent/60" />
            </div>
          ))}
        </div>

        {/* Cake */}
        <div className="relative text-6xl cursor-pointer group-active:scale-110 transition-transform select-none">
          🎂
        </div>

        {clicks > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1 animate-scale-in">
            <span className="text-xs text-secondary">🎉 x{clicks}</span>
          </div>
        )}
      </button>

      {allBlownOut && (
        <p className="mt-3 font-arabic text-sm text-secondary/60 animate-fade-in font-medium">
          نفختي الشمعات! 🎉 تمنى أمنية
        </p>
      )}

      {!allBlownOut && (
        <p className="mt-3 font-arabic text-[11px] text-muted-foreground/30 animate-pulse">
          إضغط باش تنفخ الشمعات 🕯️
        </p>
      )}
    </div>
  );
};

export default HandwrittenMessage;
