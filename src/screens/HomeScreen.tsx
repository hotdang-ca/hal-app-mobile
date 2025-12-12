import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { theme } from '../theme/theme';
import { SocialCard } from '../components/SocialCard';
import { API_URL } from '../constants'; // Assuming this is where it is

interface FeedItem {
    id: number;
    platform: string;
    content: string;
    authorName: string;
    authorHandle: string;
    mediaUrls: string[];
    originalUrl: string;
    postedAt: string;
}

export const HomeScreen = () => {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeed = async () => {
        try {
            const response = await fetch(`${API_URL}/feed`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch feed', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchFeed();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <SocialCard item={item} />}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No updates yet.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    list: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...theme.typography.caption,
        fontSize: 16,
    }
});
