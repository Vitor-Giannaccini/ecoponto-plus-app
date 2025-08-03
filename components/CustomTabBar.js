// components/CustomTabBar.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// O Botão de Ação (FAB)
const CustomTabBarButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View style={styles.fab}>
      <Ionicons name="qr-code" size={30} color={COLORS.dark} />
    </View>
  </TouchableOpacity>
);

// Ícone reutilizável
const TabBarIcon = ({ focused, iconName, label }) => {
  const icon = focused ? iconName : `${iconName}-outline`;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
      <Text style={{ color: COLORS.primary, fontSize: 12 }}>{label}</Text>
    </View>
  );
};

// Barra de abas customizada
const CustomTabBar = ({ state, navigation }) => {
  const iconConfig = {
    'Home': { iconName: 'home', label: 'Início' },
    'Wallet': { iconName: 'wallet', label: 'Carteira' },
    'Map': { iconName: 'map', label: 'Mapa' },
    'Profile': { iconName: 'person', label: 'Perfil' },
  };

  return (

    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // Ação de pressionar um botão
        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        // Botão de Ação Central (FAB)
        if (route.name === 'RegisterAction') {
          return <CustomTabBarButton key={route.key} onPress={() => navigation.navigate('RegistroModal')} />;
        }

        // Botões normais
        const { iconName, label } = iconConfig[route.name];
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TabBarIcon focused={isFocused} iconName={iconName} label={label} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    
    // Aparência
    height: 65,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    flexDirection: 'row',

    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para o FAB
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  }
});

export default CustomTabBar;