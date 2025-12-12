import { TextStyle } from 'react-native';

export const theme = {
    colors: {
        primary: '#4A90E2', // Professional Blue
        secondary: '#FF6F61', // Fun Coral
        background: '#F7F9FC', // Clean Off-white
        card: '#FFFFFF',
        text: '#2C3E50', // Dark Slate
        subText: '#95A5A6',
        border: '#E1E8ED',
        success: '#2ECC71',
        error: '#E74C3C',
        warning: '#F1C40F',
        disabled: '#BDC3C7',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 4,
        m: 8,
        l: 16,
        xl: 24,
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#2C3E50',
        } as TextStyle,
        subheader: {
            fontSize: 18,
            fontWeight: '600',
            color: '#34495E',
        } as TextStyle,
        body: {
            fontSize: 16,
            color: '#2C3E50',
        } as TextStyle,
        caption: {
            fontSize: 14,
            color: '#95A5A6',
        } as TextStyle,
    },
};
