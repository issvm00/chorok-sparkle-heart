import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface MusicPlayerHandle {
  pause: () => void;
  resume: () => void;
}

interface Props {
  autoPlay?: boolean;
}

const MusicPlayer = forwardRef<MusicPlayerHandle, Props>(({ autoPlay = false }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const wasPlayingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    pause: () => {
      if (audioRef.current && playing) {
        wasPlayingRef.current = true;
        audioRef.current.pause();
        setPlaying(false);
      }
    },
    resume: () => {
      if (audioRef.current && wasPlayingRef.current) {
        wasPlayingRef.current = false;
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
        setPlaying(true);
      }
    },
  }));

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoPlay]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      wasPlayingRef.current = false;
    } else {
      audioRef.current.volume = 0.4;
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src="/music/birthday-song.mp3" loop />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-xl animate-border-glow shadow-lg active:scale-90 transition-transform"
        aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;
