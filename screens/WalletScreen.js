// screens/WalletScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WalletScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Tela da Carteira de Pontos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default WalletScreen;