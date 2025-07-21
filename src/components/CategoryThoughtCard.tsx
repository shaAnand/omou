import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { formatDistanceToNow } from 'date-fns';

interface CategoryThoughtCardProps {
  thought: Flashcard;
  onDelete: (id: string) => void;
  onEdit?: (thought: Flashcard) => void;
  isEditable?: boolean;
}

export const CategoryThoughtCard = ({ 
  thought, 
  onDelete, 
  onEdit, 
  isEditable = true 
}: CategoryThoughtCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {thought.image && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={thought.image} 
                alt="Thought illustration"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {thought.content}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(thought.createdAt, { addSuffix: true })}
            </span>
            
            {isEditable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(thought)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(thought.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};