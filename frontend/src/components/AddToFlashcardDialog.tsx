import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface WordDetail {
  word: string;
  readings: string[];
  definitions: string[];
}

interface AddToFlashcardDialogProps {
  open: boolean;
  onClose: () => void;
  word: WordDetail;
}

export const AddToFlashcardDialog = ({ open, onClose, word }: AddToFlashcardDialogProps) => {
  const { toast } = useToast();
  const [selectedDeck, setSelectedDeck] = useState('default');
  const [frontText, setFrontText] = useState(`${word.word} (${word.readings[0]})`);
  const [backText, setBackText] = useState(word.definitions.join('; '));

  // Mock decks - will be replaced with real API call
  const decks = [
    { id: 'default', name: 'My Vocabulary' },
    { id: 'kanji', name: 'Kanji Study' },
    { id: 'jlpt', name: 'JLPT N5' },
  ];

  const handleSubmit = () => {
    // Mock API call - will be replaced with real endpoint
    toast({
      title: 'Added to flashcards!',
      description: `"${word.word}" has been added to your ${decks.find(d => d.id === selectedDeck)?.name} deck.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Flashcards</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deck">Select Deck</Label>
            <Select value={selectedDeck} onValueChange={setSelectedDeck}>
              <SelectTrigger id="deck">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decks.map((deck) => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="front">Front (Question)</Label>
            <Textarea
              id="front"
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              rows={2}
              className="font-japanese"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Back (Answer)</Label>
            <Textarea
              id="back"
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
