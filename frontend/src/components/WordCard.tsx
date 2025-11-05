import { useState, useRef, useEffect } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { useStore } from '@/store/useStore';

interface WordCardProps {
  word: string;
  reading: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

const WordCard = ({ word, reading, meaning, example, exampleTranslation }: WordCardProps) => {
  const [showXP, setShowXP] = useState(false);
  const [learned, setLearned] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);
  const { addXP, incrementCardsLearned } = useStore();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }, []);

  const handleLearn = () => {
    if (learned) return;

    setLearned(true);
    addXP(10);
    incrementCardsLearned();
    setShowXP(true);

    // Animate XP popup
    if (xpRef.current) {
      gsap.fromTo(
        xpRef.current,
        { opacity: 0, y: 0, scale: 0.5 },
        {
          opacity: 1,
          y: -40,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2)',
        }
      );

      gsap.to(xpRef.current, {
        opacity: 0,
        y: -80,
        duration: 0.5,
        delay: 1,
        ease: 'power2.in',
        onComplete: () => setShowXP(false),
      });
    }
  };

  const playAudio = () => {
    // Placeholder for audio functionality
    console.log('Playing audio for:', word);
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-float transition-all card-hover border border-border"
    >
      {/* XP Popup */}
      {showXP && (
        <div
          ref={xpRef}
          className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold shadow-glow flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          +10 XP
        </div>
      )}

      {/* Word Section */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-4xl font-bold japanese-text text-primary mb-1">{word}</h3>
            <p className="text-lg text-muted-foreground japanese-text">{reading}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={playAudio}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xl font-medium text-foreground">{meaning}</p>
      </div>

      {/* Example Section */}
      <div className="bg-muted/50 rounded-xl p-4 mb-4">
        <p className="text-lg japanese-text text-foreground mb-2">{example}</p>
        <p className="text-sm text-muted-foreground">{exampleTranslation}</p>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleLearn}
        disabled={learned}
        className={`w-full font-semibold ${
          learned
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-gradient-hero text-white hover:opacity-90 shadow-glow'
        }`}
      >
        {learned ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Learned
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Mark as Learned
          </>
        )}
      </Button>
    </div>
  );
};

export default WordCard;
