import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Flashcard } from '@/types/flashcard';
import { useToast } from '@/hooks/use-toast';

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch flashcards for the current user
  const fetchFlashcards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFlashcards: Flashcard[] = data.map(card => ({
        id: card.id,
        content: card.content,
        image: card.image_url || undefined,
        createdAt: new Date(card.created_at),
        updatedAt: new Date(card.updated_at)
      }));

      setFlashcards(formattedFlashcards);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load flashcards"
      });
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new flashcard
  const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      let imageUrl = flashcard.image;

      // Upload image if provided
      if (flashcard.image && flashcard.image.startsWith('data:')) {
        imageUrl = await uploadImage(flashcard.image);
      }

      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          content: flashcard.content,
          image_url: imageUrl
        })
        .select()
        .single();

      if (error) throw error;

      const newFlashcard: Flashcard = {
        id: data.id,
        content: data.content,
        image: data.image_url || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setFlashcards(prev => [newFlashcard, ...prev]);
      
      toast({
        title: "Success",
        description: "Flashcard created successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create flashcard"
      });
      console.error('Error creating flashcard:', error);
    }
  };

  // Update a flashcard
  const updateFlashcard = async (flashcard: Flashcard) => {
    if (!user) return;

    try {
      let imageUrl = flashcard.image;

      // Upload new image if provided
      if (flashcard.image && flashcard.image.startsWith('data:')) {
        imageUrl = await uploadImage(flashcard.image);
      }

      const { data, error } = await supabase
        .from('flashcards')
        .update({
          content: flashcard.content,
          image_url: imageUrl
        })
        .eq('id', flashcard.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedFlashcard: Flashcard = {
        id: data.id,
        content: data.content,
        image: data.image_url || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setFlashcards(prev => prev.map(card => 
        card.id === flashcard.id ? updatedFlashcard : card
      ));

      toast({
        title: "Success",
        description: "Flashcard updated successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update flashcard"
      });
      console.error('Error updating flashcard:', error);
    }
  };

  // Delete a flashcard
  const deleteFlashcard = async (flashcard: Flashcard) => {
    if (!user) return;

    try {
      // Delete image from storage if exists
      if (flashcard.image && !flashcard.image.startsWith('data:')) {
        const imagePath = getImagePath(flashcard.image);
        if (imagePath) {
          await supabase.storage
            .from('flashcard-images')
            .remove([imagePath]);
        }
      }

      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcard.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFlashcards(prev => prev.filter(card => card.id !== flashcard.id));

      toast({
        title: "Success",
        description: "Flashcard deleted successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete flashcard"
      });
      console.error('Error deleting flashcard:', error);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (imageDataUrl: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileExt = blob.type.split('/')[1] || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('flashcard-images')
        .upload(fileName, blob);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('flashcard-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Extract image path from URL for deletion
  const getImagePath = (imageUrl: string): string | null => {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'flashcard-images');
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
    } catch (error) {
      console.error('Error parsing image URL:', error);
    }
    return null;
  };

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    } else {
      setFlashcards([]);
    }
  }, [user]);

  return {
    flashcards,
    loading,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refetchFlashcards: fetchFlashcards
  };
}