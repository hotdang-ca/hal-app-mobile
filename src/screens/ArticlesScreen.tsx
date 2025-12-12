import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme/theme';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { API_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

export const ArticlesScreen = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch(`${API_URL}/articles`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setArticles(data);
                setFilteredArticles(data);
            } else {
                console.error("API returned non-array:", data);
                setArticles([]);
                setFilteredArticles([]);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (article: Article) => {
        navigation.navigate('ArticleDetail', { article });
    };

    const filterByCategory = (category: string) => {
        if (category === categoryFilter) {
            setCategoryFilter('');
            setFilteredArticles(articles);
        } else {
            setCategoryFilter(category);
            setFilteredArticles(articles.filter(a => a.category === category));
        }
    };

    const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean) as string[]));

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={categories}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.chip,
                                categoryFilter === item && styles.chipActive
                            ]}
                            onPress={() => filterByCategory(item)}
                        >
                            <Text style={[
                                styles.chipText,
                                categoryFilter === item && styles.chipTextActive
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item}
                    contentContainerStyle={{ paddingHorizontal: theme.spacing.m }}
                />
            </View>

            <FlatList
                data={filteredArticles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ArticleCard article={item} onPress={handlePress} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: theme.colors.subText, marginTop: 40, textAlign: 'center' }}>
                            No articles found. Check back later!
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
    filterContainer: {
        height: 60,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
    },
    chip: {
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        marginRight: theme.spacing.s,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        ...theme.typography.caption,
        color: theme.colors.text,
    },
    chipTextActive: {
        color: theme.colors.card,
    },
    list: {
        padding: theme.spacing.m,
    },
});
