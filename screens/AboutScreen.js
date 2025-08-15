import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/logo.png')} // Certifique-se que o caminho do logo está correto
          style={styles.logo}
        />
        <Text style={styles.title}>ECOPONTO+</Text>
        <Text style={styles.sectionTitle}>Nossa missão</Text>
        <Text style={styles.paragraph}>
          Acreditamos que pequenas ações geram grandes transformações. A gestão de resíduos sólidos é um dos maiores desafios das cidades modernas e, embora os ecopontos sejam uma solução fantástica, a participação popular ainda é baixa. Por quê? Muitas vezes, pela falta de um incentivo claro que valorize o esforço do cidadão.
        </Text>
        <Text style={styles.paragraph}>
          O <Text style={styles.appName}>Ecoponto+</Text> nasceu para mudar essa realidade.
        </Text>
        
        <Text style={styles.sectionTitle}>A Solução na palma da sua mão</Text>
        <Text style={styles.paragraph}>
          Somos mais que um aplicativo; somos uma ponte entre a sua boa ação e um benefício real. Nossa plataforma gamifica o processo de reciclagem, tornando o descarte correto uma atividade recompensadora. Com o Ecoponto+, você registra seus descartes de forma simples, acumula moedas e transforma seu cuidado com o meio ambiente em vantagens diretas, como descontos em impostos municipais. É a economia circular funcionando para você e para a sua cidade.
        </Text>

        <Text style={styles.sectionTitle}>Quem somos</Text>
        <Text style={styles.paragraph}>
          Este projeto foi idealizado e desenvolvido por uma equipe de mestrandos do Programa de Pós-Graduação em Engenharia e Gestão da Inovação (PPG-INV) da Universidade Federal do ABC (UFABC), como resultado prático da disciplina "Foundations of Systems Engineering", ministrada pelo Prof. Dr. Romulo G. Lins.
        </Text>

        <Text style={styles.teamTitle}>Equipe:</Text>
        <Text style={styles.teamMember}>• Elaine Alves Lischewski;</Text>
        <Text style={styles.teamMember}>• Januario Lisboa de Souza;</Text>
        <Text style={styles.teamMember}>• Lucianne Regina Gimenes Pedroti;</Text>
        <Text style={styles.teamMember}>• Vitor Giannaccini Tito da Silva.</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
    letterSpacing: 2,
    marginTop: -50,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  appName: {
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 15,
    marginBottom: 10,
  },
  teamMember: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  }
});

export default AboutScreen;