// app/activities/index.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import useAuthStore from '@/stores/useAuthStore';
import { fetchActivities } from '@/api/stravaApi';

interface Activity {
  id: number;
  name: string;
  start_date: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
}

export default function Activities() {
  const router = useRouter();
  const { accessToken, isLoadingTokens, loadTokens } = useAuthStore();
  console.log('accessToken', accessToken)

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (!isLoadingTokens && !accessToken) {
      router.replace('/');
    }
  }, [accessToken, isLoadingTokens]);

  const { data, error, isLoading: isLoadingActivities, isError } = useQuery<Activity[], Error>({
    queryKey: ['activities', accessToken],
    queryFn: fetchActivities,
    enabled: !!accessToken,
  });

  if (isLoadingTokens) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tokens...</Text>
      </View>
    );
  }

  if (isLoadingActivities) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando actividades...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error al cargar actividades: {error.message}</Text>
      </View>
    );
  }

  const activities = data;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>Nombre: {item.name}</Text>
            <Text>
              Fecha: {new Date(item.start_date).toLocaleDateString()}
            </Text>
            <Text>Distancia: {(item.distance / 1000).toFixed(2)} km</Text>
            <Text>Tiempo: {(item.moving_time / 60).toFixed(2)} min</Text>
            <Text>
              Elevación: {item.total_elevation_gain.toFixed(2)} metros
            </Text>
          </View>
        )}
      />
    </View>
  );
}
