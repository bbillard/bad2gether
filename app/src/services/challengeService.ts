import { supabase } from '@/services/supabase';
import type { Challenge } from '@/types/domain';

export async function fetchActiveChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenge_progress_view')
    .select('challenge_id,title,description,xp_reward,progress,target,end_date')
    .order('end_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: String(row.challenge_id),
    title: String(row.title),
    description: String(row.description),
    xpReward: Number(row.xp_reward),
    progress: Number(row.progress),
    target: Number(row.target),
    endDate: String(row.end_date)
  }));
}
