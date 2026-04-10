import { useEffect, useState, useRef, useCallback } from "react";
import AuroraCanvas from "./AuroraCanvas";
import ParticleCanvas from "./ParticleCanvas";
import OpeningScreen from "./OpeningScreen";
import MusicPlayer from "./MusicPlayer";
import HeroSection from "./HeroSection";
import PhotoReveal from "./PhotoReveal";
import WishLanterns from "./WishLanterns";
import HandwrittenMessage from "./HandwrittenMessage";
import FinaleSection from "./FinaleSection";

const BirthdayPage = () => {
  const [opened, setOpened] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [messageRevealed, setMessageRevealed] = useState(false);
  const [finaleRevealed, setFinaleRevealed] = useState(false);

  const photoRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setOpened(true);
  }, []);

  // Intersection observer for scroll reveals
  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === photoRef.current) setPhotoRevealed(true);
          if (entry.target === wishRef.current) setWishRevealed(true);
          if (entry.target === messageRef.current) setMessageRevealed(true);
          if (entry.target === finaleRef.current) setFinaleRevealed(true);
        });
      },
      { threshold: 0.15 }
    );

    [photoRef, wishRef, messageRef, finaleRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [opened]);

  if (!opened) return <OpeningScreen onOpen={handleOpen} />;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <AuroraCanvas />
      <ParticleCanvas />
      <MusicPlayer autoPlay />

      <HeroSection />
      <PhotoReveal ref={photoRef} revealed={photoRevealed} />
      <WishLanterns ref={wishRef} revealed={wishRevealed} />
      <HandwrittenMessage ref={messageRef} revealed={messageRevealed} />
      <FinaleSection ref={finaleRef} revealed={finaleRevealed} />
    </div>
  );
};

export default BirthdayPage;
