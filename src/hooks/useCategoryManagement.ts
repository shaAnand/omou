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

    console.log('Adding sample thoughts for categories:', selectedCategories);
    let totalThoughtsAdded = 0;
    
    for (const category of selectedCategories) {
      const { data, error } = await supabase.rpc('get_sample_thoughts', {
        category_name: category
      });
      
      if (error) {
        console.error(`Error fetching sample thoughts for ${category}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        // Insert sample thoughts with proper category assignment
        const flashcardsToInsert = data.map((item: { content: string }) => ({
          user_id: user.id,
          content: item.content,
          category: category // Ensure category is properly set
        }));

        const { error: insertError } = await supabase
          .from('flashcards')
          .insert(flashcardsToInsert);

        if (insertError) {
          console.error(`Error inserting flashcards for ${category}:`, insertError);
          throw insertError;
        }

        totalThoughtsAdded += data.length;
        console.log(`Added ${data.length} thoughts for category ${category}`);
      }
    }

    console.log(`Total thoughts added: ${totalThoughtsAdded}`);
    return totalThoughtsAdded;
  };

  const mergeUserCategories = async (newCategories: string[], existingCategories: string[] = []) => {
    if (!user) return false;

    setLoading(true);
    try {
      console.log('Merging categories:', { newCategories, existingCategories });
      
      // Only add truly new categories
      const categoriesToAdd = newCategories.filter(cat => !existingCategories.includes(cat));
      console.log('Categories to add:', categoriesToAdd);
      
      if (categoriesToAdd.length === 0) {
        toast.info('No new categories to add');
        return true;
      }

      // Add sample thoughts for new categories
      const thoughtsCount = await addSampleThoughtsForCategories(categoriesToAdd);

      // Update profile with all categories (existing + new)
      const updatedCategories = [...existingCategories, ...categoriesToAdd];
      console.log('Updating profile with categories:', updatedCategories);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_categories: updatedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Refresh profile to trigger UI update
      await refetch();

      toast.success(`🎉 Added ${categoriesToAdd.length} new categories with ${thoughtsCount} sample thoughts!`);
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
      console.log('Current categories:', existingCategories);
      
      // Step 1: Remove category from profile first
      const updatedCategories = existingCategories.filter(cat => cat !== categoryToRemove);
      console.log('Updated categories after removal:', updatedCategories);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_categories: updatedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }

      console.log('Profile updated successfully');

      // Step 2: Delete flashcards for this category
      // Handle both actual category matches AND null categories if user only has one category
      let deleteQuery = supabase
        .from('flashcards')
        .delete({ count: 'exact' })
        .eq('user_id', user.id);

      // If this is the last category being removed, delete all flashcards
      // Otherwise, only delete flashcards with matching category
      if (updatedCategories.length === 0) {
        console.log('Deleting all flashcards as no categories remain');
        // Delete all flashcards for this user since no categories remain
      } else {
        console.log('Deleting flashcards with category:', categoryToRemove);
        deleteQuery = deleteQuery.eq('category', categoryToRemove);
      }

      const { error: deleteError, count } = await deleteQuery;

      if (deleteError) {
        console.error('Error deleting flashcards:', deleteError);
        // Don't throw here - profile update was successful
        console.warn('Profile updated but some flashcards may not have been deleted');
      } else {
        console.log(`Deleted ${count || 0} flashcards for category: ${categoryToRemove}`);
      }

      // Step 3: Refresh profile data to trigger UI updates
      console.log('Refreshing profile data...');
      await refetch();
      console.log('Profile data refreshed');
      
      toast.success(`Successfully removed "${categoryToRemove}" category${count ? ` and ${count} associated thoughts` : ''}`);
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
