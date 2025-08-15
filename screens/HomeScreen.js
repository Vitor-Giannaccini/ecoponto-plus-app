// screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { MATERIAL_CATEGORIES } from '../constants/materials';
import CategoryIcon from '../components/CategoryIcon';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [disposalHistory, setDisposalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Ouvinte para dados do usuário
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
      }
    });

    // Ouvinte para o histórico
    const disposalsRef = collection(db, 'disposals');
    const q = query(
      disposalsRef, 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribeHistory = onSnapshot(q, (querySnapshot) => {
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisposalHistory(history);
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeHistory();
    };
  }, []);

  const getIconForMaterial = (materialName) => {
    for (const category of MATERIAL_CATEGORIES) {
      const foundItem = category.items.find(item => item.name === materialName);
      if (foundItem) return foundItem.icon;
    }
    return { library: 'Ionicons', name: 'leaf-outline' };
  };

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
    return <ActivityIndicator size="large" color={COLORS.primary} style={styles.container} />;
  }

  const firstName = userData?.fullName?.split(' ')[0] || 'Usuário';

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>Olá, {firstName}!</Text>
      <Text style={styles.subtitle}>Transforme seu lixo em moedas e troque por benefícios fiscais!</Text>
      
      {/* NOVO Contêiner para os cards */}
      <View style={styles.statsContainer}>
        {/* Card de Saldo (agora menor) */}
        <View style={styles.statCard}>
          <Image source={require('../assets/coin.png')} style={styles.cardIconImage} />
          <View>
            <Text style={styles.cardLabel}>Seu saldo</Text>
            <Text style={styles.cardValue}>{userData?.totalPoints || 0}</Text>
          </View>
        </View>

        {/* Card de Descarte (agora menor) */}
        <View style={styles.statCard}>
          <View style={styles.cardIconView}>
              <Ionicons name="leaf-outline" size={30} color={COLORS.dark} />
          </View>
          <View>
            <Text style={styles.cardLabel}>Descartes</Text>
            <Text style={styles.cardValue}>{disposalHistory.length}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.historyTitle}>Atividade recente</Text>
      <FlatList
        data={disposalHistory.slice(0, 3)}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum descarte registrado.</Text>}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.dark, textAlign: 'left' },
  subtitle: { fontSize: 16, color: 'grey', textAlign: 'left', marginTop: 8, marginBottom: 20 },
  
  // Novo estilo para o contêiner dos cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  // Estilo ajustado para os cards menores
  statCard: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 20,
    width: '48%', // Ocupa um pouco menos da metade para ter um espaço no meio
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  cardIconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cardIconView: {
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: COLORS.dark,
    fontSize: 14,
    opacity: 0.7,
  },
  cardValue: {
    color: COLORS.dark,
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  // Estilos do histórico (sem alteração)
  historyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginBottom: 10, alignSelf: 'flex-start' },
  historyItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  historyIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e6f9f0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historyDetails: { flex: 1 },
  historyMaterial: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  historyDate: { fontSize: 14, color: 'grey' },
  historyPoints: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'grey' },
});

export default HomeScreen;