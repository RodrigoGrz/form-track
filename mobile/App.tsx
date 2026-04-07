import { StatusBar, View } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import '@/styles/global.css';

import { AuthContextProvider } from '@/contexts/AuthContext';
import { Routes } from '@/routes';
import { Loading } from '@/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-700">
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-700">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </View>
  );
}