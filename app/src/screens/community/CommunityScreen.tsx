import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

export function CommunityScreen(): JSX.Element {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Amis</Text>
        <Text style={styles.text}>Ajout via username, demandes et classement hebdo.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Clubs</Text>
        <Text style={styles.text}>Rejoignez un club et suivez le champion hebdomadaire.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, backgroundColor: colors.surface, padding: 14, gap: 6 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  text: { color: colors.mutedText }
});
