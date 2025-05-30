import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';

type Props = NativeStackScreenProps<any>;

export default function ForgotPassword({ navigation }: Props) {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await axios.post('http://SEU_IP:PORTA/forgot-password', { email });
      Alert.alert('Se existir, um link foi enviado para seu e-mail.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Tente novamente mais tarde');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Recuperar Senha</Text>

      <TextInput
        placeholder="Email"
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handlePasswordReset}>
        <Text style={globalStyles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={globalStyles.link}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}