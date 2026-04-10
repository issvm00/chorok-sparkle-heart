import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";

interface Props {
  onOpen: () => void;
}

const stages = ["waiting", "countdown3", "countdown2", "countdown1", "burst", "gift", "opening"] as const;
type Stage = (typeof stages)[number];

const OpeningScreen = ({ onOpen }: Props) => {
  const [stage, setStage] = useState<Stage>("waiting");
  const [starsVisible, setStarsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start the sequence
  const startSequence = useCallback(() => {
    if (stage !== "waiting") return;
    setStarsVisible(true);

    setTimeout(() => setStage("countdown3"), 400);
    setTimeout(() => setStage("countdown2"), 1400);
    setTimeout(() => setStage("countdown1"), 2400);
    setTimeout(() => {
      setStage("burst");
      // Big confetti burst
      const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa", "#34d399", "#fcd34d"];
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 100 + i * 20,
            origin: { x: 0.3 + Math.random() * 0.4, y: 0.4 + Math.random() * 0.2 },
            colors,
            startVelocity: 30 + i * 5,
            ticks: 120,
          });
        }, i * 150);
      }
    }, 3400);
    setTimeout(() => setStage("gift"), 4200);
  }, [stage]);

  const handleGiftClick = () => {
    if (stage !== "gift") return;
    setStage("opening");

    // Epic confetti
    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa", "#34d399"];
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(onOpen, 1500);
  };

  // Auto-start on first interaction or after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === "waiting") startSequence();
    }, 2000);

    const handleInteraction = () => {
      if (stage === "waiting") startSequence();
    };
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [stage, startSequence]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
    >
      {/* Star field */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${starsVisible ? "opacity-100" : "opacity-0"}`}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2.5 + 0.5,
              height: Math.random() * 2.5 + 0.5,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient orbs */}
      <div className="orb w-56 h-56 bg-primary -top-10 -left-10" />
      <div className="orb w-40 h-40 bg-accent bottom-10 right-0" style={{ animationDelay: "3s" }} />

      {/* Countdown numbers */}
      {(stage === "countdown3" || stage === "countdown2" || stage === "countdown1") && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            key={stage}
            className="text-[10rem] md:text-[14rem] font-black number-gradient font-display animate-countdown select-none"
          >
            {stage === "countdown3" ? "3" : stage === "countdown2" ? "2" : "1"}
          </span>
        </div>
      )}

      {/* Burst flash */}
      {stage === "burst" && (
        <div className="absolute inset-0 bg-secondary/20 animate-flash" />
      )}

      {/* Gift box */}
      {(stage === "gift" || stage === "opening") && (
        <div
          className={`flex flex-col items-center transition-all duration-700 ${
            stage === "opening" ? "scale-[3] opacity-0" : "scale-100 opacity-100 animate-gift-arrive"
          }`}
        >
          <button
            onClick={handleGiftClick}
            className="relative group cursor-pointer focus:outline-none"
            aria-label="Open gift"
          >
            {/* Pulse rings */}
            <div className="absolute inset-[-20px] flex items-center justify-center">
              <div className="absolute w-36 h-36 rounded-full border border-primary/30 photo-ring" />
              <div className="absolute w-36 h-36 rounded-full border border-secondary/20 photo-ring" style={{ animationDelay: "0.7s" }} />
              <div className="absolute w-36 h-36 rounded-full border border-accent/20 photo-ring" style={{ animationDelay: "1.4s" }} />
            </div>

            <div className="relative text-8xl md:text-9xl animate-heartbeat group-active:scale-125 transition-transform select-none drop-shadow-2xl">
              🎁
            </div>
          </button>

          <p className="mt-8 text-lg text-muted-foreground tracking-wide animate-fade-in font-arabic font-medium">
            إضغط على الهدية 🎁
          </p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tap to start hint */}
      {stage === "waiting" && (
        <div className="text-center animate-pulse">
          <p className="text-muted-foreground/50 text-sm tracking-widest">TAP ANYWHERE</p>
        </div>
      )}
    </div>
  );
};

export default OpeningScreen;
