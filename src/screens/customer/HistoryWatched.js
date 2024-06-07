import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../components/Header'
import Loading from '../../components/loading';

const HistoryWatched = () => {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
    return () => clearTimeout(timer);
    }, [])

    useEffect(() => {
        const fetchMovies = async () => {
            const snapshot = await firestore().collection('USERS').doc(firebase.auth().currentUser.email).collection('movieWatched').get();
            const movieList = snapshot.docs.map(doc => doc.data());
            setMovies(movieList);
        };
        fetchMovies();
    }, []);

    const navigation = useNavigation();

    return loading ? (
        <Loading/>
    ):(<>
        <StatusBar
            translucent
            backgroundColor='transparent'
            barStyle='light-content'
        />
        {
            !loading && movies?.length === 0 && (
                <View style={styles.warningWrapper}>
                    <Text style={styles.warning}>There are no movies in your history watched</Text>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("Customer")} style={styles.warningButton}>
                        <Text style={styles.warningButtonText}>Browse Movies</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        <ScrollView style={styles.container}>
        <Header login={true} goBack={navigation.goBack} label="History" />
            
            <View style={styles.movieScroll}>
                {movies?.map((movie, index) => (
                    <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => navigation.navigate("VideoPlayer", { id: movie.movieID })}>
                        <View style={styles.movieCard}>
                            <Image style={styles.moviePoster} resizeMode='cover' source={{ uri: movie.movieBanner }} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        marginTop:20,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    movieScroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    movieCard: {
        marginRight: 10,
    },
    moviePoster: {
        width: (Dimensions.get('window').width * 29) / 100,
        height: 200,
        borderRadius: 10,
    },
    warningWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        zIndex: 50,
        top: '40%',
        left:20
    },
    warning: {
        color: '#fff',
        fontSize: 23,
        textAlign: 'center',
        fontFamily: "Montserrat_400Regular",
    },
    warningButton: {
        backgroundColor: '#E7442E',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    warningButtonText: {
        color: 'white',
        fontFamily: "Montserrat_300Light",
        fontSize: 15,
    },
});

export default HistoryWatched;
