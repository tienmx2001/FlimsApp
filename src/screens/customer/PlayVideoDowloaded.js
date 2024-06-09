import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'
import Header from '../../components/Header';
import Orientation from 'react-native-orientation-locker';

const PlayVideoDowloaded = ({ route }) => {
  const { localUri, id } = route.params;
  const navigation = useNavigation();

  const deleteVideo = async () => {
    try {
      
      await RNFS.unlink(localUri);

      let downloadedMovies = JSON.parse(await AsyncStorage.getItem('downloadedMovies')) || [];
      downloadedMovies = downloadedMovies.filter(movie => movie.id !== id);
      await AsyncStorage.setItem('downloadedMovies', JSON.stringify(downloadedMovies));

      Alert.alert('Success', 'Video deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete video:', error);
      Alert.alert('Error', 'Failed to delete video');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteVideo, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
    <Header login={false} goBack={navigation.goBack} label="Playing Video" />
      <Video
        source={{ uri: localUri }}
        style={styles.video}
        controls
        resizeMode="contain"
        repeat={false}
        onFullscreenPlayerWillPresent={() => {
              Orientation.lockToLandscape();
            }}
        onFullscreenPlayerWillDismiss={() => {
              Orientation.lockToPortrait();
            }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Icon style={styles.deleteButtonText} name='delete' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '92%',
    left: '85%',
    right: 0,
    width:50,
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 23,
   
  },
});

export default PlayVideoDowloaded;
