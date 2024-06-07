import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert, Platform } from "react-native";
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const MyContext = createContext();
MyContext.displayName = "MyContextContext";

function reducer(state, action) {
    switch (action.type) {
        case "USER_LOGIN": {
            return { ...state, userLogin: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function MyContextControllerProvider({ children }) {
    const initialState = {
        userLogin: null,
    };
    const [controller, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error(
            "useMyContextController should be used inside the MyContextControllerProvider"
        );
    }
    return context;
}

const USERS = firestore().collection("USERS");
const SERVICES = firestore().collection("services");

const login = (dispatch, email, password) => {
    auth().signInWithEmailAndPassword(email, password)
        .then(
            () => USERS.doc(email).onSnapshot(u => {
                const value = u.data();
                // console.log("Đăng nhập thành công với User: ", value);
                dispatch({ type: "USER_LOGIN", value });
            })
        )
        .catch(e => Alert.alert("Sai user và Password"));
};

const logout = (dispatch) => {
    dispatch({ type: "USER_LOGIN", });
};

// const incrementMovieID = async () => {
//     const movieCounterRef = firestore().collection('counters').doc('movieCounter');

//     const newID = await firestore().runTransaction(async (transaction) => {
//         const movieCounterDoc = await transaction.get(movieCounterRef);

//         if (!movieCounterDoc.exists) {
//             transaction.set(movieCounterRef, { currentID: 1 });
//             return 1;
//         }

//         const currentID = movieCounterDoc.data().currentID;
//         const newID = currentID + 1;

//         transaction.update(movieCounterRef, { currentID: newID });

//         return newID;
//     });

//     return newID;
// };

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

const addMovie = async (title, backdrops,banner, description, tags, videoURL, yearOfRelease, onProgress) => {
  try {
    const docRef = await firestore().collection('movies').add({
      title,
      backdrops:'',
      banner: '',
      description,
      tags,
      videoURL: '',
      yearOfRelease,
    });

    const id = docRef.id;
    const backdropsURL = await uploadFile(backdrops, `backdrops_${id}.jpg`, 'images', onProgress);
    const bannerURL = await uploadFile(banner, `banner_${id}.jpg`, 'images', onProgress);
    const videoDownloadURL = await uploadFile(videoURL, `video_${id}.mp4`, 'videos', onProgress);

    await firestore().collection('movies').doc(id).update({
      backdrops:backdropsURL,
      banner: bannerURL,
      videoURL: videoDownloadURL,
      id: id,
    });

    console.log('Movie added!');
  } catch (error) {
    console.error('Error adding movie: ', error);
  }
};




export {
    MyContextControllerProvider,
    useMyContextController,
    addMovie,
    login,
    logout,
};
