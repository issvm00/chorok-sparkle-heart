import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import FloatingHearts from "./FloatingHearts";
import Sparkles from "./Sparkles";

const BirthdayPage = () => {
  const [revealed, setRevealed] = useState(false);

  const launchConfetti = () => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 100 };
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.2, y: 0.5 }, colors: ["#e84393", "#fdcb6e", "#fab1a0"] });
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.8, y: 0.5 }, colors: ["#e84393", "#fdcb6e", "#fab1a0"] });
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.5, y: 0.3 }, colors: ["#ff6b81", "#ffd700", "#ff9ff3"] });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      launchConfetti();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleHeartClick = () => {
    launchConfetti();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Sparkles />
      <FloatingHearts />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none z-0" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Main content */}
        <div
          className={`text-center transition-all duration-1000 ${revealed ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
        >
          {/* Age badge */}
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-secondary/50 bg-muted/50 backdrop-blur-sm">
            <span className="text-4xl font-bold gradient-text">19</span>
          </div>

          {/* Happy Birthday */}
          <h2 className="text-lg md:text-xl tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Happy Birthday
          </h2>

          {/* Name */}
          <h1 className="font-script text-6xl md:text-8xl lg:text-9xl gradient-text animate-glow mb-2 leading-tight">
            Chorok
          </h1>

          <p className="font-script text-3xl md:text-4xl text-secondary mb-8">شروق ✨</p>

          {/* Decorative line */}
          <div className="w-40 h-[2px] mx-auto mb-8 animate-shimmer rounded-full" />

          {/* Message */}
          <div
            className="max-w-lg mx-auto space-y-4 mb-10"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              عيد ميلاد سعيد يا أجمل شروق 🌅
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              19 عام من النور و الجمال ✨
              <br />
              كل سنة و أنتِ أحلى وأقرب للقلب 💕
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              عقبال 100 سنة مليانة بالفرح و السعادة و النجاح 🎉
            </p>
          </div>

          {/* Interactive heart */}
          <button
            onClick={handleHeartClick}
            className="group relative inline-flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
            <div className="relative animate-heartbeat text-7xl md:text-8xl cursor-pointer hover:scale-110 transition-transform select-none">
              💖
            </div>
          </button>

          <p className="mt-4 text-sm text-muted-foreground animate-pulse">
            إضغطي على القلب 💫
          </p>

          {/* Footer wish */}
          <div className="mt-16 pt-8 border-t border-border/30">
            <p className="font-script text-2xl md:text-3xl text-secondary/80">
              من قلبي لقلبك 💛
            </p>
            <p className="text-xs text-muted-foreground mt-3 tracking-widest uppercase">
              2026 · With Love
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPage;
