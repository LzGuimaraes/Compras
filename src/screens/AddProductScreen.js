import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const saveProduct = async () => {
    // Validação dos campos
    if (name.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira o nome do produto.');
      return;
    }

    if (price.trim() === '' || isNaN(parseFloat(price))) {
      Alert.alert('Erro', 'Por favor, insira um preço válido.');
      return;
    }

    try {
      // Carregar produtos existentes
      const jsonValue = await AsyncStorage.getItem('products');
      let products = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      // Criar novo produto
      const newProduct = {
        id: Date.now(), // ID único baseado no timestamp
        name: name.trim(),
        price: parseFloat(price),
        category: category.trim() || 'outros',
        description: description.trim() || `${name.trim()}`,
        quantity: 1
      };
      
      // Adicionar o novo produto à lista
      products.push(newProduct);
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem('products', JSON.stringify(products));
      
      Alert.alert(
        'Sucesso', 
        'Produto adicionado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.navigate('Products') }]
      );
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o produto. Tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Adicionar Produto</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Produto*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Arroz"
        />
        
        <Text style={styles.label}>Preço (R$)*</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="Ex: 10.99"
        />
        
        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Ex: alimentos"
        />
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição do produto"
          multiline
          numberOfLines={4}
        />
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveProduct}
        >
          <Text style={styles.saveButtonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddProductScreen;