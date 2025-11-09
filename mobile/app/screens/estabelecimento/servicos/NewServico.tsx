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
import { globalStyles, colors } from '../../../styles/global';
import { API_URL } from '../../../config/config';

type Props = NativeStackScreenProps<any>;

export default function NewServico({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tempo, setTempo] = useState('');
  const [image, setImage] = useState<string | null>(null);

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
    if (!nome || !valor || !tempo) {
      Alert.alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const idEstabelecimento = await AsyncStorage.getItem('id_estabelecimento');

      if (!token || !idEstabelecimento) {
        Alert.alert('Erro', 'Token ou ID do estabelecimento não encontrado');
        return;
      }

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('valor', valor);
      formData.append('tempo', tempo);
      formData.append('id_estabelecimento', idEstabelecimento);

      if (image) {
        formData.append('file', {
          uri: image,
          name: 'image.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.post(`${API_URL}/servicos/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Serviço cadastrado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro ao cadastrar', error.response?.data?.error || 'Erro desconhecido');
    }
  };

  const renderContent = () => {
    const content = (
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.title}>Novo Serviço</Text>

        <TextInput
          placeholder="Nome do Serviço"
          placeholderTextColor={colors.textLight}
          style={globalStyles.input}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Valor (R$)"
          placeholderTextColor={colors.textLight}
          style={globalStyles.input}
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Tempo (minutos)"
          placeholderTextColor={colors.textLight}
          style={globalStyles.input}
          value={tempo}
          onChangeText={setTempo}
          keyboardType="numeric"
        />

        <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
          <Text style={globalStyles.buttonText}>Selecionar Imagem (opcional)</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ 
              width: 100, 
              height: 100, 
              marginVertical: 10, 
              borderRadius: 8,
              borderWidth: 2,
              borderColor: colors.border,
            }}
          />
        )}

        <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
          <Text style={globalStyles.buttonText}>Cadastrar Serviço</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={globalStyles.link}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    );

    if (Platform.OS === 'web') {
      return content;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderContent()}
    </KeyboardAvoidingView>
  );
}
