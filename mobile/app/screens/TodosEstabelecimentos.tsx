import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/config';
import { Ionicons } from '@expo/vector-icons';

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

export default function TodosEstabelecimentos({ navigation }: Props) {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTodosEstabelecimentos);
    return unsubscribe;
  }, [navigation]);

  const loadTodosEstabelecimentos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado, faça login novamente');
        navigation.navigate('Login');
        return;
      }

      // Endpoint que retorna TODOS os estabelecimentos do sistema
      const response = await axios.get(`${API_URL}/estabelecimento/todos`, {
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
    } finally {
      setLoading(false);
    }
  };

  const getImagem = (id_estabelecimento: number) => {
    const img = imagens.find((i) => i.id_estabelecimento === id_estabelecimento);
    return img ? img.imagem_url : null;
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center' }]}>
        <Text style={globalStyles.text}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Todos os Estabelecimentos</Text>

      {estabelecimentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={80} color={colors.border} />
          <Text style={styles.emptyText}>Nenhum estabelecimento cadastrado no sistema</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={estabelecimentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
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
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
});
