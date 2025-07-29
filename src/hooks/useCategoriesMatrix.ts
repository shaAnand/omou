
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
  const [optimisticCategories, setOptimisticCategories] = useState<CategoryData[]>([]);
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
      setOptimisticCategories([]);
      return;
    }

    const selectedCategories = profile?.selected_categories;
    if (!selectedCategories || selectedCategories.length === 0) {
      console.log('useCategoriesMatrix: No selected categories');
      setCategories([]);
      setOptimisticCategories([]);
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
      setOptimisticCategories(categoriesData);
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

  // Optimistic update for immediate UI feedback
  const optimisticallyRemoveCategory = useCallback((categoryName: string) => {
    console.log('useCategoriesMatrix: Optimistically removing category:', categoryName);
    setOptimisticCategories(prev => prev.filter(cat => cat.name !== categoryName));
  }, []);

  // Rollback optimistic update if operation fails
  const rollbackOptimisticUpdate = useCallback(() => {
    console.log('useCategoriesMatrix: Rolling back optimistic update');
    setOptimisticCategories(categories);
  }, [categories]);

  // Force refresh with profile sync
  const refreshWithProfileSync = useCallback(async () => {
    console.log('useCategoriesMatrix: Refreshing with profile sync');
    // First force refresh the profile
    await forceRefresh();
    // Give profile time to update, then fetch categories
    setTimeout(() => {
      fetchCategoriesData();
    }, 300);
  }, [forceRefresh, fetchCategoriesData]);

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const goBackToMatrix = () => {
    setSelectedCategory(null);
  };

  // Use a more reliable dependency tracking
  useEffect(() => {
    console.log('useCategoriesMatrix: Effect triggered', { 
      userId: user?.id, 
      profileLoading, 
      selectedCategories: profile?.selected_categories,
      profileUpdatedAt: profile?.updated_at
    });
    
    if (user && !profileLoading) {
      fetchCategoriesData();
    }
  }, [
    user?.id, 
    profileLoading,
    // Use JSON.stringify to ensure array changes are detected
    JSON.stringify(profile?.selected_categories || []),
    // Include the profile update timestamp to force refresh
    profile?.updated_at
  ]);

  return {
    categories: optimisticCategories,
    loading: loading || profileLoading,
    selectedCategory,
    selectCategory,
    goBackToMatrix,
    refetch: fetchCategoriesData,
    optimisticallyRemoveCategory,
    rollbackOptimisticUpdate,
    refreshWithProfileSync
  };
};
