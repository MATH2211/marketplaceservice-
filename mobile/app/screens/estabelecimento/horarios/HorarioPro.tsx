import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<any>;

// Dicionário fixo dos dias da semana
const diasSemana: { [key: number]: string } = {
  0: 'domingo',
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sábado',
};

export default function NewHorarioPro({ navigation }: Props) {
  const hoje = new Date();

  // Cria os próximos 7 dias
  const dias = Array.from({ length: 7 }).map((_, i) => {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);

    const diaSemana = data.getDay(); // 0 = domingo, 1 = segunda...
    const label = diasSemana[diaSemana];
    const dataFormatada = data.toISOString().split('T')[0]; // formato '2025-06-11'

    return { label, dataFormatada };
  });

  // Função para salvar no AsyncStorage e navegar
  const handleSelectDia = async (dia: string) => {
    try {
      await AsyncStorage.setItem('diaSelecionado', dia);
      navigation.navigate('DiaPro'); // Navega sem parâmetros
    } catch (error) {
      console.log('Erro ao salvar o dia selecionado:', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Escolha um dia</Text>

      <FlatList
        data={dias}
        keyExtractor={(item) => item.dataFormatada}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => handleSelectDia(item.dataFormatada)}
          >
            <Text style={globalStyles.buttonText}>
              {item.label} - {item.dataFormatada}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={globalStyles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
