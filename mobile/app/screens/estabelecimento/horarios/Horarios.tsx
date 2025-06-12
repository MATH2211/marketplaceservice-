import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Props = NativeStackScreenProps<any>;

interface Profissional {
  id: number;
  nome: string;
  image_url: string;
}

export default function Horarios({ navigation }: Props) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProfissionais = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id_estabelecimento = await AsyncStorage.getItem('id_estabelecimento');

      if (!token || !id_estabelecimento) {
        Alert.alert('Erro', 'Token ou ID do estabelecimento não encontrado');
        return;
      }

      console.log('Token:', token);
      console.log('ID Estabelecimento:', id_estabelecimento);

      const response = await axios.post(
        'http://192.168.0.109:3000/estabelecimento/profissionais/all/privado',
        { id_estabelecimento: Number(id_estabelecimento) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProfissionais(response.data);
    } catch (error: any) {
      console.log('Erro:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não autorizado.');
    } finally {
      setLoading(false);
    }
  };

  fetchProfissionais();
}, []);

  const renderItem = ({ item }: { item: Profissional }) => (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
      }}
      onPress={() => navigation.navigate('HorariosPro', { profissionalId: item.id })}
    >
      <Image
        source={{ uri: item.image_url }}
        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
      />
      <Text style={{ fontSize: 18 }}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Profissionais</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={profissionais}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
