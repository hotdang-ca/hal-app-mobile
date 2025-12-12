import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { API_URL } from '../constants';
import { Podcast } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { getFullUrl } from '../utils/url';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export const PodcastDetailScreen = () => {
    const route = useRoute<any>();
    const { podcast } = route.params as { podcast: Podcast };

    // Global Player State
    const {
        currentPodcast,
        isPlaying,
        isBuffering,
        position,
        duration,
        playPodcast,
        togglePlayPause,
        seekTo,
        skipForward,
        skipBackward
    } = usePlayer();

    const isCurrentPodcast = currentPodcast?.id === podcast.id;

    const parseDurationToMillis = (durationStr: string): number => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':').map(Number);
        if (parts.length === 2) {
            return (parts[0] * 60 + parts[1]) * 1000;
        }
        if (parts.length === 3) {
            return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
        }
        return 0;
    };

    const fallbackDuration = parseDurationToMillis(podcast.duration);

    const displayPosition = isCurrentPodcast ? position : 0;
    // Use actual duration if playing/loaded, otherwise fallback to metadata duration
    const displayDuration = (isCurrentPodcast && duration > 0) ? duration : fallbackDuration;

    const displayIsPlaying = isCurrentPodcast ? isPlaying : false;
    const displayIsBuffering = isCurrentPodcast ? isBuffering : false;

    const handlePlayPause = async () => {
        if (isCurrentPodcast) {
            await togglePlayPause();
        } else {
            await playPodcast(podcast);
        }
    };

    const formatTime = (millis: number) => {
        if (!millis) return "0:00";
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 600); // Wait, 600? No 60.
        const minutesCalc = Math.floor(totalSeconds / 60);
        const secondsCalc = totalSeconds % 60;
        return `${minutesCalc}:${secondsCalc < 10 ? '0' : ''}${secondsCalc}`;
    };

    const progressPercent = displayDuration > 0 ? (displayPosition / displayDuration) * 100 : 0;
    const imageUrl = getFullUrl(podcast.imageUrl);

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            {/* Header (Back button handled by Navigator, but we can add custom actions here) */}

            <View style={styles.content}>
                <View style={styles.artworkContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.artwork} />
                    ) : (
                        <View style={[styles.artwork, styles.placeholderArtwork]}>
                            <Ionicons name="mic" size={100} color="rgba(255,255,255,0.8)" />
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{podcast.title}</Text>
                    <Text style={styles.host}>{podcast.host}</Text>
                    {/* Description can be a bit long, maybe truncate or hide in player view */}
                </View>

                <View style={styles.playerContainer}>
                    {/* Progress Bar */}
                    <View style={styles.progressWrapper}>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={displayDuration}
                            value={displayPosition}
                            minimumTrackTintColor="#FFD700"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                            thumbTintColor="#FFD700"
                            onSlidingComplete={async (value) => {
                                await seekTo(value);
                            }}
                        />
                        <View style={styles.timeRow}>
                            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
                            <Text style={styles.timeText}>{formatTime(displayDuration)}</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsRow}>
                        <TouchableOpacity onPress={skipBackward} style={styles.secondaryControl}>
                            <Ionicons name="play-back-outline" size={36} color="white" />
                            <Text style={styles.controlLabel}>15s</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton} disabled={displayIsBuffering}>
                            {displayIsBuffering ? (
                                <ActivityIndicator color="#192f6a" size="large" />
                            ) : (
                                <Ionicons name={displayIsPlaying ? "pause" : "play"} size={48} color="#192f6a" style={{ marginLeft: displayIsPlaying ? 0 : 4 }} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={skipForward} style={styles.secondaryControl}>
                            <Ionicons name="play-forward-outline" size={36} color="white" />
                            <Text style={styles.controlLabel}>15s</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 60, // Space for navigation bar
    },
    artworkContainer: {
        marginTop: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 20,
    },
    artwork: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 24,
    },
    placeholderArtwork: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    host: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    playerContainer: {
        width: '100%',
        marginTop: 40,
    },
    progressWrapper: {
        marginBottom: 40,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontVariant: ['tabular-nums'],
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    playButton: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    secondaryControl: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    controlLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
    },
});
