import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={{ fontSize: 18, marginVertical: 20 }}>
        ID do Estabelecimento: {idEstabelecimento}
      </Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
