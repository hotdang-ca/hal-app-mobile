import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync, AudioStatus } from 'expo-audio';
import { API_URL } from '../constants';
import { getFullUrl } from '../utils/url';

interface PlayerContextType {
    isPlaying: boolean;
    currentPodcast: any | null;
    position: number;   // Milliseconds (for compatibility)
    duration: number;   // Milliseconds (for compatibility)
    isBuffering: boolean;
    playPodcast: (podcast: any) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    seekTo: (positionMillis: number) => Promise<void>;
    skipForward: () => Promise<void>;
    skipBackward: () => Promise<void>;
    closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // We initialize the player with null source initially.
    // We will use player.replace() to change tracks.
    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    const [currentPodcast, setCurrentPodcast] = useState<any | null>(null);

    // Initial Audio Mode Setup
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: true,
                    allowsRecording: false,
                });
            } catch (e) {
                console.error("Audio mode setup failed", e);
            }
        };
        setupAudio();
    }, []);

    const playPodcast = async (podcast: any) => {
        // Toggle if same podcast
        if (currentPodcast?.id === podcast.id) {
            status.playing ? player.pause() : player.play();
            return;
        }

        setCurrentPodcast(podcast);

        try {
            const audioUrl = getFullUrl(podcast.audioUrl);
            if (!audioUrl) throw new Error("Invalid audio URL");

            const source = { uri: audioUrl };
            player.replace(source);

            player.play();

            try {
                player.setActiveForLockScreen(true, {
                    title: podcast.title,
                    artist: podcast.host,
                    artworkUrl: getFullUrl(podcast.imageUrl) || undefined,
                    albumTitle: "Hal's Hotline",
                });
            } catch (e) {
                console.error("Failed to set lock screen metadata", e);
            }

            // Track play count
            incrementPlayCount(podcast.id);
        } catch (error) {
            console.error('Error playing podcast:', error);
        }
    };

    const togglePlayPause = async () => {
        status.playing ? player.pause() : player.play();

        console.log(player);
        console.log(status);
    };

    const seekTo = async (positionMillis: number) => {
        // expo-audio uses seconds
        const seconds = positionMillis / 1000;
        await player.seekTo(seconds);
    };

    const skipForward = async () => {
        const currentSeconds = status.currentTime;
        const durationSeconds = status.duration;
        // Skip 15s, but don't go past end
        const newTime = Math.min(currentSeconds + 15, durationSeconds);

        console.log("Current time", currentSeconds);
        console.log("Duration", durationSeconds);
        console.log("Skipping forward to", newTime);

        await player.seekTo(newTime);
    };

    const skipBackward = async () => {
        const currentSeconds = status.currentTime;
        // Skip back 15s, don't go below 0
        const newTime = Math.max(currentSeconds - 15, 0);
        await player.seekTo(newTime);
    };

    const closePlayer = () => {
        player.pause();
        setCurrentPodcast(null);
    };

    const incrementPlayCount = async (id: number) => {
        try {
            await fetch(`${API_URL}/podcasts/${id}/play`, { method: 'POST' });
        } catch (e) {
            console.error("Failed to track play:", e);
        }
    }

    // Map new status fields to old context shape
    // Convert seconds to millis for compatibility with existing UI
    const position = (status.currentTime || 0) * 1000;
    const duration = (status.duration || 0) * 1000;
    const isPlaying = status.playing;
    const isBuffering = status.isBuffering;

    return (
        <PlayerContext.Provider value={{
            isPlaying,
            currentPodcast,
            position,
            duration,
            isBuffering,
            playPodcast,
            togglePlayPause,
            seekTo,
            skipForward,
            skipBackward,
            closePlayer
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
