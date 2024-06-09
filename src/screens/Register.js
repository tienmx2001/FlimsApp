import React, { useState } from "react";
import { Alert, View, StyleSheet, KeyboardAvoidingView, ScrollView } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import COLORS from "../store/constants";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const hasErrorName = () => name === "";
  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => passwordConfirm != password;
  const hasErrorAddress = () => address === "";
  const hasErrorrPhone = () => phone.length < 10;

  const USERS = firestore().collection("USERS");

  const handleCreateAccount = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        USERS.doc(email).set({
          name,
          email,
          password,
          address,
          phone,
          role: "customer"
        });
        navigation.navigate("Login");
      })
      .catch((e) => Alert.alert("Tài khoản tồn tại"));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 20, width: 400 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "center",
              color: 'black',
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Create New Account
          </Text>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.InputText}
          />
          <HelperText type="error" visible={hasErrorName()}>
            Full name không được phép để trống
          </HelperText>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.InputText}
          />
          <HelperText type="error" visible={hasErrorEmail()}>
            Địa chỉ email không hợp lệ
          </HelperText>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            style={styles.InputText}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <HelperText type="error" visible={hasErrorPassword()}>
            Password ít nhất 6 kí tự
          </HelperText>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            style={styles.InputText}
            label="Confirm Password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry={!showPasswordConfirm}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
              />
            }
          />
          <HelperText type="error" visible={hasErrorPasswordConfirm()}>
            Password Confirm phải so khớp với password
          </HelperText>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.InputText}
          />
          <HelperText type="error" visible={hasErrorAddress()}>
            Address không được phép để trống
          </HelperText>
          <TextInput
            theme={{ roundness: 40 }}
            underlineColor='transparent'
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.InputText}
          />
          <HelperText type="error" visible={hasErrorrPhone()}>
            Phone phải đủ 10 số
          </HelperText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              style={styles.buttn}
              mode="contained"
              onPress={handleCreateAccount}
            >
              Create New Account
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  InputText: {
    width: 350,
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    marginBottom: 10,
    fontSize: 15,
    paddingLeft: 20,
  },
  buttn:{
    marginTop:40,
    backgroundColor:'gray',
    width: 350,
    height: 50,
    justifyContent:'center'
  }
});

export default Register;
