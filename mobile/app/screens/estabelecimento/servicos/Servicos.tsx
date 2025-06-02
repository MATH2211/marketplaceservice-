import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { API_URL } from '../../../config/config';

type Props = NativeStackScreenProps<any>;

interface Servico {
  id: number;
  nome: string;
  valor: string;
  tempo: number;
}

export default function Servicos({ navigation }: Props) {
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const idEstabelecimento = await AsyncStorage.getItem('id_estabelecimento');

      const response = await axios.get(`${API_URL}/servicos/list/${idEstabelecimento}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Serviços</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => navigation.navigate('NewServico')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Adicionar Serviço</Text>
      </TouchableOpacity>
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>Valor: R$ {item.valor}</Text>
            <Text>Tempo: {item.tempo} min</Text>
          </View>
        )}
      />

      

      <TouchableOpacity
        style={{
          padding: 10,
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'red' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
