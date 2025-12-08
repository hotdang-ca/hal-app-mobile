import { ActionSheetIOS } from 'react-native';
import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </CartProvider>
  );
}
