import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const DownloadedVideos = () => {
  const [videos, setVideos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadDownloadedVideos = async () => {
      try {
        const downloadedMovies = JSON.parse(await AsyncStorage.getItem('downloadedMovies')) || [];
        setVideos(downloadedMovies);
      } catch (error) {
        console.error('Failed to load downloaded videos:', error);
      }
    };

    loadDownloadedVideos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PlayVideoDowloaded', { id: item.id, localUri: item.localUri })}>
      <View style={styles.videoItem}>
        <Image source={{ uri: item.backdrops }} style={styles.thumbnail} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <Header login={false} goBack={navigation.goBack} label="Downloaded Videos" />
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',

  },
  list: {
    paddingHorizontal: 20,
  },
  videoItem: {
    marginBottom: 20,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});

export default DownloadedVideos;
