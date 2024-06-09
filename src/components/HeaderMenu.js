import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderMenu= () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{
                navigation.navigate('PaymentSuccess')
            }} >
                <Text style={styles.tab}>Watching</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{
                navigation.navigate("HistoryWatched")
            }}>
                <Text style={styles.tab}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {
                navigation.navigate("MyList");
            }}>
                <Text style={styles.tab}>My List</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 60,
        width: '100%',
    },
    tab: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});

export default HeaderMenu;
