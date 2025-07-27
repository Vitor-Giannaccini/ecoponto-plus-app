// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo'; // AppLoading foi descontinuado, mas dependendo da versão do Expo pode ser necessário. Alternativa é usar a tela de splash.

export default function App() {
  // O ideal seria carregar uma fonte que combine com o design, como 'Poppins' ou 'Roboto'
  // Por simplicidade, usaremos as fontes padrão do sistema.

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}