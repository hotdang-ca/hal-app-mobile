import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Podcast } from '../types';
import { Ionicons } from '@expo/vector-icons';

export const PodcastDetailScreen = ({ route }: any) => {
    const { podcast } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: podcast.thumbnailUrl }} style={styles.artwork} />

            <View style={styles.info}>
                <Text style={styles.title}>{podcast.title}</Text>
                <Text style={styles.category}>{podcast.category}</Text>
            </View>

            <View style={styles.controls}>
                <Ionicons name="play-skip-back" size={40} color={theme.colors.text} />
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={50} color={theme.colors.card} />
                </TouchableOpacity>
                <Ionicons name="play-skip-forward" size={40} color={theme.colors.text} />
            </View>

            <View style={styles.progress}>
                <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                </View>
                <View style={styles.timeRow}>
                    <Text style={styles.time}>0:00</Text>
                    <Text style={styles.time}>-12:45</Text>
                </View>
            </View>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Episode Notes</Text>
                <Text style={styles.summary}>{podcast.summary}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        padding: theme.spacing.l,
    },
    artwork: {
        width: 250,
        height: 250,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.l,
        backgroundColor: theme.colors.border,
    },
    info: {
        alignItems: 'center',
        marginBottom: theme.spacing.l,
    },
    title: {
        ...theme.typography.header,
        textAlign: 'center',
        marginBottom: theme.spacing.s,
    },
    category: {
        ...theme.typography.subheader,
        color: theme.colors.primary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.l,
    },
    playButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    progress: {
        width: '100%',
        marginBottom: theme.spacing.xl,
    },
    progressBar: {
        height: 6,
        backgroundColor: theme.colors.border,
        borderRadius: 3,
        marginBottom: theme.spacing.xs,
    },
    progressFill: {
        width: '30%',
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    time: {
        ...theme.typography.caption,
    },
    summaryContainer: {
        width: '100%',
    },
    summaryTitle: {
        ...theme.typography.subheader,
        marginBottom: theme.spacing.s,
    },
    summary: {
        ...theme.typography.body,
    }
});
