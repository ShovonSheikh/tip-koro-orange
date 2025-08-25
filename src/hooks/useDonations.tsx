import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Donation {
  id: string;
  amount: number;
  donor_name?: string;
  donor_email?: string;
  message?: string;
  is_anonymous: boolean;
  created_at: string;
  payment_status: string;
}

export const useDonations = (creatorId?: string, limit?: number) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!creatorId) return;

      try {
        setLoading(true);
        let query = supabase
          .from('donations')
          .select('*')
          .eq('creator_id', creatorId)
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setDonations(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [creatorId, limit]);

  return { donations, loading, error };
};