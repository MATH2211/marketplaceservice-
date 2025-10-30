import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../../styles/global';
import { API_URL } from '../../config/config';

type Props = NativeStackScreenProps<any>;

export default function NewEstabelecimento({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!nome || !endereco || !image) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Erro', 'Token não encontrado');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('endereco', endereco);
      formData.append('imagem', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);

      await axios.post(`${API_URL}/estabelecimento/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Estabelecimento cadastrado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro ao cadastrar', error.response?.data?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={globalStyles.title}>Novo Estabelecimento</Text>

          <TextInput
            placeholder="Nome"
            style={globalStyles.input}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            placeholder="Endereço"
            style={globalStyles.input}
            value={endereco}
            onChangeText={setEndereco}
          />

          <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
            <Text style={globalStyles.buttonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, marginVertical: 10, borderRadius: 8 }}
            />
          )}

          <TouchableOpacity
            style={[globalStyles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={globalStyles.link}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
