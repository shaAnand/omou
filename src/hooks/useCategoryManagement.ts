
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCategoryManagement = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { refetch } = useProfile();

  const addSampleThoughtsForCategories = async (selectedCategories: string[]) => {
    if (!user) return;

    const sampleThoughts: string[] = [];
    
    for (const category of selectedCategories) {
      const { data, error } = await supabase.rpc('get_sample_thoughts', {
        category_name: category
      });
      
      if (error) {
        console.error(`Error fetching sample thoughts for ${category}:`, error);
        continue;
      }
      
      if (data) {
        sampleThoughts.push(...data.map((item: { content: string }) => item.content));
      }
    }

    // Insert sample thoughts as user's flashcards with category tags
    if (sampleThoughts.length > 0) {
      const flashcardsToInsert = sampleThoughts.map((content, index) => {
        // Find which category this thought belongs to
        const categoryIndex = Math.floor(index / (sampleThoughts.length / selectedCategories.length));
        const category = selectedCategories[categoryIndex] || selectedCategories[0];
        
        return {
          user_id: user.id,
          content,
          category
        };
      });

      const { error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert);

      if (insertError) {
        throw insertError;
      }
    }

    return sampleThoughts.length;
  };

  const mergeUserCategories = async (newCategories: string[], existingCategories: string[] = []) => {
    if (!user) return false;

    setLoading(true);
    try {
      // Merge categories - only add new ones
      const categoriesToAdd = newCategories.filter(cat => !existingCategories.includes(cat));
      const updatedCategories = [...existingCategories, ...categoriesToAdd];

      // Add sample thoughts only for new categories
      const thoughtsCount = categoriesToAdd.length > 0 
        ? await addSampleThoughtsForCategories(categoriesToAdd)
        : 0;

      // Update profile with merged categories
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_categories: updatedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh profile data
      await refetch();

      if (categoriesToAdd.length > 0) {
        toast.success(`🎉 Added ${categoriesToAdd.length} new categories with ${thoughtsCount} sample thoughts!`);
      } else {
        toast.info('No new categories to add');
      }
      
      return true;
    } catch (error) {
      console.error('Error merging categories:', error);
      toast.error('Failed to update categories. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeUserCategory = async (categoryToRemove: string, existingCategories: string[] = []) => {
    if (!user) return false;

    setLoading(true);
    try {
      // Remove category from list
      const updatedCategories = existingCategories.filter(cat => cat !== categoryToRemove);

      // Remove all flashcards for this category
      const { error: deleteError } = await supabase
        .from('flashcards')
        .delete()
        .eq('user_id', user.id)
        .eq('category', categoryToRemove);

      if (deleteError) {
        console.error('Error deleting flashcards:', deleteError);
        // Continue even if flashcard deletion fails
      }

      // Update profile with remaining categories
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_categories: updatedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh profile data
      await refetch();

      toast.success(`Removed "${categoryToRemove}" category and all its thoughts`);
      return true;
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Failed to remove category. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Legacy method for backward compatibility
  const updateUserCategories = async (selectedCategories: string[]) => {
    return await mergeUserCategories(selectedCategories, []);
  };

  return {
    updateUserCategories,
    mergeUserCategories,
    removeUserCategory,
    loading
  };
};
