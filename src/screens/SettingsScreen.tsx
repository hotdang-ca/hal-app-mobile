import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { registerForPushNotificationsAsync } from '../utils/notifications';

export const SettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [pushToken, setPushToken] = useState<string | undefined>('');

    const toggleSwitch = async (value: boolean) => {
        if (value) {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                setPushToken(token);
                setNotificationsEnabled(true);
                // In a real app, send token to backend here
                Alert.alert('Subscribed!', 'You will now receive breaking news regarding Hal.');
            } else {
                setNotificationsEnabled(false);
            }
        } else {
            setNotificationsEnabled(false);
            setPushToken('');
            // In a real app, delete token from backend
            Alert.alert('Unsubscribed', 'You have turned off notifications.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Remote Notifications</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: theme.colors.primary }}
                        thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={notificationsEnabled}
                    />
                </View>
                <Text style={styles.hint}>Enable to receive breaking news alerts.</Text>

                {pushToken ? (
                    <View style={styles.tokenContainer}>
                        <Text style={styles.tokenLabel}>Device Token:</Text>
                        <Text style={styles.token}>{pushToken}</Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.text}>Hal App v1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    header: {
        ...theme.typography.header,
        marginBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.subheader,
        marginBottom: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.xs,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    label: {
        ...theme.typography.body,
        fontSize: 18,
    },
    hint: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.m,
    },
    text: {
        ...theme.typography.body,
    },
    tokenContainer: {
        marginTop: theme.spacing.m,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.s,
    },
    tokenLabel: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    token: {
        ...theme.typography.caption,
        color: theme.colors.subText,
    }
});
