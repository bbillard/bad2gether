export type SessionType = 'training' | 'match' | 'physical';

export type SkillType = 'technique' | 'physique' | 'cardio' | 'tactique' | 'match';

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  xpGlobal: number;
  levelGlobal: number;
  clubId: string | null;
}

export interface TrainingSessionInput {
  date: string;
  duration: number;
  type: SessionType;
  skills: SkillType[];
  friendId?: string;
  photoUrl?: string;
  comment?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  endDate: string;
}

export interface SessionSummary {
  id: string;
  date: string;
  duration: number;
  type: SessionType;
  xpAwarded: number;
}
