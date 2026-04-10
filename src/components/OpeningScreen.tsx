import { useState } from "react";
import confetti from "canvas-confetti";

interface Props {
  onOpen: () => void;
}

const OpeningScreen = ({ onOpen }: Props) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);

    // Big confetti burst
    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa", "#34d399"];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 100, origin: { x: 0.3, y: 0.5 }, colors });
      confetti({ particleCount: 60, spread: 100, origin: { x: 0.7, y: 0.5 }, colors });
    }, 300);
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors });
    }, 600);

    setTimeout(onOpen, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Ambient orbs */}
      <div className="orb w-64 h-64 bg-primary -top-20 -left-20" />
      <div className="orb w-48 h-48 bg-accent bottom-20 right-0" style={{ animationDelay: "3s" }} />
      <div className="orb w-32 h-32 bg-secondary top-1/2 left-1/2" style={{ animationDelay: "5s" }} />

      <div className={`relative flex flex-col items-center transition-all duration-1000 ${opening ? "scale-150 opacity-0" : "scale-100 opacity-100"}`}>
        {/* Gift box */}
        <button
          onClick={handleOpen}
          className="relative group cursor-pointer"
          aria-label="Open gift"
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full border border-primary/30 photo-ring" />
            <div className="absolute w-32 h-32 rounded-full border border-accent/20 photo-ring" style={{ animationDelay: "0.7s" }} />
          </div>

          <div className="relative text-8xl md:text-9xl animate-heartbeat group-hover:scale-110 transition-transform select-none">
            🎁
          </div>
        </button>

        <p className="mt-8 text-lg text-muted-foreground animate-pulse tracking-wide">
          إضغط/ي هنا 👆
        </p>
        <p className="mt-2 text-sm text-muted-foreground/60">
          عندك هدية...
        </p>
      </div>
    </div>
  );
};

export default OpeningScreen;
