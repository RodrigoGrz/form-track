import { View, Text } from 'react-native';
import { HistoryDTO } from '@/dtos/HistoryDTO';

type Props = {
  data: HistoryDTO;
};

export function HistoryCard({ data }: Props) {
  return (
    <View className="w-full px-5 py-4 mb-3 bg-gray-600 rounded-md flex-row items-center justify-between">
      <View className="mr-5 flex-1">
        <Text
          className="text-white text-base font-bold capitalize"
          numberOfLines={1}
        >
          {data.group}
        </Text>

        <Text
          className="text-gray-100 text-lg"
          numberOfLines={1}
        >
          {data.name}
        </Text>
      </View>

      <Text className="text-gray-300 text-base">
        {data.hour}
      </Text>
    </View>
  );
}