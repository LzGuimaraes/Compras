import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para salvar os produtos no AsyncStorage
export const saveProducts = async (products) => {
  try {
    const jsonValue = JSON.stringify(products);
    await AsyncStorage.setItem('products', jsonValue);
    return true;
  } catch (e) {
    console.error('Erro ao salvar produtos:', e);
    return false;
  }
};

// Função para carregar os produtos do AsyncStorage
export const loadProducts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('products');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao carregar produtos:', e);
    return [];
  }
};

// Função para deletar um produto
export const deleteProduct = async (productId) => {
  try {
    const currentProducts = await loadProducts();
    const updatedProducts = currentProducts.filter(product => product.id !== productId);
    const success = await saveProducts(updatedProducts);
    return success;
  } catch (e) {
    console.error('Erro ao deletar produto:', e);
    return false;
  }
};