
import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { FlashcardComponent } from './FlashcardComponent';
import { CreateFlashcardModal } from './CreateFlashcardModal';
import { EditFlashcardModal } from './EditFlashcardModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  onCreateFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateFlashcard: (flashcard: Flashcard) => Promise<void>;
  onDeleteFlashcard: (flashcard: Flashcard) => Promise<void>;
}

export function FlashcardDeck({ flashcards, onCreateFlashcard, onUpdateFlashcard, onDeleteFlashcard }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const { toast } = useToast();

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first card
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(flashcards.length - 1); // Loop to last card
    }
  };

  const handleCreateFlashcard = async (newCard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onCreateFlashcard(newCard);
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
  };

  const handleUpdateFlashcard = async (flashcard: Flashcard) => {
    await onUpdateFlashcard(flashcard);
    setEditingFlashcard(null);
  };

  const handleDeleteFlashcard = async (flashcard: Flashcard) => {
    await onDeleteFlashcard(flashcard);
    
    // Adjust current index if needed
    const newLength = flashcards.length - 1;
    if (currentIndex >= newLength && newLength > 0) {
      setCurrentIndex(newLength - 1);
    } else if (newLength === 0) {
      setCurrentIndex(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    toast({
      title: "Restarted",
      description: "Back to the first card!"
    });
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center element-spacing max-w-md">
          <div className="space-y-3">
            <h2 className="heading-secondary">Create Your First Flashcard</h2>
            <p className="body-text text-muted-foreground">
              Start building your knowledge with interactive flashcards
            </p>
          </div>
          
          <CreateFlashcardModal 
            onCreateFlashcard={handleCreateFlashcard}
            trigger={
              <Button className="btn-primary touch-target">
                <Plus className="h-5 w-5 mr-2" />
                Create Flashcard
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      {/* Clean progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="caption-text">
            {currentIndex + 1} of {flashcards.length}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="btn-ghost"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
            <CreateFlashcardModal onCreateFlashcard={handleCreateFlashcard} />
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-muted" />
      </div>

      {/* Main flashcard */}
      <div className="animate-fade-in">
        <FlashcardComponent
          flashcard={currentCard}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onEdit={handleEditFlashcard}
          onDelete={handleDeleteFlashcard}
        />
      </div>

      {/* Clean navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={flashcards.length <= 1}
          className="btn-secondary"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="px-4 py-2 bg-muted rounded-lg">
          <span className="caption-text">Swipe to navigate</span>
        </div>
        
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={flashcards.length <= 1}
          className="btn-secondary"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Edit Modal */}
      <EditFlashcardModal
        flashcard={editingFlashcard}
        isOpen={!!editingFlashcard}
        onClose={() => setEditingFlashcard(null)}
        onUpdateFlashcard={handleUpdateFlashcard}
      />
    </div>
  );
}
