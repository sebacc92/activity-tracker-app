// app/activities/index.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchActivities } from '@/api/stravaApi';
import { Card, Title, Paragraph } from 'react-native-paper';
import dayjs from 'dayjs';
import useAuthStore from '@/stores/useAuthStore';
import useActivitiesStore from '@/stores/useActivitiesStore';

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
  const { accessToken, isLoadingTokens, loadTokens, logout } = useAuthStore();
  const { activities, setActivities } = useActivitiesStore();

  const { month } = useLocalSearchParams();

  let after = undefined;
  let before = undefined;

  if (month) {
    const startOfMonth = dayjs(month as string).startOf('month').unix();
    const endOfMonth = dayjs(month as string).endOf('month').unix();

    after = startOfMonth;
    before = endOfMonth;
  }

  const { data, error, isLoading: isLoadingActivities, isError } = useQuery<Activity[], Error>({
    queryKey: ['activities', accessToken, { after, before }],
    queryFn: fetchActivities,
    enabled: !!accessToken,
  });

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (!isLoadingTokens && !accessToken) {
      router.replace('/');
    }
  }, [accessToken, isLoadingTokens]);

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  if (isLoadingTokens) {
    return (
      <View>
        <Text>Cargando tokens...</Text>
      </View>
    );
  }

  if (isLoadingActivities) {
    return (
      <View>
        <Text>Cargando actividades...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error al cargar actividades: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Cerrar Sesión" onPress={() => {
        logout();
        router.replace('/');
      }} />
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 10 }}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>Fecha: {new Date(item.start_date).toLocaleDateString()}</Paragraph>
              <Paragraph>Distancia: {(item.distance / 1000).toFixed(2)} km</Paragraph>
              <Paragraph>Tiempo: {(item.moving_time / 60).toFixed(2)} min</Paragraph>
              <Paragraph>Elevación: {item.total_elevation_gain.toFixed(2)} metros</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});