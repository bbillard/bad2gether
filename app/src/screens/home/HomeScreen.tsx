import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { XpBar } from '@/components/XpBar';
import { colors } from '@/theme/colors';
import { useAppStore } from '@/store/useAppStore';

const skillRows = [
  { key: 'Technique', progress: 0.68, color: '#3DA9FC' },
  { key: 'Physique', progress: 0.52, color: '#6CC551' },
  { key: 'Cardio', progress: 0.4, color: '#F8961E' },
  { key: 'Tactique', progress: 0.33, color: '#F94144' },
  { key: 'Match', progress: 0.59, color: '#43AA8B' }
];

export function HomeScreen(): JSX.Element {
  const { sessions, refreshDashboard } = useAppStore();

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Niveau global 7</Text>
        <Text style={styles.heroSubtitle}>XP 350 / 500</Text>
        <XpBar progress={0.7} />
      </View>

      {skillRows.map((row) => (
        <View key={row.key} style={styles.skillCard}>
          <Text style={styles.skillTitle}>{row.key}</Text>
          <XpBar progress={row.progress} color={row.color} />
        </View>
      ))}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>3 dernières séances</Text>
        {sessions.map((session) => (
          <Text key={session.id} style={styles.item}>{`${session.date} · ${session.duration} min · +${session.xpAwarded} XP`}</Text>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8
  },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: colors.mutedText, fontWeight: '600' },
  skillCard: { gap: 6, backgroundColor: colors.card, padding: 12, borderRadius: 12 },
  skillTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  block: { gap: 8, backgroundColor: colors.surface, borderRadius: 12, padding: 12 },
  blockTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  item: { color: colors.mutedText }
});
