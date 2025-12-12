import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { theme } from '../theme/theme';
import { Podcast } from '../types';
import { PodcastCard } from '../components/PodcastCard';
import { API_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

export const PodcastsScreen = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
        try {
            const response = await fetch(`${API_URL}/podcasts`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPodcasts(data);
            } else {
                console.error("API returned non-array:", data);
                setPodcasts([]);
            }
        } catch (error) {
            console.error("Failed to fetch podcasts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (podcast: Podcast) => {
        navigation.navigate('PodcastDetail', { podcast });
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
                data={podcasts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PodcastCard podcast={item} onPress={handlePress} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: theme.colors.subText, marginTop: 40, textAlign: 'center' }}>
                            No podcasts yet. Stay tuned!
                        </Text>
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: theme.spacing.m,
    },
});
