import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../../styles/global';
import { API_URL } from '../../../config/config';

type Props = NativeStackScreenProps<any>;

interface Profissional {
  id: number;
  nome: string;
  celular: string;
  email: string;
  disponivel: boolean;
  id_estabelecimento: number;
  image_url: string;
}

export default function Profissionais({ navigation }: Props) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
  const fetchProfissionais = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id_estabelecimento = await AsyncStorage.getItem('id_estabelecimento');

      if (!token || !id_estabelecimento) {
        Alert.alert('Erro', 'Token ou ID do estabelecimento não encontrado');
        return;
      }

      const response = await axios.post(
        `${API_URL}/estabelecimento/profissionais/all/privado`,
        { id_estabelecimento: Number(id_estabelecimento) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfissionais(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os profissionais.');
    }
  };

  fetchProfissionais();
}, []);


  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Profissionais</Text>

      <FlatList
        data={profissionais}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Text>Sem imagem</Text>
            )}
            <Text style={{ fontSize: 18, marginTop: 8 }}>{item.nome}</Text>
            <Text style={{ color: '#555' }}>{item.email}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 10, backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('NewPro')}
      >
        <Text style={globalStyles.buttonText}>Adicionar Profissional</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
