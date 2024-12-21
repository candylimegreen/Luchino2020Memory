import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import Card from './Card';

const { width, height } = Dimensions.get('window');

const CARD_PAIRS_VALUE: string[] = [
  require('../assets/Brachiosauro.webp'),
  require('../assets/Mosasauro.webp'),
  require('../assets/Plesiosauro.webp'),
  require('../assets/Pterodattilo.webp'),
  require('../assets/Spinosauro.webp'),
  require('../assets/Velociraptor.webp'),
  require('../assets/stegosauro.webp'),
  require('../assets/triceratopo.webp')
];

interface CardType {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Game() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);

  useEffect(() => {
    initGame();
  }, []);

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
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      cards[index].isMatched
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        setMatchedPairs([...matchedPairs, cards[firstIndex].value]);
        setCards(cards.map((card, i) =>
          i === firstIndex || i === secondIndex
            ? { ...card, isMatched: true }
            : card
        ));
      }
      setTimeout(() => setFlippedIndices([]), 1000);
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
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>Super Mosse: </Text>
          <Text style={styles.movesNumber}>{moves} ✨</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                value={card.value}
                isFlipped={flippedIndices.includes(index) || card.isMatched}
                onPress={() => handleCardPress(index)}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={initGame}>
          <Text style={styles.buttonText}>Nuova Partita</Text>
        </TouchableOpacity>
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
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
