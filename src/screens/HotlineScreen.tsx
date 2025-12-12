import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, ScrollView, Platform, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { API_URL } from '../constants';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface HotlineMessage {
    id: number;
    name: string;
    isRead: boolean;
    createdAt: string;
}

export const HotlineScreen = () => {
    const { userId, userName } = useUser();
    const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');

    // Recorder State
    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [name, setName] = useState(userName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // History State
    const [history, setHistory] = useState<HotlineMessage[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (activeTab === 'history' && userId) {
            fetchHistory();
        }
    }, [activeTab, userId]);

    const fetchHistory = async () => {
        setRefreshing(true);
        try {
            const res = await fetch(`${API_URL}/hotline/history?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setRefreshing(false);
        }
    };

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

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);
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

    async function submitRecording() {
        if (!name.trim()) {
            Alert.alert('Validation', 'Please enter your name.');
            return;
        }
        if (!audioUri || !userId) return;

        setIsSubmitting(true);

        setIsSubmitting(true);

        try {
            // 1. Upload to Firebase Storage
            const response = await fetch(audioUri);
            const blob = await response.blob();

            const filename = `hotline/${Date.now()}-${userId}.m4a`;
            const storageRef = ref(storage, filename);

            const snapshot = await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            // 2. Send JSON to API
            const res = await fetch(`${API_URL}/hotline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    userId,
                    audioUrl: downloadUrl
                })
            });

            if (res.ok) {
                Alert.alert('Success', 'Your message has been sent to Hal!');
                discardRecording();
                setActiveTab('history'); // Switch to history to show it
            } else {
                Alert.alert('Error', 'Failed to upload message.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const renderHistoryItem = ({ item }: { item: HotlineMessage }) => (
        <View style={styles.historyItem}>
            <View>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</Text>
            </View>
            <View style={[styles.statusBadge, item.isRead ? styles.statusRead : styles.statusUnread]}>
                <Text style={styles.statusText}>{item.isRead ? 'Heard' : 'Sent'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab('record')} style={[styles.tab, activeTab === 'record' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'record' && styles.activeTabText]}>Record</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('history')} style={[styles.tab, activeTab === 'history' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>My History</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'record' ? (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
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
            ) : (
                <View style={styles.historyContainer}>
                    <FlatList
                        data={history}
                        renderItem={renderHistoryItem}
                        keyExtractor={item => item.id.toString()}
                        refreshing={refreshing}
                        onRefresh={fetchHistory}
                        ListEmptyComponent={<Text style={styles.emptyText}>No messages sent yet.</Text>}
                        contentContainerStyle={{ padding: theme.spacing.m }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        backgroundColor: theme.colors.card,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.subText,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        padding: theme.spacing.l,
    },
    headerContainer: {
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.m,
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
    },
    historyContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    historyItem: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    historyName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: theme.colors.text,
    },
    historyDate: {
        fontSize: 12,
        color: theme.colors.subText,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusRead: {
        backgroundColor: '#E8F5E9',
    },
    statusUnread: {
        backgroundColor: '#E3F2FD',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.subText,
        marginTop: 40,
        fontSize: 16,
    }
});
