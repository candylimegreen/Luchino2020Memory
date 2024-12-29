import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import Home from './components/Home';
import MemoryGame from './components/MemoryGame';
import { ImagesType } from './lib/enums';

export default function App() {
  const [showGame, setShowGame] = useState(false);
  const [imagesType, setImagesType] = useState<ImagesType | null>(null);

  const handleStartGame = (imagesType: ImagesType) => {
    setShowGame(true);
    setImagesType(imagesType);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {!showGame ? (
          <Home onStartGame={handleStartGame} />
        ) : (
          imagesType !== null && <MemoryGame imagesType={imagesType} onBackToHome={() => setShowGame(false)} />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
