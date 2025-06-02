import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const API_URL = 'http://192.168.0.109:3000';

type Props = NativeStackScreenProps<any>;

export default function NewServico({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tempo, setTempo] = useState('');

  const handleAdicionar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const idEstabelecimento = await AsyncStorage.getItem('id_estabelecimento');

      await axios.post(
        `${API_URL}/servicos/create`,
        {
          nome,
          valor,
          tempo: Number(tempo),
          id_estabelecimento: Number(idEstabelecimento),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Sucesso', 'Serviço cadastrado!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o serviço.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Novo Serviço</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Tempo (min)"
        value={tempo}
        onChangeText={setTempo}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleAdicionar}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          Cadastrar Serviço
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'red' }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}