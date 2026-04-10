import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const heart: Heart = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        size: Math.random() * 24 + 12,
        delay: 0,
        duration: Math.random() * 4 + 4,
      };
      setHearts((prev) => [...prev.slice(-15), heart]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="rising-heart text-primary"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            bottom: 0,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
