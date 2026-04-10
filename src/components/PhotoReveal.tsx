import { forwardRef, useState, useEffect } from "react";
import chorokImg from "@/assets/chorok.jpg";

interface Props {
  revealed: boolean;
}

const PhotoReveal = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [prismaticAngle, setPrismaticAngle] = useState(0);

  // Rotate prismatic light
  useEffect(() => {
    if (!revealed) return;
    const interval = setInterval(() => {
      setPrismaticAngle((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [revealed]);

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 snap-start"
    >
      <div className={`transition-all duration-[2000ms] ease-out ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        {/* Photo container */}
        <div className="relative">
          {/* Outer prismatic ring */}
          <div
            className="absolute -inset-5 rounded-[2.5rem] opacity-60 transition-opacity duration-1000"
            style={{
              background: `conic-gradient(from ${prismaticAngle}deg,
                hsl(270 60% 55% / 0.4),
                hsl(45 80% 55% / 0.3),
                hsl(320 50% 50% / 0.4),
                hsl(220 80% 60% / 0.3),
                hsl(270 60% 55% / 0.4)
              )`,
              filter: "blur(20px)",
            }}
          />

          {/* Inner glow */}
          <div
            className="absolute -inset-3 rounded-[2rem]"
            style={{
              background: `conic-gradient(from ${prismaticAngle + 180}deg,
                hsl(270 60% 55% / 0.2),
                hsl(45 80% 55% / 0.15),
                hsl(320 50% 50% / 0.2),
                hsl(270 60% 55% / 0.2)
              )`,
              filter: "blur(10px)",
            }}
          />

          {/* Photo frame */}
          <div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-[1.8rem] overflow-hidden"
            style={{
              border: "2px solid transparent",
              backgroundImage: `conic-gradient(from ${prismaticAngle}deg, hsl(270 60% 55%), hsl(45 80% 55%), hsl(320 50% 50%), hsl(220 80% 60%), hsl(270 60% 55%))`,
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              padding: "2px",
            }}
          >
            <div className="w-full h-full rounded-[calc(1.8rem-2px)] overflow-hidden relative bg-background">
              {/* Developing photo effect */}
              <img
                src={chorokImg}
                alt="Chorok - شروق"
                className={`w-full h-full object-cover transition-all duration-[3000ms] ${
                  revealed && photoLoaded ? "opacity-100 saturate-100 blur-0" : "opacity-0 saturate-0 blur-md"
                }`}
                onLoad={() => setPhotoLoaded(true)}
              />

              {/* Holographic overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  background: `linear-gradient(${prismaticAngle}deg,
                    transparent 0%,
                    rgba(167, 139, 250, 0.3) 25%,
                    transparent 50%,
                    rgba(251, 191, 36, 0.3) 75%,
                    transparent 100%
                  )`,
                }}
              />

              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </div>
          </div>

          {/* Floating light orbs around photo */}
          {revealed && [
            { size: 6, x: -20, y: -15, color: "hsl(270 60% 55%)", delay: 0 },
            { size: 5, x: "calc(100% + 12px)", y: 30, color: "hsl(45 80% 55%)", delay: 1.5 },
            { size: 4, x: -10, y: "calc(100% + 10px)", color: "hsl(320 50% 50%)", delay: 3 },
            { size: 5, x: "calc(100% + 8px)", y: "calc(100% - 20px)", color: "hsl(220 80% 60%)", delay: 0.8 },
          ].map((orb, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: orb.size * 2,
                height: orb.size * 2,
                left: orb.x,
                top: orb.y,
                background: `radial-gradient(circle, ${orb.color}, transparent)`,
                boxShadow: `0 0 ${orb.size * 4}px ${orb.color}`,
                animationDelay: `${orb.delay}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* Text below photo */}
        <div className={`text-center mt-10 transition-all duration-1000 delay-[1500ms] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="font-arabic text-3xl md:text-4xl text-secondary/70 font-bold">
            عيد ميلاد سعيد يا شروق
          </p>
          <div className="w-16 h-[1px] mx-auto mt-4 animate-shimmer rounded-full" />
        </div>
      </div>
    </section>
  );
});

PhotoReveal.displayName = "PhotoReveal";
export default PhotoReveal;
