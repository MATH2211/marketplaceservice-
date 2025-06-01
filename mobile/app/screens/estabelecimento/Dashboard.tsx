import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<any>;

export default function Dashboard({ navigation }: Props) {
  const [idEstabelecimento, setIdEstabelecimento] = useState<string | null>(null);

  useEffect(() => {
    const getId = async () => {
      const id = await AsyncStorage.getItem('id_estabelecimento');
      setIdEstabelecimento(id);
    };
    getId();
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard do Estabelecimento</Text>

      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        ID do Estabelecimento: {idEstabelecimento}
      </Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('Agendamentos')}
      >
        <Text style={globalStyles.buttonText}>Agendamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('Servicos')}
      >
        <Text style={globalStyles.buttonText}>Serviços</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('Horarios')}
      >
        <Text style={globalStyles.buttonText}>Horários</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('Profissionais')}
      >
        <Text style={globalStyles.buttonText}>Profissionais</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('Customizacao')}
      >
        <Text style={globalStyles.buttonText}>Customização</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#e74c3c' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
