import { supabase } from '@/services/supabase';
import type { SessionSummary, TrainingSessionInput } from '@/types/domain';

export async function createSession(input: TrainingSessionInput): Promise<{ xpAwarded: number }> {
  const { data, error } = await supabase.functions.invoke('validate_session', {
    body: input
  });

  if (error) {
    throw error;
  }

  return data as { xpAwarded: number };
}

export async function fetchRecentSessions(): Promise<SessionSummary[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id,date,duration,type,xp_awarded')
    .order('date', { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    date: String(row.date),
    duration: Number(row.duration),
    type: row.type as SessionSummary['type'],
    xpAwarded: Number(row.xp_awarded ?? 0)
  }));
}
