import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, finalizePurchase, clearCart } = useCart();
  const [purchaseTitle, setPurchaseTitle] = useState('');

  const handleFinalizePurchase = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.');
      return;
    }

    const title = purchaseTitle.trim() || 'Compra';
    const success = await finalizePurchase(title);
    
    if (success) {
      Alert.alert(
        'Compra Finalizada',
        'Sua compra foi registrada com sucesso!',
        [
          { 
            text: 'Ver Histórico', 
            onPress: () => navigation.navigate('PurchaseHistory') 
          },
          { 
            text: 'Continuar Comprando', 
            onPress: () => navigation.navigate('Products') 
          }
        ]
      );
    } else {
      Alert.alert('Erro', 'Não foi possível finalizar a compra. Tente novamente.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity || 1}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>Ver Produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          
          <View style={styles.purchaseTitleContainer}>
            <Text style={styles.purchaseTitleLabel}>Nome da compra (opcional):</Text>
            <TextInput
              style={styles.purchaseTitleInput}
              value={purchaseTitle}
              onChangeText={setPurchaseTitle}
              placeholder="Ex: Compras do mês"
            />
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {getCartTotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.clearButton]}
              onPress={() => {
                Alert.alert(
                  "Limpar Carrinho",
                  "Tem certeza que deseja remover todos os itens?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Limpar", style: "destructive", onPress: clearCart }
                  ]
                );
              }}
            >
              <Text style={styles.clearButtonText}>Limpar Carrinho</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.finalizeButton]}
              onPress={handleFinalizePurchase}
            >
              <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
    color: '#2c3e50',
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    backgroundColor: '#ecf0f1',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: '#2c3e50',
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    marginRight: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finalizeButton: {
    backgroundColor: '#27ae60',
    marginLeft: 8,
  },
  finalizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  purchaseTitleContainer: {
    marginBottom: 16,
  },
  purchaseTitleLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  purchaseTitleInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    elevation: 2,
  },
});

export default CartScreen;