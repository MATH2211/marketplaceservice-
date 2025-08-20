import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../config/config';

type Props = NativeStackScreenProps<any>;

interface Servico {
  id: number;
  nome: string;
  valor: string;
  tempo: number;
}

export default function Edit({ route, navigation }: Props) {
  const { servico } = route.params as { servico: Servico };

  const [nome, setNome] = useState(servico.nome);
  const [valor, setValor] = useState(servico.valor);
  const [tempo, setTempo] = useState(servico.tempo.toString());

  const handleSalvar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const idEstabelecimento = await AsyncStorage.getItem('id_estabelecimento');
      if (!idEstabelecimento) {
        Alert.alert('Erro', 'Estabelecimento não definido.');
        return;
      }

      await axios.put(
        `${API_URL}/servicos/edit/${idEstabelecimento}/${servico.id}`,
        {
          nome,
          valor,
          tempo: Number(tempo)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Sucesso', 'Serviço atualizado!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o serviço.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Nome do serviço"
      />

      <Text style={styles.label}>Valor (R$):</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        style={styles.input}
        keyboardType="decimal-pad"
        placeholder="Valor"
      />

      <Text style={styles.label}>Tempo (min):</Text>
      <TextInput
        value={tempo}
        onChangeText={setTempo}
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Tempo em minutos"
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});