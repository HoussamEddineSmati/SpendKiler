import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronDown, Edit3, Menu, Plus, Settings as SettingsIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';
import { filterExpensesByCycle, getCurrentCycleDates } from '@/src/utils/cycleUtils';

// Circular Progress Component
const CircularProgressRing = ({
  size = 260,
  strokeWidth = 8,
  progress = 0,
  isDark = true,
  colors,
  children
}: {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  isDark?: boolean;
  colors: any;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <SvgLinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,77,64,0.1)'} />
            <Stop offset="100%" stopColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,77,64,0.05)'} />
          </SvgLinearGradient>
          <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.accent} />
            <Stop offset="100%" stopColor={isDark ? '#2D5A52' : '#006D5B'} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[
        styles.ringInner,
        {
          width: size - strokeWidth * 4,
          height: size - strokeWidth * 4,
          borderRadius: (size - strokeWidth * 4) / 2,
          backgroundColor: isDark ? 'rgba(30, 60, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        }
      ]}>
        {children}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { expenses, settings, isLoading } = useMainStore();
  const { colors, isDark } = useTheme();
  const [sortByValue, setSortByValue] = useState(false);

  const cycleData = useMemo(() => {
    const { start, end } = getCurrentCycleDates(settings.cycleStartDay);
    const cycleExpenses = filterExpensesByCycle(expenses, start, end);
    const totalSpent = cycleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = settings.salary || 7000;

    return {
      totalSpent,
      totalBudget,
      balance: Math.max(0, totalBudget - totalSpent),
      start,
      end,
      recentExpenses: cycleExpenses
        .sort((a, b) =>
          sortByValue
            ? b.amount - a.amount
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 10)
    };
  }, [expenses, settings, sortByValue]);

  const ringProgress = Math.min((cycleData.totalSpent / cycleData.totalBudget) * 100, 100);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    const whole = Math.floor(amount);
    const decimal = Math.round((amount % 1) * 100).toString().padStart(2, '0');
    return { whole: whole.toLocaleString(), decimal };
  };

  const spent = formatCurrency(cycleData.totalSpent);

  const containerStyle = isDark
    ? { colors: colors.gradient, locations: [0, 0.5, 1] as const }
    : null;

  const ContentWrapper = isDark ? LinearGradient : View;
  const wrapperProps = isDark
    ? { colors: colors.gradient, locations: [0, 0.5, 1] as const, style: styles.container }
    : { style: [styles.container, { backgroundColor: colors.background }] };

  return (
    <ContentWrapper {...wrapperProps as any}>
      <View style={styles.topNav}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Menu size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Bell size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.menuSmallBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => router.push('/settings')}
          >
            <SettingsIcon size={18} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.labelSmall, { color: colors.textMuted }]}>MONTHLY BUDGET</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Overall</Text>
          </View>
        </View>

        <View style={styles.ringContainer}>
          <CircularProgressRing size={280} strokeWidth={10} progress={ringProgress} isDark={isDark} colors={colors}>
            <View style={styles.ringContent}>
              <Text style={[styles.spentAmount, { color: colors.text }]}>
                ${spent.whole}
                <Text style={[styles.spentDecimal, { color: colors.textSecondary }]}>.{spent.decimal}</Text>
              </Text>
              <Text style={[styles.spentLabel, { color: colors.textMuted }]}>SPENT</Text>
            </View>
          </CircularProgressRing>
          <View style={styles.ringFooter}>
            <Text style={[styles.availableText, { color: colors.textMuted }]}>
              available out of <Text style={[styles.availableBold, { color: colors.textSecondary }]}>${cycleData.totalBudget.toLocaleString()}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/add-expense')}>
            <View style={[styles.actionBtnCircle, { backgroundColor: colors.buttonPrimary }]}>
              <Plus size={22} color={colors.buttonPrimaryText} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/settings')}>
            <View style={[styles.actionBtnCircleOutline, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: colors.border }]}>
              <Edit3 size={20} color={colors.textSecondary} strokeWidth={1.5} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <View>
              <Text style={[styles.transactionsLabel, { color: colors.textMuted }]}>TRANSACTIONS FOR</Text>
              <Text style={[styles.transactionsMonth, { color: colors.text }]}>
                {cycleData.start.toLocaleString('default', { month: 'long' })} {cycleData.start.getFullYear()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.sortButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              onPress={() => setSortByValue(prev => !prev)}
            >
              <Text style={[styles.sortText, { color: colors.textSecondary }]}>{sortByValue ? 'Value' : 'Date'}</Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {cycleData.recentExpenses.length > 0 ? (
            cycleData.recentExpenses.map((tr) => (
              <View key={tr.id} style={[styles.transactionItem, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.transactionIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.accentLight }]}>
                    <View style={[styles.transactionDot, { backgroundColor: colors.accent }]} />
                  </View>
                  <View>
                    <Text style={[styles.transactionCategory, { color: colors.text }]}>{tr.category}</Text>
                    <Text style={[styles.transactionDate, { color: colors.textMuted }]}>
                      {new Date(tr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, { color: colors.text }]}>-${tr.amount.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyBorder, { borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions this cycle</Text>
              </View>
            </View>
          )}
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
  menuSmallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'serif',
  },
  ringContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  ringInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContent: {
    alignItems: 'center',
  },
  ringFooter: {
    marginTop: 15,
    alignItems: 'center',
  },
  spentAmount: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -1,
  },
  spentDecimal: {
    fontSize: 24,
    fontWeight: '300',
  },
  spentLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 4,
  },
  availableText: {
    fontSize: 13,
  },
  availableBold: {
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
    marginTop: 10,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionBtnCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionBtnCircleOutline: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsSection: {
    marginTop: 10,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  transactionsLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  transactionsMonth: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 13,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyBorder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
