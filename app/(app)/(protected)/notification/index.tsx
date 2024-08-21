import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getValueFromStorage } from '../../../../src/utils/storage-utils';
import { useRouter } from 'expo-router';

const API_URL = 'https://apiqa2.uniqueschoolapp.ie/v5/api/fetchnotifications?timestamp=0&previous_time_stamp=0&api_version=%20api_version&category=';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  image1: string;
  image2: string;
  image3: string;
}

interface CategoryItem {
  id: string;
  title: string;
  sort_order: string;
}

export default function HomeScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
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
        setNotifications(response.data.data.notificationData || []);
        setCategories(response.data.data.category || []);
      } else {
        setError('Error fetching data: ' + (response.data.message || 'Unknown error'));
        setNotifications([]);
        setCategories([]);
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
      setNotifications([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderThumbnail = (imageUrl: string) => {
    if (imageUrl && imageUrl.trim() !== '') {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      );
    }
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => onNotificationPress(item.id)}
    >
      {renderThumbnail(item.image1)}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const onNotificationPress = (id: string) => {
    console.log('id >>', id)
    router.push({
    pathname: `/notification/${id}`,
  })}

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={()=>onNotificationPress(item.id)}
    >
      {renderThumbnail(item.image1)}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderThumbnail: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  categoriesList: {
    marginBottom: 10,
    marginTop: 10,
  },
  categoryItem: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});