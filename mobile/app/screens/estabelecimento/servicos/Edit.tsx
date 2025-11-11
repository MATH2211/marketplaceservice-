import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../config/config';

type Props = NativeStackScreenProps<any>;

interface Servico {
  id: number;
  nome: string;
  valor: string;
  tempo: number;
}

export default function Edit({ route, navigation }: Props) {
  const { servico } = route.params as { servico: Servico };

  const [nome, setNome] = useState(servico.nome);
  const [valor, setValor] = useState(servico.valor);
  
  // Divide o tempo em horas e minutos
  const [horas, setHoras] = useState(Math.floor(servico.tempo / 60).toString());
  const [minutos, setMinutos] = useState((servico.tempo % 60).toString());

  const handleSalvar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const idEstabelecimento = await AsyncStorage.getItem('id_estabelecimento');
      if (!idEstabelecimento) {
        Alert.alert('Erro', 'Estabelecimento não definido.');
        return;
      }

      // Valida os campos
      if (!nome.trim()) {
        Alert.alert('Erro', 'O nome do serviço é obrigatório.');
        return;
      }

      if (!valor.trim()) {
        Alert.alert('Erro', 'O valor do serviço é obrigatório.');
        return;
      }

      // Converte horas e minutos de volta para minutos totais
      const horasNum = Number(horas) || 0;
      const minutosNum = Number(minutos) || 0;
      const tempoEmMinutos = (horasNum * 60) + minutosNum;

      if (tempoEmMinutos === 0) {
        Alert.alert('Erro', 'O tempo deve ser maior que zero.');
        return;
      }

      await axios.put(
        `${API_URL}/servicos/edit/${idEstabelecimento}/${servico.id}`,
        {
          nome,
          valor,
          tempo: tempoEmMinutos
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Sucesso', 'Serviço atualizado!');
      navigation.goBack();
    } catch (error) {
      console.error('==== ERRO COMPLETO ====');
      console.error('Erro:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Dados da resposta:', error.response?.data);
        console.error('URL chamada:', error.config?.url);
      }
      console.error('==== FIM DO ERRO ====');
      Alert.alert('Erro', 'Não foi possível atualizar o serviço.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholder="Nome do serviço"
        />

        <Text style={styles.label}>Valor (R$):</Text>
        <TextInput
          value={valor}
          onChangeText={setValor}
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Valor"
        />

        <Text style={styles.label}>Duração do serviço:</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeInputWrapper}>
            <TextInput
              value={horas}
              onChangeText={setHoras}
              style={styles.timeInput}
              keyboardType="number-pad"
              placeholder="0"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>horas</Text>
          </View>

          <View style={styles.timeInputWrapper}>
            <TextInput
              value={minutos}
              onChangeText={setMinutos}
              style={styles.timeInput}
              keyboardType="number-pad"
              placeholder="0"
              maxLength={2}
            />
            <Text style={styles.timeLabel}>minutos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    gap: 10,
  },
  timeInputWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
  },
  timeLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
