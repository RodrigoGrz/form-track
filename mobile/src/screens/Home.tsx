import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Alert } from 'react-native';

import { api } from '@/services/api';
import { AppError } from '@/utils/AppError';
import { AppNavigatorRoutesProps } from '@/routes/app.routes';

import { Group } from '@/components/Group';
import { HomeHeader } from '@/components/HomeHeader';
import { Loading } from '@/components/Loading';
import { ExerciseCard } from '@/components/ExerciseCard';
import { ExerciseDTO } from '@/dtos/ExerciseDTO';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.';

      Alert.alert('Erro', title);
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios.';

      Alert.alert('Erro', title);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExerciseByGroup();
    }, [groupSelected])
  );

  return (
    <View className="flex-1">
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toUpperCase() === item.toUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 40, minHeight: 40 }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 px-8">
          <View className="flex-row justify-between mb-5">
            <Text className="text-gray-200 text-base font-bold">
              Exercicios
            </Text>

            <Text className="text-gray-200 text-sm">
              {exercises.length}
            </Text>
          </View>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() =>
                  handleOpenExerciseDetails(item.id)
                }
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
    </View>
  );
}