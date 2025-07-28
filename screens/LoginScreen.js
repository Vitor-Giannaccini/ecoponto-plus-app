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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import { COLORS } from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt with:', email, password);
    navigation.navigate('App');
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
        {/* 1. O TouchableWithoutFeedback começa aqui */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          {/* 2. Ele precisa de um único filho, que é o seu container principal */}
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

            <TouchableOpacity>
              <Text style={styles.linkText}>ESQUECI A MINHA SENHA</Text>
            </TouchableOpacity>
          </View>

        </TouchableWithoutFeedback>
        {/* 3. O TouchableWithoutFeedback termina aqui */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 4. Renomeado para 'container', será nosso container raiz
  container: {
    flex: 1,
  },
  // 5. O safeArea agora só precisa garantir que o conteúdo ocupe o espaço
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
    fontSize: 45,
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