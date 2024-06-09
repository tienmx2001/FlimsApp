import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import { Appbar } from 'react-native-paper';

const PaymentSuccess = ({ route }) => {
  const navigation = useNavigation();
  const { orderDetails } = route.params;

  const fullName = orderDetails.fullname || '';
  const [name, dob] = fullName.split('-');

  const handleDetailPress = () => {
    navigation.navigate('DetailBuy', { orderId: orderDetails.orderId, readOnly: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/checked.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>Payment Success</Text>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
  
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Resolution:</Text>
            <Text style={styles.info}>
              {orderDetails.selectedPlan}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Device:</Text>
            <Text style={styles.info}>
              {orderDetails.device}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.info}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(orderDetails.price)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Customer')}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%',
  },
  appbar: {
    backgroundColor: '#1E90FF',
    width: '100%',
  },
  appbarTitle: {
    textAlign: 'center',
    color: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: '40%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#A9A9A9',
    width: '90%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 23,
    color: 'white',
    textAlign: 'center',
    padding: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    width: '40%',
  },
  info: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  detailLink: {
    paddingTop: 10,
    textAlign: 'center',
    color: '#1E90FF',
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  noteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  noteText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 16,
  },
  thankYouText: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#E7442E',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor:'#E7442E'
  },
  footer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

export default PaymentSuccess;
