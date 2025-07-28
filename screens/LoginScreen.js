// screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert, // 1. Importe o Alert para mostrar mensagens
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// 2. Importe a função de login e nossa config do Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebaseConfig';

import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import { COLORS } from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Função de Login atualizada com a lógica do Firebase
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos Vazios", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sucesso! A navegação agora é automática.
        console.log('Usuário logado:', userCredential.user.uid);
      })
      .catch((error) => {
        // O código de erro para nossa depuração
        console.log("Código do erro de login:", error.code);

        // --- TRATAMENTO DE ERRO ATUALIZADO ---
        
        // Este código agora cobre "usuário não encontrado" E "senha errada"
        if (error.code === 'auth/invalid-credential') {
          Alert.alert("Erro de Login", "E-mail ou senha inválidos. Por favor, verifique seus dados e tente novamente.");
        
        // Este erro acontece se o e-mail for mal formatado (ex: "teste@teste")
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert("Formato Inválido", "O formato do e-mail digitado não é válido.");
        
        // Um erro genérico para qualquer outra coisa (ex: problema de rede)
        } else {
          Alert.alert("Erro", "Ocorreu um erro inesperado ao tentar fazer o login.");
        }
      });
  };

  const handleForgotPassword = () => {
    // 1. Verifica se o campo de e-mail está preenchido
    if (!email.trim()) {
      Alert.alert("E-mail Necessário", "Por favor, digite seu endereço de e-mail no campo correspondente para redefinir a senha.");
      return;
    }

    // 2. Chama a função do Firebase
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // 3. Mostra uma mensagem de sucesso
        Alert.alert(
          "Verifique seu E-mail",
          "Se existir uma conta com este e-mail, um link para redefinição de senha foi enviado."
        );
      })
      .catch((error) => {
        // 4. Lida com possíveis erros
        console.log("Erro ao enviar e-mail de redefinição:", error.code);
        // Mesmo em caso de erro (ex: e-mail não encontrado), mostramos a mesma mensagem de sucesso.
        // Isso é uma prática de segurança para não revelar quais e-mails estão ou não cadastrados.
        Alert.alert(
          "Verifique seu E-mail",
          "Se existir uma conta com este e-mail, um link para redefinição de senha foi enviado."
        );
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#ffe0b8', '#D2B48C']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>ECOPONTO+</Text>
            </View>

            <StyledInput
              placeholder="E-mail"
              iconName="person-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <StyledInput
              placeholder="Senha"
              iconName="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.buttonContainer}>
              <StyledButton title="CRIAR CONTA" onPress={() => navigation.navigate('SignUp')} style={{ flex: 1, marginRight: 10 }} />
              <StyledButton title="ENTRAR" onPress={handleLogin} style={{ flex: 1 }} type="accent" />
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.linkText}>ESQUECI A MINHA SENHA</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Seus estilos (styles) continuam os mesmos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
    marginTop: -50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    color: COLORS.primary,
    marginTop: 50,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;