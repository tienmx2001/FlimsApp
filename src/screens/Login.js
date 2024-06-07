import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Animated, Easing } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { login, useMyContextController } from '../store/firebaseConfig';

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [email, setEmail] = useState('ti123@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const hasErrorEmail = () => !email.includes('@');
  const hasErrorPassword = () => password.length < 6;

  const handleLogin = () => {
    login(dispatch, email, password);
  };

  useEffect(() => {
    console.log(userLogin);
    if (userLogin != null) {
      if (userLogin.role === 'admin') {
        navigation.navigate('Admin');
      } else if (userLogin.role === 'customer') {
        navigation.navigate('Customer');
      }
    }
  }, [userLogin]);

  const bounceValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounce = () => {
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -20, 
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0, 
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => bounce());
    };

    bounce();
  }, [bounceValue]);

  useEffect(() => {
    const blink = () => {
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => blink());
    };

    blink();
  }, [opacityValue]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={style.container}>
          <Animated.Image
            style={[style.image, { transform: [{ translateY: bounceValue }] }]}
            source={require('../assets/logo.png')}
          />
          <Animated.Text style={[style.title, { opacity: opacityValue }]}>
            LOGIN TO START
          </Animated.Text>

          <TextInput
            placeholder='Email'
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            style={style.textInput}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            underlineColor='transparent'
            placeholder='Password'
            theme={{ roundness: 40 }}
            style={style.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
          />
          <Button style={style.button} mode="contained" onPress={handleLogin}>
            Login
          </Button>

          <View style={style.signUpContainer}>
            <Text>Don't have an account ?</Text>
            <Button style={style.buttonSignUp} onPress={() => navigation.navigate('Register')}>
                Sign up
            </Button>
          </View>
          <View style={style.signUpContainer}>
            <Button style={style.buttonSignUp} onPress={() => navigation.navigate('DownloadedVideos')}>
                Offline
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    bottom:100,
    width: 350,
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    marginBottom: 20,
    fontSize: 15,
    paddingLeft: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    bottom:100,
    width: 350,
    height: 50,
    marginBottom: 10,
  },
  buttonSignUp: {
    tintColor: 'black',
    
  },
  signUpContainer: {
    bottom:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  image: {
    width: 300,
    height: 300,
    right:10
  },
  title: {
    bottom:110,
    fontSize: 20,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 10,
  },
});

export default Login;
