import { useEffect, useState, useRef, useCallback } from "react";
import AuroraCanvas from "./AuroraCanvas";
import ParticleCanvas from "./ParticleCanvas";
import OpeningScreen from "./OpeningScreen";
import MusicPlayer, { MusicPlayerHandle } from "./MusicPlayer";
import HeroSection from "./HeroSection";
import PhotoReveal from "./PhotoReveal";
import WishLanterns from "./WishLanterns";
import HandwrittenMessage from "./HandwrittenMessage";
import FinaleSection from "./FinaleSection";
import DedicatedSongs from "./DedicatedSongs";

const BirthdayPage = () => {
  const [opened, setOpened] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [songsRevealed, setSongsRevealed] = useState(false);
  const [finaleRevealed, setFinaleRevealed] = useState(false);

  const photoRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const songsRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  const handleOpen = useCallback(() => {
    setOpened(true);
  }, []);

  const handleSongPlayState = useCallback((isPlaying: boolean) => {
    if (isPlaying) {
      musicPlayerRef.current?.pause();
    } else {
      musicPlayerRef.current?.resume();
    }
  }, []);

  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === photoRef.current) setPhotoRevealed(true);
          if (entry.target === wishRef.current) setWishRevealed(true);
          if (entry.target === messageRef.current) setMessageRevealed(true);
          if (entry.target === songsRef.current) setSongsRevealed(true);
          if (entry.target === finaleRef.current) setFinaleRevealed(true);
        });
      },
      { threshold: 0.15 }
    );

    [photoRef, wishRef, messageRef, songsRef, finaleRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [opened]);

  if (!opened) return <OpeningScreen onOpen={handleOpen} />;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <AuroraCanvas />
      <ParticleCanvas />
      <MusicPlayer ref={musicPlayerRef} autoPlay />

      <HeroSection />
      <PhotoReveal ref={photoRef} revealed={photoRevealed} />
      <WishLanterns ref={wishRef} revealed={wishRevealed} />
      <HandwrittenMessage ref={messageRef} revealed={messageRevealed} />
      <DedicatedSongs ref={songsRef} revealed={songsRevealed} onPlayStateChange={handleSongPlayState} />
      <FinaleSection ref={finaleRef} revealed={finaleRevealed} />
    </div>
  );
};

export default BirthdayPage;
