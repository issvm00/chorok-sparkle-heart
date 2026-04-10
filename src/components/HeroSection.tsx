import { useEffect, useState } from "react";

interface Props {
  onReady?: () => void;
}

const HeroSection = ({ onReady }: Props) => {
  const [stage, setStage] = useState(0);
  const [nameChars, setNameChars] = useState(0);
  const name = "Chorok";

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 1800),
      setTimeout(() => setStage(4), 3200),
      setTimeout(() => setStage(5), 3800),
      setTimeout(() => { setStage(6); onReady?.(); }, 4400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onReady]);

  useEffect(() => {
    if (stage < 3) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setNameChars(i);
      if (i >= name.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12 snap-start">
      <div className="text-center">
        {/* 19 — Chrome/metallic style */}
        <div className={`mb-4 transition-all duration-[1500ms] ease-out ${stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
          <span className="text-[9rem] md:text-[14rem] font-black leading-none font-display block chrome-text select-none">
            19
          </span>
        </div>

        {/* Decorative line */}
        <div className={`transition-all duration-1000 ${stage >= 2 ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] animate-shimmer rounded-full" />
            <span className="text-xs tracking-[0.6em] uppercase font-light" style={{ color: "hsl(var(--secondary) / 0.6)" }}>Happy Birthday</span>
            <div className="w-12 h-[1px] animate-shimmer rounded-full" />
          </div>
        </div>

        {/* Name — letter by letter */}
        <div className={`transition-all duration-700 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}>
          <h1 className="font-script text-7xl md:text-9xl leading-tight inline-block">
            {name.split("").map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-500 gradient-text ${
                  i < nameChars ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>
          {stage >= 3 && nameChars < name.length && (
            <span className="inline-block w-[3px] h-14 ml-1 animate-pulse align-bottom" style={{ background: "hsl(var(--secondary) / 0.6)" }} />
          )}
        </div>

        {/* Arabic name with glow */}
        <div className={`transition-all duration-1000 ${stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="relative inline-block mt-3">
            <div className="absolute inset-0 blur-2xl rounded-full" style={{ background: "hsl(var(--secondary) / 0.1)" }} />
            <p className="relative font-panorama text-5xl md:text-6xl font-bold" style={{ color: "hsl(var(--secondary) / 0.8)" }}>شروق</p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className={`transition-all duration-1000 ${stage >= 5 ? "opacity-100" : "opacity-0"}`}>
          <div className="w-32 h-[1px] mx-auto mt-10 mb-5 animate-shimmer rounded-full" />
          <p className="font-panorama text-base text-muted-foreground/40">
            ✦ كل عام و أنت بألف خير ✦
          </p>
        </div>

        {/* Scroll hint */}
        <div className={`mt-16 transition-all duration-1000 ${stage >= 6 ? "opacity-100" : "opacity-0"}`}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-9 rounded-full flex items-start justify-center p-1.5" style={{ border: "1px solid hsl(var(--muted-foreground) / 0.15)" }}>
              <div className="w-1 h-2 rounded-full animate-scroll-dot" style={{ background: "hsl(var(--secondary) / 0.4)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
