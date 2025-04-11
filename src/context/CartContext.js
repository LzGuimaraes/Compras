import React, { createContext, useState, useContext } from 'react';
import { addPurchaseToHistory } from '../services/purchaseHistoryService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // If exists, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
      setCartItems(updatedItems);
    } else {
      // If new, add to cart with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price * (item.quantity || 1)), 
      0
    );
  };

  const finalizePurchase = async (title = 'Compra') => {
    if (cartItems.length === 0) return false;
    
    const purchase = {
      title,
      items: cartItems,
      total: getCartTotal(),
    };
    
    const success = await addPurchaseToHistory(purchase);
    if (success) {
      clearCart();
    }
    return success;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      finalizePurchase
    }}>
      {children}
    </CartContext.Provider>
  );
};