
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

      console.log('useProfile: Successfully fetched profile:', data);
      // Force React to detect changes by creating a completely new object
      setProfile({ 
        ...data,
        // Add a timestamp to ensure React detects the change
        _lastUpdated: Date.now()
      } as Profile);
    } catch (error) {
      console.error('useProfile: Exception fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, refreshTrigger]);

  // Force refresh function that triggers a re-fetch
  const forceRefresh = useCallback(() => {
    console.log('useProfile: Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    refetch: fetchProfile,
    forceRefresh
  };
};
