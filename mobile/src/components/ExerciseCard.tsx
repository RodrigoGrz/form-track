import { View, Text, Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { ExerciseDTO } from '@/dtos/ExerciseDTO';

import { api } from '@/services/api';

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <View className="flex-row items-center bg-gray-500 p-2 pr-4 rounded-md mb-3">
        <Image
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
          className="w-16 h-16 rounded-md mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text className="text-lg text-white font-bold">
            {data.name}
          </Text>

          <Text
            className="text-sm text-gray-200 mt-1"
            numberOfLines={2}
          >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </View>

        <Entypo
          name="chevron-thin-right"
          size={16}
          color="#d1d5db"
        />
      </View>
    </TouchableOpacity>
  );
}