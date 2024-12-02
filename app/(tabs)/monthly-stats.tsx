import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/api/stravaApi';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import useAuthStore from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { MonthlyStatsCard } from '@/components/MonthlyStatsCard';
import { ActivityCard } from '@/components/ActivityCard';

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
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

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

    const handleMonthPress = (month: string) => {
        setSelectedMonth(month);
    };

    const renderContent = () => {
        if (selectedMonth) {
            const monthData = aggregatedData[selectedMonth];
            return (
                <>
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMonth(null)}>
                        <Ionicons name="arrow-back" size={24} color="#4CAF50" />
                        <Text style={styles.backButtonText}>Back to Monthly Stats</Text>
                    </TouchableOpacity>
                    <Text style={styles.monthHeader}>{dayjs(selectedMonth).format('MMMM YYYY')}</Text>
                    <FlatList
                        data={monthData.activities}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <ActivityCard activity={item} />}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            );
        } else {
            return (
                <FlatList
                    data={months}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <MonthlyStatsCard
                            month={item}
                            data={aggregatedData[item]}
                            onPress={handleMonthPress}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {selectedMonth ? 'Monthly Activities' : 'Monthly Statistics'}
            </Text>
            {renderContent()}
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#4CAF50',
    },
    monthHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#4CAF50',
    },
});

