import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

export const CartIcon = () => {
    const { itemCount } = useCart();
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.container}>
            <Ionicons name="cart" size={24} color={theme.colors.primary} />
            {itemCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginRight: 10,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: theme.colors.error,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
