import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
    const [selectedPlan, setSelectedPlan] = useState('720p');
    const [price, setPrice] = useState(108000);
    const [device,setDevice]=useState(1)

    const navigation = useNavigation();

    const selectPlan = (plan) => {
        if (plan === '1080p') {
            setSelectedPlan('1080p');
            setPrice(220000);
            setDevice(2);
        } else {
            setSelectedPlan('720p');
            setPrice(108000);
            setDevice(1);
        }
    };

    const handleNext = () => {
        navigation.navigate('PaymentMethods', { selectedPlan, price ,device});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Choose Your Plan</Text>
            <View style={styles.planContainer}>
                <TouchableOpacity
                    style={[styles.planButton, selectedPlan === '720p' && styles.selectedPlan]}
                    onPress={() => selectPlan('720p')}
                >
                    <Text style={styles.planText}>720p</Text>
                    <Text style={styles.priceText}>108.000 VND</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.planButton, selectedPlan === '1080p' && styles.selectedPlan]}
                    onPress={() => selectPlan('1080p')}
                >
                    <Text style={styles.planText}>1080p</Text>
                    <Text style={styles.priceText}>220.000 VND</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Selected Plan: {selectedPlan}</Text>
                <Text style={styles.detailText}>Price: {price.toLocaleString()} VND</Text>
                <Text style={styles.detailText}>Device Connect: {device}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    planContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    planButton: {
        padding: 20,
        marginHorizontal: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.4,
    },
    selectedPlan: {
        backgroundColor: '#E7442E',
    },
    planText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    priceText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    detailsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    detailText: {
        color: '#fff',
        fontSize: 18,
        marginVertical: 5,
        padding:10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    nextButton: {
        backgroundColor: '#E7442E',
        padding: 15,
        borderRadius: 10,
        alignItems:'center',
        marginTop:40,
        width:300
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PaymentScreen;
