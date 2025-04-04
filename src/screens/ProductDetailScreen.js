import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [price, setPrice] = useState(product.price.toString());
  const [quantity, setQuantity] = useState(product.quantity.toString());
  
  // Função para adicionar o produto à lista de compras
  const addToShoppingList = async () => {
    try {
      // Validar preço e quantidade
      const priceValue = parseFloat(price);
      const quantityValue = parseInt(quantity);
      
      if (isNaN(priceValue) || priceValue <= 0) {
        Alert.alert('Erro', 'Por favor, insira um preço válido.');
        return;
      }
      
      if (isNaN(quantityValue) || quantityValue <= 0) {
        Alert.alert('Erro', 'Por favor, insira uma quantidade válida.');
        return;
      }
      
      // Obter a lista de compras atual
      const shoppingListJson = await AsyncStorage.getItem('shoppingList');
      let shoppingList = shoppingListJson ? JSON.parse(shoppingListJson) : [];
      
      // Verificar se o produto já está na lista
      const existingProductIndex = shoppingList.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // Atualizar o produto existente
        shoppingList[existingProductIndex] = {
          ...product,
          price: priceValue,
          quantity: quantityValue
        };
      } else {
        // Adicionar novo produto
        shoppingList.push({
          ...product,
          price: priceValue,
          quantity: quantityValue
        });
      }
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      
      Alert.alert(
        'Sucesso', 
        'Produto adicionado à lista de compras!',
        [{ text: 'OK', onPress: () => navigation.navigate('ShoppingList') }]
      );
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o produto à lista.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productHeader}>
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.productImageText}>{product.name.charAt(0)}</Text>
        </View>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        <Text style={styles.sectionTitle}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="Insira o preço"
        />
        
        <Text style={styles.sectionTitle}>Quantidade</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => {
              const newQuantity = parseInt(quantity) - 1;
              if (newQuantity >= 1) setQuantity(newQuantity.toString());
            }}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
          />
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => {
              const newQuantity = parseInt(quantity) + 1;
              setQuantity(newQuantity.toString());
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.totalPrice}>
          Total: R$ {(parseFloat(price || 0) * parseInt(quantity || 0)).toFixed(2)}
        </Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addToShoppingList}
        >
          <Text style={styles.addButtonText}>Adicionar à Lista de Compras</Text>
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
  productHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  productImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  productImageText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  detailsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 60,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;