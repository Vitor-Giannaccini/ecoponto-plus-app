import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';

const TermsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.paragraph}>
          Bem-vindo ao Ecoponto+! Ao se cadastrar e utilizar nosso aplicativo, você concorda com os seguintes termos.
        </Text>

        <Text style={styles.sectionTitle}>1. Sobre o aplicativo</Text>
        <Text style={styles.paragraph}>
          O Ecoponto+ é uma ferramenta que visa incentivar o descarte correto de resíduos em ecopontos municipais. Através do registro de descartes, os usuários podem acumular pontos (moedas) que podem ser, futuramente, convertidos em benefícios, como descontos em impostos municipais (ex: IPTU), de acordo com as parcerias estabelecidas com o poder público.
        </Text>

        <Text style={styles.sectionTitle}>2. Cadastro e conta do usuário</Text>
        <Text style={styles.paragraph}>
          Para utilizar todas as funcionalidades, você precisa criar uma conta fornecendo informações verdadeiras e precisas, como nome, e-mail e CPF. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades que ocorrerem em sua conta.
        </Text>

        <Text style={styles.sectionTitle}>3. Sistema de pontos</Text>
        <Text style={styles.paragraph}>
          Os pontos são concedidos com base no tipo e na quantidade (peso ou unidade) do material descartado e registrado no aplicativo. Todos os registros estão sujeitos a uma validação posterior por um operador. O Ecoponto+ se reserva o direito de ajustar ou invalidar pontos concedidos por registros fraudulentos ou incorretos. Os pontos não possuem valor monetário e não podem ser vendidos ou transferidos.
        </Text>

        <Text style={styles.sectionTitle}>4. Uso do aplicativo</Text>
        <Text style={styles.paragraph}>
          Você concorda em usar o aplicativo de forma ética e legal, fornecendo informações corretas sobre seus descartes. Qualquer tentativa de fraude no sistema de pontuação resultará na suspensão ou exclusão da sua conta.
        </Text>

        <Text style={styles.sectionTitle}>5. Coleta de dados</Text>
        <Text style={styles.paragraph}>
          Para o funcionamento do mapa, o aplicativo solicitará acesso à sua localização. Esses dados são usados exclusivamente para exibir os ecopontos próximos a você e não são armazenados para outros fins.
        </Text>
        
        <Text style={styles.disclaimer}>
          Este é um protótipo desenvolvido para fins acadêmicos e de demonstração. As regras de pontuação e os benefícios mencionados são representativos e dependem de futuras implementações e parcerias.
        </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'grey',
    marginTop: 30,
    textAlign: 'center',
  }
});

export default TermsScreen;