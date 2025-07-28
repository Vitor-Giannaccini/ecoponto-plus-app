// navigation/AppNavigator.js

// --- React & React Native Imports ---
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';

// --- Firebase Imports ---
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';

// --- Navigation Imports ---
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- Icon Imports ---
import { Ionicons } from '@expo/vector-icons';

// --- Constants ---
import { COLORS } from '../constants/colors';

// --- Screen Imports ---
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WalletScreen from '../screens/WalletScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';

// --- Navigator Initializers ---
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


// --- COMPONENTES DE NAVEGAÇÃO ---

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: COLORS.white, borderTopWidth: 0, elevation: 5 },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarIconStyle: { marginTop: 5 }
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} />
      <Tab.Screen name="Registrar" component={RegisterScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={24} color={color} /> }} />
      <Tab.Screen name="Carteira" component={WalletScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={24} color={color} /> }} />
      <Tab.Screen name="Histórico" component={HistoryScreen} options={{ tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

function CustomDrawerContent(props) {
  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Erro ao fazer logout: ", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    });
  };
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sair"
        onPress={handleLogout}
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
      />
    </DrawerContentScrollView>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
        headerTitle: () => <Ionicons name="leaf" size={30} color={COLORS.white} />,
      }}
    >
      <Drawer.Screen name="Ecoponto+" component={MainTabs} />
      <Drawer.Screen name="Sobre o Ecoponto+" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}


// --- NAVEGADOR PRINCIPAL COM A LÓGICA DE SESSÃO ---
export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppDrawer} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}