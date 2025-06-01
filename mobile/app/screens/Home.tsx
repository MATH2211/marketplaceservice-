import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
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

export default function Home({ navigation }: Props) {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

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
    navigation.navigate('Login');
  };

  return (
    <View style={globalStyles.container}>
  <Text style={globalStyles.title}>Bem-vindo!</Text>

  <TouchableOpacity
    style={[globalStyles.button, { backgroundColor: '#4CAF50', marginBottom: 20 }]}
    onPress={() => navigation.navigate('NewEstabelecimento')}
  >
    <Ionicons name="add-circle-outline" size={20} color="#fff" />
    <Text style={globalStyles.buttonText}>Adicionar Estabelecimento</Text>
  </TouchableOpacity>

  <FlatList
    data={estabelecimentos}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleSelect(item.id)}>
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          {getImagem(item.id) && (
            <Image
              source={{ uri: getImagem(item.id)! }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          )}
          <Text style={{ fontSize: 18, marginTop: 8 }}>{item.nome}</Text>
          <Text style={{ color: '#555' }}>{item.endereco}</Text>
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
