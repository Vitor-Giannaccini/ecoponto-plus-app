// screens/RegisterScreen.js

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler,
  FlatList 
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';
import { COLORS } from '../constants/colors';
import ScannerOverlay from '../components/ScannerOverlay';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

import { auth, db } from '../firebaseConfig';
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";

import { MATERIAL_CATEGORIES } from '../constants/materials';
import CategoryIcon from '../components/CategoryIcon';

// Constantes
const SCANNER_FRAME_SIZE = 250;
const { width, height } = Dimensions.get('window');
const MATERIAL_OPTIONS = ['Plástico', 'Vidro', 'Metal', 'Papel', 'Orgânico'];

const MATERIAL_POINTS_RULES = {
  // Recicláveis (por Kg)
  'Papéis e Papelão': { points: 10, type: 'per_kg' },
  'Plásticos': { points: 15, type: 'per_kg' },
  'Vidros': { points: 5, type: 'per_kg' },
  'Metais': { points: 20, type: 'per_kg' },

  // Construção (por Kg)
  'Entulho': { points: 2, type: 'per_kg' },
  'Cerâmicas': { points: 2, type: 'per_kg' },
  'Madeiras': { points: 3, type: 'per_kg' },

  // Itens Grandes (por Unidade, o peso vira a quantidade)
  'Móveis': { points: 50, type: 'per_unit' },
  'Eletrodomésticos': { points: 100, type: 'per_unit' },
  'Pneus Usados': { points: 25, type: 'per_unit' },

  // Eletrônicos (por Unidade)
  'Celulares': { points: 30, type: 'per_unit' },
  'Computadores': { points: 80, type: 'per_unit' },
  'TVs e Rádios': { points: 60, type: 'per_unit' },
};

