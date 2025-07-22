
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

    // Insert sample thoughts as user's flashcards
    if (sampleThoughts.length > 0) {
      const flashcardsToInsert = sampleThoughts.map(content => ({
        user_id: user.id,
        content
      }));

      const { error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert);

      if (insertError) {
        throw insertError;
      }
    }

    return sampleThoughts.length;
  };

  const updateUserCategories = async (selectedCategories: string[]) => {
    if (!user) return;

    setLoading(true);
    try {
      // Add sample thoughts for selected categories
      const thoughtsCount = await addSampleThoughtsForCategories(selectedCategories);

      // Update profile with selected categories
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_categories: selectedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh profile data
      await refetch();

      toast.success(`🎉 Added ${selectedCategories.length} categories with ${thoughtsCount} sample thoughts!`);
      return true;
    } catch (error) {
      console.error('Error updating categories:', error);
      toast.error('Failed to update categories. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserCategories,
    loading
  };
};
