import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { createSession } from '@/services/sessionService';
import { colors } from '@/theme/colors';
import type { SessionType, SkillType } from '@/types/domain';

const defaultSkills: SkillType[] = ['technique', 'physique'];

export function CreateSessionScreen(): JSX.Element {
  const [duration, setDuration] = useState('60');
  const [type, setType] = useState<SessionType>('training');

  async function submit(): Promise<void> {
    try {
      const result = await createSession({
        date: new Date().toISOString(),
        duration: Number(duration),
        type,
        skills: defaultSkills
      });
      Alert.alert('Séance validée', `Vous avez gagné ${result.xpAwarded} XP`);
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Nouvelle séance</Text>
      <TextInput value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} placeholder="Durée en minutes" placeholderTextColor={colors.mutedText} />
      <View style={styles.row}>
        {(['training', 'match', 'physical'] as const).map((value) => (
          <Pressable key={value} style={[styles.chip, value === type && styles.chipActive]} onPress={() => setType(value)}>
            <Text style={styles.chipText}>{value}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.cta} onPress={submit}>
        <Text style={styles.ctaText}>Valider la séance</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, color: colors.text },
  row: { flexDirection: 'row', gap: 8 },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
  cta: { marginTop: 12, backgroundColor: colors.success, borderRadius: 12, padding: 12, alignItems: 'center' },
  ctaText: { color: colors.text, fontWeight: '700' }
});
