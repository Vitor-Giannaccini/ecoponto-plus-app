// screens/WalletScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

import { MATERIAL_CATEGORIES } from '../constants/materials';
import CategoryIcon from '../components/CategoryIcon';

const WalletScreen = () => {
  const [userData, setUserData] = useState(null);
  const [disposalHistory, setDisposalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // --- OUVINTE EM TEMPO REAL PARA OS DADOS DO USUÁRIO (PONTOS) ---
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        console.log("Documento do usuário não encontrado!");
      }
    });

    // --- OUVINTE EM TEMPO REAL PARA O HISTÓRICO DE DESCARTES ---
    const disposalsRef = collection(db, 'disposals');
    const q = query(
      disposalsRef, 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribeHistory = onSnapshot(q, (querySnapshot) => {
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDisposalHistory(history);
      setLoading(false);
    }, (error) => { // Adicionamos um tratamento de erro para o ouvinte
      console.error("Erro ao buscar histórico em tempo real: ", error);
      setLoading(false);
    });

    // Função de limpeza: agora para os DOIS "ouvintes"
    return () => {
      unsubscribeUser();
      unsubscribeHistory();
    };
  }, []);

  // Função para encontrar o objeto do ícone pelo nome do material
    const getIconForMaterial = (materialName) => {
      for (const category of MATERIAL_CATEGORIES) {
        const foundItem = category.items.find(item => item.name === materialName);
        if (foundItem) {
          return foundItem.icon;
        }
      }
      return { library: 'Ionicons', name: 'leaf-outline' }; // Ícone padrão caso não encontre
    };

  // Item da lista de histórico
  const renderHistoryItem = ({ item }) => {
    const iconObject = getIconForMaterial(item.material);

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <CategoryIcon icon={iconObject} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.historyDetails}>
          <Text style={styles.historyMaterial}>{item.material}</Text>
          <Text style={styles.historyDate}>
            {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Data indisponível'}
          </Text>
        </View>
        <Text style={styles.historyPoints}>+{item.pointsAwarded} pts</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {/* 2. Card do Saldo com a nova estrutura e estilos */}
      <View style={styles.balanceCard}>
        <Image 
          source={require('../assets/coin.png')} 
          style={styles.coinImage} 
        />
        <View>
          <Text style={styles.balanceLabel}>Seu saldo atual</Text>
          <Text style={styles.balanceAmount}>
            {userData?.totalPoints || 0}
            <Text style={styles.balanceCoin}> moedas</Text>
          </Text>
        </View>
      </View>
      
      <Text style={styles.historyTitle}>Histórico de transações</Text>

      <FlatList
        data={disposalHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não registrou nenhum descarte.</Text>}
      />
    </View>
  );
};

// 3. StyleSheet completamente atualizado
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 105, 
  },
  balanceCard: {
    backgroundColor: COLORS.accent, // Cor de fundo alterada para o verde claro
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    flexDirection: 'row', // Alinha os itens (imagem e texto) lado a lado
    alignItems: 'center', // Centraliza os itens verticalmente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  coinImage: {
    width: 60,
    height: 60,
    marginRight: 20, // Espaçamento entre a moeda e o texto
  },
  balanceLabel: {
    color: COLORS.dark, // Cor da fonte alterada para preto
    fontSize: 18,
    opacity: 0.7, // Um pouco de opacidade para diferenciar do saldo
  },
  balanceAmount: {
    color: COLORS.dark, // Cor da fonte alterada para preto
    fontSize: 42, // Ajustei o tamanho para caber melhor
    fontWeight: 'bold',
  },
  balanceCoin: {
    fontSize: 22, // Ajustei o tamanho
    fontWeight: 'normal',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  historyDetails: {
    flex: 1,
  },
  historyMaterial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  historyDate: {
    fontSize: 14,
    color: 'grey',
  },
  historyPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'grey',
  }
});

export default WalletScreen;