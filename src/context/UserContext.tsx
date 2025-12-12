import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

interface UserContextProps {
    userId: string | null;
    userName: string;
    setUserName: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
    userId: null,
    userName: 'Anonymous User',
    setUserName: async () => { }
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserNameState] = useState<string>('Anonymous User');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Load User ID
                let id = await AsyncStorage.getItem('hal_user_id');
                if (!id) {
                    id = Crypto.randomUUID();
                    await AsyncStorage.setItem('hal_user_id', id);
                }
                setUserId(id);

                // Load User Name
                const name = await AsyncStorage.getItem('hal_user_name');
                if (name) {
                    setUserNameState(name);
                }
            } catch (error) {
                console.error('Failed to load user data', error);
            }
        };

        loadUserData();
    }, []);

    const setUserName = async (name: string) => {
        try {
            await AsyncStorage.setItem('hal_user_name', name);
            setUserNameState(name);
        } catch (error) {
            console.error('Failed to save user name', error);
        }
    };

    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
