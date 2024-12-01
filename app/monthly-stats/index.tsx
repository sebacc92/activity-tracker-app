// app/monthly-stats/index.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/api/stravaApi';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import useAuthStore from '@/stores/useAuthStore';

interface Activity {
    id: number;
    name: string;
    start_date: string;
    distance: number;
    moving_time: number;
    total_elevation_gain: number;
    // otros campos si los necesitas
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando tokens...</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Cargando estadísticas...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View>
                <Text>Error al cargar estadísticas: {error.message}</Text>
            </View>
        );
    }

    console.log('data', data)

    // Procesar y agregar actividades por mes
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
                        <View style={{ padding: 10 }}>
                            <Text>{dayjs(item).format('MMMM YYYY')}</Text>
                            <Text>
                                Distancia Total: {(monthData.totalDistance / 1000).toFixed(2)} km
                            </Text>
                            <Text>
                                Tiempo Total: {(monthData.totalTime / 3600).toFixed(2)} horas
                            </Text>
                            <Text>
                                Elevación Total: {monthData.totalElevationGain.toFixed(2)} metros
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}
