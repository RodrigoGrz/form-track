import { Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import HomeSvg from '@/assets/home.svg';
import ProfileSvg from '@/assets/profile.svg';
import HistorySvg from '@/assets/history.svg';

import { Home } from '@/screens/Home';
import { Profile } from '@/screens/Profile';
import { Exercise } from '@/screens/Exercise';
import { History } from '@/screens/History';

type AppRoutes = {
  home: undefined;
  exercise: { exerciseId: string };
  profile: undefined;
  history: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const iconSize = 24; // equivalente ao sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        // cores equivalentes ao seu tema
        tabBarActiveTintColor: '#22c55e', // green-500
        tabBarInactiveTintColor: '#e5e7eb', // gray-200

        tabBarStyle: {
          backgroundColor: '#374151', // gray-600
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? undefined : 66,
          paddingBottom: 24,
          paddingTop: 24,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}