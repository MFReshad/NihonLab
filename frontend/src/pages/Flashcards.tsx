import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashCard from '@/components/FlashCard';
import { useStore } from '@/store/useStore';

const flashcardsData = [
  { front: '学ぶ', frontReading: 'まなぶ', back: 'to learn' },
  { front: '桜', frontReading: 'さくら', back: 'cherry blossom' },
  { front: '頑張る', frontReading: 'がんばる', back: 'to do one\'s best' },
  { front: '友達', frontReading: 'ともだち', back: 'friend' },
  { front: '美味しい', frontReading: 'おいしい', back: 'delicious' },
  { front: '夢', frontReading: 'ゆめ', back: 'dream' },
  { front: '幸せ', frontReading: 'しあわせ', back: 'happiness' },
  { front: '時間', frontReading: 'じかん', back: 'time' },
];

const Flashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(flashcardsData);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addXP, incrementCardsLearned } = useStore();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      addXP(10);
      incrementCardsLearned();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
          Japanese Flashcards
        </h1>
        <p className="text-lg text-muted-foreground">
          Practice vocabulary with interactive flip cards
        </p>
      </div>

      {/* Flashcard Display */}
      <div className="mb-8">
        <FlashCard
          key={currentIndex}
          front={cards[currentIndex].front}
          frontReading={cards[currentIndex].frontReading}
          back={cards[currentIndex].back}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between max-w-md mx-auto mb-8">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          size="lg"
          className="rounded-xl"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Card</p>
          <p className="font-bold text-lg">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          variant="outline"
          size="lg"
          className="rounded-xl"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Additional Actions */}
      <div className="text-center">
        <Button
          onClick={handleShuffle}
          variant="outline"
          className="rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle Deck
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h3 className="font-semibold text-lg mb-4">Deck Progress</h3>
          <div className="flex gap-2">
            {cards.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-primary scale-110'
                    : idx < currentIndex
                    ? 'bg-secondary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {Math.round(((currentIndex + 1) / cards.length) * 100)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
