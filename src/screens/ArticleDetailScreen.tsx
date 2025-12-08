import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { theme } from '../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Article } from '../types';

type RootStackParamList = {
    ArticleDetail: { article: Article };
};

export const ArticleDetailScreen = ({ route }: any) => {
    const { article } = route.params;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.date}>Published on {article.publishedDate}</Text>

            <View style={styles.divider} />

            <Markdown style={markdownStyles}>
                {article.content}
            </Markdown>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.m,
        paddingBottom: theme.spacing.xl,
    },
    category: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    title: {
        ...theme.typography.header,
        marginBottom: theme.spacing.s,
    },
    date: {
        ...theme.typography.caption,
        fontStyle: 'italic',
        marginBottom: theme.spacing.m,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: theme.spacing.m,
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        ...theme.typography.body,
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        ...theme.typography.header,
        fontSize: 22,
        marginTop: theme.spacing.l,
        marginBottom: theme.spacing.s,
    },
    heading2: {
        ...theme.typography.subheader,
        marginTop: theme.spacing.m,
        marginBottom: theme.spacing.xs,
    },
    list_item: {
        ...theme.typography.body,
        marginVertical: theme.spacing.xs,
    }
});
