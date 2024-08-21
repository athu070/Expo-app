import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { getValueFromStorage } from '../../../../src/utils/storage-utils';
import { NotificationItem } from '../../../../src/utils/types';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image_url: string;
    date: string;
    image1: string;
    image2: string;
    image3: string;
}


export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NotificationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotificationDetails();
  }, [id]);

  const fetchNotificationDetails = async () => {
    //console.log('Fetching notifications for id:', id);
    setIsLoading(true);
    setError('');
    try {
      const AUTHORIZATION_TOKEN = await getValueFromStorage('userToken');
      //console.log('Authorization Token:', AUTHORIZATION_TOKEN); 

      const response = await axios.get('https://apiqa2.uniqueschoolapp.ie/v5/api/fetchnotifications', {
        params: {
          timestamp: 0,
          previous_time_stamp: 0,
          api_version: 'api_version',
          category: '',
        },
        headers: {
          'Authorization': 'Bearer ' + AUTHORIZATION_TOKEN,
        },
      });

      //console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (response.data.code === 200 && response.data.data && response.data.data.newsData) {
        const newsData = response.data.data.newsData;
        const selectedNews = newsData.find((item: NewsItem) => item.id === id);
        if (selectedNews) {
          setNews(selectedNews);
        } else {
          setError('Notification not found');
        }
      } else {
        setError('Error fetching notification details: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (axios.isAxiosError(err)) {
        console.error('Error response:', err.response?.data);
        setError(`Error fetching notification details: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      } else {
        setError('Error fetching notification details: ' + ((err instanceof Error) ? err.message : 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

 // console.log('Render state:', { isLoading, error, notification });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading notification details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.container}>
        <Text>No notification data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.description}>{news.description}</Text>
      <View style={styles.imageContainer}>
        {news.image1 && (
          <Image source={{ uri: news.image1 }} style={styles.image} />
        )}
        {news.image2 && (
          <Image source={{ uri: news.image2 }} style={styles.image} />
        )}
        {news.image3 && (
          <Image source={{ uri: news.image3 }} style={styles.image} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});
