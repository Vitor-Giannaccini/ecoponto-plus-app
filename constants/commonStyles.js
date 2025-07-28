// constants/commonStyles.js

import { COLORS } from './colors';

// Estilos que serão compartilhados por vários componentes
export const commonStyles = {
  // Estilo base para o texto de todos os inputs
  textInputStyle: {
    fontSize: 16,
    color: COLORS.dark, // A cor escura que definimos
    // Se no futuro você adicionar uma fonte customizada, colocaria aqui:
    // fontFamily: 'SuaFonteRegular', 
  },

  // Estilo base para os containers dos inputs
  inputContainerStyle: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    justifyContent: 'center',
  },
};