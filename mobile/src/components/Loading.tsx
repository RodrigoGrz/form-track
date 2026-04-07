import { View, ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <View className="flex-1 bg-gray-700 items-center justify-center">
      <ActivityIndicator color="#00B37E" />
    </View>
  );
}