import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Business } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface BusinessCardProps {
    business: Business;
    onPress: (business: Business) => void;
}

export const BusinessCard = ({ business, onPress }: BusinessCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(business)}>
            <View style={styles.header}>
                <Text style={styles.name}>{business.name}</Text>
                <Text style={styles.category}>{business.category}</Text>
            </View>
            <Text style={styles.summary} numberOfLines={2}>{business.summary}</Text>
            <View style={styles.footer}>
                <Ionicons name="location-outline" size={14} color={theme.colors.subText} />
                <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    name: {
        ...theme.typography.subheader,
        flex: 1,
    },
    category: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    summary: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    address: {
        ...theme.typography.caption,
        marginLeft: theme.spacing.xs,
    },
});
