import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

export const HotlineScreen = () => {
    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording.');
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setAudioUri(uri);
    }

    async function playSound() {
        if (!audioUri) return;

        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);

        console.log('Playing Sound');
        setIsPlaying(true);
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
            }
        });
    }

    async function stopSound() {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    }

    function discardRecording() {
        setAudioUri(null);
        setIsPlaying(false);
        setName('');
    }

    function submitRecording() {
        if (!name.trim()) {
            Alert.alert('Validation', 'Please enter your name.');
            return;
        }
        setIsSubmitting(true);

        // Simulate Network Request
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert('Success', 'Your message has been sent to Hal!');
            discardRecording();
        }, 2000);
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Hal's Hotline</Text>
                    <Text style={styles.subHeader}>Record a message for Hal. Tell him about a great business, a funny story, or just say hi.</Text>
                </View>

                <View style={styles.recordContainer}>
                    {audioUri ? (
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewText}>Message Recorded!</Text>

                            <View style={styles.controlsRow}>
                                <TouchableOpacity onPress={isPlaying ? stopSound : playSound} style={styles.controlButton}>
                                    <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={64} color={theme.colors.primary} />
                                    <Text style={styles.controlLabel}>{isPlaying ? "Stop" : "Preview"}</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Your Name (Required)"
                                placeholderTextColor={theme.colors.subText}
                                value={name}
                                onChangeText={setName}
                            />

                            <View style={styles.actionRow}>
                                <TouchableOpacity onPress={discardRecording} style={[styles.actionButton, styles.discardButton]}>
                                    <Text style={[styles.actionText, styles.discardText]}>Discard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={submitRecording} style={[styles.actionButton, styles.submitButton]} disabled={isSubmitting}>
                                    <Text style={styles.actionText}>{isSubmitting ? 'Sending...' : 'Send to Hal'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.recordButton, recording ? styles.recordingActive : null]}
                            onPress={recording ? stopRecording : startRecording}
                        >
                            <Ionicons name={recording ? "stop" : "mic"} size={50} color="white" />
                            <Text style={styles.recordButtonText}>{recording ? "Stop Recording" : "Tap to Record"}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.l,
    },
    headerContainer: {
        marginBottom: theme.spacing.xl,
    },
    header: {
        ...theme.typography.header,
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    subHeader: {
        ...theme.typography.body,
        color: theme.colors.subText,
        textAlign: 'center',
    },
    recordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    recordingActive: {
        backgroundColor: theme.colors.error,
        transform: [{ scale: 1.1 }]
    },
    recordButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: theme.spacing.s,
        fontSize: 18,
    },
    previewContainer: {
        width: '100%',
        alignItems: 'center',
    },
    previewText: {
        ...theme.typography.subheader,
        marginBottom: theme.spacing.l,
    },
    controlsRow: {
        marginBottom: theme.spacing.l,
    },
    controlButton: {
        alignItems: 'center',
    },
    controlLabel: {
        ...theme.typography.caption,
        marginTop: theme.spacing.xs,
    },
    input: {
        width: '100%',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.l,
        fontSize: 16,
        color: theme.colors.text,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: theme.spacing.m,
    },
    actionButton: {
        flex: 1,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
    },
    discardButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.error,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    discardText: {
        color: theme.colors.error,
    }
});
