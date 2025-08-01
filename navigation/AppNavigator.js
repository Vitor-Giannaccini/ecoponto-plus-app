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
import WalletScreen from '../screens/WalletScreen';
import AboutScreen from '../screens/AboutScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

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

// --- Componente do Botão de Ação Customizado (FAB) ---
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow
    }}
    onPress={onPress}
  >
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

const TabBarIcon = ({ focused, iconName, label }) => {
  const icon = focused ? iconName : `${iconName}-outline`;
  
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 60 }}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
      <Text style={{ color: COLORS.primary, fontSize: 12 }}>{label}</Text>
    </View>
  );
};

// --- Navegador Inferior (Tabs) ---
// Em navigation/AppNavigator.js

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 65,
          ...styles.shadow
        },
        tabBarItemStyle: {
          justifyContent: 'center' // Isso ajuda no alinhamento vertical
        }
      }}
      sceneContainerStyle={{
        paddingBottom: 100, // Ajuste para a nova altura da barra
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconName="home" label="Início" />
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconName="wallet" label="Carteira" />
        }} 
      />
      
      <Tab.Screen
        name="RegisterAction"
        options={{
          tabBarIcon: () => (<Ionicons name="qr-code" size={30} color={COLORS.dark} />),
          tabBarButton: (props) => (<CustomTabBarButton {...props} />),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('RegistroModal');
          },
        })}
      >
        {() => null}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconName="map" label="Mapa" />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconName="person" label="Perfil" />
        }} 
      />
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
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
        headerTitle: () => <Ionicons name="leaf" size={30} color={COLORS.white} />,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Ionicons name="menu" size={30} color={COLORS.white} />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Ecoponto+" component={MainTabs} />
      <Drawer.Screen name="Sobre o Ecoponto+" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

// --- Pilha de Telas do App Principal (para permitir o Modal de Registro) ---
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />
      <Stack.Screen name="RegistroModal" component={RegisterScreen} options={{ presentation: 'modal', headerShown: true, title: 'Registrar Descarte' }} />
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