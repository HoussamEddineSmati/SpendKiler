import { Colors, ColorScheme, ThemeColors } from '@/constants/theme';
import { useMainStore } from '@/src/store/useMainStore';
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

interface ThemeContextType {
    colors: ThemeColors;
    isDark: boolean;
    colorScheme: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();
    const themeSetting = useMainStore((state) => state.settings.theme);

    const { colors, isDark, colorScheme } = useMemo(() => {
        let resolvedScheme: ColorScheme;

        if (themeSetting === 'system') {
            resolvedScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
        } else {
            resolvedScheme = themeSetting as ColorScheme;
        }

        return {
            colors: Colors[resolvedScheme],
            isDark: resolvedScheme === 'dark',
            colorScheme: resolvedScheme,
        };
    }, [themeSetting, systemColorScheme]);

    return (
        <ThemeContext.Provider value={{ colors, isDark, colorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // Return dark theme as fallback if used outside provider
        return {
            colors: Colors.dark,
            isDark: true,
            colorScheme: 'dark',
        };
    }
    return context;
}

// Helper hook that returns the current color scheme
export function useAppColorScheme(): ColorScheme {
    const { colorScheme } = useTheme();
    return colorScheme;
}
