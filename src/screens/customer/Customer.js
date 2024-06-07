import { ScrollView, StatusBar, StyleSheet, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Home_Banner from '../../components/Home_Banner';
import MovieCards from '../../components/MovieCards';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 
import Loading from '../../components/loading'

const Customer = () => {
  const [nowPlayingData, setNowPlayingData] = useState([]);
  const [comedyData,setComedyData]=useState(null);
  const [actionData,setActionData]=useState(null)
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(true)
  const navigation = useNavigation();
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = await firestore().collection('movies').get();
        const movies = moviesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNowPlayingData(movies);
      } catch (error) {
        Alert.alert(`Request failed: ${error.message}`);
       
      }
    };
    fetchMovies();

    const fetchActionMovies = async () => {
      try {
        const actionMoviesCollection = await firestore()
          .collection('movies')
          .where('tags', 'array-contains', 'Action')
          .get();
        const actionMovies = actionMoviesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActionData(actionMovies);
      } catch (error) {
        Alert.alert(`Request for action movies failed: ${error.message}`);
      }
    };
    const fetchComedyMovies = async () => {
      try {
        const comedyMoviesCollection = await firestore()
          .collection('movies')
          .where('tags', 'array-contains', 'Comedy')
          .get();
        const comedyMovies = comedyMoviesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComedyData(comedyMovies);
      } catch (error) {
        Alert.alert(`Request for comedy movies failed: ${error.message}`);
      }
    };
    fetchActionMovies();
    fetchComedyMovies();
  }, []); 

  useEffect(() => {
		firestore().collection('USERS').doc(firebase.auth().currentUser.email).onSnapshot(doc => {
			if (doc.exists) {
				setUser(doc.data())
			}
		})

	}, [firebase.auth().currentUser])


  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
    }, [])
  return loading ? (
    <Loading/>
  ):(
    <View style={styles.container}>
    <StatusBar barStyle={'default'} translucent backgroundColor={'transparent'} />
   
        <ScrollView style={styles.scrollView}>
        <Home_Banner user={user} navigation={navigation}/>
        <View style={styles.subContainer}>
          <MovieCards label="Now Playing" data={nowPlayingData}  />
          <MovieCards label="Action" data={actionData}  />
          <MovieCards label="Comedy" data={comedyData}  />
        </View>
      </ScrollView>
    </View>
  )
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: 15,
    gap: 10,
    marginTop: 20,
  },
});
