import React, { useRef, useState } from 'react';
import { Image, ImageStyle, StyleProp, Animated, ViewStyle } from 'react-native';

interface FadeInImageProps {
    source: any;
    style?: StyleProp<ImageStyle>;
    duration?: number;
}

export const FadeInImage = ({ source, style, duration = 500 }: FadeInImageProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const [loaded, setLoaded] = useState(false);

    const onLoad = () => {
        setLoaded(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.Image
            source={source}
            style={[style, { opacity }]}
            onLoad={onLoad}
        />
    );
};
