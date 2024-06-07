import {
  StyleSheet,
  View,
  Image,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import {myColors} from '../../theme/theme';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../../store/firebaseConfig';

const Splash = ({navigation}) => {
  useEffect(() => {
    const app = initializeApp(firebaseConfig); // Khởi tạo Firebase

    setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} hidden />
      <Image
        style={styles.logo}
        source={{
          uri: 'https://media.zenfs.com/en/hypebeast_936/55dd2178cbbd27b2cdba3f8985a08d48',
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 200,
  },
});
