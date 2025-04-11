import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const { cartItems } = useCart();
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>App de Compras</Text>
        <Text style={styles.subtitle}>Organize suas compras de forma fácil</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.buttonText}>Ver Produtos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cartButton]} 
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.buttonText}>Meu Carrinho</Text>
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.historyButton]} 
          onPress={() => navigation.navigate('PurchaseHistory')}
        >
          <Text style={styles.buttonText}>Histórico de Compras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartButton: {
    backgroundColor: '#27ae60',
  },
  historyButton: {
    backgroundColor: '#e67e22',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#e74c3c',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;