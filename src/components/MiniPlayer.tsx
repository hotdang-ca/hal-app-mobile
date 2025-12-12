import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { theme } from '../theme/theme';
import { API_URL } from '../constants';

export const MiniPlayer = () => {
    const navigation = useNavigation<any>();
    const { currentPodcast, isPlaying, togglePlayPause, closePlayer } = usePlayer();

    if (!currentPodcast) return null;

    return (
        <Pressable
            style={styles.container}
            onPress={() => navigation.navigate('PodcastDetail', { podcast: currentPodcast })}
        >
            <View style={styles.content}>
                {currentPodcast.imageUrl ? (
                    <Image source={{ uri: `${API_URL}${currentPodcast.imageUrl}` }} style={styles.thumbnail} />
                ) : (
                    <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                        <Ionicons name="mic" size={20} color="white" />
                    </View>
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{currentPodcast.title}</Text>
                    <Text style={styles.host} numberOfLines={1}>{currentPodcast.host}</Text>
                </View>

                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                }}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={28} color={theme.colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    closePlayer();
                }} style={{ marginLeft: 12 }}>
                    <Ionicons name="close-circle" size={24} color={theme.colors.subText} />
                </TouchableOpacity>
            </View>
            {/* Progress Bar (Fake thin line at bottom/top) */}
            <View style={styles.progressBar}>
                {/* Could hook up real progress here if desired */}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 85, // Above Tab Bar (approx height) - Adjust based on safe area
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
    },
    placeholderThumbnail: {
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    host: {
        fontSize: 12,
        color: theme.colors.subText,
    },
    progressBar: {
        // Optional
    }
});
