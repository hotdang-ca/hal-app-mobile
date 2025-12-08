import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { ArticlesScreen } from '../ArticlesScreen';
import { PodcastsScreen } from '../PodcastsScreen';

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
const mockArticles = [
    {
        id: '1',
        title: 'Article 1',
        category: 'News',
        publishedDate: '2025-01-01',
        summary: 'Summary 1',
        content: 'Content 1',
    },
    {
        id: '2',
        title: 'Article 2',
        category: 'Tech',
        publishedDate: '2025-01-02',
        summary: 'Summary 2',
        content: 'Content 2',
    }
];

const mockPodcasts = [
    {
        id: '1',
        title: 'Podcast 1',
        category: 'Chat',
        publishedDate: '2025-01-01',
        summary: 'Summary 1',
        thumbnailUrl: 'http://img.com/1.png',
        audioUrl: 'http://audio.com/1.mp3'
    }
];

global.fetch = jest.fn((url) => {
    if (url.includes('articles')) {
        return Promise.resolve({
            json: () => Promise.resolve(mockArticles)
        });
    }
    if (url.includes('podcasts')) {
        return Promise.resolve({
            json: () => Promise.resolve(mockPodcasts)
        });
    }
    return Promise.reject('Unknown URL');
}) as jest.Mock;

test('ArticlesScreen renders and filters', async () => {
    const { getByText, queryByText, getAllByText } = render(<ArticlesScreen />);

    // Wait for load
    await waitFor(() => expect(getByText('Article 1')).toBeTruthy());
    expect(getByText('Article 2')).toBeTruthy();

    // Filter by category
    const chips = getAllByText('News');
    fireEvent.press(chips[0]); // First one should be the filter chip

    expect(getByText('Article 1')).toBeTruthy();
    expect(queryByText('Article 2')).toBeNull();

    // Clear filter
    fireEvent.press(chips[0]);
    expect(getByText('Article 2')).toBeTruthy();
});

test('PodcastsScreen renders items', async () => {
    const { getByText } = render(<PodcastsScreen />);

    await waitFor(() => expect(getByText('Podcast 1')).toBeTruthy());
    expect(getByText('Chat • 2025-01-01')).toBeTruthy();
});
