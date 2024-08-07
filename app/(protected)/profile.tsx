import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };
  
  return (
    <View style={styles.container}>
      {user && user.profile_image && (
        <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
      )}
      <Text style={styles.title}>Welcome, {user ? `${user.first_name} ${user.last_name}` : 'User'}!</Text>
      <Text style={styles.subtitle}>You are now logged in!</Text>
      
      {user && user.user_type && user.user_type.length > 0 && (
        <Text style={styles.roleText}>
          Role(s): {user.user_type.map(type => type.name).join(', ')}
        </Text>
      )}
      
      {user && user.child_data && user.child_data.length > 0 && (
        <View style={styles.childrenContainer}>
          <Text style={styles.childrenTitle}>Children:</Text>
          {user.child_data.map(child => (
            <Text key={child.id} style={styles.childText}>
              {child.child_firstname} {child.child_lastname} - Class: {child.class}
            </Text>
          ))}
        </View>
      )}
       <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  roleText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#444',
  },
  childrenContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  childrenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  childText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
