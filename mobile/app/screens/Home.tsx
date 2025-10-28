import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/config';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

type Props = NativeStackScreenProps<any>;

interface Estabelecimento {
  id: number;
  nome: string;
  endereco: string;
}

interface Imagem {
  id: number;
  imagem_url: string;
  tipo: string;
  id_estabelecimento: number;
}

export default function Home({ navigation }: Props) {
  const { logout } = useContext(AuthContext);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado, faça login novamente');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(`${API_URL}/estabelecimento/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEstabelecimentos(response.data.estabelecimentos);
        setImagens(response.data.imagens);
      } catch (error: any) {
        console.error('Erro ao buscar dados:', error);
        if (error.response) {
          Alert.alert('Erro', error.response.data.message || 'Erro ao carregar dados');
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados.');
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const getImagem = (id_estabelecimento: number) => {
    const img = imagens.find((i) => i.id_estabelecimento === id_estabelecimento);
    return img ? img.imagem_url : null;
  };

  const handleSelect = async (id_estabelecimento: number) => {
    await AsyncStorage.setItem('id_estabelecimento', id_estabelecimento.toString());
    navigation.navigate('Dashboard');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('id_estabelecimento');
    logout();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo!</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewEstabelecimento')}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.white} />
        <Text style={globalStyles.buttonText}>Adicionar Estabelecimento</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.list}
        data={estabelecimentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item.id)} style={styles.card}>
            <View style={styles.cardContent}>
              {getImagem(item.id) ? (
                <Image
                  source={{ uri: getImagem(item.id)! }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="business-outline" size={60} color={colors.primary} />
                </View>
              )}
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardSubtitle}>{item.endereco}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
