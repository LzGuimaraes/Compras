import AsyncStorage from '@react-native-async-storage/async-storage';

const PURCHASE_HISTORY_KEY = '@shopping_app:purchase_history';

// Obter todo o histórico de compras
export const getPurchaseHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PURCHASE_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao obter histórico de compras:', error);
    return [];
  }
};

// Adicionar uma nova compra ao histórico
export const addPurchaseToHistory = async (purchase) => {
  try {
    // Adiciona data e ID à compra
    const purchaseWithMeta = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Obtém histórico atual e adiciona nova compra
    const currentHistory = await getPurchaseHistory();
    const updatedHistory = [purchaseWithMeta, ...currentHistory];
    
    // Salva histórico atualizado
    await AsyncStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao adicionar compra ao histórico:', error);
    return false;
  }
};

// Limpar todo o histórico de compras
export const clearPurchaseHistory = async () => {
  try {
    await AsyncStorage.removeItem(PURCHASE_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar histórico de compras:', error);
    return false;
  }
};

// Remover uma compra específica do histórico
export const removePurchaseFromHistory = async (purchaseId) => {
  try {
    const currentHistory = await getPurchaseHistory();
    const updatedHistory = currentHistory.filter(item => item.id !== purchaseId);
    await AsyncStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao remover compra do histórico:', error);
    return false;
  }
};