import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/api/stravaApi';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import useAuthStore from '@/stores/useAuthStore';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface Activity {
    id: number;
    name: string;
    start_date: string;
    distance: number;
    moving_time: number;
    total_elevation_gain: number;
}

interface AggregatedData {
    [month: string]: {
        totalDistance: number;
        totalTime: number;
        totalElevationGain: number;
        activities: Activity[];
    };
}

export default function MonthlyStatsScreen() {
    const router = useRouter();
    const { accessToken, isLoadingTokens, loadTokens } = useAuthStore();

    useEffect(() => {
        loadTokens();
    }, []);

    useEffect(() => {
        if (!isLoadingTokens && !accessToken) {
            router.replace('/');
        }
    }, [accessToken, isLoadingTokens]);

    const { data, error, isLoading, isError } = useQuery<Activity[], Error>({
        queryKey: ['allActivities', accessToken],
        queryFn: fetchActivities,
        enabled: !!accessToken,
    });

    if (isLoadingTokens || isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={50} color="red" />
                <Text style={styles.errorText}>Error loading statistics: {error.message}</Text>
            </View>
        );
    }

    // Process and aggregate activities by month
    const aggregatedData: AggregatedData = {};

    data?.forEach((activity) => {
        const month = dayjs(activity.start_date).format('YYYY-MM');

        if (!aggregatedData[month]) {
            aggregatedData[month] = {
                totalDistance: 0,
                totalTime: 0,
                totalElevationGain: 0,
                activities: [],
            };
        }

        aggregatedData[month].totalDistance += activity.distance;
        aggregatedData[month].totalTime += activity.moving_time;
        aggregatedData[month].totalElevationGain += activity.total_elevation_gain;
        aggregatedData[month].activities.push(activity);
    });

    const months = Object.keys(aggregatedData).sort().reverse();

    const renderMonthItem = ({ item }: { item: string }) => {
        const monthData = aggregatedData[item];
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/activities',
                        params: { month: item },
                    });
                }}
            >
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.monthTitle}>{dayjs(item).format('MMMM YYYY')}</Text>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
                                <Text style={styles.statValue}>{monthData.activities.length}</Text>
                                <Text style={styles.statLabel}>Activities</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="speedometer-outline" size={24} color="#2196F3" />
                                <Text style={styles.statValue}>{(monthData.totalDistance / 1000).toFixed(1)}</Text>
                                <Text style={styles.statLabel}>Total km</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="time-outline" size={24} color="#FFC107" />
                                <Text style={styles.statValue}>{Math.floor(monthData.totalTime / 3600)}</Text>
                                <Text style={styles.statLabel}>Total Hours</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="trending-up-outline" size={24} color="#FF5722" />
                                <Text style={styles.statValue}>{Math.floor(monthData.totalElevationGain)}</Text>
                                <Text style={styles.statLabel}>Total m elevation</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Monthly Statistics</Text>
            <FlatList
                data={months}
                keyExtractor={(item) => item}
                renderItem={renderMonthItem}
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#4CAF50',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    listContainer: {
        padding: 10,
    },
    card: {
        marginBottom: 15,
        elevation: 3,
        borderRadius: 10,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
});
