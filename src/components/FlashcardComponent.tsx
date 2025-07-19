import { Flashcard } from '@/types/flashcard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
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
  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    threshold: 50
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm mx-auto">
        {/* Flashcard - Single side with white background */}
        <div 
          className="relative w-full mb-6"
          {...swipeHandlers}
        >
          <Card className="w-full min-h-96 p-6 bg-white text-gray-900 shadow-lg border border-gray-200">
            <div className="flex flex-col h-full">
              {/* Image section */}
              {flashcard.image && (
                <div className="mb-4 flex-shrink-0">
                  <img 
                    src={flashcard.image} 
                    alt="Flashcard" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              {/* Content section */}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg leading-relaxed text-center font-medium text-gray-800 break-words">
                  {flashcard.content}
                </p>
              </div>
              
              {/* Swipe hint */}
              <div className="text-xs text-gray-500 text-center mt-4">
                Swipe for next card
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-center space-x-4">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(flashcard)}
                className="touch-target bg-white hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(flashcard)}
                className="touch-target bg-white hover:bg-gray-50"
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