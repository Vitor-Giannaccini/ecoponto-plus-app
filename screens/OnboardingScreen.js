// screens/OnboardingScreen.js

import React, { useState, useRef } from 'react'; // 1. Importe o useRef
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import StyledButton from '../components/StyledButton';

const ONBOARDING_PAGES = [
  {
    key: '1',
    image: require('../assets/hands.png'),
    title: 'A CIDADE PRECISA DE VOCÊ',
    subtitle: 'O descarte incorreto de lixo é um grande desafio. Você pode fazer a diferença e ainda ser recompensado por isso.',
  },
  {
    key: '2',
    image: require('../assets/coin.png'),
    title: 'REGISTRE E PONTUE',
    subtitle: 'Use o app para escanear o QR Code do ecoponto, informe o material e a quantidade do seu descarte e ganhe pontos.',
  },
  {
    key: '3',
    image: require('../assets/tax.png'),
    title: 'SUA AÇÃO VALE BENEFÍCIOS',
    subtitle: 'Acumule seus pontos e troque por benefícios reais, como descontos em impostos municipais.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [activePage, setActivePage] = useState(0);
  const pagerRef = useRef(null);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      navigation.replace('Auth'); 
    } catch (error) {
      console.error("Erro ao salvar status do onboarding:", error);
    }
  };

  // Função para ir para a próxima página
  const goToNextPage = () => {
    if (pagerRef.current) {
      pagerRef.current.setPage(activePage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView 
        ref={pagerRef}
        style={styles.pagerView} 
        initialPage={0}
        onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
      >
        {ONBOARDING_PAGES.map(page => (
          <View style={styles.page} key={page.key}>
            <Image source={page.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.subtitle}>{page.subtitle}</Text>
            
            {/* Se for a última página (índice 2), mostra o botão "Começar" */}
            {activePage === ONBOARDING_PAGES.length - 1 ? (
              <StyledButton 
                title="Começar" 
                onPress={handleDone} 
                style={styles.buttonStyle}
              />
            ) : (
            /* Se não for a última, mostra o botão "Próximo" */
              <StyledButton 
                title="Próximo" 
                onPress={goToNextPage} 
                style={styles.buttonStyle}
              />
            )}
          </View>
        ))}
      </PagerView>
      
      <View style={styles.indicatorContainer}>
        {ONBOARDING_PAGES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activePage === index && styles.indicatorActive
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    color: COLORS.dark,
    lineHeight: 25,
    marginBottom: 40,
  },
  buttonStyle: {
    paddingHorizontal: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    width: '100%',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C4C4C4', // Cor da bolinha inativa
    marginHorizontal: 5,
  },
  indicatorActive: {
    backgroundColor: COLORS.primary, // Cor da bolinha ativa
  },
});

export default OnboardingScreen;