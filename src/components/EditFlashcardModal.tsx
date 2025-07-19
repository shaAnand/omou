import { useState, useEffect } from 'react';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera as CameraIcon, Upload, X } from 'lucide-react';
import { Flashcard } from '@/types/flashcard';
import { useToast } from '@/hooks/use-toast';

interface EditFlashcardModalProps {
  flashcard: Flashcard | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFlashcard: (flashcard: Flashcard) => void;
}

export function EditFlashcardModal({ 
  flashcard, 
  isOpen, 
  onClose, 
  onUpdateFlashcard 
}: EditFlashcardModalProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with flashcard data
  useEffect(() => {
    if (flashcard) {
      setContent(flashcard.content);
      setImage(flashcard.image);
    }
  }, [flashcard]);

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
          description: "Photo updated for your flashcard."
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
              description: "Image updated for your flashcard."
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

    if (!flashcard) return;

    const updatedFlashcard: Flashcard = {
      ...flashcard,
      content: content.trim(),
      image
    };

    onUpdateFlashcard(updatedFlashcard);
    onClose();

    toast({
      title: "Flashcard updated!",
      description: "Your flashcard has been updated successfully."
    });
  };

  const removeImage = () => {
    setImage(undefined);
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (flashcard) {
      setContent(flashcard.content);
      setImage(flashcard.image);
    }
  };

  if (!flashcard) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Enter your text here *</Label>
            <Textarea
              id="content"
              placeholder="Type your flashcard content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24"
              required
            />
          </div>

          {/* Image Section */}
          <div className="space-y-2">
            <Label>Update Image (Optional)</Label>
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
                <label htmlFor="edit-file-upload">
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
                    id="edit-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary flex-1"
            >
              Update Flashcard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}