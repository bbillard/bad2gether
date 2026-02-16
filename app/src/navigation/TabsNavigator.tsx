import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ChallengesScreen } from '@/screens/challenges/ChallengesScreen';
import { CommunityScreen } from '@/screens/community/CommunityScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { CreateSessionScreen } from '@/screens/sessions/CreateSessionScreen';
import { colors } from '@/theme/colors';

const Tab = createBottomTabNavigator();

export function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        },
        tabBarActiveTintColor: colors.xp,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Accueil: 'home',
            Seance: 'add-circle',
            Defis: 'trophy',
            Communaute: 'people',
            Profil: 'person'
          };
          return <Ionicons name={map[route.name] ?? 'ellipse'} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Seance" component={CreateSessionScreen} options={{ title: 'Séance' }} />
      <Tab.Screen name="Defis" component={ChallengesScreen} options={{ title: 'Défis' }} />
      <Tab.Screen name="Communaute" component={CommunityScreen} options={{ title: 'Communauté' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
