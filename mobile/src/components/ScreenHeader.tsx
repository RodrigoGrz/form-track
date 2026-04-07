import { View, Text } from 'react-native';

type Props = {
  title: string;
}

export function ScreenHeader({ title }: Props) {
  return (
    <View className="bg-gray-600 pt-16 pb-6 items-center">
      <Text className="text-gray-100 text-xl font-bold">
        {title}
      </Text>
    </View>
  );
}