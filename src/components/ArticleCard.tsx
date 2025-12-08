import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    onPress: (article: Article) => void;
}

export const ArticleCard = ({ article, onPress }: ArticleCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(article)}>
            <View style={styles.header}>
                <Text style={styles.category}>{article.category}</Text>
                <Text style={styles.date}>{article.publishedDate}</Text>
            </View>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.summary} numberOfLines={2}>{article.summary}</Text>
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
        marginBottom: theme.spacing.xs,
    },
    category: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    date: {
        ...theme.typography.caption,
    },
    title: {
        ...theme.typography.subheader,
        marginBottom: theme.spacing.s,
    },
    summary: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.subText,
    },
});
