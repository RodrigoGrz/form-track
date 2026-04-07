import { useCallback, useState } from 'react';
import { SectionList, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryByDayDTO } from '@/dtos/HistoryByDayDTO';
import { api } from '@/services/api';

import { ScreenHeader } from '@/components/ScreenHeader';
import { HistoryCard } from '@/components/HistoryCard';
import { Loading } from '@/components/Loading';
import { AppError } from '@/utils/AppError';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get('/history');
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.';
      alert(title);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []));

  return (
    <View className="flex-1 bg-gray-700">
      <ScreenHeader title="Histórico de Exercício" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-gray-200 text-md mt-10 mb-3 font-bold">
              {title}
            </Text>
          )}
          contentContainerStyle={
            exercises.length === 0
              ? { flex: 1, justifyContent: 'center', paddingHorizontal: 16 }
              : { paddingHorizontal: 16 }
          }
          ListEmptyComponent={() => (
            <Text className="text-gray-100 text-center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}