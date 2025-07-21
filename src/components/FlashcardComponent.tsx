
import { Flashcard } from '@/types/flashcard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2 } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface FlashcardComponentProps {
  flashcard: Flashcard;
  onNext?: () => void;
  onPrevious?: () => void;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  showControls?: boolean;
  loading?: boolean;
}

export function FlashcardComponent({
  flashcard,
  onNext,
  onPrevious,
  onEdit,
  onDelete,
  showControls = true,
  loading = false
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
              {loading ? (
                <div className="mb-6 flex-shrink-0">
                  <Skeleton className="w-full h-48 rounded-lg" />
                </div>
              ) : flashcard.image ? (
                <div className="mb-6 flex-shrink-0">
                  <img 
                    src={flashcard.image} 
                    alt="Flashcard" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ) : null}
              
              {/* Content section - expanded to fill more space */}
              <div className="flex-1 flex items-center justify-center p-4">
                {loading ? (
                  <div className="w-full space-y-3">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                  </div>
                ) : (
                  <p className="text-xl leading-relaxed text-center font-medium text-gray-800 break-words w-full">
                    {flashcard.content}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Controls - Improved visibility */}
        {showControls && (
          <div className="flex items-center justify-center space-x-6">
            {loading ? (
              <>
                <Skeleton className="h-12 w-20 rounded-lg" />
                <Skeleton className="h-12 w-24 rounded-lg" />
              </>
            ) : (
              <>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(flashcard)}
                    className="touch-target w-12 h-12 rounded-full bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300"
                  >
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(flashcard)}
                    className="touch-target w-12 h-12 rounded-full bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* Swipe Indicators */}
        <div className="flex justify-between items-center mt-6 px-8">
          {loading ? (
            <>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </>
          ) : (
            <>
              <div className="swipe-indicator text-xs text-muted-foreground">
                ← Previous
              </div>
              <div className="swipe-indicator text-xs text-muted-foreground">
                Next →
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
