
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
          <Card className="w-full min-h-96 p-8 bg-white text-gray-900 shadow-lg border border-gray-200">
            <div className="flex flex-col h-full min-h-80">
              {/* Image section */}
              {flashcard.image && (
                <div className="mb-6 flex-shrink-0">
                  <img 
                    src={flashcard.image} 
                    alt="Flashcard" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              {/* Content section - expanded to fill more space */}
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-xl leading-relaxed text-center font-medium text-gray-800 break-words w-full">
                  {flashcard.content}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls - Improved visibility */}
        {showControls && (
          <div className="flex items-center justify-center space-x-6">
            {onEdit && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => onEdit(flashcard)}
                className="touch-target bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 px-6 py-3"
              >
                <Edit2 className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-blue-600 font-medium">Edit</span>
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => onDelete(flashcard)}
                className="touch-target bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 px-6 py-3"
              >
                <Trash2 className="h-5 w-5 mr-2 text-red-600" />
                <span className="text-red-600 font-medium">Delete</span>
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
