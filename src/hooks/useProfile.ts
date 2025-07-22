
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean | null;
  selected_categories: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      console.log('useProfile: No user, setting profile to null');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('useProfile: Fetching profile for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('useProfile: Error fetching profile:', error);
        setProfile(null);
        return;
      }

      console.log('useProfile: Successfully fetched profile with categories:', data?.selected_categories);
      
      // Create a completely new object to ensure React detects the change
      const newProfile = {
        ...data,
        // Force React to detect changes by adding a timestamp
        _lastUpdated: Date.now(),
        // Ensure selected_categories is always an array
        selected_categories: data.selected_categories || []
      } as Profile & { _lastUpdated: number };
      
      setProfile(newProfile);
      console.log('useProfile: Profile state updated with timestamp:', newProfile._lastUpdated);
    } catch (error) {
      console.error('useProfile: Exception fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, refreshTrigger]);

  // Force refresh function that triggers a re-fetch
  const forceRefresh = useCallback(() => {
    console.log('useProfile: Force refresh triggered - incrementing refresh trigger');
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log('useProfile: Refresh trigger updated from', prev, 'to', newValue);
      return newValue;
    });
  }, []);

  useEffect(() => {
    console.log('useProfile: Effect triggered, refreshTrigger:', refreshTrigger);
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    refetch: fetchProfile,
    forceRefresh
  };
};
