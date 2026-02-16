import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { XpBar } from '@/components/XpBar';
import { colors } from '@/theme/colors';
import { useAppStore } from '@/store/useAppStore';

export function ChallengesScreen(): JSX.Element {
  const { challenges, refreshDashboard } = useAppStore();

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Défis hebdomadaires</Text>
      {challenges.map((challenge) => (
        <View style={styles.card} key={challenge.id}>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          <Text style={styles.cardBody}>{challenge.description}</Text>
          <XpBar progress={challenge.target ? challenge.progress / challenge.target : 0} color={colors.secondary} />
          <Text style={styles.reward}>{`+${challenge.xpReward} XP`}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  card: { gap: 8, borderRadius: 14, backgroundColor: colors.surface, padding: 12 },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  cardBody: { color: colors.mutedText },
  reward: { color: colors.xp, fontWeight: '700' }
});
