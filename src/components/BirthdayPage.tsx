import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import FloatingEmojis from "./FloatingEmojis";
import Sparkles from "./Sparkles";
import chorokImg from "@/assets/chorok.jpg";

const BirthdayPage = () => {
  const [revealed, setRevealed] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const photoRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const quotes = [
    "الصداقة هي الوردة الوحيدة اللي ما كتدبلش 🌹",
    "صديقة حقيقية = كنز ما عندو ثمن 💎",
    "أحسن حاجة فالحياة هي صديقة كتفهمك بلا كلام 🦋",
    "شروق.. إسم على مسمى، نور كيضوي الدنيا 🌅",
  ];

  const launchConfetti = () => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 100 };
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.2, y: 0.5 }, colors: ["#e84393", "#fdcb6e", "#fab1a0", "#a29bfe"] });
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.8, y: 0.5 }, colors: ["#e84393", "#fdcb6e", "#fab1a0", "#a29bfe"] });
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.5, y: 0.3 }, colors: ["#ff6b81", "#ffd700", "#ff9ff3", "#74b9ff"] });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      launchConfetti();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === photoRef.current) setPhotoRevealed(true);
            if (entry.target === messageRef.current) setMessageRevealed(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (photoRef.current) observer.observe(photoRef.current);
    if (messageRef.current) observer.observe(messageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Sparkles />
      <FloatingEmojis />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none z-0" />

      {/* Section 1: Hero */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className={`text-center transition-all duration-1000 ${revealed ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          {/* Age badge */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-secondary/50 bg-muted/50 backdrop-blur-sm">
            <span className="text-3xl md:text-4xl font-bold gradient-text">19</span>
          </div>

          <h2 className="text-base md:text-xl tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Happy Birthday
          </h2>

          <h1 className="font-script text-5xl md:text-8xl lg:text-9xl gradient-text animate-glow mb-2 leading-tight">
            Chorok
          </h1>

          <p className="font-script text-2xl md:text-4xl text-secondary mb-6">شروق ✨</p>

          <div className="w-32 md:w-40 h-[2px] mx-auto mb-6 animate-shimmer rounded-full" />

          <p className="text-base md:text-lg text-muted-foreground">
            عيد ميلاد سعيد يا أجمل شروق 🌅
          </p>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <span className="text-2xl">↓</span>
            <p className="text-xs text-muted-foreground mt-1">سكرولي لتحت 💫</p>
          </div>
        </div>
      </section>

      {/* Section 2: Photo */}
      <section ref={photoRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className={`transition-all duration-1000 ${photoRevealed ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}>
          {/* Photo frame */}
          <div className="relative group">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40 blur-xl animate-pulse" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl">
              <img
                src={chorokImg}
                alt="Chorok"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Photo decorations */}
            <div className="absolute -top-4 -right-4 text-3xl animate-float">🌸</div>
            <div className="absolute -bottom-4 -left-4 text-3xl animate-float" style={{ animationDelay: "1s" }}>🦋</div>
            <div className="absolute -top-4 -left-4 text-2xl animate-float" style={{ animationDelay: "2s" }}>✨</div>
            <div className="absolute -bottom-4 -right-4 text-2xl animate-float" style={{ animationDelay: "0.5s" }}>🎀</div>
          </div>

          <p className="font-script text-3xl md:text-4xl gradient-text mt-8 text-center">
            أحلى بنت فالدنيا 🌟
          </p>
        </div>
      </section>

      {/* Section 3: Friendship Message */}
      <section ref={messageRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className={`max-w-sm md:max-w-lg mx-auto transition-all duration-1000 ${messageRevealed ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"}`}>
          
          {/* Friendship card */}
          <div className="bg-card/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-border/30 shadow-xl">
            <h3 className="font-script text-3xl md:text-4xl gradient-text text-center mb-6">
              رسالة من صديقتك 💌
            </h3>
            
            <div className="space-y-4 text-center" dir="rtl">
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                يا شروق، أنتِ من أحلى الناس اللي عرفتهم 🌸
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                19 عام من النور و الجمال ✨
                <br />
                كل سنة و أنتِ أحلى و أقرب 💕
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                صداقتنا من أحسن الحوايج اللي وقعو ليا فحياتي 🦋
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                عقبال 100 سنة مليانة بالنجاح و الفرح و الأحلام اللي تتحقق 🎉
              </p>
            </div>

            {/* Decorative separator */}
            <div className="w-24 h-[2px] mx-auto my-6 animate-shimmer rounded-full" />

            {/* Rotating quotes */}
            <div className="h-16 flex items-center justify-center">
              <p
                key={currentQuote}
                className="font-script text-xl md:text-2xl text-secondary text-center animate-fade-in-up"
                dir="rtl"
              >
                {quotes[currentQuote]}
              </p>
            </div>
          </div>

          {/* Interactive section */}
          <div className="text-center mt-10">
            <button
              onClick={launchConfetti}
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
              <div className="relative animate-heartbeat text-6xl md:text-7xl cursor-pointer hover:scale-110 transition-transform select-none">
                🎂
              </div>
            </button>
            <p className="mt-3 text-sm text-muted-foreground animate-pulse">
              إضغطي على الكيكة 🎉
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Footer */}
      <section className="relative z-20 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="w-32 h-[2px] mx-auto mb-8 animate-shimmer rounded-full" />
          <p className="font-script text-3xl md:text-4xl text-secondary/80 mb-2">
            من صديقتك للأبد 🤝
          </p>
          <p className="font-script text-2xl text-secondary/60 mb-4">
            Best Friends Forever 💛
          </p>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            2026 · With Friendship & Love
          </p>

          {/* Instagram hint */}
          <div className="mt-8 inline-flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-full px-5 py-2.5 border border-border/30">
            <span className="text-lg">📸</span>
            <span className="text-sm text-muted-foreground">Instagram Bestie</span>
            <span className="text-lg">🤍</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BirthdayPage;
