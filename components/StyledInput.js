// components/StyledInput.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const StyledInput = ({ iconName, placeholder, isPassword, style, ...props }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {iconName && <Ionicons name={iconName} size={22} color={COLORS.lightGray} style={styles.iconLeft} />}
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightGray}
        secureTextEntry={isPassword && !isPasswordVisible}
        multiline={false}
        {...props}
      />
      
      {isPassword && (
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.lightGray} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Layout
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    
    // Aparência
    backgroundColor: 'white', // Cor padrão
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15, // Padding para manter os ícones dentro
    marginVertical: 10,
  },
  input: {
    flex: 1, // Campo de texto que ocupa o espaço disponível
    height: '100%',
    fontSize: 16,
    color: COLORS.dark,
  },
  iconLeft: {
    marginRight: 10, // Espaço entre o ícone da esquerda e o texto
  },
});

export default StyledInput;