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
  Modal,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../../styles/global';
import { API_URL } from '../../config/config';

type Props = NativeStackScreenProps<any>;

const modalidades = [
  { label: 'Bombeiro Hidráulico', value: 'bombeiro_hidraulico' },
  { label: 'Pedreiro', value: 'pedreiro' },
  { label: 'Mecânico Elétrico de Carro', value: 'mecanico_eletrico' },
  { label: 'Eletricista Residencial', value: 'eletricista_residencial' },
];

export default function NewEstabelecimento({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [modalidadeLabel, setModalidadeLabel] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const selectModalidade = (value: string, label: string) => {
    setModalidade(value);
    setModalidadeLabel(label);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!nome || !endereco || !modalidade || !image) {
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
      formData.append('modalidade', modalidade);
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

  const renderContent = () => {
    const content = (
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.title}>Novo Estabelecimento</Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor={colors.textLight}
          style={globalStyles.input}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Endereço"
          placeholderTextColor={colors.textLight}
          style={globalStyles.input}
          value={endereco}
          onChangeText={setEndereco}
        />

        <TouchableOpacity 
          style={{
            width: '100%',
            height: 50,
            backgroundColor: colors.inputBg,
            borderRadius: 8,
            padding: 15,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'center',
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ 
            color: modalidade ? colors.textPrimary : colors.textLight,
            fontSize: 16 
          }}>
            {modalidadeLabel || 'Selecione a modalidade'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
          <Text style={globalStyles.buttonText}>Selecionar Imagem</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                width: '85%',
                backgroundColor: colors.white,
                borderRadius: 12,
                padding: 20,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  Selecione a Modalidade
                </Text>

                <FlatList
                  data={modalidades}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.inputBg,
                        padding: 15,
                        borderRadius: 8,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: modalidade === item.value ? colors.primary : colors.border,
                      }}
                      onPress={() => selectModalidade(item.value, item.label)}
                    >
                      <Text style={{
                        color: colors.textPrimary,
                        fontSize: 16,
                        fontWeight: modalidade === item.value ? 'bold' : 'normal',
                      }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primaryLight,
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{
                    color: colors.white,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}
