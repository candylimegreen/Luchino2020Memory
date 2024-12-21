import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import Game from './components/Game';
import Home from './components/Home';

export default function App() {
  const [showGame, setShowGame] = useState(false);

  const handleStartGame = () => {
    setShowGame(true);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {!showGame ? (
          <Home onStartGame={handleStartGame} />
        ) : (
          <Game />
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
