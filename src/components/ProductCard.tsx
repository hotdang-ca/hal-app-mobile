import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { FadeInImage } from './FadeInImage';

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onPress, onAddToCart }: ProductCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
            <FadeInImage source={{ uri: product.imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.price}>${(product.price / 100).toFixed(2)}</Text>
                <TouchableOpacity style={styles.addButton} onPress={(e) => {
                    // Stop propagation if possible, but separate touchable handles it mostly
                    onAddToCart(product);
                }}>
                    <Text style={styles.addButtonText}>Add</Text>
                    <Ionicons name="cart-outline" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flex: 1, // Grid
        margin: theme.spacing.s,
        maxWidth: '45%'
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    content: {
        padding: theme.spacing.s,
    },
    name: {
        ...theme.typography.body,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
        height: 40,
    },
    price: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: theme.spacing.s,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.s,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        marginRight: theme.spacing.xs,
        fontWeight: 'bold',
    }
});
