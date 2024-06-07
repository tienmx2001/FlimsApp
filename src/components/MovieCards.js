import React from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MovieCards = ({ label, data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal style={styles.movieScroll}>
        {data && data.map((movie, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              key={index}
              onPress={() => {
                navigation.navigate('VideoPlayer', {
                  id: movie.id,
                });
              }}
            >
              <View style={styles.movieCard}>
                <Image resizeMode="cover" source={{ uri: movie.banner }} style={styles.moviePoster} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 23,
    marginBottom: 15,
  },
  movieScroll: {
    paddingLeft: 10,
  },
  moviePoster: {
    width: Math.round((Dimensions.get('window').width * 35) / 100),
    height: 200,
  },
  movieCard: {
    paddingRight: 9,
  },
});

export default MovieCards;
