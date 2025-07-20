
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
    <div className="flex flex-col items-center">
      <div className="w-full max-w-lg mx-auto">
        {/* Clean flashcard with generous whitespace */}
        <div 
          className="mb-8"
          {...swipeHandlers}
        >
          <Card className="card-elevated min-h-[400px] p-8">
            <div className="flex flex-col h-full min-h-[320px]">
              {/* Image section with clean styling */}
              {flashcard.image && (
                <div className="mb-6 flex-shrink-0">
                  <img 
                    src={flashcard.image} 
                    alt="Flashcard visual content" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
              
              {/* Content with optimal typography */}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xl leading-relaxed text-center text-foreground font-normal break-words max-w-prose">
                  {flashcard.content}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Minimal control buttons */}
        {showControls && (
          <div className="flex items-center justify-center gap-4">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(flashcard)}
                className="btn-secondary touch-target"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(flashcard)}
                className="btn-secondary touch-target text-destructive border-destructive/20 hover:bg-destructive/5"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
