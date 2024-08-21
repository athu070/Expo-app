import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useAuth } from '../../src/context/AuthContext';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer>
      <Drawer.Screen
        name="(protected)"
        options={{ headerShown: false, drawerLabel: "Home" }}
      />
      <Drawer.Screen
        name="about"
        options={{ 
          headerTitle: "About",
          drawerLabel: "About"
        }}
      />
      <Drawer.Screen
        name="contact"
        options={{ 
          headerTitle: "Contact",
          drawerLabel: "Contact"
        }}
      />
    </Drawer>
  );
}