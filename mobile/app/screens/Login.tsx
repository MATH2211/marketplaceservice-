import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
import { API_URL } from '../config/config';
import { AuthContext } from '../context/AuthContext';
import FloatingLabelInput from './estabelecimento/components/FloatingLabelInput';

type Props = NativeStackScreenProps<any>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        senha,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      await login(token);
    } catch (error: any) {
      Alert.alert('Erro', 'Falha no login');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Login</Text>

        <FloatingLabelInput
          label="E-mail *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FloatingLabelInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
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
    </TouchableWithoutFeedback>
  );
}
