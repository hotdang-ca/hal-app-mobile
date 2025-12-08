import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: number;
    user?: string;
}

const TOPIC = "What's the best hidden gem restaurant in town?";

const INITIAL_MESSAGES: Message[] = [
    { id: '1', text: 'Has anyone tried that new taco place on main?', sender: 'other', timestamp: Date.now() - 10000, user: 'Sarah' },
    { id: '2', text: 'Yes! The al pastor is amazing.', sender: 'other', timestamp: Date.now() - 5000, user: 'Mike' },
];

export const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
    };

    // Auto-scroll to bottom
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.otherMessageContainer
            ]}>
                {!isUser && <Text style={styles.senderName}>{item.user}</Text>}
                <View style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userMessageText : styles.otherMessageText
                    ]}>{item.text}</Text>
                </View>
                <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.banner}>
                <Text style={styles.bannerLabel}>TODAY'S TOPIC</Text>
                <Text style={styles.bannerText}>{TOPIC}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Join the conversation..."
                    placeholderTextColor={theme.colors.subText}
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    style={styles.sendButton}
                    disabled={!inputText.trim()}
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
    }
});
