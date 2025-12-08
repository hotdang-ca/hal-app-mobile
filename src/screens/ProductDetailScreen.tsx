import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CartIcon } from '../components/CartIcon';

export const ProductDetailScreen = ({ route }: any) => {
    const { product } = route.params as { product: Product };
    const { addToCart } = useCart();
    const navigation = useNavigation<any>();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <CartIcon />,
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>${(product.price / 100).toFixed(2)}</Text>
                <Text style={styles.description}>{product.description}</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addToCart(product)}
                    accessibilityLabel={`Add ${product.name} to cart`}
                    accessibilityHint="Adds the item to your shopping cart"
                >
                    <Text style={styles.buttonText}>Add to Cart</Text>
                    <Ionicons name="cart" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    image: {
        width: '100%',
        height: 300,
        backgroundColor: theme.colors.border,
    },
    content: {
        padding: theme.spacing.l,
    },
    name: {
        ...theme.typography.header,
        marginBottom: theme.spacing.s,
    },
    price: {
        ...theme.typography.subheader,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: theme.spacing.m,
    },
    description: {
        ...theme.typography.body,
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: theme.spacing.s,
    }
});
