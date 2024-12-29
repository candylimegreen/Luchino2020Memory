import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_SIZE = Math.min((width - 60) / 4, (height - 280) / 4);

interface CardProps {
  card: {
    value: any;
    isFlipped: boolean;
    isMatched: boolean;
  };
  onPress: () => void;
  style?: any;
  imageStyle?: any;
}

export default function Card({ card, onPress, style, imageStyle }: CardProps) {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: card.isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped]);

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
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <Image source={card.value} style={[styles.image, imageStyle]} resizeMode="contain" />
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
    borderColor: '#fff',
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
    width: '100%',
    height: '100%',
    borderRadius: 15
  },
});
