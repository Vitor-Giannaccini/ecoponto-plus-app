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
    // 1. Um container principal que vai segurar tanto o fundo quanto o conteúdo
    <View style={styles.container}>
      {/* 2. O gradiente agora é o fundo absoluto, preenchendo toda a tela */}
      <LinearGradient
        colors={['#ffe0b8', '#D2B48C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        // StyleSheet.absoluteFill faz o gradiente se comportar como um papel de parede
        style={StyleSheet.absoluteFill}
      />
      
      {/* 3. O SafeAreaView agora fica por cima, de forma transparente,
          apenas para posicionar o conteúdo dentro da área segura */}
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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