import { Tabs } from 'expo-router';
import { Icon } from '@/components/Icon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Icon name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          title: 'Achievements',
          tabBarIcon: ({ color }) => <Icon name="diamond" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="slot"
        options={{
          title: 'Slots',
          tabBarIcon: ({ color }) => <Icon name="toy" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="menu" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
