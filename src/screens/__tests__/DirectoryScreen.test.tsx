import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { DirectoryScreen } from '../DirectoryScreen';

// Mock API_URL
jest.mock('../../constants', () => ({
    API_URL: 'http://localhost:3000/api',
}));

// Mock Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

// Mock Fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve([
                {
                    id: '1',
                    name: 'Joe Garage',
                    category: 'Automotive',
                    summary: 'Fixes cars',
                    address: '123 St',
                },
                {
                    id: '2',
                    name: 'Sal Pizza',
                    category: 'Dining',
                    summary: 'Makes pizza',
                    address: '456 Ave',
                }
            ]),
    })
) as jest.Mock;

test('renders directory and filters items', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<DirectoryScreen />);

    // Wait for fetch to load
    await waitFor(() => expect(getByText('Joe Garage')).toBeTruthy());
    expect(getByText('Sal Pizza')).toBeTruthy();

    // Filter
    const input = getByPlaceholderText('Search businesses...');
    fireEvent.changeText(input, 'Pizza');

    expect(getByText('Sal Pizza')).toBeTruthy();
    expect(queryByText('Joe Garage')).toBeNull();
});
