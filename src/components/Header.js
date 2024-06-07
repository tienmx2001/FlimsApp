import React,{useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import  FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { auth } from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../store/firebaseConfig';


const Header = ({ login, goBack, label }) => {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [avatarURL, setAvatarURL] = useState(userLogin?.imageUserURL || null);
  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.navigate('Login');
    });
  };

  return login ? (
    <View style={styles.container}>
        <View style={styles.headerLeftSide}>
            {goBack ? (
            <TouchableOpacity style={styles.goBack} onPress={goBack}>
                <FontAwesome name="chevron-left" size={22} color="white" />
            </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.goBack} onPress={()=>{
                    navigation.navigate('Setting')
                }}>
                <Entypo name="menu" size={33} color="white" />
            </TouchableOpacity>
                
            )}
            {label && <Text style={styles.headerTitle}>{label}</Text>}
        </View>
        <View style={styles.headerIcons}>
            <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                navigation.navigate("SearchScreen");
            }}
            >
            <MaterialIcons name="search" size={goBack ? 30 : 35} color="white" style={styles.searchIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avt} activeOpacity={0.5} onPress={()=>{
                navigation.navigate('Profile')
            }}>
            {avatarURL ? (<Image
                style={goBack ? styles.avatar2 : styles.avatar}
                resizeMode="contain"
                source={{
                uri: avatarURL,
                }}
            />):(
              <Entypo name='user' size={30} color='white'/>
            )
              
            }
            </TouchableOpacity>
        </View>
    </View>
  ) : (
    <View style={styles.container}>
         <View style={styles.headerLeftSide}>
            {goBack ? (
            <TouchableOpacity style={styles.goBack} onPress={goBack}>
                <FontAwesome name="chevron-left" size={22} color="white" />
            </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.goBack} onPress={()=>{
                    console.log('Clicked')
                }}>
                <Entypo name="menu" size={33} color="white" />
            </TouchableOpacity>
                
            )}
            {label && <Text style={styles.headerTitle}>{label}</Text>}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:35,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom:10,
  },
  container2: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    width: '100%',
  },
  logo: {
    width: 40,
    height:50,
  },
  logo2: {
    width: 125,
    height: 145,
  },
  avatar: {
    width: 50,
    height: 40,
    borderRadius: 20,
  },
  avatar2: {
    width: 40,
    height: 30,
    borderRadius: 30,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    marginLeft:'20%',
    fontSize: 18,
  },
  headerLeftSide: {
    flexDirection: 'row',
  },
  goBack: {
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 15,
  },
});

export default Header;
