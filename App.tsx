import { ActionSheetIOS } from 'react-native';
import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { CartProvider } from './src/context/CartContext';
import { PlayerProvider } from './src/context/PlayerContext';
import { ChatProvider } from './src/context/ChatContext';

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <PlayerProvider>
          <ChatProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </ChatProvider>
        </PlayerProvider>
      </CartProvider>
    </UserProvider>
  );
}
