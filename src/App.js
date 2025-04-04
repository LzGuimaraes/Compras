import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importando as telas
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Início' }} 
        />
        <Stack.Screen 
          name="Products" 
          component={ProductsScreen} 
          options={{ title: 'Produtos' }} 
        />
        <Stack.Screen 
          name="ShoppingList" 
          component={ShoppingListScreen} 
          options={{ title: 'Lista de Compras' }} 
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ title: 'Detalhes do Produto' }} 
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen} 
          options={{ title: 'Finalizar Compra' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}