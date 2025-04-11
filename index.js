import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './src/App';

// Register the app
AppRegistry.registerComponent('main', () => App);

// For Expo, we use registerRootComponent
registerRootComponent(App); 