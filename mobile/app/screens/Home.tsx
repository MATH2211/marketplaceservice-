import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

type Props = NativeStackScreenProps<any>;

export default function Home({ navigation }: Props) {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('id_estabelecimento');
    logout();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo!</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('NewEstabelecimento')}
      >
        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        <Text style={styles.menuButtonText}>Adicionar Estabelecimento</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('MeusEstabelecimentos')}
      >
        <Ionicons name="business-outline" size={24} color={colors.primary} />
        <Text style={styles.menuButtonText}>Meus Estabelecimentos</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, { marginTop: 'auto', marginBottom: 20 }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={[styles.menuButtonText, { color: colors.error }]}>Sair</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 15,
  },
});
