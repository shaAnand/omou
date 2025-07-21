import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useToast } from './use-toast';

export interface CategoryData {
  name: string;
  emoji: string;
  thoughtCount: number;
  lastUpdated?: Date;
}

export const useCategoriesMatrix = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const categoryEmojis: Record<string, string> = {
    'Stoicism': '🏛️',
    'Motivation': '🚀',
    'Wisdom': '🦉',
    'Mindfulness': '🧘',
    'Health': '💪',
    'Spirituality': '✨'
  };

  const fetchCategoriesData = async () => {
    if (!user || !profile?.selected_categories) return;
    
    setLoading(true);
    try {
      const categoriesData: CategoryData[] = [];
      
      for (const categoryName of profile.selected_categories) {
        // Get count of user's thoughts for this category
        const { count, error } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('category', categoryName);

        if (error) {
          console.error(`Error fetching count for ${categoryName}:`, error);
          continue;
        }

        // Get last updated timestamp for this category
        const { data: lastThought } = await supabase
          .from('flashcards')
          .select('updated_at')
          .eq('user_id', user.id)
          .eq('category', categoryName)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        categoriesData.push({
          name: categoryName,
          emoji: categoryEmojis[categoryName] || '💭',
          thoughtCount: count || 0,
          lastUpdated: lastThought ? new Date(lastThought.updated_at) : undefined
        });
      }

      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories data:', error);
      toast({
        title: "Error",
        description: "Failed to load categories data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const goBackToMatrix = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [user, profile?.selected_categories]);

  return {
    categories,
    loading,
    selectedCategory,
    selectCategory,
    goBackToMatrix,
    refetch: fetchCategoriesData
  };
};