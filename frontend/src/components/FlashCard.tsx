import { useState, useRef } from 'react';
import { gsap } from 'gsap';

interface FlashCardProps {
  front: string;
  frontReading?: string;
  back: string;
}

const FlashCard = ({ front, frontReading, back }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    if (!cardRef.current) return;

    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);

    gsap.to(cardRef.current, {
      rotateY: newFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        ref={cardRef}
        onClick={handleFlip}
        className="relative w-full h-80 cursor-pointer preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-card rounded-3xl shadow-float p-8 flex flex-col items-center justify-center backface-hidden border-2 border-primary ${
            isFlipped ? 'invisible' : 'visible'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <h3 className="text-6xl font-bold japanese-text text-primary mb-3">
              {front}
            </h3>
            {frontReading && (
              <p className="text-2xl text-muted-foreground japanese-text">{frontReading}</p>
            )}
          </div>
          <p className="absolute bottom-6 text-sm text-muted-foreground">Click to flip</p>
        </div>

        {/* Back Side */}
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-hero rounded-3xl shadow-float p-8 flex items-center justify-center backface-hidden border-2 border-white ${
            isFlipped ? 'visible' : 'invisible'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white">{back}</h3>
          </div>
          <p className="absolute bottom-6 text-sm text-white/80">Click to flip</p>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
