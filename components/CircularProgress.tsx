import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
    size: number;
    strokeWidth: number;
    progress: number;
    color: string;
    backgroundColor: string;
}

export const CircularProgress = ({ size, strokeWidth, progress, color, backgroundColor }: Props) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const svgProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset = circumference - (svgProgress / 100) * circumference;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Circle
                    stroke={backgroundColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={color}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
};
