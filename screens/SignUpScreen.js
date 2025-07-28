// screens/SignUpScreen.js

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';

import { MaskedTextInput } from "react-native-mask-text";

// 1. Importe as funções do Firebase e a nossa config
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';

import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';
import { commonStyles } from '../constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const SignUpScreen = ({ navigation }) => {
  // States para todos os campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCheckedTerms, setCheckedTerms] = useState(false);

  // 2. Função de cadastro com a lógica do Firebase
 // Em screens/SignUpScreen.js

const handleSignUp = async () => { // A função precisa ser 'async' para usar o 'await'
  // 1. Validações iniciais (campos vazios, senhas, termos)
  if (!nome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !dataNascimento.trim() || !password.trim()) {
    Alert.alert("Campos Incompletos", "Por favor, preencha todos os campos para continuar.");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("Erro de Senha", "As senhas não coincidem!");
    return;
  }
  if (!isCheckedTerms) {
    Alert.alert("Termos de Uso", "Você precisa aceitar os Termos de Uso para se cadastrar.");
    return;
  }

  try {
    // 2. VERIFICAÇÃO DE CPF DUPLICADO (no seu banco de dados)
    // Cria uma referência à sua coleção de usuários
    const usersRef = collection(db, "users");
    // Cria uma consulta para buscar documentos onde o campo 'cpf' seja igual ao CPF digitado
    const q = query(usersRef, where("cpf", "==", cpf));
    // Executa a consulta
    const querySnapshot = await getDocs(q);

    // Se a consulta encontrou algum documento, o CPF já existe
    if (!querySnapshot.empty) {
      Alert.alert("CPF em Uso", "Este CPF já está cadastrado em nosso sistema.");
      return; // Para a execução
    }

    // 3. Se o CPF é único, o código continua para criar o usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 4. Salva os dados no Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      fullName: nome,
      email: email,
      phone: telefone,
      cpf: cpf,
      birthDate: dataNascimento,
      createdAt: new Date(),
    });

    Alert.alert("Sucesso!", "Usuário cadastrado com sucesso!");
    navigation.navigate('Login');

  } catch (error) {
    // 5. Tratamento de erros (erros de autenticação ou qualquer outro problema)
    console.log("Código do erro:", error.code);

    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('E-mail em Uso', 'Este endereço de e-mail já está sendo utilizado por outra conta.');
    } else if (error.code === 'auth/weak-password') {
      Alert.alert('Senha Fraca', 'Sua senha precisa ter no mínimo 6 caracteres.');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('E-mail Inválido', 'Por favor, insira um endereço de e-mail válido.');
    } else {
      Alert.alert('Erro no Cadastro', 'Ocorreu um erro inesperado. Por favor, tente novamente.');
    }
  }
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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <StyledInput placeholder="Nome Completo" autoCapitalize="words" value={nome} onChangeText={setNome} />
          <StyledInput placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />
          
          <MaskedTextInput
            mask="(99) 99999-9999"
            onChangeText={(text, rawText) => {
              setTelefone(rawText); // Salva só os números
            }}
            value={telefone}
            placeholder="Telefone"
            keyboardType="numeric"
            style={[commonStyles.inputContainerStyle, commonStyles.textInputStyle]}
            placeholderTextColor={COLORS.lightGray}
          />
          
          <MaskedTextInput
            mask="999.999.999-99"
            onChangeText={(text, rawText) => {
              setCpf(rawText); // Salva o CPF sem a máscara
            }}
            value={cpf}
            placeholder="CPF"
            keyboardType="numeric"
            style={[commonStyles.inputContainerStyle, commonStyles.textInputStyle]}
            placeholderTextColor={COLORS.lightGray}
          />
          
          <MaskedTextInput
            mask="99/99/9999"
            onChangeText={(text, rawText) => {
              setDataNascimento(rawText);
            }}
            value={dataNascimento}
            placeholder="Data de Nascimento"
            keyboardType="numeric"
            style={[commonStyles.inputContainerStyle, commonStyles.textInputStyle]}
            placeholderTextColor={COLORS.lightGray}
          />
          
          <StyledInput placeholder="Senha" isPassword autoCorrect={false} value={password} onChangeText={setPassword} />
          <StyledInput placeholder="Confirmar Senha" isPassword autoCorrect={false} value={confirmPassword} onChangeText={setConfirmPassword} />

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