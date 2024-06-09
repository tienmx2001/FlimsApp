import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert ,Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const PaymentMethods = ({ route }) => {
  const { selectedPlan, price,device } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [payVisible, setPayVisible] = useState(true);
  const [checked, setChecked] = useState('');
  const [paymentSelected, setPaymentSelected] = useState(false);
  const [zaloPaymentStatus, setZaloPaymentStatus] = useState('idle');

  const handlePayment = async () => {
    if (!paymentSelected) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán');
      return;
    }
    if (checked === 'zalo') {
      payOrder();
    } else {
      createBill();
    }
  };

  const createBill = async () => {
    const orderDetails = {
      device,
      selectedPlan,
      totalPrice: price,
      paymentStatus: zaloPaymentStatus === 'success' ? 1 : 0,
      paymentMethod: checked === 'zalo' ? 'zalo' : checked,
      createdAt: Date.now(),
    };

    try {
      await firestore().collection('bills').doc(orderId).set(orderDetails);
      navigation.navigate('PaymentSuccess', { orderDetails });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  

  const payOrder = async () => {
    const paymentUrl = 'https://server-api-payment.vercel.app/payment';
    try {
      const response = await fetch(paymentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: "Thanh toán gói dịch vụ",
          price,
        }),
      });

      const data = await response.json();
      if (data && data.order_url) {
        navigation.navigate('PaymentWeb', { orderUrl: data.order_url, selectedPlan, price,device });
      } else {
        console.error('No order URL found in response');
      }
    } catch (error) {
      console.error('Error fetching payment URL:', error);
    }
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const togglePays = () => {
    setPayVisible(!payVisible);
  };

  const handlePaymentSelection = (value) => {
    setChecked(value);
    setPaymentSelected(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={toggleDetails} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleLabel}>Details Order</Text>
              
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : detailsVisible ? (
            <>
              <Text style={styles.detailText}>Selected Plan: {selectedPlan}</Text>
              <Text style={styles.detailText}>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</Text>
              <Text style={styles.detailText}>Device Connect: {selectedPlan}</Text>
            </>
          ) : null}
        </View>
        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginTop: '2%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={togglePays} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleLabel}>Payment Methods</Text>
              
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : payVisible ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value="Momo"
                  status={checked === 'Momo' ? 'checked' : 'unchecked'}
                  onPress={() => handlePaymentSelection('Momo')}
                  color={checked === 'Momo' ? '#E7442E' : 'white'}
                />
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: checked === 'Momo' ? 20 : 16,
                  color: checked === 'Momo' ? '#E7442E' : 'white',
                }}>
                <Image
                  source={require('../../assets/MoMo_Logo.png')}
                  style={{height:20,width:20}}
                />
                  Momo
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                  value="zalo"
                  status={checked === 'zalo' ? 'checked' : 'unchecked'}
                  onPress={() => handlePaymentSelection('zalo')}
                  color={checked === 'zalo' ? '#E7442E' : 'white'}
                />
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  width: '100%',
                  color: checked === 'zalo' ? '#E7442E' : 'white',
                }}>
                <Image
                  source={require('../../assets/zalopay.png')}
                  style={{height:20,width:20,borderColor:'white'}}
                />
                  ZaloPay
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
          <Text style={styles.confirmButtonText}>Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    padding: 20,
    backgroundColor:'#000'
  },
  headerContainer: {
    marginBottom: 10,
  },
  titleLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    paddingTop: '2%',
  },
  titleLabels: {
    fontWeight: 'bold',
    fontSize: 19,
    color: 'white',
    paddingTop: '2%',
  },
  detailText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  totalContainer: {
    flexDirection: 'column',
    
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#E7442E',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethods;
