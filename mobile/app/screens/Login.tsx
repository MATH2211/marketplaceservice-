import React, { useState,useContext } from 'react';
//import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // ajuste o caminho conforme sua estrutura

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

  const { login } = useContext(AuthContext); // pega a função login do contexto

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        senha,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      // Agora chama o login do contexto para atualizar o estado global
      await login(token);

      // NÃO precisa navegar aqui manualmente, o app vai trocar a stack automaticamente
    } catch (error: any) {
      // seu código de tratamento de erro permanece igual
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