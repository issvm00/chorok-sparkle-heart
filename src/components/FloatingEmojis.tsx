import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  left: string;
  size: number;
  duration: number;
  emoji: string;
}

const emojis = ["⭐", "✨", "🌸", "🎀", "🦋", "💫", "🌺", "🎉", "🌟", "🎂"];

const FloatingEmojis = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const item: FloatingItem = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 14,
        duration: Math.random() * 5 + 5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      };
      setItems((prev) => [...prev.slice(-12), item]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {items.map((item) => (
        <span
          key={item.id}
          className="rising-heart"
          style={{
            left: item.left,
            fontSize: item.size,
            animationDuration: `${item.duration}s`,
            bottom: 0,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingEmojis;
