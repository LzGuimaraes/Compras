import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShoppingListScreen = ({ navigation }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  // Carregar a lista de compras do AsyncStorage
  const loadShoppingList = async () => {
    try {
      const shoppingListJson = await AsyncStorage.getItem('shoppingList');
      if (shoppingListJson) {
        const loadedList = JSON.parse(shoppingListJson);
        setShoppingList(loadedList);
        
        // Calcular o valor total
        const total = loadedList.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        
        setTotalValue(total);
        // Calcular o valor final (com descontos zero por padrão)
        calculateFinalTotal(0, 0);
        setDiscount(0);
        setDiscountPercent(0);
        setCouponCode('');
        setCouponApplied(false);
      }
    } catch (error) {
      console.error('Erro ao carregar lista de compras:', error);
      Alert.alert('Erro', 'Não foi possível carregar sua lista de compras.');
    }
  };

  // Remover um item da lista de compras
  const removeItem = async (itemId) => {
    try {
      const updatedList = shoppingList.filter(item => item.id !== itemId);
      setShoppingList(updatedList);
      
      // Atualizar o valor total
      const total = updatedList.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      setTotalValue(total);
      // Atualizar o valor final
      calculateFinalTotal(discount, discountPercent);
      
      // Salvar a lista atualizada
      await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Erro ao remover item:', error);
      Alert.alert('Erro', 'Não foi possível remover o item da lista.');
    }
  };

  // Editar um item da lista
  const editItem = (item) => {
    navigation.navigate('ProductDetail', { product: item });
  };

  // Aplicar desconto em valor fixo
  const applyDiscount = (value) => {
    const discountValue = parseFloat(value);
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= totalValue) {
      setDiscount(discountValue);
      calculateFinalTotal(discountValue, discountPercent);
    } else {
      Alert.alert('Erro', 'Por favor, insira um valor de desconto válido.');
      setDiscount(0);
      calculateFinalTotal(0, discountPercent);
    }
  };

  // Aplicar desconto percentual
  const applyDiscountPercent = (value) => {
    const percentValue = parseFloat(value);
    if (!isNaN(percentValue) && percentValue >= 0 && percentValue <= 100) {
      setDiscountPercent(percentValue);
      calculateFinalTotal(discount, percentValue);
    } else {
      Alert.alert('Erro', 'Por favor, insira uma porcentagem válida (0-100).');
      setDiscountPercent(0);
      calculateFinalTotal(discount, 0);
    }
  };

  // Calcular o valor final com os descontos aplicados
  const calculateFinalTotal = (discountValue, percentValue) => {
    const percentDiscount = (totalValue * percentValue) / 100;
    let totalDiscount = discountValue + percentDiscount;
    
    // Adicionar desconto do cupom se aplicado
    if (couponApplied) {
      // Simulando um desconto fixo de 10% para o cupom
      const couponDiscount = totalValue * 0.1;
      totalDiscount += couponDiscount;
    }
    
    const final = totalValue - totalDiscount;
    setFinalTotal(final > 0 ? final : 0);
  };
  
  // Aplicar cupom de desconto
  const applyCoupon = () => {
    // Lista de cupons válidos (em um app real, isso viria de uma API)
    const validCoupons = ['PROMO10', 'DESCONTO20', 'BLACKFRIDAY'];
    
    if (couponCode.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um código de cupom.');
      return;
    }
    
    if (validCoupons.includes(couponCode.toUpperCase())) {
      if (!couponApplied) {
        setCouponApplied(true);
        Alert.alert('Sucesso', 'Cupom aplicado com sucesso!');
        calculateFinalTotal(discount, discountPercent);
      } else {
        Alert.alert('Aviso', 'Um cupom já foi aplicado a esta compra.');
      }
    } else {
      Alert.alert('Erro', 'Cupom inválido ou expirado.');
    }
  };
  
  // Remover cupom aplicado
  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    calculateFinalTotal(discount, discountPercent);
    Alert.alert('Aviso', 'Cupom removido.');
  };

  // Carregar a lista quando a tela for focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadShoppingList();
    });

    return unsubscribe;
  }, [navigation]);

  // Renderizar cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity} x R$ {item.price.toFixed(2)} = R$ {(item.quantity * item.price).toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => editItem(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.removeButton]}
          onPress={() => {
            Alert.alert(
              'Remover Item',
              `Deseja remover ${item.name} da lista?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: () => removeItem(item.id) }
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {shoppingList.length > 0 ? (
        <>
          <FlatList
            data={shoppingList}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
          
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Subtotal:</Text>
              <Text style={styles.totalValue}>R$ {totalValue.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <View style={styles.discountContainer}>
                <Text style={styles.totalText}>Desconto (R$):</Text>
                <TextInput
                  style={styles.discountInput}
                  value={discount.toString()}
                  onChangeText={applyDiscount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
              <Text style={styles.discountValue}>- R$ {discount.toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <View style={styles.discountContainer}>
                <Text style={styles.totalText}>Desconto (%):</Text>
                <TextInput
                  style={styles.discountInput}
                  value={discountPercent.toString()}
                  onChangeText={applyDiscountPercent}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
              </View>
              <Text style={styles.discountValue}>- R$ {((totalValue * discountPercent) / 100).toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <View style={styles.couponContainer}>
                <TextInput
                  style={styles.couponInput}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Código do cupom"
                  editable={!couponApplied}
                />
                {!couponApplied ? (
                  <TouchableOpacity 
                    style={styles.couponButton}
                    onPress={applyCoupon}
                  >
                    <Text style={styles.couponButtonText}>Aplicar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.couponButton, styles.removeCouponButton]}
                    onPress={removeCoupon}
                  >
                    <Text style={styles.couponButtonText}>Remover</Text>
                  </TouchableOpacity>
                )}
              </View>
              {couponApplied && (
                <Text style={styles.discountValue}>- R$ {(totalValue * 0.1).toFixed(2)}</Text>
              )}
            </View>
            
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={styles.finalTotalText}>Valor Total:</Text>
              <Text style={styles.finalTotalValue}>R$ {finalTotal.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { finalTotal })}
            >
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sua lista de compras está vazia</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.addButtonText}>Adicionar Produtos</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 16,
    color: '#34495e',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 80,
    marginLeft: 10,
    textAlign: 'center',
  },
  discountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  discountPercentInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 60,
    marginLeft: 10,
    textAlign: 'center',
  },
  finalTotalRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  finalTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  finalTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 10,
  },
  couponButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeCouponButton: {
    backgroundColor: '#e74c3c',
  },
  couponButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShoppingListScreen;