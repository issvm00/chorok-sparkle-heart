import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import FloatingEmojis from "./FloatingEmojis";
import Sparkles from "./Sparkles";
import OpeningScreen from "./OpeningScreen";
import chorokImg from "@/assets/chorok.jpg";

const BirthdayPage = () => {
  const [opened, setOpened] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [cakeClicks, setCakeClicks] = useState(0);
  const photoRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);

  const launchConfetti = () => {
    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];
    confetti({ particleCount: 70, spread: 80, origin: { x: 0.3, y: 0.6 }, colors });
    confetti({ particleCount: 70, spread: 80, origin: { x: 0.7, y: 0.6 }, colors });
    setCakeClicks((p) => p + 1);
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setHeroVisible(true), 300);
  };

  // Intersection observer
  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === photoRef.current) setPhotoRevealed(true);
            if (entry.target === wishRef.current) setWishRevealed(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (photoRef.current) observer.observe(photoRef.current);
    if (wishRef.current) observer.observe(wishRef.current);
    return () => observer.disconnect();
  }, [opened]);

  if (!opened) return <OpeningScreen onOpen={handleOpen} />;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Sparkles />
      <FloatingEmojis />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb w-72 h-72 bg-primary -top-20 -right-20" />
        <div className="orb w-56 h-56 bg-accent bottom-40 -left-20" style={{ animationDelay: "4s" }} />
        <div className="orb w-40 h-40 bg-secondary top-1/3 right-1/4" style={{ animationDelay: "2s" }} />
      </div>

      {/* ===== Section 1: Hero ===== */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className={`text-center transition-all duration-1000 delay-200 ${heroVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          {/* Age - big cinematic number */}
          <div className="mb-4">
            <span className="text-[7rem] md:text-[10rem] font-black leading-none number-gradient font-display">
              19
            </span>
          </div>

          <h2 className="text-sm md:text-base tracking-[0.4em] uppercase text-muted-foreground mb-3 font-light">
            Happy Birthday
          </h2>

          <h1 className="font-script text-6xl md:text-8xl gradient-text animate-glow mb-3 leading-tight">
            Chorok
          </h1>

          <p className="font-script text-2xl md:text-3xl text-secondary/80 mb-8">شروق ✨</p>

          <div className="w-32 h-[1px] mx-auto mb-6 animate-shimmer rounded-full" />

          <p className="text-sm text-muted-foreground/70 tracking-wide">
            🎂 عيد ميلاد سعيد 🎂
          </p>

          {/* Scroll hint */}
          <div className="mt-16 animate-bounce">
            <span className="text-xl text-muted-foreground/40">↓</span>
          </div>
        </div>
      </section>

      {/* ===== Section 2: Photo ===== */}
      <section ref={photoRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className={`transition-all duration-1000 ${photoRevealed ? "animate-scale-in opacity-100" : "opacity-0 scale-90"}`}>
          {/* Photo with glow ring */}
          <div className="relative">
            {/* Animated glow behind photo */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-2xl animate-pulse" />

            {/* Photo frame */}
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 animate-border-glow shadow-2xl">
              <img
                src={chorokImg}
                alt="Chorok - شروق"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating decorations */}
            <div className="absolute -top-5 -right-5 text-2xl animate-float">🌟</div>
            <div className="absolute -bottom-5 -left-5 text-2xl animate-float" style={{ animationDelay: "1.5s" }}>🎉</div>
            <div className="absolute -top-5 -left-3 text-xl animate-float" style={{ animationDelay: "0.8s" }}>✨</div>
            <div className="absolute -bottom-3 -right-5 text-xl animate-float" style={{ animationDelay: "2.2s" }}>🎈</div>
          </div>

          <h3 className="font-script text-3xl md:text-4xl gradient-text-warm mt-8 text-center">
            🥳 Happy 19th 🥳
          </h3>
        </div>
      </section>

      {/* ===== Section 3: Wishes ===== */}
      <section ref={wishRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className={`w-full max-w-sm mx-auto transition-all duration-1000 ${wishRevealed ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}>

          {/* Wish card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 animate-border-glow">
            <div className="text-center mb-6">
              <span className="text-5xl">🎂</span>
            </div>

            <div className="space-y-4 text-center" dir="rtl">
              <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                عقبال 💯 سنة 🎉
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                كل عام و أنتِ بألف خير يا شروق ✨
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                سنة مليانة بالنجاح والفرح والأحلام اللي تتحقق 🌟
              </p>
            </div>

            <div className="w-20 h-[1px] mx-auto my-6 animate-shimmer rounded-full" />

            <p className="text-center font-script text-xl text-secondary/70">
              من صديقك 🤝
            </p>
          </div>

          {/* Interactive cake */}
          <div className="text-center mt-12">
            <button
              onClick={launchConfetti}
              className="group relative inline-flex flex-col items-center"
              aria-label="Launch confetti"
            >
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative animate-heartbeat text-6xl cursor-pointer hover:scale-110 transition-transform select-none">
                🎂
              </div>
              {cakeClicks > 0 && (
                <span className="mt-1 text-xs text-secondary/60 animate-fade-in">
                  🎉 x{cakeClicks}
                </span>
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground/50 animate-pulse">
              إضغط على الكيكة 🎉
            </p>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <section className="relative z-20 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="w-24 h-[1px] mx-auto mb-8 animate-shimmer rounded-full" />
          <p className="font-script text-2xl md:text-3xl text-secondary/60 mb-3">
            Best Friends Forever 🤝
          </p>
          <p className="text-xs text-muted-foreground/40 tracking-[0.3em] uppercase">
            2026
          </p>
        </div>
      </section>
    </div>
  );
};

export default BirthdayPage;
