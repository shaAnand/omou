
import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { FlashcardComponent } from './FlashcardComponent';
import { CreateFlashcardModal } from './CreateFlashcardModal';
import { EditFlashcardModal } from './EditFlashcardModal';
import { FlashcardDeckSkeleton, EmptyStateSkeleton } from './LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  loading?: boolean;
  onCreateFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateFlashcard: (flashcard: Flashcard) => Promise<void>;
  onDeleteFlashcard: (flashcard: Flashcard) => Promise<void>;
}

export function FlashcardDeck({ flashcards, loading = false, onCreateFlashcard, onUpdateFlashcard, onDeleteFlashcard }: FlashcardDeckProps) {
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

  // Show loading skeleton when loading
  if (loading) {
    return <FlashcardDeckSkeleton />;
  }

  // Show empty state when no flashcards
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-subtle">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome to Omou</h2>
            <p className="text-muted-foreground">
              Create your first flashcard to start studying
            </p>
          </div>
          
          <CreateFlashcardModal 
            onCreateFlashcard={handleCreateFlashcard}
            trigger={
              <Button size="lg" className="btn-primary touch-target">
                <Plus className="h-5 w-5 mr-2" />
                Create First Flashcard
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-subtle">
      {/* Header - Counter removed */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {/* Counter removed - empty space for balance */}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              className="touch-target"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <CreateFlashcardModal onCreateFlashcard={handleCreateFlashcard} />
          </div>
        </div>
        
        <Progress value={progress} className="h-1" />
      </div>

      {/* Main Content */}
      <div className="pt-20">
        <FlashcardComponent
          flashcard={currentCard}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onEdit={handleEditFlashcard}
          onDelete={handleDeleteFlashcard}
        />
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-t">
        <div className="flex items-center justify-center p-4 space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="touch-target"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="px-4 py-2 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium text-primary">
              Swipe to navigate
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={handleNext}
            className="touch-target"
            disabled={flashcards.length <= 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
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
