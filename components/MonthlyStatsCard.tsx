import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface Activity {
    id: number;
    name: string;
    start_date: string;
    distance: number;
    moving_time: number;
    total_elevation_gain: number;
}

interface MonthlyData {
    month: string;
    data: {
        totalDistance: number;
        totalTime: number;
        totalElevationGain: number;
        activities: Activity[];
    };
    onPress: (month: string) => void;
}

export const MonthlyStatsCard: React.FC<MonthlyData> = ({ month, data, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(month)}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.monthTitle}>{dayjs(month).format('MMMM YYYY')}</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
                            <Text style={styles.statValue}>{data.activities.length}</Text>
                            <Text style={styles.statLabel}>Activities</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="speedometer-outline" size={24} color="#2196F3" />
                            <Text style={styles.statValue}>{(data.totalDistance / 1000).toFixed(1)}</Text>
                            <Text style={styles.statLabel}>Total km</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={24} color="#FFC107" />
                            <Text style={styles.statValue}>{Math.floor(data.totalTime / 3600)}</Text>
                            <Text style={styles.statLabel}>Total Hours</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="trending-up-outline" size={24} color="#FF5722" />
                            <Text style={styles.statValue}>{Math.floor(data.totalElevationGain)}</Text>
                            <Text style={styles.statLabel}>Total m elevation</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
