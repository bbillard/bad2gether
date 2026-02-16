import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';

export function ProfileScreen(): JSX.Element {
  const { signOut } = useAuthStore();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.name}>@alex7</Text>
        <Text style={styles.email}>alex@example.com</Text>
        <Text style={styles.meta}>Club: Bad2gether Paris</Text>
      </View>
      <Pressable style={styles.button} onPress={() => void signOut()}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, backgroundColor: colors.surface, padding: 14, gap: 8 },
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  email: { color: colors.mutedText },
  meta: { color: colors.secondary, fontWeight: '600' },
  button: { backgroundColor: colors.danger, borderRadius: 12, padding: 12, alignItems: 'center' },
  buttonText: { color: colors.text, fontWeight: '700' }
});
