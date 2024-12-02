// app/(authenticated)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
            <Tabs.Screen
                name="activities"
                options={{
                    title: 'Recent Activities',
                    tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="monthly-stats"
                options={{
                    title: 'Monthly Stats',
                    tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
