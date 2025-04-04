import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { sampleProducts } from '../data/products';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Em um app real, aqui faríamos uma chamada API
    setProducts(sampleProducts);
    
    // Extrair categorias únicas dos produtos
    const uniqueCategories = [...new Set(sampleProducts.map(product => product.category))];
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productImageText}>{item.name.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        <TouchableOpacity
          style={[styles.categoryItem, selectedCategory === 'all' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'all' && styles.selectedCategoryText]}>
            Todos
          </Text>
        </TouchableOpacity>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    elevation: 2,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
  },
  selectedCategory: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    color: '#2c3e50',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productList: {
    padding: 10,
  },
  productItem: {
    marginBottom: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  productImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});

export default ProductsScreen;