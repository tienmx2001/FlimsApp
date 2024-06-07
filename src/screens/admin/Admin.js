import { View, Text ,TextInput,ScrollView,TouchableOpacity,Image, Dimensions} from 'react-native'
import { Button } from 'react-native-paper'
import React ,{useEffect,useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'
import { StatusBar } from 'expo-status-bar'

export default function Admin() {
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
          <View style={styles.searchBoxWrapper}>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={30} color="white" style={styles.searchIcon} />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor="#7f7f7f"
                            placeholder="Search movies."
                            style={styles.searchInput}
                        />
                    </View>
                </View>
                {results2 && (
                    <>
                        <View style={styles.resultsWrapper}>
                            {results2.map((movie, index) => (
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    key={index}
                                    onPress={() => {
                                        navigation.navigate("MovieDetails", {
                                            id: movie.id
                                        });
                                    }}
                                >
                                    <View style={styles.movieCard}>
                                    <TextInput editable={false} style={styles.titleTextInput} value={movie.title}/>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
          <View style={styles.buttonAddView}>
            <Button style={styles.button} onPress={()=>{
                navigation.navigate('AddMovieScreen')
                }} >Add Movies</Button>
          </View>
        </ScrollView>
      </>
  )
}
const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop:'10%',
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
    padding: 10,
    justifyContent: 'center',
    padding:10,
    margin:10
},
moviePoster: {
    width: Math.round((Dimensions.get('window').width * 29.5) / 100),
    height: 200,
},
movieCard: {
    paddingRight: 9,
    color:'white',
    marginTop:10,
    backgroundColor:'gray',
    borderRadius:10,
    elevation:10,
},
button:{
  backgroundColor:'orange',
  width:300,
  color:'white'
},
buttonAddView:{
    alignItems:"center"
},
titleTextInput :{
  marginLeft:20,
  color:'white'
},

})