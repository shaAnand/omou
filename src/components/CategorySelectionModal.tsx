
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CategoryCard } from './CategoryCard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategorySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (selectedCategories: string[]) => void;
  initialSelectedCategories?: string[];
}

const categories = [
  {
    id: 'Stoicism',
    name: 'Stoicism',
    icon: '🏛️',
    description: 'Ancient wisdom for modern resilience'
  },
  {
    id: 'Motivation',
    name: 'Motivation',
    icon: '🚀',
    description: 'Fuel for your dreams and goals'
  },
  {
    id: 'Wisdom',
    name: 'Wisdom',
    icon: '🦉',
    description: 'Life lessons and insights'
  },
  {
    id: 'Mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    description: 'Present moment awareness'
  },
  {
    id: 'Health',
    name: 'Health',
    icon: '💪',
    description: 'Wellness and vitality'
  },
  {
    id: 'Spirituality',
    name: 'Spirituality',
    icon: '✨',
    description: 'Inner peace and growth'
  }
];

export const CategorySelectionModal = ({ 
  open, 
  onOpenChange, 
  onComplete, 
  initialSelectedCategories = [] 
}: CategorySelectionModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleConfirm = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsLoading(true);
    try {
      onComplete(selectedCategories);
    } catch (error) {
      console.error('Failed to update categories:', error);
      toast.error('Failed to update categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedCategories(initialSelectedCategories);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Your Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Choose the categories that interest you. We'll add sample thoughts for each selected category.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={selectedCategories.includes(category.id)}
                onToggle={() => handleCategoryToggle(category.id)}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button 
              onClick={handleCancel} 
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={isLoading || selectedCategories.length === 0}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {selectedCategories.length} Categories
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
