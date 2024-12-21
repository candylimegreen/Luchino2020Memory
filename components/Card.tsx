import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_SIZE = Math.min((width - 60) / 4, (height - 280) / 4);

interface CardProps {
  value: any;
  isFlipped: boolean;
  onPress: () => void;
}

export default function Card({ value, isFlipped, onPress }: CardProps) {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Image source={value} style={styles.image} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Text style={styles.cardText}>?</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 5,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFront: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#FF8C00',
  },
  cardBack: {
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    borderColor: '#fff',
  },
  cardText: {
    fontSize: CARD_SIZE * 0.6,
    color: '#FFF',
    fontWeight: 'bold',
  },
  image: {
    width: '90%',
    height: '90%',
  },
});
