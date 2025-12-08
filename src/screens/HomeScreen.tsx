import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Hal's World</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        ...theme.typography.header,
    },
});
