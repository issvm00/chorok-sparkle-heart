import { forwardRef, useState, useRef, useEffect, useCallback } from "react";

interface Props {
  revealed: boolean;
}

const SONGS = [
  { title: "الأغنية الأولى", file: "/music/chorouk_1.mp3", emoji: "🎵", color: "hsl(320 60% 55%)" },
  { title: "الأغنية الثانية", file: "/music/chorouk_2.mp3", emoji: "🎶", color: "hsl(270 60% 60%)" },
  { title: "الأغنية الثالثة", file: "/music/chorouk_3.mp3", emoji: "🎼", color: "hsl(200 70% 55%)" },
];

const DedicatedSongs = forwardRef<HTMLDivElement, Props>(({ revealed }, ref) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);
  const [durations, setDurations] = useState<number[]>([0, 0, 0]);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null, null]);
  const animRef = useRef<number>(0);

  const updateProgress = useCallback(() => {
    setProgress((prev) => {
      const next = [...prev];
      audioRefs.current.forEach((audio, i) => {
        if (audio && audio.duration) {
          next[i] = (audio.currentTime / audio.duration) * 100;
        }
      });
      return next;
    });
    animRef.current = requestAnimationFrame(updateProgress);
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      animRef.current = requestAnimationFrame(updateProgress);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [activeIndex, updateProgress]);

  const handlePlay = (index: number) => {
    // Pause all others
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[index];
    if (!audio) return;

    if (activeIndex === index) {
      audio.pause();
      setActiveIndex(null);
    } else {
      audio.volume = 0.7;
      audio.play().catch(() => {});
      setActiveIndex(index);
    }
  };

  const handleLoadedMetadata = (index: number) => {
    const audio = audioRefs.current[index];
    if (audio) {
      setDurations((prev) => {
        const next = [...prev];
        next[index] = audio.duration;
        return next;
      });
    }
  };

  const handleEnded = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      setProgress((prev) => {
        const next = [...prev];
        next[index] = 0;
        return next;
      });
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[index];
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  return (
    <section
      ref={ref}
      className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] px-4 py-20 snap-start"
      dir="rtl"
    >
      <div
        className={`w-full max-w-sm mx-auto transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-4xl block mb-3">🎧</span>
          <h3
            className="font-panorama text-2xl tracking-wide mb-2"
            style={{ color: "hsl(45 80% 75%)" }}
          >
            أغاني مُهداة إليكِ
          </h3>
          <p
            className="font-panorama text-sm"
            style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}
          >
            اختارناهم ليكِ خصيصاً… اسمعيهم بالقلب 💛
          </p>
        </div>

        {/* Song cards */}
        <div className="space-y-4">
          {SONGS.map((song, i) => {
            const isActive = activeIndex === i;
            const currentTime = audioRefs.current[i]?.currentTime || 0;

            return (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, hsl(270 25% 12%) 0%, hsl(260 30% 16%) 100%)`
                    : "hsl(260 25% 10% / 0.6)",
                  border: `1px solid ${isActive ? "hsl(45 80% 55% / 0.25)" : "hsl(260 30% 20% / 0.4)"}`,
                  boxShadow: isActive
                    ? `0 0 30px hsl(270 60% 40% / 0.15), 0 10px 40px hsl(0 0% 0% / 0.3)`
                    : "0 4px 20px hsl(0 0% 0% / 0.2)",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Glow line on top when active */}
                {isActive && (
                  <div
                    className="h-[2px] w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${song.color}, hsl(45 90% 65%), ${song.color}, transparent)`,
                    }}
                  />
                )}

                <div className="p-4 flex items-center gap-4">
                  {/* Play button */}
                  <button
                    onClick={() => handlePlay(i)}
                    className="relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${song.color}, hsl(45 80% 55%))`
                        : `linear-gradient(135deg, hsl(260 25% 18%), hsl(260 30% 22%))`,
                      boxShadow: isActive
                        ? `0 0 20px ${song.color.replace(")", " / 0.4)")}`
                        : "0 2px 8px hsl(0 0% 0% / 0.3)",
                    }}
                  >
                    {isActive ? (
                      <div className="flex gap-[3px]">
                        {[0, 1, 2].map((b) => (
                          <div
                            key={b}
                            className="w-[3px] rounded-full"
                            style={{
                              height: "16px",
                              background: "hsl(260 30% 8%)",
                              animation: `equalizer 0.8s ease-in-out ${b * 0.15}s infinite alternate`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(45 60% 70%)">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}

                    {/* Pulse ring */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ background: song.color }}
                      />
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{song.emoji}</span>
                      <h4
                        className="font-panorama text-base truncate"
                        style={{ color: isActive ? "hsl(45 80% 80%)" : "hsl(45 40% 75%)" }}
                      >
                        {song.title}
                      </h4>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="h-1.5 rounded-full overflow-hidden cursor-pointer mb-1.5"
                      style={{ background: "hsl(260 20% 18%)" }}
                      onClick={(e) => handleSeek(i, e)}
                    >
                      <div
                        className="h-full rounded-full transition-[width] duration-100"
                        style={{
                          width: `${progress[i]}%`,
                          background: isActive
                            ? `linear-gradient(90deg, ${song.color}, hsl(45 90% 65%))`
                            : "hsl(260 20% 30%)",
                        }}
                      />
                    </div>

                    {/* Time */}
                    <div className="flex justify-between">
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "hsl(var(--muted-foreground) / 0.4)" }}
                      >
                        {formatTime(currentTime)}
                      </span>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "hsl(var(--muted-foreground) / 0.4)" }}
                      >
                        {formatTime(durations[i])}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hidden audio */}
                <audio
                  ref={(el) => { audioRefs.current[i] = el; }}
                  src={song.file}
                  onLoadedMetadata={() => handleLoadedMetadata(i)}
                  onEnded={() => handleEnded(i)}
                  preload="metadata"
                />
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="text-center mt-8 font-panorama text-xs"
          style={{ color: "hsl(var(--muted-foreground) / 0.3)" }}
        >
          ✦ كل أغنية فيها شوية منك ✦
        </p>
      </div>

      {/* Equalizer keyframes */}
      <style>{`
        @keyframes equalizer {
          0% { height: 4px; }
          100% { height: 18px; }
        }
      `}</style>
    </section>
  );
});

DedicatedSongs.displayName = "DedicatedSongs";
export default DedicatedSongs;
