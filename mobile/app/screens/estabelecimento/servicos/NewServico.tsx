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
  Keyboard,
  StyleSheet
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
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
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
    if (!nome || !valor) {
      Alert.alert('Erro', 'Preencha o nome e valor do serviço');
      return;
    }

    // Converte horas e minutos para minutos totais
    const horasNum = Number(horas) || 0;
    const minutosNum = Number(minutos) || 0;
    const tempoEmMinutos = (horasNum * 60) + minutosNum;

    if (tempoEmMinutos === 0) {
      Alert.alert('Erro', 'O tempo deve ser maior que zero');
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
      formData.append('tempo', tempoEmMinutos.toString());
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

      Alert.alert('Sucesso', 'Serviço cadastrado com sucesso!');
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
          keyboardType="decimal-pad"
        />

        {/* CAMPO DE TEMPO COM HORAS E MINUTOS */}
        <Text style={styles.label}>Duração do serviço:</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeInputWrapper}>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.textLight}
              style={styles.timeInput}
              value={horas}
              onChangeText={setHoras}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>horas</Text>
          </View>

          <View style={styles.timeInputWrapper}>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.textLight}
              style={styles.timeInput}
              value={minutos}
              onChangeText={setMinutos}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>minutos</Text>
          </View>
        </View>

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

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  timeInputWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: colors.white,
    color: colors.text,
  },
  timeLabel: {
    marginTop: 5,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
