import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<any>;

export default function DiaPro({ navigation }: Props) {
  const [dia, setDia] = useState<string | null>(null);

  useEffect(() => {
    const fetchDia = async () => {
      try {
        const diaSalvo = await AsyncStorage.getItem('diaSelecionado');
        if (diaSalvo) {
          setDia(diaSalvo);
        }
      } catch (error) {
        console.log('Erro ao ler o dia selecionado:', error);
      }
    };

    fetchDia();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dia Selecionado</Text>
      <Text style={globalStyles.text}>{dia || 'Carregando...'}</Text>

      <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
