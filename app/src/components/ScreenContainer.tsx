import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

export function ScreenContainer({ children }: PropsWithChildren): JSX.Element {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32
  }
});
