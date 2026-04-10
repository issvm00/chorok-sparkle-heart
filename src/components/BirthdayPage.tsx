import { useEffect, useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import ParticleCanvas from "./ParticleCanvas";
import OpeningScreen from "./OpeningScreen";
import MusicPlayer from "./MusicPlayer";
import chorokImg from "@/assets/chorok.jpg";

const BirthdayPage = () => {
  const [opened, setOpened] = useState(false);
  const [heroStage, setHeroStage] = useState(0);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [footerRevealed, setFooterRevealed] = useState(false);
  const [cakeClicks, setCakeClicks] = useState(0);
  const [activeWish, setActiveWish] = useState(0);
  const photoRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const wishes = [
    { emoji: "🎓", text: "النجاح فكلشي" },
    { emoji: "😊", text: "السعادة ديما" },
    { emoji: "💪", text: "الصحة و العافية" },
    { emoji: "⭐", text: "تحقيق كل الأحلام" },
  ];

  const launchConfetti = useCallback(() => {
    const colors = ["#a78bfa", "#fbbf24", "#f472b6", "#60a5fa", "#34d399"];
    confetti({ particleCount: 80, spread: 90, origin: { x: 0.3, y: 0.6 }, colors });
    confetti({ particleCount: 80, spread: 90, origin: { x: 0.7, y: 0.6 }, colors });
    setTimeout(() => {
      confetti({ particleCount: 40, spread: 120, origin: { x: 0.5, y: 0.4 }, colors, startVelocity: 40 });
    }, 200);
    setCakeClicks((p) => p + 1);
  }, []);

  const handleOpen = useCallback(() => {
    setOpened(true);
    // Staggered hero reveal
    setTimeout(() => setHeroStage(1), 200);
    setTimeout(() => setHeroStage(2), 700);
    setTimeout(() => setHeroStage(3), 1200);
    setTimeout(() => setHeroStage(4), 1700);
    setTimeout(() => setHeroStage(5), 2200);
  }, []);

  // Intersection observer
  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === photoRef.current) setPhotoRevealed(true);
            if (entry.target === wishRef.current) setWishRevealed(true);
            if (entry.target === footerRef.current) setFooterRevealed(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (photoRef.current) observer.observe(photoRef.current);
    if (wishRef.current) observer.observe(wishRef.current);
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [opened]);

  // Auto-cycle wishes
  useEffect(() => {
    if (!wishRevealed) return;
    const interval = setInterval(() => setActiveWish((p) => (p + 1) % wishes.length), 3000);
    return () => clearInterval(interval);
  }, [wishRevealed, wishes.length]);

  if (!opened) return <OpeningScreen onOpen={handleOpen} />;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden snap-y snap-mandatory">
      <ParticleCanvas />
      <MusicPlayer autoPlay />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb w-80 h-80 bg-primary -top-20 -right-20" />
        <div className="orb w-64 h-64 bg-accent bottom-40 -left-20" style={{ animationDelay: "4s" }} />
        <div className="orb w-48 h-48 bg-secondary top-1/3 right-1/4" style={{ animationDelay: "2s" }} />
        <div className="orb w-36 h-36 bg-primary/50 bottom-1/4 left-1/3" style={{ animationDelay: "6s" }} />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12 snap-start">
        <div className="text-center">
          {/* Age */}
          <div className={`mb-2 transition-all duration-1000 ${heroStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-[8rem] md:text-[12rem] font-black leading-none number-gradient font-display block">
              19
            </span>
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-100 ${heroStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="text-xs md:text-sm tracking-[0.5em] uppercase text-muted-foreground mb-4 font-light">
              ✦ Happy Birthday ✦
            </h2>
          </div>

          {/* Name */}
          <div className={`transition-all duration-1000 ${heroStage >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <h1 className="font-script text-7xl md:text-9xl gradient-text animate-glow leading-tight">
              Chorok
            </h1>
          </div>

          {/* Arabic name */}
          <div className={`transition-all duration-1000 ${heroStage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="font-arabic text-3xl md:text-4xl text-secondary/70 mt-2 font-bold">شروق</p>
          </div>

          {/* Shimmer line + subtitle */}
          <div className={`transition-all duration-1000 ${heroStage >= 5 ? "opacity-100" : "opacity-0"}`}>
            <div className="w-40 h-[1px] mx-auto mt-8 mb-4 animate-shimmer rounded-full" />
            <p className="text-sm text-muted-foreground/50 tracking-wider font-arabic">
              🎂 عيد ميلاد سعيد 🎂
            </p>
            {/* Scroll hint */}
            <div className="mt-14 animate-bounce">
              <div className="w-6 h-10 mx-auto rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5">
                <div className="w-1 h-2.5 rounded-full bg-secondary/50 animate-scroll-dot" />
              </div>
              <p className="text-[10px] text-muted-foreground/30 mt-2 tracking-widest">SCROLL</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHOTO ===== */}
      <section ref={photoRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start">
        <div className={`transition-all duration-[1500ms] ${photoRevealed ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          {/* Photo with morphing border */}
          <div className="relative">
            {/* Glow layers */}
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-accent/15 to-secondary/25 blur-3xl animate-pulse" />
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-secondary/20 via-transparent to-primary/20 blur-xl" style={{ animation: "orbFloat 6s ease-in-out infinite" }} />

            {/* Photo */}
            <div className="relative w-60 h-60 md:w-80 md:h-80 rounded-[1.5rem] overflow-hidden border-2 animate-border-glow shadow-[0_0_60px_rgba(167,139,250,0.15)]">
              <img
                src={chorokImg}
                alt="Chorok - شروق"
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {/* Floating decorations with stagger */}
            {[
              { emoji: "🌟", pos: "-top-6 -right-6", delay: "0s" },
              { emoji: "🎉", pos: "-bottom-6 -left-6", delay: "1s" },
              { emoji: "✨", pos: "-top-6 -left-4", delay: "0.5s" },
              { emoji: "🎈", pos: "-bottom-4 -right-6", delay: "1.5s" },
              { emoji: "🥳", pos: "top-1/2 -right-8", delay: "2s" },
            ].map((d, i) => (
              <span
                key={i}
                className={`absolute ${d.pos} text-2xl animate-float`}
                style={{ animationDelay: d.delay }}
              >
                {d.emoji}
              </span>
            ))}
          </div>

          {/* Text */}
          <div className={`text-center mt-10 transition-all duration-1000 delay-500 ${photoRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h3 className="font-script text-4xl md:text-5xl gradient-text-warm">
              🥳 Happy 19th 🥳
            </h3>
          </div>
        </div>
      </section>

      {/* ===== WISHES ===== */}
      <section ref={wishRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start">
        <div className={`w-full max-w-sm mx-auto transition-all duration-1000 ${wishRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

          {/* Main wish card */}
          <div className="glass-card rounded-[2rem] p-7 animate-border-glow relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="text-center mb-5">
                <span className="text-5xl block mb-3">🎂</span>
                <h3 className="font-arabic text-3xl gradient-text font-bold">عيد ميلاد سعيد</h3>
              </div>

              <div className="space-y-3 text-center font-arabic" dir="rtl">
                <p className="text-foreground/90 leading-relaxed text-lg">
                  كل عام و أنتِ بألف خير يا شروق ✨
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  عقبال 💯 سنة مليانة بالنجاح و الفرح 🎉
                </p>
              </div>

              {/* Animated wish cards */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {wishes.map((wish, i) => (
                  <div
                    key={i}
                    className={`glass-card rounded-xl p-3 text-center transition-all duration-500 cursor-pointer
                      ${activeWish === i ? "border-secondary/40 scale-105 shadow-lg shadow-secondary/10" : "border-border/20 scale-100"}
                    `}
                    onClick={() => setActiveWish(i)}
                    style={{
                      transitionDelay: wishRevealed ? `${i * 150}ms` : "0ms",
                      opacity: wishRevealed ? 1 : 0,
                      transform: wishRevealed ? (activeWish === i ? "scale(1.05)" : "scale(1)") : "translateY(20px)",
                    }}
                  >
                    <span className="text-2xl block mb-1">{wish.emoji}</span>
                    <span className="text-xs text-muted-foreground font-arabic font-medium" dir="rtl">{wish.text}</span>
                  </div>
                ))}
              </div>

              <div className="w-16 h-[1px] mx-auto my-5 animate-shimmer rounded-full" />

              <p className="text-center font-arabic text-lg text-secondary/60 font-medium">
                من صديقك 🤝
              </p>
            </div>
          </div>

          {/* Interactive cake */}
          <div className="text-center mt-10">
            <button
              onClick={launchConfetti}
              className="group relative inline-flex flex-col items-center focus:outline-none"
              aria-label="Launch confetti"
            >
              <div className="absolute -inset-6 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="relative animate-heartbeat text-7xl cursor-pointer group-active:scale-125 transition-transform select-none">
                🎂
              </div>
              {cakeClicks > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1 animate-scale-in">
                  <span className="text-xs text-secondary">🎉 x{cakeClicks}</span>
                </div>
              )}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground/40 animate-pulse tracking-wide font-arabic">
              إضغط على الكيكة 🎉
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <section ref={footerRef} className="relative z-20 flex flex-col items-center justify-center py-24 px-4 snap-start">
        <div className={`text-center transition-all duration-1000 ${footerRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="w-20 h-[1px] mx-auto mb-8 animate-shimmer rounded-full" />

          <p className="font-script text-3xl md:text-4xl gradient-text mb-3">
            Best Friends Forever
          </p>
          <p className="font-script text-xl text-secondary/40 mb-6">🤝</p>

          <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5">
            <span className="text-sm">📸</span>
            <span className="text-xs text-muted-foreground/60 tracking-wider">Instagram Besties</span>
            <span className="text-sm">🤍</span>
          </div>

          <p className="mt-6 text-[10px] text-muted-foreground/25 tracking-[0.4em] uppercase">
            2026 · Made with 💛
          </p>
        </div>
      </section>
    </div>
  );
};

export default BirthdayPage;
