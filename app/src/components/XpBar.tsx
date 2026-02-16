import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  progress: number;
  color?: string;
}

export function XpBar({ progress, color = colors.xp }: Props): JSX.Element {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, progress * 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#0A1E44',
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 8
  }
});
