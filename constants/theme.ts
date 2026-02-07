/**
 * Theme colors for the Budget App
 * Supports light and dark mode with a premium green accent
 */

import { Platform } from 'react-native';

const tintColorLight = '#004D40'; // Deep Green
const tintColorDark = '#4A7C74'; // Teal Green

export const Colors = {
  light: {
    // Core
    text: '#1A2421',
    textSecondary: '#435B55',
    textMuted: '#9EB1AD',
    background: '#F9FBF9',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F4F2',

    // Accents
    tint: tintColorLight,
    accent: '#004D40',
    accentLight: 'rgba(0, 77, 64, 0.1)',

    // UI Elements
    icon: '#435B55',
    iconMuted: '#9EB1AD',
    tabIconDefault: '#9EB1AD',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardSecondary: '#F5F8F7',
    border: '#E0E8E4',
    borderLight: '#EDF1EF',

    // Tab Bar
    tabBar: 'rgba(255, 255, 255, 0.98)',

    // Gradients
    gradient: ['#F9FBF9', '#F0F4F2', '#E8EEE9'] as const,

    // Status
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#C62828',

    // Specific Components
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E8E4',
    buttonPrimary: '#1A2421',
    buttonPrimaryText: '#FFFFFF',
  },
  dark: {
    // Core
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    background: '#0D1F1D',
    surface: '#1A3A36',
    surfaceSecondary: '#152E2B',

    // Accents
    tint: tintColorDark,
    accent: '#4A7C74',
    accentLight: 'rgba(74, 124, 116, 0.2)',

    // UI Elements
    icon: 'rgba(255, 255, 255, 0.8)',
    iconMuted: 'rgba(255, 255, 255, 0.5)',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.05)',
    cardSecondary: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.06)',

    // Tab Bar
    tabBar: 'rgba(15, 28, 25, 0.96)',

    // Gradients
    gradient: ['#1A3A36', '#152E2B', '#0D1F1D'] as const,

    // Status
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#E85D75',

    // Specific Components
    inputBackground: 'rgba(255, 255, 255, 0.06)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    buttonPrimary: '#FFFFFF',
    buttonPrimaryText: '#1A3A36',
  },
};

export type ThemeColors = typeof Colors.light | typeof Colors.dark;
export type ColorScheme = 'light' | 'dark';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
