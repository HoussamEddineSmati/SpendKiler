import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const CATEGORY_COLORS = [
    { main: '#4A7C74', gradient: ['#5A9B91', '#3A6B64'] },
    { main: '#7B5EA7', gradient: ['#9B7EC7', '#5B3E87'] },
    { main: '#E85D75', gradient: ['#FF7D95', '#C83D55'] },
    { main: '#4ECDC4', gradient: ['#6EEEE5', '#2EAD9E'] },
    { main: '#F7B731', gradient: ['#FFD761', '#D79711'] },
    { main: '#5D6D7E', gradient: ['#7D8D9E', '#3D4D5E'] },
    { main: '#A569BD', gradient: ['#C589DD', '#85499D'] },
    { main: '#45B7D1', gradient: ['#65D7F1', '#2597B1'] },
];

interface DonutChartProps {
    data: { name: string; value: number; color?: string }[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
}

export const DonutChart = ({
    data,
    size = 240,
    strokeWidth = 35,
    centerLabel = "TOTAL",
    centerValue
}: DonutChartProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // If no data, show a placeholder ring
    if (total === 0) {
        return (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                </Svg>
                <View style={[styles.donutCenter, { width: size - strokeWidth * 2 - 20, height: size - strokeWidth * 2 - 20, borderRadius: size }]}>
                    <Text style={styles.donutTotalLabel}>{centerLabel}</Text>
                    <Text style={styles.donutTotalValue}>$0</Text>
                </View>
            </View>
        );
    }

    let currentOffset = 0;

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size}>
                <Defs>
                    {data.map((_, idx) => (
                        <SvgLinearGradient key={`grad-${idx}`} id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length].gradient[0]} />
                            <Stop offset="100%" stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length].gradient[1]} />
                        </SvgLinearGradient>
                    ))}
                </Defs>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background full ring */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {data.map((item, idx) => {
                        const percentage = item.value / total;
                        const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
                        const strokeDashoffset = -currentOffset;
                        currentOffset += circumference * percentage;

                        return (
                            <Circle
                                key={idx}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={`url(#gradient-${idx})`}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </G>
            </Svg>
            <View style={[styles.donutCenter, { width: size - strokeWidth * 2 - 20, height: size - strokeWidth * 2 - 20, borderRadius: size }]}>
                <Text style={styles.donutTotalLabel}>{centerLabel}</Text>
                <Text style={styles.donutTotalValue}>{centerValue || `$${total.toLocaleString()}`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    donutCenter: {
        position: 'absolute',
        backgroundColor: 'rgba(30, 60, 55, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutTotalLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
    },
    donutTotalValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 4,
    },
});
