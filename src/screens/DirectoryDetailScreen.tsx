import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { theme } from '../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Business } from '../types';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    DirectoryDetail: { business: Business };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DirectoryDetail'>;

export const DirectoryDetailScreen = ({ route }: any) => {
    const { business } = route.params;

    const handleCall = () => {
        Linking.openURL(`tel:${business.phone}`);
    };

    const handleWeb = () => {
        Linking.openURL(business.website);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{business.name}</Text>
                <Text style={styles.category}>{business.category}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hal's Take</Text>
                <Text style={styles.summary}>{business.summary}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>{business.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <View style={styles.row}>
                    <Ionicons name="location" size={20} color={theme.colors.primary} />
                    <Text style={styles.contactItem}>{business.address}</Text>
                </View>

                <TouchableOpacity style={styles.row} onPress={handleCall}>
                    <Ionicons name="call" size={20} color={theme.colors.primary} />
                    <Text style={[styles.contactItem, styles.link]}>{business.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={handleWeb}>
                    <Ionicons name="globe" size={20} color={theme.colors.primary} />
                    <Text style={[styles.contactItem, styles.link]}>{business.website}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    header: {
        marginBottom: theme.spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.m,
    },
    title: {
        ...theme.typography.header,
        marginBottom: theme.spacing.xs,
    },
    category: {
        ...theme.typography.subheader,
        color: theme.colors.primary,
    },
    section: {
        marginBottom: theme.spacing.l,
    },
    sectionTitle: {
        ...theme.typography.subheader,
        marginBottom: theme.spacing.s,
        color: theme.colors.text,
    },
    summary: {
        ...theme.typography.body,
        fontStyle: 'italic',
        color: theme.colors.text,
    },
    description: {
        ...theme.typography.body,
        lineHeight: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    contactItem: {
        ...theme.typography.body,
        marginLeft: theme.spacing.s,
    },
    link: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
});
