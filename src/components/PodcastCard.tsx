import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Podcast } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { FadeInImage } from './FadeInImage';
import { API_URL } from '../constants';
import { getFullUrl } from '../utils/url';

interface PodcastCardProps {
    podcast: Podcast;
    onPress: (podcast: Podcast) => void;
}

export const PodcastCard = ({ podcast, onPress }: PodcastCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(podcast)}>
            <View style={styles.thumbnail}>
                {podcast.imageUrl ? (
                    <FadeInImage source={{ uri: getFullUrl(podcast.imageUrl)! }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                ) : (
                    <Ionicons name="mic-circle" size={50} color={theme.colors.card} />
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.category}>{new Date(podcast.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.title} numberOfLines={2}>{podcast.title}</Text>
                <Text style={styles.summary} numberOfLines={2}>{podcast.description}</Text>
                <Text style={styles.host}>Host: {podcast.host}</Text>
                <View style={styles.playRow}>
                    <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
                    <Text style={styles.playText}>Listen Now</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 120, // Fixed height per request
    },
    thumbnail: {
        width: 120, // Square thumbnail
        height: '100%',
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: theme.spacing.m,
    },
    category: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.xs,
    },
    title: {
        ...theme.typography.subheader,
        fontSize: 16,
        marginBottom: theme.spacing.xs,
    },
    summary: {
        ...theme.typography.body,
        fontSize: 12,
        color: theme.colors.subText,
        marginBottom: theme.spacing.s,
    },
    host: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.s,
    },
    playRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginLeft: theme.spacing.xs,
    }
});
