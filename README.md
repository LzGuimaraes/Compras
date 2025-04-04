# Aplicativo de Lista de Compras

Um aplicativo móvel desenvolvido com React Native e Expo que permite aos usuários criar e gerenciar listas de compras, visualizar produtos por categorias, adicionar itens à lista de compras e finalizar compras com diferentes métodos de pagamento.

## Funcionalidades

- **Navegação intuitiva**: Interface amigável com navegação entre telas
- **Catálogo de produtos**: Visualização de produtos organizados por categorias
- **Lista de compras**: Adicione, edite e remova produtos da sua lista
- **Gerenciamento de quantidades**: Defina a quantidade de cada produto
- **Cálculo automático**: Valor total calculado automaticamente
- **Sistema de descontos**: Aplicação de descontos em valor fixo ou percentual
- **Cupons promocionais**: Suporte para aplicação de cupons de desconto
- **Checkout completo**: Processo de finalização de compra com dados de entrega e pagamento
- **Múltiplos métodos de pagamento**: Cartão de crédito, débito e PIX
- **Armazenamento local**: Dados salvos localmente usando AsyncStorage

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage
- JavaScript ES6+

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Um dispositivo móvel ou emulador para testar o aplicativo

## Instalação

1. Clone o repositório:
   ```
   git clone [URL_DO_REPOSITÓRIO]
   ```

2. Navegue até a pasta do projeto:
   ```
   cd shopping-list-app
   ```

3. Instale as dependências:
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```

## Executando o Aplicativo

1. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```
   ou
   ```
   yarn start
   ```

2. Escaneie o código QR com o aplicativo Expo Go no seu dispositivo móvel ou execute em um emulador.

## Estrutura do Projeto

```
├── src/
│   ├── data/
│   │   └── products.js       # Dados de exemplo dos produtos
│   ├── screens/
│   │   ├── HomeScreen.js     # Tela inicial
│   │   ├── ProductsScreen.js # Tela de listagem de produtos
│   │   ├── ProductDetailScreen.js # Detalhes do produto
│   │   ├── ShoppingListScreen.js # Lista de compras
│   │   └── CheckoutScreen.js # Tela de finalização da compra
│   └── App.js                # Componente principal e configuração de navegação
├── package.json              # Dependências e scripts
└── babel.config.js          # Configuração do Babel
```

## Fluxo de Uso

1. **Tela Inicial**: Navegue para "Ver Produtos" ou "Minha Lista de Compras"
2. **Produtos**: Visualize produtos por categoria e selecione um produto para ver detalhes
3. **Detalhes do Produto**: Veja informações detalhadas, defina preço e quantidade, e adicione à lista
4. **Lista de Compras**: Visualize todos os itens adicionados, edite ou remova produtos, aplique descontos ou cupons
5. **Checkout**: Preencha dados de entrega e escolha método de pagamento para finalizar a compra

## Recursos Adicionais

- **Filtro por Categorias**: Filtre produtos por categorias como alimentos, higiene, etc.
- **Edição de Itens**: Modifique preço e quantidade de produtos já adicionados à lista
- **Cálculo de Descontos**: Aplique descontos em valor fixo ou percentual
- **Validação de Formulários**: Validação de dados de entrega e pagamento
- **Formatação Automática**: Formatação de números de cartão e data de validade

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar o aplicativo.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.