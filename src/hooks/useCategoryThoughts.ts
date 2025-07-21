import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Flashcard } from '@/types/flashcard';
import { useToast } from './use-toast';

export const useCategoryThoughts = (category: string | null) => {
  const [thoughts, setThoughts] = useState<Flashcard[]>([]);
  const [sampleThoughts, setSampleThoughts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCategoryThoughts = async () => {
    if (!category || !user) return;
    
    setLoading(true);
    try {
      // Fetch user's personal thoughts for this category
      const { data: userThoughts, error: userError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Fetch sample thoughts for this category
      const { data: sampleData, error: sampleError } = await supabase
        .rpc('get_sample_thoughts', { category_name: category });

      if (sampleError) throw sampleError;

      const transformedThoughts = (userThoughts || []).map(thought => ({
        ...thought,
        createdAt: new Date(thought.created_at),
        updatedAt: new Date(thought.updated_at),
        image: thought.image_url
      }));

      setThoughts(transformedThoughts);
      setSampleThoughts(sampleData?.map(item => item.content) || []);
    } catch (error) {
      console.error('Error fetching category thoughts:', error);
      toast({
        title: "Error",
        description: "Failed to load thoughts for this category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteThought = async (thoughtId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', thoughtId)
        .eq('user_id', user.id);

      if (error) throw error;

      setThoughts(prev => prev.filter(t => t.id !== thoughtId));
      toast({
        title: "Success",
        description: "Thought deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting thought:', error);
      toast({
        title: "Error",
        description: "Failed to delete thought",
        variant: "destructive",
      });
    }
  };

  const filteredThoughts = thoughts.filter(thought =>
    thought.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSampleThoughts = sampleThoughts.filter(thought =>
    thought.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCategoryThoughts();
  }, [category, user]);

  return {
    thoughts: filteredThoughts,
    sampleThoughts: filteredSampleThoughts,
    loading,
    searchQuery,
    setSearchQuery,
    deleteThought,
    refetch: fetchCategoryThoughts
  };
};