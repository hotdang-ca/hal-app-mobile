import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChatScreen } from '../ChatScreen';

describe('ChatScreen', () => {
    it('renders topic banner and initial messages', () => {
        const { getByText } = render(<ChatScreen />);
        expect(getByText("TODAY'S TOPIC")).toBeTruthy();
        expect(getByText("What's the best hidden gem restaurant in town?")).toBeTruthy();
        expect(getByText("Has anyone tried that new taco place on main?")).toBeTruthy();
    });

    it('allows sending a message', async () => {
        const { getByPlaceholderText, getByText, getByLabelText } = render(<ChatScreen />);

        const input = getByPlaceholderText('Join the conversation...');
        fireEvent.changeText(input, 'I love the burger joint!');

        const sendButton = getByLabelText('Send Message');
        fireEvent.press(sendButton);

        await waitFor(() => expect(getByText('I love the burger joint!')).toBeTruthy());
    });
});
