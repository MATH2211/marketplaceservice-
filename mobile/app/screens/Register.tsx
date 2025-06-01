import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';

type Props = NativeStackScreenProps<any>;

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://SEU_IP:PORTA/register', {
        email,
        senha,
      });
      Alert.alert('Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro no cadastro', 'Tente novamente');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Cadastro</Text>

      <TextInput
        placeholder="Email"
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={globalStyles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={globalStyles.link}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}