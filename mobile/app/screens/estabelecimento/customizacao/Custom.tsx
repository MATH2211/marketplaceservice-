import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../../styles/global'; // Se você estiver usando um globalStyles

type Props = NativeStackScreenProps<any>;

export default function Custom({ navigation }: Props) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Nome da Página</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.goBack()} // ou navigation.navigate('OutraTela')
      >
        <Text style={globalStyles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
