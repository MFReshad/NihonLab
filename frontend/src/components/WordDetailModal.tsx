import { useEffect, useRef } from 'react';
import { X, Plus, Star, Check, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { gsap } from 'gsap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddToFlashcardDialog } from './AddToFlashcardDialog';
import { useToast } from '@/hooks/use-toast';

interface WordDetail {
  id: number;
  word: string;
  readings: string[];
  definitions: string[];
  part_of_speech: string[];
  jlpt?: string;
  stroke_count?: number;
  examples: { jp: string; en: string }[];
  radicals?: string[];
  source_meta?: { jisho_url?: string };
}

interface WordDetailModalProps {
  word: WordDetail | null;
  open: boolean;
  onClose: () => void;
}

export const WordDetailModal = ({ word, open, onClose }: WordDetailModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-item');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [open, word]);

  if (!word) return null;

  const handleAddToFlashcards = () => {
    setShowAddDialog(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: `${word.word} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleMarkLearned = () => {
    setIsLearned(!isLearned);
    toast({
      title: isLearned ? 'Unmarked as learned' : 'Marked as learned',
      description: isLearned ? `${word.word} unmarked.` : `${word.word} marked as learned! +10 XP`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-orange-primary">{word.word}</span>
                {word.jlpt && (
                  <Badge variant="secondary" className="bg-green-success text-white">
                    {word.jlpt}
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div ref={contentRef} className="space-y-6">
            {/* Readings */}
            <div className="animate-item">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Readings</h3>
              <div className="flex flex-wrap gap-2">
                {word.readings.map((reading, idx) => (
                  <Badge key={idx} variant="outline" className="text-lg px-3 py-1">
                    {reading}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Definitions */}
            <div className="animate-item">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Definitions</h3>
              <ol className="list-decimal list-inside space-y-1">
                {word.definitions.map((def, idx) => (
                  <li key={idx} className="text-foreground">
                    {def}
                  </li>
                ))}
              </ol>
            </div>

            {/* Part of Speech */}
            {word.part_of_speech.length > 0 && (
              <div className="animate-item">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Part of Speech</h3>
                <div className="flex flex-wrap gap-2">
                  {word.part_of_speech.map((pos, idx) => (
                    <Badge key={idx} variant="secondary">
                      {pos}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stroke Count */}
            {word.stroke_count && (
              <div className="animate-item">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Stroke Count</h3>
                <p className="text-foreground">{word.stroke_count} strokes</p>
              </div>
            )}

            {/* Examples */}
            {word.examples.length > 0 && (
              <div className="animate-item">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Example Sentences</h3>
                <div className="space-y-3">
                  {word.examples.map((example, idx) => (
                    <div key={idx} className="border-l-2 border-orange-primary pl-4">
                      <p className="text-lg font-japanese mb-1">{example.jp}</p>
                      <p className="text-sm text-muted-foreground">{example.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Radicals */}
            {word.radicals && word.radicals.length > 0 && (
              <div className="animate-item">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Radicals</h3>
                <div className="flex flex-wrap gap-2">
                  {word.radicals.map((radical, idx) => (
                    <span key={idx} className="text-2xl">
                      {radical}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="animate-item flex flex-wrap gap-3 pt-4 border-t">
              <Button onClick={handleAddToFlashcards} className="gap-2">
                <Plus className="w-4 h-4" />
                Add to Flashcards
              </Button>
              <Button
                onClick={handleToggleFavorite}
                variant={isFavorite ? 'default' : 'outline'}
                className="gap-2"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                onClick={handleMarkLearned}
                variant={isLearned ? 'default' : 'outline'}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                {isLearned ? 'Learned' : 'Mark as Learned'}
              </Button>
            </div>

            {/* View Details Button */}
            <div className="animate-item text-center pt-2">
              <Button
                onClick={() => {
                  navigate(`/words/${word.id}`);
                  onClose();
                }}
                variant="outline"
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddToFlashcardDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        word={word}
      />
    </>
  );
};
