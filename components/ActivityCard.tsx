// components/ActivityCard.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
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

interface ActivityCardProps {
    activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
                    <Text style={styles.activityName}>{activity.name}</Text>
                </View>
                <View style={styles.cardBody}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{dayjs(activity.start_date).format('DD MMM YYYY')}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="speedometer-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{(activity.distance / 1000).toFixed(2)} km</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{Math.floor(activity.moving_time / 60)} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="trending-up-outline" size={16} color="#666" />
                        <Text style={styles.infoText}>{activity.total_elevation_gain.toFixed(0)} m</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

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

