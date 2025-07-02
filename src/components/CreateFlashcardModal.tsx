import { useState } from 'react';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera as CameraIcon, Plus, X } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { useToast } from '@/hooks/use-toast';

interface CreateFlashcardModalProps {
  onCreateFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  trigger?: React.ReactNode;
}

export function CreateFlashcardModal({ onCreateFlashcard, trigger }: CreateFlashcardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const takePicture = async () => {
    try {
      setIsLoading(true);
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 80,
        allowEditing: true,
        saveToGallery: false
      });

      if (photo.dataUrl) {
        setImage(photo.dataUrl);
        toast({
          title: "Photo captured!",
          description: "Photo added to your flashcard."
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Missing content",
        description: "Please fill in both front and back of the flashcard.",
        variant: "destructive"
      });
      return;
    }

    onCreateFlashcard({
      front: front.trim(),
      back: back.trim(),
      image
    });

    // Reset form
    setFront('');
    setBack('');
    setImage(undefined);
    setIsOpen(false);

    toast({
      title: "Flashcard created!",
      description: "Your new flashcard has been added to the deck."
    });
  };

  const removeImage = () => {
    setImage(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-primary touch-target">
            <Plus className="h-4 w-4 mr-2" />
            Add Flashcard
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Section */}
          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Flashcard" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={takePicture}
                disabled={isLoading}
                className="w-full h-20 border-dashed"
              >
                <CameraIcon className="h-6 w-6 mr-2" />
                {isLoading ? 'Taking Photo...' : 'Take Photo'}
              </Button>
            )}
          </div>

          {/* Front Side */}
          <div className="space-y-2">
            <Label htmlFor="front">Front Side *</Label>
            <Textarea
              id="front"
              placeholder="Enter the question or prompt..."
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="min-h-20"
              required
            />
          </div>

          {/* Back Side */}
          <div className="space-y-2">
            <Label htmlFor="back">Back Side *</Label>
            <Textarea
              id="back"
              placeholder="Enter the answer or definition..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="min-h-20"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1"
            >
              Create Flashcard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}