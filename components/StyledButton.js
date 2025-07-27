// components/StyledButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const StyledButton = ({ title, onPress, style, textStyle, type = 'primary' }) => {
  const buttonColor = type === 'accent' ? COLORS.accent : COLORS.primary;
  const textColor = type === 'accent' ? COLORS.primary : COLORS.white;

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }, style]} onPress={onPress}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StyledButton;