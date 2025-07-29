
import { useState, useEffect, useCallback } from 'react';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const { profile, loading: profileLoading, forceRefresh } = useProfile();
  const { toast } = useToast();

  const categoryEmojis: Record<string, string> = {
    'Stoicism': '🏛️',
    'Motivation': '🚀',
    'Wisdom': '🦉',
    'Mindfulness': '🧘',
    'Health': '💪',
    'Spirituality': '✨'
  };

  const fetchCategoriesData = useCallback(async () => {
    if (!user || profileLoading) {
      console.log('useCategoriesMatrix: Not fetching - no user or profile loading');
      setCategories([]);
      return;
    }

    const selectedCategories = profile?.selected_categories;
    if (!selectedCategories || selectedCategories.length === 0) {
      console.log('useCategoriesMatrix: No selected categories');
      setCategories([]);
      return;
    }
    
    console.log('useCategoriesMatrix: Fetching categories data for:', selectedCategories);
    setLoading(true);
    
    try {
      const categoriesData: CategoryData[] = [];
      
      for (const categoryName of selectedCategories) {
        // Get count of user's thoughts for this category
        const { count, error } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .or(`category.eq.${categoryName},category.is.null`);

        if (error) {
          console.error(`Error fetching count for ${categoryName}:`, error);
          continue;
        }

        // Get last updated timestamp for this category
        const { data: lastThought } = await supabase
          .from('flashcards')
          .select('updated_at')
          .eq('user_id', user.id)
          .or(`category.eq.${categoryName},category.is.null`)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        categoriesData.push({
          name: categoryName,
          emoji: categoryEmojis[categoryName] || '💭',
          thoughtCount: count || 0,
          lastUpdated: lastThought ? new Date(lastThought.updated_at) : undefined
        });
      }

      console.log('useCategoriesMatrix: Successfully fetched categories:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('useCategoriesMatrix: Error fetching categories data:', error);
      toast({
        title: "Error",
        description: "Failed to load categories data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, profile?.selected_categories, profileLoading, categoryEmojis, toast]);

  const refreshCategories = useCallback(async () => {
    console.log('useCategoriesMatrix: Refreshing categories');
    await forceRefresh();
    setRefreshTrigger(prev => prev + 1);
  }, [forceRefresh]);

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const goBackToMatrix = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    console.log('useCategoriesMatrix: Effect triggered', { 
      userId: user?.id, 
      profileLoading, 
      selectedCategories: profile?.selected_categories,
      refreshTrigger
    });
    
    if (user && !profileLoading) {
      fetchCategoriesData();
    }
  }, [
    user?.id, 
    profileLoading,
    fetchCategoriesData,
    JSON.stringify(profile?.selected_categories || []),
    refreshTrigger
  ]);

  return {
    categories,
    loading,
    selectedCategory,
    selectCategory,
    goBackToMatrix,
    refetch: fetchCategoriesData,
    refreshCategories
  };
};
