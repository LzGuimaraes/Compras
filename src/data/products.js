export const sampleProducts = [
  {
    id: 1,
    name: 'Arroz',
    category: 'alimentos',
    price: 22.90,
    description: 'Arroz branco tipo 1, pacote de 5kg. Produto de alta qualidade e grãos selecionados.',
    quantity: 1
  },
  {
    id: 2,
    name: 'Feijão',
    category: 'alimentos',
    price: 8.50,
    description: 'Feijão carioca tipo 1, pacote de 1kg. Grãos selecionados e de cozimento rápido.',
    quantity: 1
  },
  {
    id: 3,
    name: 'Leite',
    category: 'laticínios',
    price: 4.99,
    description: 'Leite integral UHT, embalagem de 1 litro. Rico em cálcio e vitaminas.',
    quantity: 1
  },
  {
    id: 4,
    name: 'Pão',
    category: 'padaria',
    price: 7.99,
    description: 'Pão francês fresco, pacote com 10 unidades. Crocante por fora e macio por dentro.',
    quantity: 1
  },
  {
    id: 5,
    name: 'Maçã',
    category: 'frutas',
    price: 8.90,
    description: 'Maçã vermelha, pacote com 1kg. Frutas frescas e selecionadas.',
    quantity: 1
  },
  {
    id: 6,
    name: 'Sabonete',
    category: 'higiene',
    price: 2.50,
    description: 'Sabonete em barra, 90g. Perfume suave e hidratante.',
    quantity: 1
  },
  {
    id: 7,
    name: 'Detergente',
    category: 'limpeza',
    price: 3.20,
    description: 'Detergente líquido, 500ml. Remove gordura e deixa as louças brilhando.',
    quantity: 1
  },
  {
    id: 8,
    name: 'Papel Higiênico',
    category: 'higiene',
    price: 18.90,
    description: 'Papel higiênico folha dupla, pacote com 12 rolos. Macio e resistente.',
    quantity: 1
  },
  {
    id: 9,
    name: 'Café',
    category: 'alimentos',
    price: 15.90,
    description: 'Café torrado e moído, pacote de 500g. Aroma intenso e sabor encorpado.',
    quantity: 1
  },
  {
    id: 10,
    name: 'Açúcar',
    category: 'alimentos',
    price: 4.99,
    description: 'Açúcar refinado, pacote de 1kg. Ideal para doces e bebidas.',
    quantity: 1
  }
];

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
    return jsonValue != null ? JSON.parse(jsonValue) : sampleProducts;
  } catch (e) {
    console.error('Erro ao carregar produtos:', e);
    return sampleProducts;
  }
};