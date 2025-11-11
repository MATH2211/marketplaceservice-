import { StyleSheet } from 'react-native';

// Paleta de Cores
export const colors = {
  // Azuis
  primary: '#1E88E5',        // Azul principal
  primaryDark: '#1565C0',    // Azul escuro (hover/pressed)
  primaryLight: '#42A5F5',   // Azul claro (destaque)
  secondary: '#0D47A1',      // Azul muito escuro (textos importantes)
  
  // Brancos e Cinzas
  white: '#FFFFFF',
  background: '#F5F9FF',     // Branco levemente azulado
  inputBg: '#E3F2FD',        // Fundo dos inputs (azul muito claro)
  
  // Textos
  textPrimary: '#0D47A1',    // Texto principal (azul escuro)
  textSecondary: '#64B5F6',  // Texto secundário (azul médio)
  textLight: '#90CAF9',      // Texto claro
  text: '#0D47A1',

  // Bordas
  border: '#BBDEFB',         // Bordas suaves
  
  // Estados
  success: '#1E88E5',
  error: '#E53935',
  disabled: '#B3E5FC',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  link: {
    color: colors.primaryLight,
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    marginVertical: 10,
  },
});
