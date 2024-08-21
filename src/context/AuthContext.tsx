import React, { createContext, useContext, useState, useEffect } from 'react';
import { Text } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { getValueFromStorage, removeValuefromStorage, setValueInStorage } from '../utils/storage-utils';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  user_type: Array<{ id: string; name: string }>;
  contact_no: string;
  country_code: string;
  profile_image: string;
  child_data: Array<{
    id: string;
    child_firstname: string;
    child_lastname: string;
    year_id: string;
    year: string;
    class_id: string;
    class: string;
    student_id: string;
  }>;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getValueFromStorage('userToken');
        const userData = await getValueFromStorage('userData');
        if (token && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('https://apiqa2.uniqueschoolapp.ie/v5/api/login?api_version=5&school_id=2&app_version=1.0.3&device_manufacturer=OnePlus&device_model=HD1901&device_os_name=android&device_os_version=12&device_os_type=64bit&device_type=PHONE&email=ayushtester%40yopmail.com&password=12345678', {
        api_version: '5',
        school_id: '2',
        app_version: '1.0.3',
        email: email,
        password: password
      });

      if (response.data.code === 200 && response.data.data.access_token) {
        await setValueInStorage('userToken', response.data.data.access_token);
        await setValueInStorage('userData', JSON.stringify(response.data.data.user));
        setIsLoggedIn(true);
        setUser(response.data.data.user); 
        router.replace('/(protected)/notification');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeValuefromStorage('userToken');
      await removeValuefromStorage('userData');
      setIsLoggedIn(false);
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};