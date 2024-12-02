import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchActivities } from '@/api/stravaApi';
import { Card } from 'react-native-paper';
import dayjs from 'dayjs';
import useAuthStore from '@/stores/useAuthStore';
import useActivitiesStore from '@/stores/useActivitiesStore';
import { Ionicons } from '@expo/vector-icons';

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
  } else {
    after = dayjs().subtract(4, 'weeks').unix();
    before = dayjs().unix();
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

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
          <Text style={styles.activityName}>{item.name}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{dayjs(item.start_date).format('DD MMM YYYY')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="speedometer-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{(item.distance / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{Math.floor(item.moving_time / 60)} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="trending-up-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.total_elevation_gain.toFixed(0)} m</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

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
        renderItem={renderActivityItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          router.replace('/');
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
  },
  card: {
    marginBottom: 10,
    elevation: 3,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

