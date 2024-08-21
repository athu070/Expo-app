import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/context/AuthContext';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter, Redirect, useNavigation } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

type IconName = "home" | "person" | "settings" | "newspaper" | "home-outline" | "person-outline" | "settings-outline" | "newspaper-outline"; 

function assertIsIconName(iconName: string): asserts iconName is IconName {
  const validIconNames: IconName[] = ["home", "person", "settings", "newspaper", "home-outline", "person-outline", "settings-outline", "newspaper-outline"]; 
  if (!validIconNames.includes(iconName as IconName)) {
    throw new Error(`Invalid icon name: ${iconName}`);
  }
}

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerLeft: () => <DrawerToggleButton />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home'; 

          if (route.name === 'notification') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'news') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else {
            iconName = 'home-outline';
          }

          assertIsIconName(iconName); 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red', 
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white', 
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: 'red', 
        },
        headerTintColor: 'white',
      })}
    >
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          headerShown: true,

        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
