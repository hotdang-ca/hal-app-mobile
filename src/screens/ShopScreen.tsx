import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { API_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { CartIcon } from '../components/CartIcon';

export const ShopScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
        navigation.setOptions({
            headerRight: () => <CartIcon />
        });
    }, [navigation]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (product: Product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ProductCard product={item} onPress={handlePress} onAddToCart={handleAddToCart} />
                )}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: theme.spacing.s,
    },
});
