import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/loading';


const VideoPlayer = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentVideoTime, setCurrentVideoTime] = useState(0); 

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
    }, [])
  useEffect(() => {
    const unsubscribe = firestore().collection('USERS').doc(firebase.auth().currentUser.email).onSnapshot(doc => {
      if (doc.exists) {
        setUser(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore().collection('movies').doc(route.params.id).onSnapshot(doc => {
      setMovie(doc.data());
    });

    return () => unsubscribe();
  }, [route]);

  useEffect(() => {
    const unsubscribe = firestore().collection('comments').where('movieID', '==', route.params.id).onSnapshot(snapshot => {
      const commentsData = snapshot.docs.map(doc => doc.data());
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [route]);

  useEffect(() => {
    const getRecommendedMovies = async () => {
      if (movie && movie.tags) {
        const tagPromises = movie.tags.map(tag =>
          firestore().collection('movies').where('tags', 'array-contains', tag).get()
        );
        const tagSnapshots = await Promise.all(tagPromises);
        const recommendedMoviesData = [];
        tagSnapshots.forEach(snapshot => {
          snapshot.forEach(doc => {
            if (doc.id !== route.params.id && !recommendedMoviesData.some(movie => movie.id === doc.id)) {
              recommendedMoviesData.push({ id: doc.id, ...doc.data() });
            }
          });
        });
        setRecommendedMovies(recommendedMoviesData);
      }
    };

    getRecommendedMovies();

    return () => {};
  }, [route.params.id, movie]);

  const handleNavigateToMovie = (id) => {
    navigation.navigate('VideoPlayer', { id });
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        movieID: route.params.id,
        userID: firebase.auth().currentUser.email,
        userName: user.name,
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      firestore().collection('comments').add(newComment);
      setComment('');
    }
  };

  const handleVideoPlay = (time) => {
    const movieWatchingRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('movieWatching').doc();
    movieWatchingRef.set({
      movieID: route.params.id,
      currentTime: time,
    });
    setIsPlaying(true); 
  };

  const handleVideoTimeUpdate = (time) => {
    if (isPlaying) {
      setCurrentTime(time); 
      setCurrentVideoTime(time); 
      const movieWatchingRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('movieWatching').doc();
      movieWatchingRef.update({
        currentTime: time,
      });
    }
  };

  const handleVideoEnd = () => {
    const movieWatchedRef = firestore()
      .collection('USERS')
      .doc(firebase.auth().currentUser.email)
      .collection('movieWatched')
      .doc(route.params.id);
  
    movieWatchedRef
      .set({
        movieID: route.params.id,
        movieBanner:movie.banner,
      })
      .then(() => {
        console.log('Movie added to movieWatched collection');
      })
      .catch((error) => {
        console.error('Error adding movie to movieWatched collection:', error);
      });
  };
  const downloadVideo = async () => {
    try {
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${movie.id}`;
      const options = {
        fromUrl: movie.videoURL,
        toFile: downloadDest,
        background: true,
        begin: res => {
          console.log('begin', res);
          console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
        },
        progress: res => {
          let progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log('progress', progressPercent);
        }
      };

      const result = await RNFS.downloadFile(options).promise;
      console.log('Download result:', result);

      if (result.statusCode === 200) {
        // Save the downloaded movie information to AsyncStorage
        const newMovie = {
          id: movie.id,
          title: movie.title,
          backdrops: movie.backdrops,
          localUri: downloadDest
        };

        let downloadedMovies = JSON.parse(await AsyncStorage.getItem('downloadedMovies')) || [];
        downloadedMovies.push(newMovie);
        await AsyncStorage.setItem('downloadedMovies', JSON.stringify(downloadedMovies));

        return downloadDest;
      } else {
        throw new Error('Failed to download video');
      }
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  };


  const [isVideoVisible, setisVideoVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isPlaying) {
        const movieWatchingRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('movieWatching').doc();
        movieWatchingRef.update({
          currentTime: currentVideoTime,
        });
      }
    });

    return unsubscribe;
  }, [navigation, isPlaying, currentVideoTime]);

 

  return !loading ? (
    <>
      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />
      <ScrollView style={styles.container}>
        <Header login={false} goBack={navigation.goBack} label="Video Player" />
        {isVideoVisible ? (
          <Video
            controls
            repeat={false}
            resizeMode="cover"
            style={styles.video}
            source={{
              uri: movie?.videoURL,
            }}
            onFullscreenPlayerWillPresent={() => {
              Orientation.lockToLandscape();
            }}
            onFullscreenPlayerWillDismiss={() => {
              Orientation.lockToPortrait();
            }}
            onPlaybackResume={(e) => handleVideoPlay(e.currentTime)}
            onProgress={(e) => handleVideoTimeUpdate(e.currentTime)}
            onEnd={handleVideoEnd}
            onPause={() => setIsPlaying(false)} 
          />
        ) : (
          <Image
            style={styles.video}
            source={{
              uri: movie?.backdrops,
            }}
          />
        )}

        <Text style={styles.title}>{movie?.title}</Text>
        <View style={styles.movieSubDetails}>
          <Text style={styles.movieBadge}>13+</Text>
          <Text style={styles.subtitle}>{movie?.yearOfRelease}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.play} activeOpacity={0.5} onPress={() => {
            setisVideoVisible(true);
          }}>
            <Ionicons name='play' size={26} color='white' />
            <Text style={styles.textButtonPlay}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.download} activeOpacity={0.5} onPress={downloadVideo}>
            <Feather name='download' size={24} style={styles.iconWhite} />
            <Text style={styles.textButtonDownload}>Download</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.movieDescription}>
          {movie?.description}
        </Text>
        <View style={styles.tags}>
          {movie?.tags.map((tag, i) => (
            <View style={styles.tagWrapper} key={i}>
              <Text style={styles.tag}>{tag}</Text>
              {i + 1 < movie?.tags.length && <View style={styles.tagDot} />}
            </View>
          ))}
        </View>
        <View style={styles.actionButtons2}>
          {movie && user?.list?.includes(movie.id) ? (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.5}
              onPress={() => {
                firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('myList').doc(movie.id).delete();
                const list = user.list.filter(id => id !== movie.id);
                firestore().collection('USERS').doc(firebase.auth().currentUser.email).update({ list });
              }}
            >
              <Feather name="check" size={35} color="white" />
              <Text style={styles.actionButtonLabel}>My List</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.5}
              onPress={() => {
                firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('myList').doc(movie.id).set({
                  movieID: movie.id,
                  banner: movie.banner
                });
                const list = [...user.list, movie.id];
                firestore().collection('USERS').doc(firebase.auth().currentUser.email).update({ list });
              }}
            >
              <Ionicons name="add-outline" size={40} color="white" />
              <Text style={styles.actionButtonLabel}>My List</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.5}>
            <AntDesign name="like2" size={35} color="white" style={styles.marginBottom7} />
            <Text style={styles.actionButtonLabel}>Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.5}>
            <AntDesign name="sharealt" size={30} color="white" style={styles.marginBottom7} />
            <Text style={styles.actionButtonLabel}>Share</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recommendedMoviesContainer}>
          <Text style={styles.recommendedTitle}>Recommended</Text>
          <ScrollView horizontal>
            {recommendedMovies.map((movie, index) => (
              <TouchableOpacity key={index} onPress={() => handleNavigateToMovie(movie.id)}>
                <Image source={{ uri: movie.backdrops }} style={styles.recommendedMovieBanner} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.commentsTask} onPress={() => setModalVisible(true)}>
          <Text style={styles.commentsTaskText}>Comments ({comments.length})</Text>
          <AntDesign name="caretup" size={20} color="white" />
        </TouchableOpacity>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <AntDesign name="caretdown" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.commentTitle}>Comments</Text>
            <ScrollView style={styles.commentsContainer}>
              {comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <View style={styles.commentUserandTime}>
                    <Text style={styles.commentUser}>{comment.userName}</Text>
                    <View style={styles.dotUserAndTime}/>
                    <Text style={styles.commentTimestamp}>
                      {comment.timestamp ? moment(comment.timestamp.toDate()).fromNow() : ''}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.AddCommentView}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity style={styles.buttonSubmitComment}  onPress={handleCommentSubmit}>
                <Ionicons name="send" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
      </ScrollView>
    </>
  ) : (
    <Loading/>
  );
}

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    height: responsiveHeight(30)
  },
  title: {
    color: 'white',
    fontSize: 24,
    margin: 10,
    fontWeight: 'bold',
  },
  movieSubDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -17,
  },
  movieBadge: {
    color: 'white',
    backgroundColor: '#c44031',
    padding: 2,
    borderRadius: 5,
    width: 38,
    textAlign: 'center',
    margin: 10,
  },
  subtitle: {
    color: '#a2a2a2',
    margin: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:5,
    marginRight:5
  },
  play: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 5,
    justifyContent:'center'
  },
  textButtonPlay: {
    color: 'white',
    marginLeft: 10,
    fontSize: responsiveFontSize(2.2),
  
  },
  download: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginLeft: 5,
    justifyContent:'center'
  },
  textButtonDownload: {
    color: 'white',
    marginLeft: 10,
    fontSize: responsiveFontSize(2.2),
  },
  movieDescription: {
    color: 'white',
    width: '98%',
    marginLeft: 10,
    margin: 10,
    lineHeight: 20,
    marginTop: 25,
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '99%',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    color: '#fff',
  },
  tagDot: {
    margin: 10,
    backgroundColor: 'white',
    height: 2,
    width: 2,
  },
  actionButtons2: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin:10,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:30
  },
  actionButtonLabel: {
    color: 'white',
    fontSize: 15,
  },
  iconWhite: {
    color: 'white',
    margin: 4,
  },
  marginBottom7: {
    marginBottom: 7,
  },
  commentsTask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    margin: 10,
  },
  commentsTaskText: {
   
    color: 'white',
    fontSize: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  commentsContainer: {
    marginBottom: 20,
  
  },
  commentTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor:'#1c1c1c',
    padding:10,
    margin:15,
    borderRadius:20,
  },
  commentUserandTime:{
    flexDirection:'row',
    alignItems:'center',
  },
  commentTimestamp: {
    color: '#a2a2a2',
    fontSize: 12,
    marginVertical: 5,
    marginLeft:5
  },
  commentUser: {  
    color: 'white',
    fontWeight: '900',
    paddingLeft:10
  },
  commentText: {
    color: 'white',
    fontWeight: '300',
    paddingLeft:10
  },
  dotUserAndTime:{
    backgroundColor:'#a2a2a2',
    width:3,
    height:3,
    borderRadius:10,
    marginLeft:5
  },
  AddCommentView:{
    flexDirection:'row',
    alignItems:'center',
  },
  commentInput: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 10,
    marginBottom: 10,
    width:340,
    marginRight:10,
  },
  buttonSubmitComment:{
    marginBottom: 10,
  },
  recommendedMoviesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  recommendedTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor:'#1c1c1c',
    width:160,
    padding:10,
    borderRadius:20
  },
  recommendedMovieBanner: {
    width: 180,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  recommendedMovieTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});
