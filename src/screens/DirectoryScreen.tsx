import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { Business } from '../types';
import { BusinessCard } from '../components/BusinessCard';
import { API_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

export const DirectoryScreen = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const response = await fetch(`${API_URL}/businesses`);
            const data = await response.json();
            setBusinesses(data);
            setFilteredBusinesses(data);
        } catch (error) {
            console.error("Failed to fetch businesses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text) {
            const filtered = businesses.filter(b =>
                b.name.toLowerCase().includes(text.toLowerCase()) ||
                b.summary.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredBusinesses(filtered);
        } else {
            setFilteredBusinesses(businesses);
        }
    };

    const handlePress = (business: Business) => {
        navigation.navigate('DirectoryDetail', { business });
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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search businesses..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredBusinesses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BusinessCard business={item} onPress={handlePress} />
                )}
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
    searchContainer: {
        padding: theme.spacing.m,
        backgroundColor: theme.colors.background,
    },
    input: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.s,
        borderColor: theme.colors.border,
        borderWidth: 1,
        fontSize: 16,
    },
    list: {
        padding: theme.spacing.m,
    },
});
