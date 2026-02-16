import { create } from 'zustand';

import { fetchActiveChallenges } from '@/services/challengeService';
import { fetchRecentSessions } from '@/services/sessionService';
import type { Challenge, Profile, SessionSummary } from '@/types/domain';

interface AppState {
  profile: Profile | null;
  sessions: SessionSummary[];
  challenges: Challenge[];
  refreshDashboard: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  sessions: [],
  challenges: [],
  refreshDashboard: async () => {
    const [sessions, challenges] = await Promise.all([fetchRecentSessions(), fetchActiveChallenges()]);
    set({ sessions, challenges });
  }
}));
