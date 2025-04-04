import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ navigation, route }) => {
  const { finalTotal } = route.params;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Validar formulário
  const validateForm = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira seu nome completo.');
      return false;
    }
    
    if (address.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira seu endereço de entrega.');
      return false;
    }
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Erro', 'Por favor, insira um número de cartão válido.');
        return false;
      }
      
      if (cardExpiry.trim().length !== 5 || !cardExpiry.includes('/')) {
        Alert.alert('Erro', 'Por favor, insira uma data de validade válida (MM/AA).');
        return false;
      }
      
      if (cardCVV.trim().length !== 3) {
        Alert.alert('Erro', 'Por favor, insira um código de segurança válido.');
        return false;
      }
    }
    
    return true;
  };

  // Finalizar compra
  const finishPurchase = async () => {
    if (!validateForm()) return;
    
    try {
      // Em um app real, aqui enviaríamos os dados para um servidor
      // Limpar a lista de compras
      await AsyncStorage.removeItem('shoppingList');
      
      // Mostrar confirmação
      Alert.alert(
        'Compra Finalizada',
        'Sua compra foi realizada com sucesso! Obrigado por comprar conosco.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      Alert.alert('Erro', 'Não foi possível finalizar sua compra. Tente novamente.');
    }
  };

  // Formatar número do cartão
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limitar a 16 dígitos + 3 espaços
  };

  // Formatar data de validade
  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    
    return formatted;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo da Compra</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Valor Total:</Text>
          <Text style={styles.summaryValue}>R$ {finalTotal.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados de Entrega</Text>
        <Text style={styles.inputLabel}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome completo"
        />
        
        <Text style={styles.inputLabel}>Endereço de Entrega</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Digite seu endereço completo"
          multiline
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        
        <View style={styles.paymentOptions}>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'credit' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('credit')}
          >
            <Text style={styles.paymentOptionText}>Cartão de Crédito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'debit' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('debit')}
          >
            <Text style={styles.paymentOptionText}>Cartão de Débito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('pix')}
          >
            <Text style={styles.paymentOptionText}>PIX</Text>
          </TouchableOpacity>
        </View>
        
        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
          <View style={styles.cardDetails}>
            <Text style={styles.inputLabel}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="0000 0000 0000 0000"
              keyboardType="number-pad"
              maxLength={19}
            />
            
            <View style={styles.cardSecurityRow}>
              <View style={styles.cardExpiryContainer}>
                <Text style={styles.inputLabel}>Validade</Text>
                <TextInput
                  style={styles.input}
                  value={cardExpiry}
                  onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                  placeholder="MM/AA"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              
              <View style={styles.cardCVVContainer}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cardCVV}
                  onChangeText={setCardCVV}
                  placeholder="000"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </View>
          </View>
        )}
        
        {paymentMethod === 'pix' && (
          <View style={styles.pixInfo}>
            <Text style={styles.pixInfoText}>Ao finalizar a compra, você receberá um QR Code para pagamento via PIX.</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.finishButton}
        onPress={finishPurchase}
      >
        <Text style={styles.finishButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#34495e',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  inputLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedPayment: {
    borderColor: '#3498db',
    backgroundColor: '#ebf5fb',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  cardDetails: {
    marginTop: 10,
  },
  cardSecurityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardExpiryContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardCVVContainer: {
    flex: 1,
  },
  pixInfo: {
    backgroundColor: '#ebf5fb',
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  pixInfoText: {
    color: '#2980b9',
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
    elevation: 3,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;