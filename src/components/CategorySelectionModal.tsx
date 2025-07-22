
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
  mode?: 'add' | 'manage';
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
  initialSelectedCategories = [],
  mode = 'add'
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
    if (mode === 'add') {
      // In add mode, only return new categories
      const newCategories = selectedCategories.filter(cat => !initialSelectedCategories.includes(cat));
      if (newCategories.length === 0) {
        toast.error('Please select at least one new category');
        return;
      }
      
      setIsLoading(true);
      try {
        onComplete(newCategories);
      } catch (error) {
        console.error('Failed to update categories:', error);
        toast.error('Failed to update categories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // In manage mode, return all selected categories
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
    }
  };

  const handleCancel = () => {
    setSelectedCategories(initialSelectedCategories);
    onOpenChange(false);
  };

  const newCategoriesCount = mode === 'add' 
    ? selectedCategories.filter(cat => !initialSelectedCategories.includes(cat)).length
    : selectedCategories.length;

  const getButtonText = () => {
    if (mode === 'add') {
      return newCategoriesCount > 0 
        ? `Add ${newCategoriesCount} New Categories`
        : 'No New Categories Selected';
    }
    return `Save ${selectedCategories.length} Categories`;
  };

  const getTitle = () => {
    return mode === 'add' ? 'Add New Categories' : 'Manage Your Categories';
  };

  const getDescription = () => {
    if (mode === 'add') {
      return 'Select new categories to add. Already selected categories are shown but cannot be removed here.';
    }
    return 'Choose the categories that interest you. We\'ll add sample thoughts for each selected category.';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {getDescription()}
            </p>
            {mode === 'add' && initialSelectedCategories.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Current categories: {initialSelectedCategories.join(', ')}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => {
              const isAlreadySelected = initialSelectedCategories.includes(category.id);
              const isCurrentlySelected = selectedCategories.includes(category.id);
              
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={isCurrentlySelected}
                  onToggle={() => handleCategoryToggle(category.id)}
                  disabled={mode === 'add' && isAlreadySelected}
                  alreadyOwned={mode === 'add' && isAlreadySelected}
                />
              );
            })}
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
              disabled={isLoading || newCategoriesCount === 0}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
