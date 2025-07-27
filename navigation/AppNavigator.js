// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Telas
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';

import RegisterScreen from '../screens/RegisterScreen';
import WalletScreen from '../screens/WalletScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// --- ALTERAÇÃO PRINCIPAL AQUI ---
// Navegador Inferior (Tabs) atualizado
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Oculta o header de cada aba
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 0,
            elevation: 5,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
        },
        tabBarIconStyle: {
            marginTop: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Início" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Registrar" 
        component={RegisterScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Carteira" 
        component={WalletScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Histórico" 
        component={HistoryScreen} 
        options={{ tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}

// Navegador Lateral (Drawer) - Sem alterações
function AppDrawer() {
  return (
    <Drawer.Navigator
        drawerContentOptions={{ activeTintColor: COLORS.primary }}
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

// Navegador Principal - Sem alterações
export default function AppNavigator() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="App" component={AppDrawer} />
    </Stack.Navigator>
  );
}