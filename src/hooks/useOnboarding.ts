import { useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOnboarding = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { refetch } = useProfile();

  const addSampleThoughts = async (selectedCategories: string[]) => {
    if (!user) return;

    setLoading(true);
    try {
      // Get sample thoughts for selected categories
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

      // Update profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          selected_categories: selectedCategories
        })
        .eq('user_id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh profile data
      await refetch();

      if (selectedCategories.length > 0) {
        toast.success(`Added ${sampleThoughts.length} sample thoughts from ${selectedCategories.length} categories!`);
      } else {
        toast.success('Welcome! You can start creating your own thoughts.');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addSampleThoughts,
    loading
  };
};