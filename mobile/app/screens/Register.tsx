import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
import { API_URL } from '../config/config';

type Props = NativeStackScreenProps<any>;

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [loading,setLoading] = useState(false);
  const handleRegister = async () => {
    if (!email || !senha || !username || !nome || !celular) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/register`, {
        email,
        senha,
        username,
        nome,
        celular,
      });

      Alert.alert('Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro no cadastro', error.response?.data?.error || 'Tente novamente');
    }finally{
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Cadastro</Text>

      <TextInput
        placeholder="Nome completo"
        style={globalStyles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Usuário"
        style={globalStyles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Celular"
        style={globalStyles.input}
        value={celular}
        onChangeText={setCelular}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Email"
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={globalStyles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity 
      style={globalStyles.button} 
      onPress={handleRegister}
      disabled = {loading}      
>
        <Text style={globalStyles.buttonText}>{loading ? 'Cadastrar':'Cadastrando'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={globalStyles.link}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}
