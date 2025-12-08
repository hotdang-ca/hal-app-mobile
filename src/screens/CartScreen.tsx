import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const CartScreen = () => {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();
    const navigation = useNavigation<any>();

    const handleCheckout = () => {
        if (items.length === 0) {
            Alert.alert('Cart Empty', 'Add items before checking out.');
            return;
        }
        // Mock Checkout
        Alert.alert(
            'Prototype Checkout',
            `Total charge would be $${(cartTotal / 100).toFixed(2)}. Proceed?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Purchase',
                    onPress: () => {
                        clearCart();
                        Alert.alert('Success', 'Order Placed! (Mock)');
                        // Navigate to Shop Tab first (in background)
                        navigation.navigate('MainTabs', { screen: 'Shop' });
                        // Then dismiss the modal
                        navigation.goBack();
                    }
                }
            ]
        )
    };

    return (
        <View style={styles.container}>
            {items.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="cart-outline" size={64} color={theme.colors.subText} />
                    <Text style={styles.emptyText}>Your cart is empty.</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>
                                    ${(item.price / 100).toFixed(2)} x {item.quantity}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>${(cartTotal / 100).toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                    accessibilityRole="button"
                    accessibilityLabel="Checkout"
                    accessibilityHint="Proceeds to payment with current items"
                >
                    <Text style={styles.checkoutText}>Checkout (Mock)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...theme.typography.subheader,
        color: theme.colors.subText,
        marginTop: theme.spacing.m,
    },
    list: {
        padding: theme.spacing.m,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: theme.colors.card,
        marginBottom: theme.spacing.s,
        borderRadius: theme.borderRadius.s,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        ...theme.typography.body,
        fontWeight: 'bold',
    },
    itemPrice: {
        ...theme.typography.caption,
    },
    footer: {
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.m,
    },
    totalLabel: {
        ...theme.typography.subheader,
    },
    totalValue: {
        ...theme.typography.subheader,
        color: theme.colors.primary,
    },
    checkoutButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
