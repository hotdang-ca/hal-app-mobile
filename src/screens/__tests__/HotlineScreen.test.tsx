import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HotlineScreen } from '../HotlineScreen';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

// Mock expo-av
jest.mock('expo-av', () => {
    const mockRecording = {
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn(() => 'file://mock/audio.m4a'),
    };
    const mockSound = {
        playAsync: jest.fn(),
        stopAsync: jest.fn(),
        setOnPlaybackStatusUpdate: jest.fn(),
    };

    return {
        Audio: {
            usePermissions: jest.fn(() => [{ status: 'granted' }, jest.fn()]),
            Recording: {
                createAsync: jest.fn(() => Promise.resolve({ recording: mockRecording })),
            },
            RecordingOptionsPresets: { HIGH_QUALITY: {} },
            Sound: {
                createAsync: jest.fn(() => Promise.resolve({ sound: mockSound })),
            },
            setAudioModeAsync: jest.fn(() => Promise.resolve()),
        },
    };
});

describe('HotlineScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<HotlineScreen />);
        expect(getByText("Hal's Hotline")).toBeTruthy();
        expect(getByText('Tap to Record')).toBeTruthy();
    });

    it('starts and stops recording', async () => {
        const { getByText } = render(<HotlineScreen />);

        // Start
        fireEvent.press(getByText('Tap to Record'));
        await waitFor(() => expect(Audio.Recording.createAsync).toHaveBeenCalled());
        expect(getByText('Stop Recording')).toBeTruthy();

        // Stop
        fireEvent.press(getByText('Stop Recording'));
        await waitFor(() => expect(getByText('Message Recorded!')).toBeTruthy());
    });

    it('validates name before submission', async () => {
        jest.spyOn(Alert, 'alert');
        const { getByText } = render(<HotlineScreen />);

        // Record something first
        fireEvent.press(getByText('Tap to Record'));
        await waitFor(() => expect(getByText('Stop Recording')).toBeTruthy());
        fireEvent.press(getByText('Stop Recording'));
        await waitFor(() => expect(getByText('Message Recorded!')).toBeTruthy());

        // Submit without name
        fireEvent.press(getByText('Send to Hal'));
        expect(Alert.alert).toHaveBeenCalledWith('Validation', 'Please enter your name.');
    });
});
