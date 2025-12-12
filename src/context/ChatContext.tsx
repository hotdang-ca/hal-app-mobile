import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, orderBy, limit, addDoc, onSnapshot, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from './UserContext';

// GiftedChat Message Type + topicId
interface IMessage {
    _id: string | number;
    text: string;
    createdAt: Date | number;
    user: {
        _id: string | number;
        name: string;
        avatar?: string;
    };
    topicId?: string;
}

interface ChatTopic {
    id: string;
    title: string;
    isActive: boolean;
}

interface ChatContextType {
    messages: IMessage[];
    activeTopic: ChatTopic | null;
    topicsMap: Record<string, string>;
    sendMessage: (messages: IMessage[]) => Promise<void>;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [activeTopic, setActiveTopic] = useState<ChatTopic | null>(null);
    const [topicsMap, setTopicsMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const { userId, userName } = useUser();

    // 1. Listen for ALL Topics (to build map and find active)
    useEffect(() => {
        const q = query(collection(db, 'chat_topics'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const map: Record<string, string> = {};
            let active: ChatTopic | null = null;

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                map[doc.id] = data.title;
                if (data.isActive) {
                    active = { id: doc.id, ...data } as ChatTopic;
                }
            });

            setTopicsMap(map);
            setActiveTopic(active);
        });
        return () => unsubscribe();
    }, []);

    // 2. Listen to ALL messages (ordered by time)
    useEffect(() => {
        setIsLoading(true);

        const collectionRef = collection(db, 'messages');
        const q = query(
            collectionRef,
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages: IMessage[] = snapshot.docs.map(doc => {
                const data = doc.data();

                let createdAt = new Date();
                if (data.createdAt instanceof Timestamp) {
                    createdAt = data.createdAt.toDate();
                } else if (data.createdAt) {
                    createdAt = new Date();
                }

                return {
                    _id: doc.id,
                    text: data.text,
                    createdAt: createdAt,
                    user: data.user,
                    topicId: data.topicId,
                };
            });
            setMessages(fetchedMessages);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []); // Run once, no dependency on activeTopic

    const sendMessage = async (newMessages: IMessage[] = []) => {
        const message = newMessages[0];
        if (!message || !activeTopic) return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: message.text,
                createdAt: serverTimestamp(),
                topicId: activeTopic.id,
                user: {
                    _id: userId,
                    name: userName,
                    avatar: 'https://placeimg.com/140/140/any',
                }
            });
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, isLoading, activeTopic, topicsMap }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
