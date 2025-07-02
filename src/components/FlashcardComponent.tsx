import { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Edit2, Trash2 } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface FlashcardComponentProps {
  flashcard: Flashcard;
  onNext?: () => void;
  onPrevious?: () => void;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  showControls?: boolean;
}

export function FlashcardComponent({
  flashcard,
  onNext,
  onPrevious,
  onEdit,
  onDelete,
  showControls = true
}: FlashcardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    threshold: 50
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-subtle">
      <div className="w-full max-w-sm mx-auto">
        {/* Flashcard */}
        <div 
          className="relative w-full h-96 perspective-1000 mb-6"
          {...swipeHandlers}
        >
          <Card 
            className={`
              flashcard absolute inset-0 w-full h-full cursor-pointer
              transform-style-preserve-3d transition-transform duration-500
              ${isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={handleFlip}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden p-6 flex flex-col items-center justify-center text-center">
              {flashcard.image && (
                <img 
                  src={flashcard.image} 
                  alt="Flashcard" 
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-lg font-medium text-foreground break-words">
                {flashcard.front}
              </p>
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                Tap to flip
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col items-center justify-center text-center bg-gradient-card">
              <p className="text-lg font-medium text-foreground break-words">
                {flashcard.back}
              </p>
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                Swipe for next
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFlipped(!isFlipped)}
              className="touch-target"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(flashcard)}
                className="touch-target"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(flashcard)}
                className="touch-target"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Swipe Indicators */}
        <div className="flex justify-between items-center mt-6 px-8">
          <div className="swipe-indicator text-xs text-muted-foreground">
            ← Previous
          </div>
          <div className="swipe-indicator text-xs text-muted-foreground">
            Next →
          </div>
        </div>
      </div>
    </div>
  );
}