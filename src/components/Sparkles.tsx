import { useEffect, useState } from "react";

const Sparkles = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: string; y: string; delay: string }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    }));
    setSparkles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute w-1 h-1 rounded-full bg-secondary"
          style={{
            left: s.x,
            top: s.y,
            animation: `sparkle 3s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
