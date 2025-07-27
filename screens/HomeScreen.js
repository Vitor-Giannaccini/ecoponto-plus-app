// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS } from '../constants/colors';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <View>
                <Text style={styles.title}>Chegou agora? Veja como funciona:</Text>
                <Text style={styles.subtitle}>Vamos colocar a sustentabilidade em prática!</Text>
            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
      width: 100,
      height: 100,
      borderRadius: 20,
      marginRight: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
});

export default HomeScreen;

// Crie os arquivos HabitsScreen.js, ActivitiesScreen.js, StoreScreen.js e AboutScreen.js
// com uma estrutura similar a esta para as outras telas.