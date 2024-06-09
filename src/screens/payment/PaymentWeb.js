import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';

const PaymentWeb = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderUrl, selectedPlan, price ,device} = route.params;
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore().collection('USERS').doc(firebase.auth().currentUser.email).onSnapshot(doc => {
      if (doc.exists) {
        setUserEmail(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const createBill = async () => {
    const orderDetails = {
      selectedPlan,
      price,
      device,
      user: userEmail,
      createdAt: Date.now(),
    };

    try {
      await firestore().collection('bills').add(orderDetails);
      navigation.navigate('PaymentSuccess', { orderDetails });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleNavigationStateChange = async (event) => {
    const url = event.url;
    const status = getQueryParam(url, 'status');
    if (status === '1') {
      createBill();
    }
  };

  const getQueryParam = (url, param) => {
    const queryString = url.split('?')[1] || '';
    const pairs = queryString.split('&');
    const params = {};
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params[param] || null;
  };

  return (
    <WebView
      source={{ uri: orderUrl }}
      style={{ flex: 1 ,marginTop:10}}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentWeb;
