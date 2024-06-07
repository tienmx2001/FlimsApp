import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal, Platform, PermissionsAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import { Button,IconButton } from 'react-native-paper'

const MovieDetails = ({ route }) => {
  const [movie, setMovie] = useState(null);
  // const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [yearOfRelease, setYearOfRelease] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const tagOptions = [
    'Comedy', 'Drama', 'Romantic', 'Action', 'Supernatural',
    'Science Fiction', 'Cartoon', 'Detective Fiction', 'Teenager'
  ];

  useEffect(() => {
    const unsubscribe = firestore().collection('movies').doc(route.params.id).onSnapshot(doc => {
      const data = doc.data();
      setMovie(data);
      setTitle(data.title);
      setBanner(data.banner);
      setDescription(data.description);
      setTags(data.tags);
      setVideoURL(data.videoURL);
      setYearOfRelease(data.yearOfRelease);
    });

    return () => unsubscribe();
  }, [route]);

  const uploadFile = async (filePath, fileName, folder, onProgress) => {
    try {
      const reference = storage().ref(`${folder}/${fileName}`);
      const uploadUri = Platform.OS === 'ios' ? filePath.replace('file://', '') : filePath;
      const uploadTask = reference.putFile(uploadUri);

      uploadTask.on('state_changed', taskSnapshot => {
        const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      });

      await uploadTask;
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  const requestStoragePermission = async () => {
    try {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to select photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setBanner(image.path); 
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      const uri = result[0].uri.replace('file://', '');
      console.log('Selected video URI:', uri); // Debug log
      setVideoURL(uri);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled video picker');
      } else {
        console.error('Error picking video:', error);
      }
    }
  };

  const handleUpdateMovie = async () => {
    if (tags.length !== 3) {
      alert('Please select exactly 3 tags.');
      return;
    }

    try {
      setLoading(true);

      const bannerURL = banner.startsWith('http') ? banner : await uploadFile(banner, `banner_${route.params.id}.jpg`, 'images');
      const videoDownloadURL = videoURL.startsWith('http') ? videoURL : await uploadFile(videoURL, `video_${route.params.id}.mp4`, 'videos');

      await firestore().collection('movies').doc(route.params.id).update({
        title,
        banner: bannerURL,
        description,
        tags,
        videoURL: videoDownloadURL,
        yearOfRelease
      });

      setLoading(false);
      alert('Movie updated successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error updating movie:', error);
      alert('Failed to update movie.');
    }
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    } else {
      alert('You can only select 3 tags.');
    }
  };

  const handleDeleteMovie = () => {
    Alert.alert(
      "Delete Movie",
      "Are you sure you want to delete this?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await firestore().collection('movies').doc(route.params.id).delete();
              navigation.goBack();
              alert('Movie deleted successfully!');
              
            } catch (error) {
              console.error('Error deleting movie:', error);
              alert('Failed to delete movie.');
            }
          }
        }
      ]
    );
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {banner ? (
          <Image source={{ uri: banner }} style={styles.banner} />
        ) : (
          <Text style={styles.placeholderText}>No Banner</Text>
        )}
        <Button title="Upload Banner" onPress={pickImage} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>
      <View style={styles.tagContainer}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagsWrapper}>
          {tagOptions.map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[styles.tag, { backgroundColor: tags.includes(tag) ? 'green' : 'white' }]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Year of Release</Text>
        <TextInput
          style={styles.input}
          value={yearOfRelease}
          onChangeText={setYearOfRelease}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.videoContainer}>
        <Text style={styles.label}>Video</Text>
        {videoURL ? (
          <Text style={styles.videoText}>{videoURL}</Text>
        ) : (
          <Text style={styles.placeholderText}>No Video</Text>
        )}
        <Button 
        
        style={styles.buttonUpLoad} onPress={pickVideo} 
        icon={() => (
                    <IconButton
                    icon="upload"
                    color="white"
                    size={20}
                    />
                )}>
                Upload Video</Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button
         
        style={styles.button} onPress={handleDeleteMovie} 
        icon={() => (
                    <IconButton
                    icon="delete"
                    color="white"
                    size={20}
                    />
                )}>
                Delete Movie</Button>
        <Button 
        style={styles.button} onPress={handleUpdateMovie}
        icon={() => (
                    <IconButton
                    icon="content-save"
                    color="white"
                    size={20}
                    />
                )}>
                Update Movie</Button>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Updating...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#fff',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    color:'#fff'
  },
  tagContainer: {
    marginBottom: 20,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
   
  },
  tagText: {
    color: '#000',
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoText: {
    color: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button:{
    margin:10,
    backgroundColor:'orange',
  },
  buttonUpLoad:{
    backgroundColor:'orange',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetails;
