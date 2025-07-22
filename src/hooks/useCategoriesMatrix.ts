
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
  const { profile, loading: profileLoading } = useProfile();
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
    if (!user || !profile?.selected_categories || profileLoading) {
      console.log('Not fetching categories - missing user/profile or profile loading', { 
        user: !!user, 
        profile: !!profile, 
        selectedCategories: profile?.selected_categories,
        profileLoading 
      });
      setCategories([]);
      return;
    }
    
    console.log('Fetching categories data for:', profile.selected_categories);
    setLoading(true);
    
    try {
      const categoriesData: CategoryData[] = [];
      
      for (const categoryName of profile.selected_categories) {
        // Get count of user's thoughts for this category
        // Include both matching categories AND null categories for backward compatibility
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

      console.log('Fetched categories data:', categoriesData);
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

  // Effect that properly responds to profile changes
  useEffect(() => {
    console.log('useCategoriesMatrix effect triggered', { 
      user: !!user, 
      profileLoading, 
      selectedCategories: profile?.selected_categories 
    });
    
    // Only fetch if we have user and profile is loaded
    if (user && !profileLoading) {
      fetchCategoriesData();
    }
  }, [user?.id, profile?.selected_categories, profileLoading]);

  return {
    categories,
    loading: loading || profileLoading,
    selectedCategory,
    selectCategory,
    goBackToMatrix,
    refetch: fetchCategoriesData
  };
};
