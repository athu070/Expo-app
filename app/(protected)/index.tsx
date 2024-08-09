import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { getValueFromStorage } from '../../src/utils/storage-utils';

const API_URL = 'https://apiqa2.uniqueschoolapp.ie/v5/api/fetchnotifications?timestamp=0&previous_time_stamp=0&api_version=%20api_version&category=';


interface NotificationItem {
  id: string;
  title: string;
  description: string;
}

export default function HomeScreen() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const AUTHORIZATION_TOKEN = await getValueFromStorage('userToken');
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': 'Bearer ' + AUTHORIZATION_TOKEN,
        },
      });
      if (response.data.code === 200 && response.data.data && response.data.data.notificationData) {
        setData(response.data.data.notificationData);
      } else {
        setError('Error fetching data: ' + (response.data.message || 'Unknown error'));
        setData([]);
      }
    } catch (err) {
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Error fetching data: Unauthorized user';
        } else {
          errorMessage = 'Error fetching data: ' + (err.message || 'Unknown error');
        }
      }
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <Text style={styles.emptyText}>Loading...</Text>
            ) : (
              <Text style={styles.emptyText}>{error || 'No notifications available.'}</Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});