const RegisterScreen = ({ navigation }) => {
  // States do fluxo e dos dados
  const [step, setStep] = useState('scanning');
  const [scannedData, setScannedData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [weight, setWeight] = useState('');

  // States da câmera
  const [hasPermission, setHasPermission] = useState(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  // A "trava" para o scanner
  const isProcessingScan = useRef(false);

  // Função de lógica "voltar"
  const handleBackPress = () => {
    if (selectedMaterial) {
      setSelectedMaterial(null);
      return;
    }
    if (selectedCategory) {
      setSelectedCategory(null);
      return;
    }
    navigation.goBack();
  };

  // Configuração de cabeçalho dinâmico
  useLayoutEffect(() => {
    navigation.setOptions({
      // Define um título diferente dependendo do passo
      title: step === 'scanning' ? 'Escanear QR Code' : 'Registrar Descarte',
      
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}
        >
          <Ionicons 
            name="chevron-back" 
            size={28} 
            color={Platform.OS === 'ios' ? '#007AFF' : 'black'}
          />
          {/* Mostra o texto "Voltar" apenas na etapa do formulário */}
          {step === 'form' && (
            <Text 
              style={{ 
                color: Platform.OS === 'ios' ? '#007AFF' : 'black', 
                fontSize: 17 
              }}>
              Voltar
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, step, selectedCategory, selectedMaterial]);

  // Função de controle do botão voltar no Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Se estamos na etapa do formulário, usamos nossa lógica inteligente
        if (step === 'form') {
          handleBackPress();
          return true; // Impede a ação padrão (fechar a tela)
        }

        return false; 
      };

      // Adiciona o "espião"
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Remove o "espião" quando a tela perde o foco
      return () => subscription.remove();
    }, [step, selectedCategory, selectedMaterial])
  );

  // Pede permissão para a câmera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Função para ligar/desligar o flash
  const toggleTorch = () => {
    setIsTorchOn(prevState => !prevState);
  };

  // Função chamada quando um QR Code é lido
  const handleBarCodeScanned = ({ data }) => {
    // Se já estamos processando um scan, ignore os outros para evitar o bug
    if (isProcessingScan.current === true) {
      return;
    }
    // Ativa a trava para bloquear novas chamadas
    isProcessingScan.current = true;

    if (!data || !data.startsWith('ecoponto+::')) {
      Alert.alert(
        "QR Code Inválido",
        "Este não parece ser um QR Code de um Ecoponto válido.",
        [{ text: 'Tentar Novamente', onPress: () => { isProcessingScan.current = false; } }] // Desativa a trava
      );
      return;
    }

    const parts = data.split('::');
    if (parts.length !== 3) {
      Alert.alert(
        "QR Code Malformado",
        "O formato deste QR Code de Ecoponto é inválido.",
        [{ text: 'Tentar Novamente', onPress: () => { isProcessingScan.current = false; } }] // Desativa a trava
      );
      return;
    }

    const ecopontoId = parts[1];
    setIsTorchOn(false); // Desliga o flash após o scan
    setScannedData(ecopontoId);
    setStep('form');
  };

  // Função para enviar o descarte para o Firebase
  const handleSubmit = async () => {
    if (!selectedMaterial || !weight.trim()) {
      Alert.alert("Erro", "Por favor, selecione um material e insira o peso.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para registrar um descarte.");
      return;
    }

    const weightNumber = parseFloat(weight.replace(',', '.'));
    if (isNaN(weightNumber) || weightNumber <= 0) {
      Alert.alert("Peso Inválido", "Por favor, insira um número válido para o peso.");
      return;
    }

    const rule = MATERIAL_POINTS_RULES[selectedMaterial];
    let pointsAwarded = 0;
    
    // Cria a base do objeto de dados que será salvo
    const disposalData = {
      userId: user.uid,
      ecopontoId: scannedData,
      material: selectedMaterial,
      createdAt: serverTimestamp(),
      status: 'pending_validation'
    };

    if (rule) {
      if (rule.type === 'per_kg') {
        pointsAwarded = Math.round(rule.points * weightNumber);
        // Adiciona o campo 'weight' ao nosso objeto de dados
        disposalData.weight = weightNumber;
        disposalData.quantity = null; // Deixa o outro campo nulo para clareza
      } else if (rule.type === 'per_unit') {
        const quantity = Math.round(weightNumber); // Quantidade deve ser um número inteiro
        pointsAwarded = rule.points * quantity;
        // Adiciona o campo 'quantity' ao nosso objeto de dados
        disposalData.quantity = quantity;
        disposalData.weight = null; // Deixa o outro campo nulo
      }
    }

    if (pointsAwarded === 0) {
      Alert.alert("Erro", "Não foi possível calcular os pontos para este material.");
      return;
    }
    
    // Adiciona os pontos calculados ao objeto de dados final
    disposalData.pointsAwarded = pointsAwarded;

    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", user.uid);
        const newDisposalRef = doc(collection(db, "disposals"));

        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw "Documento do usuário não encontrado!";
        }
        
        const currentPoints = userDoc.data().totalPoints || 0;
        const newTotalPoints = currentPoints + pointsAwarded;

        // Agora salvamos o objeto 'disposalData' que preparamos
        transaction.set(newDisposalRef, disposalData);

        transaction.update(userDocRef, { totalPoints: newTotalPoints });
      });

      Alert.alert("Sucesso!", `Descarte registrado com sucesso! Você ganhou ${pointsAwarded} pontos!`);
      navigation.goBack();

    } catch (error) {
      console.error("Erro ao registrar descarte: ", error);
      Alert.alert("Erro", "Não foi possível registrar seu descarte. Tente novamente.");
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text style={styles.permissionText}>Sem acesso à câmera.</Text>;

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        enableTorch={isTorchOn}
      />

      {step === 'scanning' && (
        <>
          <ScannerOverlay />
          <View style={styles.scannerFrame} />
          <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
            <MaterialIcons name={isTorchOn ? 'flash-on' : 'flash-off'} size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.cameraText}>Aponte a câmera para o QR Code</Text>
          </View>
        </>
      )}

      {step === 'form' && (
        <View style={styles.formContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* PASSO 1: MOSTRAR CATEGORIAS */}
                {!selectedCategory && (
                    <View>
                        <Text style={styles.label}>1. Selecione a categoria:</Text>
                        {MATERIAL_CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.name}
                                style={styles.categoryButton}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <CategoryIcon 
                                    icon={category.icon} 
                                    size={24} 
                                    color={COLORS.primary} 
                                    style={{ marginRight: 15 }} 
                                />
                                <Text style={styles.categoryButtonText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* PASSO 2: MOSTRAR ITENS DA CATEGORIA SELECIONADA */}
                {selectedCategory && !selectedMaterial && (
                    <View>
                        <Text style={styles.label}>2. Em "{selectedCategory.name}", selecione o item:</Text>
                        {selectedCategory.items.map((item) => (
                            <TouchableOpacity
                                key={item.name}
                                style={styles.categoryButton}
                                onPress={() => setSelectedMaterial(item.name)}
                            >
                                <CategoryIcon 
                                    icon={item.icon} 
                                    size={24} 
                                    color={COLORS.primary} 
                                    style={{ marginRight: 15 }} 
                                />
                                <Text style={styles.categoryButtonText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* PASSO 3: MOSTRAR CAMPO DE PESO E BOTÃO FINAL */}
                {selectedMaterial && (
                  <View>
                    <Text style={styles.label}>Material selecionado:</Text>
                    <Text style={styles.selectedItemText}>{selectedMaterial}</Text>
                    
                    {/* Verifica qual é a regra para o material selecionado */}
                    {MATERIAL_POINTS_RULES[selectedMaterial]?.type === 'per_unit' ? (
                      // Se for por unidade, mostra "Quantidade"
                      <>
                        <Text style={styles.label}>3. Informe a quantidade (unidades):</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex: 3"
                          value={weight}
                          onChangeText={setWeight}
                          keyboardType="numeric"
                        />
                      </>
                    ) : (
                      // Caso contrário, mostra "Peso"
                      <>
                        <Text style={styles.label}>3. Informe o peso (em kg):</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex: 2.5"
                          value={weight}
                          onChangeText={setWeight}
                          keyboardType="numeric"
                        />
                      </>
                    )}
                    
                    <Button title="Confirmar Descarte" onPress={handleSubmit} color={COLORS.primary} />
                  </View>
                )}
                <View style={{ marginTop: 20 }}>
                    <Button title="Cancelar e Escanear Novamente" onPress={() => { setStep('scanning'); isProcessingScan.current = false; setSelectedCategory(null); setSelectedMaterial(null); }} color="grey" />
                </View>
            
            </ScrollView>

            <Text style={styles.footerText}>Ecoponto ID: {scannedData}</Text>

        </View>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  permissionText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    padding: 20,
  },
  scannerFrame: {
    position: 'absolute',
    width: SCANNER_FRAME_SIZE,
    height: SCANNER_FRAME_SIZE,
    top: height / 2 - SCANNER_FRAME_SIZE / 2 - 80,
    left: width / 2 - SCANNER_FRAME_SIZE / 2,
    borderColor: 'black',
    borderWidth: 8,
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    top: height / 2 + SCANNER_FRAME_SIZE / 2 - 60,
    alignItems: 'center',
  },
  cameraText: {
    fontSize: 18,
    color: 'white',
  },
  torchButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  formContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
},
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
  },
  selectedItemText: {
    fontSize: 18,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.dark,
  },
});

export default RegisterScreen;