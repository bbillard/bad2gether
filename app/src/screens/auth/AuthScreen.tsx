import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthScreen(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { signIn, signUp, loading } = useAuthStore();

  async function onSubmit(): Promise<void> {
    try {
      if (isSignup) {
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      Alert.alert('Erreur authentification', (error as Error).message);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Bad2gether</Text>
      {isSignup ? <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.mutedText} value={username} onChangeText={setUsername} /> : null}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.mutedText} autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor={colors.mutedText} secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={styles.cta} onPress={onSubmit} disabled={loading}>
        <Text style={styles.ctaText}>{isSignup ? 'Créer un compte' : 'Se connecter'}</Text>
      </Pressable>
      <Pressable onPress={() => setIsSignup((prev) => !prev)}>
        <Text style={styles.link}>{isSignup ? 'Déjà inscrit ? Connexion' : 'Pas de compte ? Inscription'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
    gap: 12
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    backgroundColor: colors.surface
  },
  cta: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  ctaText: {
    color: colors.text,
    fontWeight: '700'
  },
  link: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 4
  }
});
