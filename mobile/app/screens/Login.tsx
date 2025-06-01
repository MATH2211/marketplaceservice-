import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
import { API_URL } from '../config/config';


type Props = NativeStackScreenProps<any>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, {  // lembre de corrigir a rota aqui
      email,
      senha,
    });

    const token = response.data.token;
    //salvar token no asyncStorage 
    await AsyncStorage.setItem('token', token);
    navigation.navigate('Home');
  } catch (error: any) {
    console.error('Erro no login:', error);

    if (error.response) {
      // Erro vindo da resposta do servidor (ex: 401, 500)
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      Alert.alert('Erro no login', error.response.data.message || 'Email ou senha inválidos');
    } else if (error.request) {
      // Erro na requisição (ex: servidor não respondeu)
      console.error('Request:', error.request);
      Alert.alert('Erro de conexão', 'Servidor não respondeu. Verifique sua conexão.');
    } else {
      // Erro inesperado
      console.error('Erro inesperado:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  }
};


  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>

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

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={globalStyles.link}>Cadastrar-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={globalStyles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
}