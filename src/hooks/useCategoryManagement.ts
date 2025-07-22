
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

      // Wait for profile data to be refreshed
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
      console.log(`Starting deletion of category: ${categoryToRemove}`);
      
      // Remove category from list
      const updatedCategories = existingCategories.filter(cat => cat !== categoryToRemove);
      console.log('Updated categories after removal:', updatedCategories);

      // First, delete all flashcards for this category
      const { error: deleteError, count } = await supabase
        .from('flashcards')
        .delete({ count: 'exact' })
        .eq('user_id', user.id)
        .eq('category', categoryToRemove);

      if (deleteError) {
        console.error('Error deleting flashcards:', deleteError);
        throw new Error(`Failed to delete flashcards: ${deleteError.message}`);
      }

      console.log(`Deleted ${count || 0} flashcards for category: ${categoryToRemove}`);

      // Then, update profile with remaining categories
      console.log('Updating profile with categories:', updatedCategories);
      const { error: profileError, data: profileData } = await supabase
        .from('profiles')
        .update({
          selected_categories: updatedCategories
        })
        .eq('user_id', user.id)
        .select('selected_categories')
        .single();

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }

      console.log('Profile updated successfully with data:', profileData);

      console.log('Profile updated successfully');

      // Wait for profile data to be properly refreshed
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay to ensure DB consistency
      await refetch();
      
      console.log('Profile data refetched');

      toast.success(`Successfully removed "${categoryToRemove}" category and ${count || 0} associated thoughts`);
      return true;
      
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error(`Failed to remove category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
