interface SessionPayload {
  date: string;
  duration: number;
  type: 'training' | 'match' | 'physical';
  skills: Array<'technique' | 'physique' | 'cardio' | 'tactique' | 'match'>;
  comment?: string;
  photoUrl?: string;
  friendId?: string;
}

interface ValidationContext {
  sessionsTodayCount: number;
}

const TYPE_COEFFICIENT: Record<SessionPayload['type'], number> = {
  training: 1,
  match: 1.3,
  physical: 1.15
};

const SKILL_BONUS = 8;

export function computeSessionXp(payload: SessionPayload, context: ValidationContext): { xpAwarded: number; isCounted: boolean } {
  if (payload.duration < 10 || payload.duration > 240) {
    throw new Error('Invalid session duration');
  }

  if (context.sessionsTodayCount >= 2) {
    return { xpAwarded: 0, isCounted: false };
  }

  const base = payload.duration * TYPE_COEFFICIENT[payload.type];
  const bonus = payload.skills.length * SKILL_BONUS;

  const diminishingRatio = context.sessionsTodayCount === 1 ? 0.7 : 1;
  const xpAwarded = Math.round((base + bonus) * diminishingRatio);

  return {
    xpAwarded,
    isCounted: true
  };
}

export function computeLevel(xpGlobal: number): number {
  if (xpGlobal <= 0) {
    return 1;
  }
  return Math.max(1, Math.floor(Math.pow(xpGlobal / 100, 2 / 3)));
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const payload = (await req.json()) as SessionPayload;

    // NOTE: DB checks and writes should be transactionally executed with service role client.
    // In production, replace mocked `sessionsTodayCount` with query against sessions table.
    const sessionsTodayCount = 0;
    const { xpAwarded } = computeSessionXp(payload, { sessionsTodayCount });

    return new Response(JSON.stringify({ xpAwarded }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
