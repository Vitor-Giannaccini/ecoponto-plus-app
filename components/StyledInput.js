// components/StyledInput.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles'; // 1. Importa os estilos comuns

const StyledInput = ({ iconName, placeholder, isPassword, ...props }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    // 2. Aplica o estilo de container comum
    <View style={[commonStyles.inputContainerStyle, styles.viewContainer]}>
      {iconName && <Ionicons name={iconName} size={22} color={COLORS.lightGray} style={styles.icon} />}
      <TextInput
        style={[styles.input, commonStyles.textInputStyle]} // 3. Aplica o estilo de texto comum
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightGray}
        secureTextEntry={isPassword && !isPasswordVisible}
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
  // O estilo do container foi movido para commonStyles, aqui ficam só os ajustes
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  // O estilo do texto foi movido para commonStyles, aqui ficam só os ajustes
  input: {
    flex: 1,
    height: '100%',
  },
});

export default StyledInput;