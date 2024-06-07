import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Text as RNText, TextInput as RNTextInput, Modal } from "react-native";
import { Button, RadioButton ,IconButton } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import COLORS from '../store/constants';
import { useMyContextController, logout } from '../store/firebaseConfig';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Loading from '../components/loading';


const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surfaceVariant: "white",
    primary: 'white', // Màu chủ đạo (nút, checkbox, ...)
    text: 'white', // Màu chữ
    placeholder: 'white', // Màu chữ placeholder
  },
};

const Profile = ({ navigation }) => {
  const [controller,dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [avatarURL, setAvatarURL] = useState(userLogin?.imageUserURL || null);
  const [name, setName] = useState(userLogin?.name || "");
  const [address, setAddress] = useState(userLogin?.address || "");
  const [phone, setPhone] = useState(userLogin?.phone || "");
  const [gender, setGender] = useState(userLogin?.gender || "male");
  const [birthday, setBirthday] = useState(userLogin?.birthday ? new Date(userLogin.birthday) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSaveChanges = () => {
    const updatedProfile = { name, address, phone, gender, birthday: birthday.toISOString() };
    updateUserProfileInFirestore(updatedProfile);
  };

  const updateUserProfileInFirestore = (updatedProfile) => {
    const userDocRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email);
    userDocRef.update(updatedProfile)
      .then(() => {
        console.log("Cập nhật hồ sơ người dùng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật hồ sơ người dùng: ", error);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000);
return () => clearTimeout(timer);
}, [])


  useEffect(() => {
    if (userLogin == null) navigation.navigate("Login");
  }, [userLogin]);

  const handleUploadAvatar = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        const uploadTask = uploadImageToStorage(uri);
        uploadTask.then((downloadURL) => {
          updateAvatarInFirestore(downloadURL);
          setAvatarURL(downloadURL);
        });
      }
    });
  };

  const uploadImageToStorage = async (uri) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`avatars/${filename}`);
    await storageRef.putFile(uri);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
  };

  const updateAvatarInFirestore = (downloadURL) => {
    const userDocRef = firestore().collection('USERS').doc(firebase.auth().currentUser.email);
    userDocRef.update({ imageUserURL: downloadURL })
      .then(() => {
        console.log("Cập nhật avatar người dùng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật avatar người dùng: ", error);
      });
  };

  const handleLogout = () => {
    logout(dispatch);
  };

  return loading ? (
    <Loading/>
  ):(
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <Header login={false} goBack={navigation.goBack} label="User Profile" />
        <View style={styles.shadowContainer}>
          <TouchableOpacity onPress={handleUploadAvatar} style={styles.imageContainer}>
            {avatarURL ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: avatarURL }} style={styles.image} />
                <View style={styles.cameraIcon}>
                  <MaterialIcons name='photo-camera' size={32} color='white' />
                </View>
              </View>
            ) : (
              <View style={styles.imageWrapper}>
                <RNText style={styles.plusSign}></RNText>
                <View style={styles.cameraIcon}>
                  <MaterialIcons name='photo-camera' size={32} color='white' />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <PaperProvider theme={customTheme}>
         <View style={styles.inputContainer}>
            <RNText style={styles.titleUser}>Name </RNText>
            <RNTextInput
                label="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
                theme={customTheme}
            />
        </View>
        <View style={styles.inputContainer}>
            <RNText style={styles.titleUser}>Address </RNText>
            <RNTextInput
                label="Address"
                value={address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input}
                theme={customTheme}
          />
        </View>

        <View style={styles.inputContainer}>
                <RNText style={styles.titleUser}>Phone </RNText>
                <RNTextInput
                label="Phone"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                keyboardType="numeric"
                style={styles.input}
                theme={customTheme}
            />
        </View>

            <View style={styles.inputContainer}>
            <RNText style={styles.titleUser}>Birthday</RNText>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <RNTextInput
              value={birthday.toLocaleDateString()}
              editable={false}
              style={styles.input}
              label='Birthday'
              theme={customTheme}
            />
            <Ionicons name="chevron-down" size={25} color="white" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthday}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || birthday;
                setShowDatePicker(false);
                setBirthday(currentDate);
              }}
            />
          )}

            </View>

            
            <TouchableOpacity onPress={toggleModal}>
              <View style={styles.inputContainer}>
              
                <RNText style={styles.titleUser}>Gender </RNText>
     
                <RNTextInput
                label="Gender"
                value={gender}
                style={styles.input}
                theme={customTheme}
                editable={false}
          />
                  
                  <Ionicons name="chevron-down" size={25} color="white" />
            
              </View>
            </TouchableOpacity>

            <Modal
              visible={showModal}
              animationType="slide"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <RadioButton.Group onValueChange={(value) => { setGender(value); toggleModal(); }} value={gender}>
                    <RadioButton.Item 
                        label="Nam" 
                        value="Nam" 
                        labelStyle={styles.radioButtonLabel} />
                    <RadioButton.Item 
                        label="Nữ" 
                        value="Nữ" 
                        labelStyle={styles.radioButtonLabel} />
                  </RadioButton.Group>
                </View>
              </View>
            </Modal>
            <View style={styles.buttonView}>
            <Button
                mode="contained"
                onPress={handleSaveChanges}
                style={styles.button}
                icon={() => (
                    <IconButton
                    icon="content-save"
                    color="white"
                    size={20}
                    />
                )}
             >
                Save Changes
            </Button>
            <Button
                style={styles.button}
                mode="contained"
                onPress={handleLogout}
                icon={() => (
                    <IconButton
                    icon="logout"
                    color="white"
                    size={20}
                    />
                )}>
                Logout
                </Button>
              
            </View>
        </PaperProvider>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
    marginBottom: 20,
    marginTop: 30,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'gray',
  },
  plusSign: {
    fontSize: 50,
    color: COLORS.white,
    height: 200,
    width: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor:'gray',
    alignItems:'center',
    justifyContent:'center'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 25,
    zIndex: 9999,
  },
  shadowContainer: {
    height: 250,
    overflow: 'hidden',
    shadowColor: 'white',
    shadowRadius: 100,
    elevation: 15,
    borderRadius: 100,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  imageWrapper: {
    borderRadius: 75,
    shadowColor: 'white',
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    padding: 20,
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingHorizontal: 28,
    padding: 10,
  },
  input: {
    width:250,
    overflow: 'hidden',
    elevation: 10,
    backgroundColor: COLORS.gray,
    color: 'white',
    fontSize:15,
    borderBottomWidth:1,
    borderColor:'gray',
    marginLeft:10,
  },
  titleUser:{
    color:'white',
  },
  genderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.gray,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    marginTop:10,
    backgroundColor: '#1DB954',
    width: "50%",
    color:'white',
    marginLeft:10,
    
  },
  radioButtonLabel: {
    color: 'white',
  },
  buttonView:{
    flexDirection:'row',
    margin:10,
    padding:10,
    alignItems:'center'
  }
});

export default Profile;
