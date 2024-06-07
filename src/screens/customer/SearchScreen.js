import React, { useState, useEffect } from 'react';
import { View, Dimensions, ScrollView, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState(null);
    const [results2, setResults2] = useState(null);

    useEffect(() => {
        const unsubscribe = firestore().collection('movies').onSnapshot(snapshot => {
            setResults(snapshot.docs.map((doc) => doc.data()));
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const filteredResults = results?.filter(result => 
            result.title.toLowerCase().includes(search.toLowerCase())
        );
        setResults2(filteredResults);
    }, [search, results]);

    return (
        <>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.container}>
            <Header login={false} goBack={navigation.goBack} label={'Search'} />
                <View style={styles.searchBoxWrapper}>
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={30} color="#B1B1B1" style={styles.searchIcon} />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#7f7f7f"
                            placeholder="Search for a show, movie, genre etc."
                            style={styles.searchInput}
                        />
                        <TouchableOpacity activeOpacity={0.5}>
                            <MaterialCommunityIcons name="microphone" size={30} color="#b1b1b1" style={styles.microphoneIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                {results2 && (
                    <>
                        <Text style={styles.topResultsText}>Top Searches</Text>
                        <View style={styles.resultsWrapper}>
                            {results2.map((movie, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    key={index}
                                    onPress={() => {
                                        navigation.navigate("VideoPlayer", {
                                            id: movie.id
                                        });
                                    }}
                                >
                                    <View style={styles.movieCard}>
                                        <Image
                                            resizeMode='cover'
                                            source={{ uri: movie.banner }}
                                            style={styles.moviePoster}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    searchBoxWrapper: {
        width: '100%',
        justifyContent: 'center',
    },
    searchBox: {
        width: '100%',
        height: 50,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 0,
        paddingRight: 7,
        margin: 10,
        marginLeft: 5,
    },
    searchIcon: {
        margin: 10,
    },
    searchInput: {
        alignItems:'center',
        justifyContent:'center',
        color: '#fff',
        fontSize: 16,
        margin: 5,
        flex: 1,
    },
    microphoneIcon: {
        margin: 10,
    },
    topResultsText: {
        color: 'white',
        fontWeight:'bold',
        fontSize: 28,
        margin: 20,
        marginTop: 5,
        marginLeft: 20,
    },
    resultsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'center',
    },
    moviePoster: {
        width: Math.round((Dimensions.get('window').width * 29.5) / 100),
        height: 200,
    },
    movieCard: {
        paddingRight: 9,
    },
});

export default SearchScreen;
