import { assertEquals, assertThrows } from 'jsr:@std/assert';

import { computeLevel, computeSessionXp } from '../index.ts';

Deno.test('computeSessionXp applies anti-cheat daily cap', () => {
  const result = computeSessionXp(
    {
      date: '2026-02-16',
      duration: 90,
      type: 'training',
      skills: ['technique', 'physique']
    },
    { sessionsTodayCount: 2 }
  );

  assertEquals(result, { xpAwarded: 0, isCounted: false });
});

Deno.test('computeSessionXp applies diminishing returns on 2nd session', () => {
  const result = computeSessionXp(
    {
      date: '2026-02-16',
      duration: 60,
      type: 'match',
      skills: ['match']
    },
    { sessionsTodayCount: 1 }
  );

  assertEquals(result.xpAwarded, 60);
});

Deno.test('computeSessionXp rejects invalid duration', () => {
  assertThrows(() =>
    computeSessionXp(
      {
        date: '2026-02-16',
        duration: 5,
        type: 'training',
        skills: ['technique']
      },
      { sessionsTodayCount: 0 }
    )
  );
});

Deno.test('computeLevel follows exponential progression baseline', () => {
  assertEquals(computeLevel(0), 1);
  assertEquals(computeLevel(350), 2);
  assertEquals(computeLevel(1000), 4);
});
