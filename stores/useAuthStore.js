import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
    accessToken: null,
    refreshToken: null,
    isLoadingTokens: true,
    expiresAt: null,

    // Load tokens from persistent storage when the application starts
    loadTokens: async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const expiresAt = await AsyncStorage.getItem('expiresAt');

            if (accessToken && refreshToken && expiresAt) {
                set({
                    accessToken,
                    refreshToken,
                    expiresAt: parseInt(expiresAt, 10)
                });
            }
        } catch (error) {
            console.error('Error al cargar los tokens:', error);
        } finally {
            set({ isLoadingTokens: false });
        }
    },

    // Save tokens to the state and persistent storage
    setTokens: async ({ accessToken, refreshToken, expiresAt }) => {
        try {
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('expiresAt', expiresAt.toString());
            set({ accessToken, refreshToken, expiresAt });
        } catch (error) {
            console.error('Error al guardar los tokens:', error);
        }
    },

    // Clear tokens from state and persistent storage
    logout: async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('expiresAt');
            set({ accessToken: null, refreshToken: null, expiresAt: null });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    },
}));

export default useAuthStore;
