// app/monthly-stats/index.tsx
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
import { Card, Title, Paragraph } from 'react-native-paper';

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

    if (isLoadingTokens) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading tokens...</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading statistics...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error loading statistics: {error.message}</Text>
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

    return (
        <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
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
                                <Title>{dayjs(item).format('MMMM YYYY')}</Title>
                                <Paragraph>
                                    Total Distance: {(monthData.totalDistance / 1000).toFixed(2)} km
                                </Paragraph>
                                <Paragraph>
                                    Total Time: {(monthData.totalTime / 3600).toFixed(2)} hours
                                </Paragraph>
                                <Paragraph>
                                    Total Elevation Gain: {monthData.totalElevationGain.toFixed(2)} meters
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        margin: 10,
    },
});
