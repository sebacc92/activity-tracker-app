import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAthleteProfile } from '@/api/stravaApi';
import useAuthStore from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';

interface AthleteProfile {
    id: number;
    username: string | null;
    firstname: string;
    lastname: string;
    bio: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    profile: string;
    weight: number | null;
    sex: string | null;
    created_at: string;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { accessToken, isLoadingTokens, loadTokens, logout } = useAuthStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    useEffect(() => {
        loadTokens();
    }, []);

    useEffect(() => {
        if (!isLoadingTokens && !accessToken) {
            router.replace('/');
        }
    }, [accessToken, isLoadingTokens]);

    const { data: profile, isLoading, isError, error } = useQuery<AthleteProfile, Error>({
        queryKey: ['athleteProfile', accessToken],
        queryFn: fetchAthleteProfile,
        enabled: !!accessToken,
    });

    const showLogoutConfirmationDialog = () => {
        setShowLogoutConfirmation(true);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        setShowLogoutConfirmation(false);
        router.replace('/');
    };

    if (isLoadingTokens || isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="fitness" size={50} color="#4CAF50" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={50} color="red" />
                <Text style={styles.errorText}>Error loading profile: {error.message}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: profile?.profile || 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{`${profile?.firstname} ${profile?.lastname}`}</Text>
                {profile?.username && <Text style={styles.username}>@{profile.username}</Text>}
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    {profile?.bio && (
                        <View style={styles.infoRow}>
                            <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
                            <Text style={styles.infoText}>{profile.bio}</Text>
                        </View>
                    )}
                    {(profile?.city || profile?.state || profile?.country) && (
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={24} color="#4CAF50" />
                            <Text style={styles.infoText}>
                                {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    )}
                    {profile?.weight && (
                        <View style={styles.infoRow}>
                            <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
                            <Text style={styles.infoText}>{`Weight: ${profile.weight.toFixed(1)} kg`}</Text>
                        </View>
                    )}
                    {profile?.sex && (
                        <View style={styles.infoRow}>
                            <Ionicons name="person-outline" size={24} color="#4CAF50" />
                            <Text style={styles.infoText}>{`Gender: ${profile.sex === 'M' ? 'Male' : 'Female'}`}</Text>
                        </View>
                    )}
                    {profile?.created_at && (
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                            <Text style={styles.infoText}>{`Member since: ${new Date(profile.created_at).toLocaleDateString()}`}</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <TouchableOpacity style={styles.logoutButton} onPress={showLogoutConfirmationDialog} disabled={isLoggingOut}>
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>

            {showLogoutConfirmation && (
                <View style={styles.confirmationOverlay}>
                    <View style={styles.confirmationDialog}>
                        <Text style={styles.confirmationText}>Are you sure you want to log out?</Text>
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLogoutConfirmation(false)}>
                                <Text style={styles.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
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
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#4CAF50',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        marginTop: 20,
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#4CAF50',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    username: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    card: {
        margin: 10,
        elevation: 3,
        borderRadius: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
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
    confirmationOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationDialog: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    confirmationText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    confirmButton: {
        backgroundColor: '#FF5722',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

