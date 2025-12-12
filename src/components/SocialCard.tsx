import React from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

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

interface SocialCardProps {
    item: FeedItem;
}

export const SocialCard = ({ item }: SocialCardProps) => {
    const handlePress = () => {
        if (item.originalUrl) {
            Linking.openURL(item.originalUrl);
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={handlePress}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{item.authorName}</Text>
                    <Text style={styles.authorHandle}>@{item.authorHandle}</Text>
                </View>
                <Ionicons name="logo-twitter" size={20} color={theme.colors.subText} />
            </View>

            {/* Content */}
            <Text style={styles.content}>{item.content}</Text>

            {/* Media */}
            {item.mediaUrls && item.mediaUrls.length > 0 && (
                <View style={styles.mediaContainer}>
                    {item.mediaUrls.map((url, index) => (
                        <Image key={index} source={{ uri: url }} style={styles.media} resizeMode="cover" />
                    ))}
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.timestamp}>{new Date(item.postedAt).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border || '#eee',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorInfo: {
        flexDirection: 'column',
    },
    authorName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.colors.text,
    },
    authorHandle: {
        fontSize: 14,
        color: theme.colors.subText,
    },
    content: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    media: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    timestamp: {
        fontSize: 12,
        color: theme.colors.subText,
    },
});
