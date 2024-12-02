import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchActivities } from '@/api/stravaApi';
import useAuthStore from '@/stores/useAuthStore';
import useActivitiesStore from '@/stores/useActivitiesStore';
import { Ionicons } from '@expo/vector-icons';
import { getDateRange } from '@/utils/dateUtils';
import { ActivityCard } from '@/components/ActivityCard';

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
  const { activities, setActivities } = useActivitiesStore();
  const { month } = useLocalSearchParams();

  const { after, before } = useMemo(() => getDateRange(month), [month]);

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

  if (isLoadingTokens || isLoadingActivities) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>Error loading activities: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Last 4 weeks</Text>
        <Text style={styles.activityCount}>{activities.length}</Text>
        <Text style={styles.caption}>Total activities</Text>
      </View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  activityCount: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 16,
    color: 'white',
  },
  listContainer: {
    padding: 10,
  }
});

