
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CategoryCard } from './CategoryCard';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingModalProps {
  open: boolean;
  onComplete: (selectedCategories?: string[]) => void;
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

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const { addSampleThoughts, loading } = useOnboarding();

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await addSampleThoughts(selectedCategories);
      toast.success(`🎉 Welcome! Added sample thoughts from ${selectedCategories.length} categories.`);
      onComplete(selectedCategories);
    } catch (error) {
      console.error('Failed to add sample thoughts:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    try {
      await addSampleThoughts([]);
      toast.success('🎉 Welcome! You can start creating your own thoughts.');
      onComplete([]);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (!open && !isCompleting) {
      // When dialog is closed via X button, treat it as skip
      await handleSkip();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 ? 'Welcome to Thoughts!' : 'Choose Your Categories'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">💭</div>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  Start your journey with curated thoughts across different categories.
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll add sample thoughts to help you get started, or you can skip and create your own.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleSkip} 
                variant="outline"
                disabled={isCompleting || loading}
              >
                {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Skip & Start Empty
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={isCompleting || loading}
              >
                Choose Categories
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Select the categories that resonate with you. We'll add sample thoughts for each selected category.
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
                onClick={() => setStep(1)} 
                variant="outline"
                disabled={isCompleting || loading}
              >
                Back
              </Button>
              <Button 
                onClick={handleSkip} 
                variant="outline"
                disabled={isCompleting || loading}
              >
                {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Skip
              </Button>
              <Button 
                onClick={handleComplete} 
                disabled={isCompleting || loading || selectedCategories.length === 0}
              >
                {(isCompleting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add {selectedCategories.length} Categories
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
