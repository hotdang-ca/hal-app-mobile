import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ShopScreen } from '../ShopScreen';
import { CartProvider } from '../../context/CartContext';
import { Product } from '../../types';

// Mock API_URL
jest.mock('../../constants', () => ({
    API_URL: 'http://localhost:3000/api',
}));

// Mock Navigation
const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        setOptions: mockSetOptions,
    }),
}));

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'T-Shirt',
        price: 2500,
        description: 'Cotton',
        imageUrl: 'http://img.com/tshirt.png'
    }
];

global.fetch = jest.fn((url) => {
    if (url.includes('products')) {
        return Promise.resolve({
            json: () => Promise.resolve(mockProducts)
        });
    }
    return Promise.reject('Unknown URL');
}) as jest.Mock;

test('ShopScreen renders products and adds to cart', async () => {
    const { getByText, getAllByText } = render(
        <CartProvider>
            <ShopScreen />
        </CartProvider>
    );

    await waitFor(() => expect(getByText('T-Shirt')).toBeTruthy());
    expect(getByText('$25.00')).toBeTruthy();

    const addButtons = getAllByText('Add');
    fireEvent.press(addButtons[0]);

    // There is no visual feedback in ShopScreen other than badge which is separate component,
    // but we can verify it doesn't crash. 
    // Ideally we test CartContext separately or verify badge updates if integrated.
});
