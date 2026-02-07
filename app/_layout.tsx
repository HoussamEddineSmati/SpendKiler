import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { initDatabase } from '@/src/db/database';
import { useMainStore } from '@/src/store/useMainStore';
import { requestNotificationPermissions, scheduleDailyReminder } from '@/src/utils/notificationUtils';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark, colorScheme } = useTheme();
  const fetchData = useMainStore((state) => state.fetchData);
  const settings = useMainStore((state) => state.settings);

  useEffect(() => {
    async function setup() {
      await initDatabase();
      await fetchData();

      const granted = await requestNotificationPermissions();
      if (granted && settings.notificationsEnabled) {
        await scheduleDailyReminder();
      }
    }
    setup();
  }, [fetchData]);

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-expense"
          options={{
            presentation: 'modal',
            title: 'Add Expense',
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
