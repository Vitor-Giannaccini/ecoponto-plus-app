// navigation/AppNavigator.js

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Alert, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Importe TODAS as suas telas
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';

// --- Inicializadores dos Navegadores ---
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// --- Estilos para Sombra ---
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
});

// --- Navegador Inferior (Tabs) com Estilo Flutuante ---
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >

      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="RegisterAction">{() => null}</Tab.Screen>
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- Conteúdo Customizado do Menu Lateral ---
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

// --- Navegador Lateral (Drawer) ---
function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        // Estilos do Cabeçalho
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
        
        headerTitle: '',
        
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Ionicons name="menu" size={30} color={COLORS.white} />
          </TouchableOpacity>
        ),

        drawerActiveTintColor: COLORS.primary, // Cor do item ativo (verde claro)
        drawerActiveBackgroundColor: '#e6f9f0', // Fundo sutil para o item ativo
      })}
    >
      <Drawer.Screen name="Ecoponto+" component={MainTabs} />
      <Drawer.Screen name="Sobre o Ecoponto+" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

// --- Pilha de Telas do App Principal ---
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />
      <Stack.Screen
        name="RegistroModal"
        component={RegisterScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Registrar Descarte',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack.Navigator>
  )
}

// --- Pilha de Telas de Autenticação ---
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
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}