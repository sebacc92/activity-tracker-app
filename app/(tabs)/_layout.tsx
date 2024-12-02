import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: '#4CAF50', 
            headerShown: false,
            tabBarStyle: { backgroundColor: '#f5f5f5' }
        }}>
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Activities',
                    tabBarIcon: ({ color, size }) => <Ionicons name="fitness-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="monthly-stats"
                options={{
                    title: 'Monthly Stats',
                    tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'My Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}