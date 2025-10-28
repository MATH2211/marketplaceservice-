import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../styles/global';
import { API_URL } from '../config/config';
import FloatingLabelInput from './estabelecimento/components/FloatingLabelInput';

type Props = NativeStackScreenProps<any>;

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Cadastro</Text>

        <FloatingLabelInput
          label="Nome completo *"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <FloatingLabelInput
          label="Usuário *"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <FloatingLabelInput
          label="Celular *"
          value={celular}
          onChangeText={setCelular}
          keyboardType="phone-pad"
        />

        <FloatingLabelInput
          label="E-mail *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FloatingLabelInput
          label="Senha *"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[globalStyles.button, loading && { opacity: 0.6 }]} 
          onPress={handleRegister}
          disabled={loading}      
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={globalStyles.link}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
