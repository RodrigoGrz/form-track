import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import defaultUserPhotoImg from '@/assets/userPhotoDefault.png';

import { UserPhoto } from './UserPhoto';

import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <View className="bg-gray-600 pt-16 pb-5 px-8 flex-row items-center">
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        size={64}
        className="mr-4"
      />

      <View className="flex-1">
        <Text className="text-gray-100 text-base">
          Olá,
        </Text>

        <Text className="text-gray-100 text-base font-bold">
          {user.name}
        </Text>
      </View>

      <TouchableOpacity onPress={signOut}>
        <MaterialIcons
          name="logout"
          size={28}
          color="#e5e7eb"
        />
      </TouchableOpacity>
    </View>
  );
}