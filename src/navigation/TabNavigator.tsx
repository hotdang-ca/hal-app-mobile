import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { DirectoryScreen } from '../screens/DirectoryScreen';
import { ArticlesScreen } from '../screens/ArticlesScreen';
import { PodcastsScreen } from '../screens/PodcastsScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { HotlineScreen } from '../screens/HotlineScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { theme } from '../theme/theme';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help'; // Default

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Directory') {
                        iconName = focused ? 'people' : 'people-outline'; // Hal Knows A Guy -> People
                    } else if (route.name === 'Articles') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    } else if (route.name === 'Podcasts') {
                        iconName = focused ? 'headset' : 'headset-outline';
                    } else if (route.name === 'Shop') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Hotline') {
                        iconName = focused ? 'mic' : 'mic-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.subText,
                headerShown: true, // Show header for simple screens
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTitleStyle: {
                    ...theme.typography.subheader,
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Hal App' }} />
            <Tab.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Hal Knows A Guy' }} />
            <Tab.Screen name="Articles" component={ArticlesScreen} />
            <Tab.Screen name="Podcasts" component={PodcastsScreen} />
            <Tab.Screen name="Shop" component={ShopScreen} />
            <Tab.Screen name="Hotline" component={HotlineScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};
