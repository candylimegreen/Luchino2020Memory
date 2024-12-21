import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface HomeProps {
  onStartGame: () => void;
}

export default function Home({ onStartGame }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/HomeLuchinoMemory.webp')}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onStartGame}>
        <Text style={styles.buttonText}>START</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
