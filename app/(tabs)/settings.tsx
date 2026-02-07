import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, Calendar, ChevronRight, Menu, Moon, Sun, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';

export default function ProfileScreen() {
  const { settings, updateSettings, isLoading } = useMainStore();
  const { colors, isDark } = useTheme();
  const [salary, setSalary] = useState(settings.salary.toString());
  const [cycleDay, setCycleDay] = useState(settings.cycleStartDay.toString());
  const [editingSalary, setEditingSalary] = useState(false);
  const [editingCycle, setEditingCycle] = useState(false);

  const handleSaveSalary = () => {
    const num = parseFloat(salary);
    if (!isNaN(num)) {
      updateSettings({ salary: num });
      setEditingSalary(false);
      Alert.alert('Success', 'Monthly budget updated');
    }
  };

  const handleSaveCycle = () => {
    const num = parseInt(cycleDay);
    if (!isNaN(num) && num >= 1 && num <= 28) {
      updateSettings({ cycleStartDay: num });
      setEditingCycle(false);
      Alert.alert('Success', 'Cycle start day updated');
    } else {
      Alert.alert('Error', 'Please enter a day between 1 and 28');
    }
  };

  const handleThemeChange = (useDark: boolean) => {
    updateSettings({ theme: useDark ? 'dark' : 'light' });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  const ContentWrapper = isDark ? LinearGradient : View;
  const wrapperProps = isDark
    ? { colors: colors.gradient, locations: [0, 0.5, 1] as const, style: styles.container }
    : { style: [styles.container, { backgroundColor: colors.background }] };

  return (
    <ContentWrapper {...wrapperProps as any}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Menu size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Bell size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.backArrow, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.labelSmall, { color: colors.textMuted }]}>CONFIGURATION</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.accentLight }]}>
              <Wallet size={36} color={colors.accent} strokeWidth={1.5} />
            </View>
            <View style={[styles.avatarRing, { borderColor: colors.accent }]} />
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>Budget Manager</Text>
          <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>Offline Mode</Text>
          </View>
        </View>

        {/* Budget & Cycle Section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>BUDGET & CYCLE</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Monthly Budget */}
          <Pressable
            style={styles.settingItem}
            onPress={() => setEditingSalary(!editingSalary)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.accentLight }]}>
                <Wallet size={20} color={colors.accent} strokeWidth={1.5} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Monthly Budget</Text>
                <Text style={[styles.settingValue, { color: colors.textMuted }]}>${settings.salary.toLocaleString()}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>

          {editingSalary && (
            <View style={styles.editSection}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                keyboardType="decimal-pad"
                value={salary}
                onChangeText={setSalary}
                placeholder="Enter amount"
                placeholderTextColor={colors.textMuted}
              />
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSaveSalary}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Cycle Start Day */}
          <Pressable
            style={styles.settingItem}
            onPress={() => setEditingCycle(!editingCycle)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.accentLight }]}>
                <Calendar size={20} color={colors.accent} strokeWidth={1.5} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Cycle Start Day</Text>
                <Text style={[styles.settingValue, { color: colors.textMuted }]}>Day {settings.cycleStartDay} of month</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>

          {editingCycle && (
            <View style={styles.editSection}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                keyboardType="number-pad"
                value={cycleDay}
                onChangeText={setCycleDay}
                placeholder="1-28"
                placeholderTextColor={colors.textMuted}
              />
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSaveCycle}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Notifications */}
          <View style={styles.settingItemToggle}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.accentLight }]}>
                <Bell size={20} color={colors.accent} strokeWidth={1.5} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Reminders</Text>
                <Text style={[styles.settingSubtext, { color: colors.textMuted }]}>Get notified to log expenses</Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(val) => updateSettings({ notificationsEnabled: val })}
              trackColor={{ false: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0', true: colors.accent }}
              thumbColor={settings.notificationsEnabled ? '#FFFFFF' : isDark ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Dark Mode */}
          <View style={styles.settingItemToggle}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: colors.accentLight }]}>
                {isDark ? (
                  <Moon size={20} color={colors.accent} strokeWidth={1.5} />
                ) : (
                  <Sun size={20} color={colors.accent} strokeWidth={1.5} />
                )}
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSubtext, { color: colors.textMuted }]}>
                  {settings.theme === 'dark' ? 'Currently enabled' : settings.theme === 'light' ? 'Currently disabled' : 'Following system'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={handleThemeChange}
              trackColor={{ false: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0', true: colors.accent }}
              thumbColor={settings.theme === 'dark' ? '#FFFFFF' : isDark ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Budget Tracker v1.0.0</Text>
          <Text style={[styles.appCopyright, { color: colors.textMuted, opacity: 0.6 }]}>Made with ♥</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ContentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    marginTop: -2,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 2,
  },
  profileCard: {
    marginTop: 30,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    top: -5,
    left: -5,
    opacity: 0.4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  settingItemToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
  },
  editSection: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  saveButton: {
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  appVersion: {
    fontSize: 13,
  },
  appCopyright: {
    fontSize: 12,
    marginTop: 4,
  },
});
