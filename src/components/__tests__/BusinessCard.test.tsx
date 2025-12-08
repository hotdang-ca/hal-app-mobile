import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BusinessCard } from '../BusinessCard';
import { Business } from '../../types';

const mockBusiness: Business = {
    id: '1',
    name: 'Test Business',
    category: 'Test Category',
    address: '123 Test St',
    phone: '555-5555',
    website: 'http://test.com',
    summary: 'A short summary',
    description: 'A long description',
};

test('renders business info correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(<BusinessCard business={mockBusiness} onPress={onPress} />);

    expect(getByText('Test Business')).toBeTruthy();
    expect(getByText('Test Category')).toBeTruthy();
    expect(getByText('A short summary')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
});

test('calls onPress with business object', () => {
    const onPress = jest.fn();
    const { getByText } = render(<BusinessCard business={mockBusiness} onPress={onPress} />);

    fireEvent.press(getByText('Test Business')); // Tapping text bubbles up to card
    expect(onPress).toHaveBeenCalledWith(mockBusiness);
});
