import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  current_amount: number;
  goal_amount: number;
  subscription_status: string;
  subscription_expires_at?: string;
  created_at: string;
  role?: string;
  email?: string;
}

export const useUserProfile = (username: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setError('User not found');
          setProfile(null);
        } else {
          setProfile(data);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  return { profile, loading, error };
};