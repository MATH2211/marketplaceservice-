import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Alert, 
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles, colors } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/config';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any>;

interface Profissional {
  id: number;
  nome: string;
  celular: string;
  email: string;
}

interface Estabelecimento {
  id: number;
  nome: string;
  endereco: string;
  telefone?: string;
  servicos?: string;
  modalidade?: string;
  profissionais?: Profissional[];
}

interface Imagem {
  id: number;
  imagem_url: string;
  tipo: string;
  id_estabelecimento: number;
}

export default function TodosEstabelecimentos({ navigation }: Props) {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<Estabelecimento | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTodosEstabelecimentos);
    return unsubscribe;
  }, [navigation]);

  const loadTodosEstabelecimentos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado, faça login novamente');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/estabelecimento/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEstabelecimentos(response.data.estabelecimentos || []);
      setImagens(response.data.imagens || []);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      
      if (error.response) {
        Alert.alert(
          'Erro ao carregar dados',
          error.response.data.message || `Erro: ${error.response.status}`
        );
      } else if (error.request) {
        Alert.alert(
          'Erro de conexão',
          'Não foi possível conectar ao servidor. Verifique sua internet.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTodosEstabelecimentos();
  };

  const loadProfissionais = async (idEstabelecimento: number) => {
    try {
      setLoadingProfissionais(true);
      const token = await AsyncStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('Buscando profissionais para estabelecimento:', idEstabelecimento);

      const response = await axios.get(
        `${API_URL}/estabelecimento/profissionais/public_all/${idEstabelecimento}`,
        { headers }
      );

      console.log('Resposta profissionais:', response.data);
      return response.data.profissionais || response.data || [];
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('Nenhum profissional cadastrado para este estabelecimento');
      } else {
        console.error('Erro ao buscar profissionais:', error.response?.data || error.message);
        Alert.alert(
          'Aviso',
          'Não foi possível carregar os profissionais deste estabelecimento.'
        );
      }
      return [];
    } finally {
      setLoadingProfissionais(false);
    }
  };

  const getImagem = (id_estabelecimento: number) => {
    const img = imagens.find((i) => i.id_estabelecimento === id_estabelecimento);
    return img ? img.imagem_url : null;
  };

  const formatModalidade = (modalidade?: string) => {
    if (!modalidade) return 'Não informado';
    return modalidade
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCallPhone = (celular: string) => {
    if (!celular) {
      Alert.alert('Aviso', 'Número de telefone não disponível');
      return;
    }
    Linking.openURL(`tel:${celular}`);
  };

  const openDetails = async (item: Estabelecimento) => {
    setSelectedEstabelecimento(item);
    setModalVisible(true);
    
    // Carrega profissionais de forma assíncrona
    const profissionais = await loadProfissionais(item.id);
    setSelectedEstabelecimento({ ...item, profissionais });
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.text, { marginTop: 10 }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Todos os Estabelecimentos</Text>

      {estabelecimentos.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons name="business-outline" size={80} color={colors.border} />
          <Text style={styles.emptyText}>Nenhum estabelecimento cadastrado no sistema</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Recarregar</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          style={styles.list}
          data={estabelecimentos}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => openDetails(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                {getImagem(item.id) ? (
                  <Image
                    source={{ uri: getImagem(item.id)! }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="business-outline" size={60} color={colors.primary} />
                  </View>
                )}
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardSubtitle}>{item.endereco}</Text>
                  {item.modalidade && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{formatModalidade(item.modalidade)}</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal de Detalhes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Cabeçalho */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEstabelecimento?.nome}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={32} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Imagem */}
              {selectedEstabelecimento && getImagem(selectedEstabelecimento.id) ? (
                <Image
                  source={{ uri: getImagem(selectedEstabelecimento.id)! }}
                  style={styles.modalImage}
                />
              ) : (
                <View style={styles.modalPlaceholderImage}>
                  <Ionicons name="business-outline" size={80} color={colors.primary} />
                </View>
              )}

              {/* Informações */}
              <View style={styles.infoSection}>
                {/* Loading de profissionais */}
                {loadingProfissionais && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.loadingText}>Carregando profissionais...</Text>
                  </View>
                )}

                {/* Profissionais */}
                {!loadingProfissionais && selectedEstabelecimento?.profissionais && selectedEstabelecimento.profissionais.length > 0 ? (
                  selectedEstabelecimento.profissionais.map((profissional, index) => (
                    <View key={profissional.id}>
                      <Text style={styles.sectionTitle}>
                        Profissional {selectedEstabelecimento.profissionais!.length > 1 ? `${index + 1}` : ''}
                      </Text>
                      
                      <View style={styles.infoItem}>
                        <Ionicons name="person-outline" size={24} color={colors.primary} />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Nome</Text>
                          <Text style={styles.infoValue}>{profissional.nome}</Text>
                        </View>
                      </View>

                      <View style={styles.infoItem}>
                        <Ionicons name="call-outline" size={24} color={colors.primary} />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Telefone</Text>
                          <Text style={styles.infoValue}>{profissional.celular}</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={() => handleCallPhone(profissional.celular)}
                          style={styles.callButton}
                        >
                          <Ionicons name="call" size={20} color={colors.white} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={24} color={colors.primary} />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Email</Text>
                          <Text style={styles.infoValue}>{profissional.email}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : !loadingProfissionais && (
                  <View style={styles.infoItem}>
                    <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Profissional</Text>
                      <Text style={styles.infoValue}>Nenhum profissional cadastrado</Text>
                    </View>
                  </View>
                )}

                {/* Serviços */}
                <View style={styles.infoItem}>
                  <Ionicons name="hammer-outline" size={24} color={colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Serviços</Text>
                    <Text style={styles.infoValue}>{selectedEstabelecimento?.servicos || 'Não informado'}</Text>
                  </View>
                </View>

                {/* Categoria */}
                <View style={styles.infoItem}>
                  <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Categoria</Text>
                    <Text style={styles.infoValue}>{formatModalidade(selectedEstabelecimento?.modalidade)}</Text>
                  </View>
                </View>

                {/* Endereço */}
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={24} color={colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>{selectedEstabelecimento?.endereco || 'Não informado'}</Text>
                  </View>
                </View>
              </View>

              {/* Botão Fechar */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    marginBottom: 15,
  },
  loadingText: {
    marginLeft: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalPlaceholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.inputBg,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
