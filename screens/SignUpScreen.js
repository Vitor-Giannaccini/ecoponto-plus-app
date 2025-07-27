// screens/SignUpScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const SignUpScreen = ({ navigation }) => {

  const [isCheckedTerms, setCheckedTerms] = useState(false);

  const handleSignUp = () => {
    // Lógica de cadastro aqui
    navigation.navigate('App');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CADASTRO</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StyledInput placeholder="Nome Completo" />
          <StyledInput placeholder="E-mail" keyboardType="email-address" />
          <StyledInput placeholder="Telefone" keyboardType="phone-pad" />
          <StyledInput placeholder="CPF" keyboardType="numeric" />
          <StyledInput placeholder="Data de Nascimento" />
          <StyledInput placeholder="Senha" isPassword />
          <StyledInput placeholder="Confirmar Senha" isPassword />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setCheckedTerms(!isCheckedTerms)}>
            <Ionicons name={isCheckedTerms ? 'checkbox' : 'square-outline'} size={24} color={COLORS.white} />
            <Text style={styles.checkboxLabel}>Li e Aceito os <Text style={styles.link}>Termos de Uso</Text></Text>
          </TouchableOpacity>

          <StyledButton title="CONTINUAR" onPress={handleSignUp} style={{ backgroundColor: COLORS.gray, marginTop: 30 }} textStyle={{ color: '#999' }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: COLORS.white,
    fontSize: 16,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default SignUpScreen;