import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';

import { DirectoryDetailScreen } from '../screens/DirectoryDetailScreen';
import { ArticleDetailScreen } from '../screens/ArticleDetailScreen';
import { PodcastDetailScreen } from '../screens/PodcastDetailScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DirectoryDetail"
                    component={DirectoryDetailScreen}
                    options={{ title: 'Ranked Business' }}
                />
                <Stack.Screen
                    name="ArticleDetail"
                    component={ArticleDetailScreen}
                    options={{ title: 'Article' }}
                />
                <Stack.Screen
                    name="PodcastDetail"
                    component={PodcastDetailScreen}
                    options={{ title: 'Now Playing' }}
                />
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                    options={{ title: 'Product' }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'Your Cart', presentation: 'modal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
