import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';

import { ImagesType } from '../lib/enums';

const { width, height } = Dimensions.get('window');

interface CardType {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function buildImagesArray(imagesType: ImagesType): string[] {
  switch (imagesType) {
    case ImagesType.Dinos:
      return [
        require('../assets/Memory/Dinos/trex.webp'),
        require('../assets/Memory/Dinos/mosasauro.webp'),
        require('../assets/Memory/Dinos/pterodattilo.webp'),
        require('../assets/Memory/Dinos/megalodon.webp'),
        require('../assets/Memory/Dinos/brontosauro.webp'),
        require('../assets/Memory/Dinos/kraken.webp'),
        require('../assets/Memory/Dinos/velociraptor.webp'),
        require('../assets/Memory/Dinos/triceratopo.webp'),
        require('../assets/Memory/Dinos/spinosauro.webp')
      ];
    case ImagesType.Animals:
      return [
        require('../assets/Memory/Animals/anaconda.webp'),
        require('../assets/Memory/Animals/canguro.webp'),
        require('../assets/Memory/Animals/coccodrillo.webp'),
        require('../assets/Memory/Animals/cornacchia.webp'),
        require('../assets/Memory/Animals/leone.webp'),        
        require('../assets/Memory/Animals/orca.webp'),
        require('../assets/Memory/Animals/rinoceronte.webp'),
        require('../assets/Memory/Animals/squaloBianco.webp'),
        require('../assets/Memory/Animals/tigre.webp')
      ];
    default:
      return [];
  }
}

export default function MemoryGame({ imagesType, onBackToHome }: { imagesType: ImagesType, onBackToHome: () => void }) {

  let CARD_PAIRS_VALUE: string[] = buildImagesArray(imagesType);

  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const onNewGame = () => {
    initGame();
  };

  const onHome = () => {
    if (typeof onBackToHome === 'function') {
      onBackToHome();
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  const animateAlert = () => {
    scaleAnim.setValue(0);
    setShowAlert(true);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 15
      }),
    ]).start();
    setTimeout(() => setShowAlert(false), 1500);
  };

  const initGame = (): void => {
    const shuffledCards: CardType[] = [...CARD_PAIRS_VALUE, ...CARD_PAIRS_VALUE]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        value: card,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardPress = (index: number): void => {
    // Create a copy of the current cards to modify
    const updatedCards = [...cards];
    
    if (
      flippedIndices.length === 2 ||
      updatedCards[index].isFlipped ||
      updatedCards[index].isMatched
    ) {
      return;
    }

    // Flip the current card
    updatedCards[index] = { ...updatedCards[index], isFlipped: true };
    setCards(updatedCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found
        const matchedCards = updatedCards.map((card, i) =>
          i === firstIndex || i === secondIndex
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setMatchedPairs([...matchedPairs, cards[firstIndex].value]);
        animateAlert();
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          const resetCards = cards.map((card, i) =>
            newFlippedIndices.includes(i) 
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/HomeLuchinoMemory.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {showAlert && (
          <Animated.View style={[
            styles.alertContainer,
            {
              transform: [
                { scale: scaleAnim },
              ]
            }
          ]}>
            <Text style={styles.alertText}>Bravo Luchino!</Text>
            <Text style={styles.alertEmoji}>🌟</Text>
          </Animated.View>
        )}
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>Super Mosse: </Text>
          <Text style={styles.movesNumber}>{moves} ✨</Text>
        </View>

        <View style={styles.cardContainer}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              onPress={() => handleCardPress(index)}
              style={styles.card}
              imageStyle={styles.cardImage}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onNewGame}>
            <Ionicons name="refresh" size={24} color="#FF0000" />
            <Text style={styles.buttonText}>Nuova Partita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onHome}>
            <Ionicons name="home" size={24} color="#FF0000" />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    paddingTop: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 183, 77, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stats: {
    fontSize: 24,
    color: 'rgba(255, 140, 0, 0.8)',
    fontWeight: 'bold',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  movesNumber: {
    fontSize: 26,
    color: 'rgba(255, 111, 0, 0.8)',
    fontWeight: 'bold',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    width: width * 0.2,
    height: width * 0.2,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF0000',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
  },
  alertText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700', 
    textAlign: 'center',
    textShadowColor: '#008000', 
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  alertEmoji: {
    fontSize: 54,
    marginTop: 15,
  },
});
