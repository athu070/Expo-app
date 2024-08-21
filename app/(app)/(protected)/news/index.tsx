import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { getValueFromStorage } from '../../../../src/utils/storage-utils';


const API_URL = 'https://apiqa2.uniqueschoolapp.ie/v5/api/fetchnotifications?timestamp=0&previous_time_stamp=0&api_version=%20api_version&category=';

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

 export default function NewsScreen() {
    const [data, setData] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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

      const renderImage = (imageUrl: string) => {
        if (imageUrl) {
          return (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          );
        }
        return null;
      };
    
      const renderItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity 
          style={styles.itemContainer}
          onPress={() => router.push({
            pathname: `/news/${item.id}`,
            params: { news: JSON.stringify(item) }
          })}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <View style={styles.imageContainer}>
            {renderImage(item.image1)}
          </View>
        </TouchableOpacity>
      );

      return (
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {isLoading ? (
                  <Text style={styles.emptyText}>Loading...</Text>
                ) : (
                  <Text style={styles.emptyText}>{error || 'No news notifications available.'}</Text>
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
      marginBottom: 8,
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginBottom: 8,
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
