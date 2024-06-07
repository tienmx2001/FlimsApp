import {
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { Button } from 'react-native-paper';
import HeaderMenu from './HeaderMenu'; 
import Header from './Header';

const Home_Banner = ({ navigation }) => {
  const [upcomingApiData, setupcomingApiData] = useState([]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = await firestore().collection('movies').get();
        const movies = moviesCollection.docs.map(doc => doc.data());
        setupcomingApiData(movies);
      } catch (error) {
        Alert.alert(`Request failed: ${error.message}`);
      }
    };
    fetchMovies();
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDocRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email);

    const unsubscribe = userDocRef.onSnapshot(doc => {
        if (doc.exists) {
            const userData = doc.data();
            if (!userData.list) {
                userDocRef.update({ list: [] });
                userData.list = [];
            }
            setUser(userData);
        }
    },[firebase.auth().currentUser]);

    return () => unsubscribe();
  }, []);

  const handleMyListToggle = async (item) => {
    const userDoc = firestore().collection('USERS').doc(firebase.auth().currentUser.email);
    const movieInList = user?.list?.includes(item.id);
    console.log("Movie in list:", movieInList);
    if (movieInList) {
      await userDoc.collection('myList').doc(item.id).delete();
      const updatedList = user.list.filter(movieId => movieId !== item.id);
      await userDoc.update({ list: updatedList });
    } else {
      await userDoc.collection('myList').doc(item.id).set({
        movieID: item.id,
        banner: item.banner,
      });
      const updatedList = [...user.list, item.id];
      await userDoc.update({ list: updatedList });
    }
  };

  const renderMovieBanner = ({ item }) => (
    <View style={styles.viewContainer}>
        <ImageBackground
          style={styles.movieBanner}
          resizeMode="cover"
          source={{ uri: item.banner }}
        >
          <View>
          <Header login={true}  />
          <HeaderMenu />
          </View>
        
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.7)']}
            style={styles.linearContainer}
          >
          <View style={styles.tags}>
            {item.tags.map((tag, i) => (
            <View style={styles.tagWrapper} key={i}>
                  <Text style={styles.tag}>{tag}</Text>
                  {i + 1 < item.tags.length && <View style={styles.tagDot} />}
                  </View>
              ))}
          </View>
            
          </LinearGradient>
        </ImageBackground>

        <View style={styles.menuHero}>
              {user?.list?.includes(item.id) ? (
                <TouchableOpacity
                  style={[styles.buttonMenu, { flexDirection: 'column', alignItems: 'center' }]}
                  activeOpacity={0.5}
                  onPress={() => handleMyListToggle(item)}
                >
                  <View style={[styles.iconContainer]}>
                  <Entypo name="check" size={25} color="#FFF" />
                  </View>
                  <View style={[styles.textContainer]}>
                  <Text style={styles.titles}>My List</Text>
                  </View>
                </TouchableOpacity>
              
              ) : (
                <TouchableOpacity
                  style={[styles.buttonMenu, { flexDirection: 'column', alignItems: 'center' }]}
                  activeOpacity={0.5}
                  onPress={() => handleMyListToggle(item)}
                >
                  <View style={[styles.iconContainer]}>
                    <Entypo name="plus" size={25} color="#FFF" />
                  </View>
                  <View style={[styles.textContainer]}>
                    <Text style={styles.titles}>My List</Text>
                  </View>
                </TouchableOpacity>

              )}

              <TouchableOpacity
                onPress={() => navigation.navigate('VideoPlayer', { id:item.id})}
                activeOpacity={0.6}
                style={styles.playButton}
              >
                <Entypo name="controller-play" size={35} color="white" />
                <Text style={[styles.titles, { fontSize: responsiveFontSize(2.2), color: 'white', fontWeight: '700' }]}>
                  Play
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={[styles.buttonMenu, { flexDirection: 'column', alignItems: 'center' }]}
                  activeOpacity={0.5}
                  onPress={() => console.log('Info Click')}
                >
                  <View style={[styles.iconContainer]}>
                  <Entypo name="info-with-circle" size={20} color="#FFF" />
                  </View>
                  <View style={[styles.textContainer]}>
                  <Text style={styles.titles}> Info</Text>
                  </View>
                </TouchableOpacity>
            
        </View>
    </View>
   
  );

  return (
    <View style={styles.container}>
      <FlatList
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        data={upcomingApiData}
        renderItem={renderMovieBanner}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Home_Banner;

const styles = StyleSheet.create({
  viewContainer:{
    flex:1,
    backgroundColor:'#000',
  },
  container: {
    flex:1,
    backgroundColor:'#000',
  },
  movieBanner: {
    width: responsiveWidth(100),
    height: Math.round((Dimensions.get('window').height * 81.5) / 100),
    justifyContent: 'space-between',
    opacity: 0.9,
  },
  linearContainer: {
   
    flex: 0.2,
    alignItems: 'center',
    alignSelf: 'stretch',
    
  },
  titles: {
    fontSize: responsiveFontSize(2.3),
    marginTop:3,
    color: 'white',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: responsiveWidth(40),
    height: responsiveHeight(5),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   
    opacity:0.9,
    gap: 5,
  },
  menuHero: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonMenu: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 1,
  },
  tags: {
    marginTop:'20%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '99%',
},
tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
},
tag: {
    
    fontWeight:'400',
    fontSize: 16,
    color: '#fff',
},
tagDot: {
    margin: 6,
    backgroundColor: '#e8e8e8',
    height: 4,
    width: 4,
    borderRadius:10,
},
});
