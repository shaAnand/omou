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
import { Camera as CameraIcon, Upload, Plus, X } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { useToast } from '@/hooks/use-toast';

interface CreateFlashcardModalProps {
  onCreateFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  trigger?: React.ReactNode;
}

export function CreateFlashcardModal({ onCreateFlashcard, trigger }: CreateFlashcardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImage(event.target.result as string);
            toast({
              title: "Image uploaded!",
              description: "Image added to your flashcard."
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select an image file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter some text for your flashcard.",
        variant: "destructive"
      });
      return;
    }

    onCreateFlashcard({
      content: content.trim(),
      image
    });

    // Reset form
    setContent('');
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
      <DialogContent className="sm:max-w-lg mx-4 p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="heading-secondary">Create New Flashcard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="element-spacing">
          {/* Content with clean spacing */}
          <div className="space-y-3">
            <Label htmlFor="content" className="body-text font-medium">Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter your flashcard content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-clean min-h-32 resize-none"
              required
            />
          </div>

          {/* Image Section with clean layout */}
          <div className="space-y-3">
            <Label className="body-text font-medium">Image (Optional)</Label>
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
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={takePicture}
                  disabled={isLoading}
                  className="h-20 border-dashed"
                >
                  <CameraIcon className="h-5 w-5 mr-2" />
                  {isLoading ? 'Taking...' : 'Camera'}
                </Button>
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-20 border-dashed w-full"
                    asChild
                  >
                    <div>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload
                    </div>
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="btn-secondary flex-1"
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