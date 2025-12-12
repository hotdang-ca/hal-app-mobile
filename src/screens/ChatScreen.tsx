import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import { usePlayer } from '../context/PlayerContext';
import { Timestamp } from 'firebase/firestore';

export const ChatScreen = () => {
    const { messages, sendMessage, isLoading, activeTopic, topicsMap } = useChat();
    const { userId, userName } = useUser();
    const { currentPodcast } = usePlayer();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Auto-scroll to bottom logic

    const handleSendMessage = async () => {
        if (!inputText.trim() || !userId) return;

        const text = inputText;
        setInputText(''); // Optimistic clear

        await sendMessage([{
            _id: Date.now().toString(), // Temp ID, will be replaced by Firestore
            text: text,
            createdAt: new Date(),
            user: {
                _id: userId,
                name: userName, // Use context name
            }
        }]);
    };

    // Formatter
    const formatTime = (date: Date | number | Timestamp) => {
        if (!date) return '';
        const timestamp = date instanceof Date ? date.getTime() : date instanceof Timestamp ? date.toDate().getTime() : date;
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUser = item.user._id === userId;
        const isDifferentTopic = activeTopic && item.topicId !== activeTopic.id;
        const msgTopicTitle = item.topicId ? topicsMap[item.topicId] : null;

        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.otherMessageContainer
            ]}>
                {!isUser && <Text style={styles.senderName}>{item.user.name}</Text>}

                {/* Topic Indicator for "Old" Topics */}
                {isDifferentTopic && msgTopicTitle && (
                    <TouchableOpacity
                        onPress={() => Alert.alert("Topic", msgTopicTitle)}
                        style={styles.topicIndicator}
                    >
                        <Text style={styles.topicIndicatorText} numberOfLines={1}>
                            {msgTopicTitle}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.otherBubble,
                    isDifferentTopic ? { opacity: 0.7 } : {} // Slightly fade old topics
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userMessageText : styles.otherMessageText
                    ]}>{item.text}</Text>
                </View>
                <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, currentPodcast && { paddingBottom: 150 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            {activeTopic && (
                <View style={styles.banner}>
                    <Text style={styles.bannerLabel}>TODAY'S TOPIC</Text>
                    <Text style={styles.bannerText}>{activeTopic.title}</Text>
                </View>
            )}

            {/* Show Loading or List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item._id.toString()}
                    contentContainerStyle={styles.listContent}
                    inverted={true} // Newest at bottom
                />
            )}

            <View
                style={[styles.inputContainer, !activeTopic && { opacity: 0.5 }]}
            >
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder={activeTopic ? "Join the conversation..." : "Chat is currently paused"}
                    placeholderTextColor={theme.colors.subText}
                    editable={!!activeTopic}
                />
                <TouchableOpacity
                    onPress={handleSendMessage}
                    style={styles.sendButton}
                    disabled={!inputText.trim() || !activeTopic}
                    accessibilityLabel="Send Message"
                >
                    <Ionicons name="send" size={24} color={inputText.trim() ? theme.colors.primary : theme.colors.disabled} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    banner: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.m,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    bannerLabel: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerText: {
        ...theme.typography.body,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContent: {
        padding: theme.spacing.m,
    },
    messageContainer: {
        marginBottom: theme.spacing.m,
        maxWidth: '80%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    senderName: {
        ...theme.typography.caption,
        marginLeft: theme.spacing.s,
        marginBottom: 2,
    },
    bubble: {
        padding: theme.spacing.m,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: theme.colors.card,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: theme.colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.text,
    },
    sendButton: {
        padding: theme.spacing.s,
    },
    timestamp: {
        ...theme.typography.caption,
        color: theme.colors.subText,
        fontSize: 10,
        marginTop: 2,
        alignSelf: 'flex-end',
    },
    topicIndicator: {
        backgroundColor: theme.colors.border,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginBottom: 2,
        alignSelf: 'flex-start',
        maxWidth: 150,
    },
    topicIndicatorText: {
        fontSize: 10,
        color: theme.colors.subText,
    }
});
