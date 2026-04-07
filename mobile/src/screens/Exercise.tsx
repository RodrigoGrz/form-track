import { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@/routes/app.routes';

import BodySvg from '@/assets/body.svg';
import SeriesSvg from '@/assets/series.svg';
import RepetitionsSvg from '@/assets/repetitions.svg';

import { Button } from '@/components/Button';
import { AppError } from '@/utils/AppError';

import { api } from '@/services/api';
import { ExerciseDTO } from '@/dtos/ExerciseDTO';
import { Loading } from '@/components/Loading';

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const [gifUrl, setGifUrl] = useState<string>('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);

      setGifUrl(`${api.defaults.baseURL}/exercise/demo/${response.data.demo}`);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício.';
      alert(title);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);
      await api.post('/history', { exercise_id: exerciseId });
      alert('Parabéns! Exercício registrado no seu histórico');
      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível registrar o exercício.';
      alert(title);
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-700">
      <View className="px-8 pt-12 bg-gray-600">
        <TouchableOpacity onPress={handleGoBack} className="mb-4">
          <Feather name="arrow-left" size={24} color="#22c55e" />
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-white text-lg font-bold flex-shrink">
            {exercise.name}
          </Text>

          <View className="flex-row items-center">
            <BodySvg />
            <Text className="text-gray-200 ml-1 capitalize">{exercise.group}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="p-8">
          <View className="rounded-lg mb-3 overflow-hidden">
            {gifUrl ? (
              <Image
                source={{ uri: gifUrl }}
                style={{ width: '100%', height: 300, borderRadius: 12 }}
                contentFit="contain"
              />
            ) : (
              <Text className="text-gray-400 text-center">GIF não disponível</Text>
            )}
          </View>

          <View className="bg-gray-600 rounded-md px-4 pb-4">
            <View className="flex-row justify-around items-center mb-6 mt-5">
              <View className="flex-row items-center">
                <SeriesSvg />
                <Text className="text-gray-200 ml-2">{exercise.series} séries</Text>
              </View>

              <View className="flex-row items-center">
                <RepetitionsSvg />
                <Text className="text-gray-200 ml-2">{exercise.repetitions} repetições</Text>
              </View>
            </View>

            <Button
              title="Marcar como realizado"
              isLoading={sendingRegister}
              onPress={handleExerciseHistoryRegister}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}