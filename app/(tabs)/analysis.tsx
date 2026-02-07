import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronDown, Menu } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, G, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';
import { calculateTotalsByCategory, filterExpensesByCycle, getCurrentCycleDates } from '@/src/utils/cycleUtils';

const CATEGORY_COLORS = ['#4A7C74', '#7B5EA7', '#E85D75', '#4ECDC4', '#F7B731', '#5D6D7E', '#A569BD', '#45B7D1'];

// Donut Chart Component
const DonutChart = ({
  data,
  size = 240,
  strokeWidth = 35,
  isDark = true,
}: {
  data: { name: string; value: number }[];
  size?: number;
  strokeWidth?: number;
  isDark?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </Svg>
        <View style={[styles.donutCenter, {
          width: size - strokeWidth * 2 - 20,
          height: size - strokeWidth * 2 - 20,
          borderRadius: size,
          backgroundColor: isDark ? 'rgba(20, 40, 38, 0.9)' : '#FFFFFF',
        }]}>
          <Text style={[styles.donutTotalLabel, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>TOTAL</Text>
          <Text style={[styles.donutTotalValue, { color: isDark ? '#FFFFFF' : '#1A2421' }]}>$0</Text>
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
              <Stop offset="0%" stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
              <Stop offset="100%" stopColor={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} stopOpacity={0.7} />
            </SvgLinearGradient>
          ))}
        </Defs>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
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
      <View style={[styles.donutCenter, {
        width: size - strokeWidth * 2 - 20,
        height: size - strokeWidth * 2 - 20,
        borderRadius: size,
        backgroundColor: isDark ? 'rgba(20, 40, 38, 0.9)' : '#FFFFFF',
      }]}>
        <Text style={[styles.donutTotalLabel, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>TOTAL</Text>
        <Text style={[styles.donutTotalValue, { color: isDark ? '#FFFFFF' : '#1A2421' }]}>${total.toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default function AnalysisScreen() {
  const { expenses, settings, isLoading } = useMainStore();
  const { colors, isDark } = useTheme();

  const chartData = useMemo(() => {
    const { start, end } = getCurrentCycleDates(settings.cycleStartDay);
    const cycleExpenses = filterExpensesByCycle(expenses, start, end);
    const totals = calculateTotalsByCategory(cycleExpenses);
    const totalSpent = cycleExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalSpent === 0) return [];

    return Object.entries(totals).map(([name, amount], idx) => ({
      name,
      value: amount,
      percentage: Math.round((amount / totalSpent) * 100),
    }));
  }, [expenses, settings]);

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
      <View style={styles.topNav}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Menu size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Bell size={24} color={colors.icon} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.backArrow, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.labelSmall, { color: colors.textMuted }]}>CURRENT CYCLE</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Analysis</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending Synopsis</Text>
          <TouchableOpacity style={[styles.dropdownButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <ChevronDown size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabelSmall, { color: colors.textMuted }]}>Analysis</Text>
            <Text style={[styles.chartLabelBig, { color: colors.text }]}>Breakdown</Text>
          </View>

          {chartData.length > 0 ? (
            <>
              <View style={styles.chartContainer}>
                <DonutChart data={chartData} size={260} strokeWidth={32} isDark={isDark} />
              </View>

              <View style={styles.legendGrid}>
                {chartData.map((item, idx) => (
                  <View key={idx} style={[styles.legendItem, { backgroundColor: colors.card }]}>
                    <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }]} />
                    <View style={styles.legendInfo}>
                      <Text style={[styles.legendPercentage, { color: colors.text }]}>{item.percentage}%</Text>
                      <Text style={[styles.legendName, { color: colors.textMuted }]}>{item.name}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.categoryCards}>
                {chartData.slice(0, 4).map((item, idx) => (
                  <View key={idx} style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.categoryCardHeader}>
                      <View style={[styles.categoryIndicator, { backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }]} />
                      <Text style={[styles.categoryCardName, { color: colors.textSecondary }]}>{item.name}</Text>
                    </View>
                    <Text style={[styles.categoryCardAmount, { color: colors.text }]}>${item.value.toFixed(2)}</Text>
                    <View style={[styles.categoryProgress, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                      <View style={[styles.categoryProgressFill, { width: `${item.percentage}%`, backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }]} />
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyBorder, { borderColor: colors.border }]}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No data for this cycle</Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted, opacity: 0.6 }]}>Add expenses to see your analysis</Text>
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
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 10 },
  navButton: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 },
  backButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 24, marginTop: -2 },
  labelSmall: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  headerTitle: { fontSize: 32, fontWeight: '700', marginTop: 2, fontFamily: 'serif' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, paddingVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  dropdownButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  chartSection: { marginTop: 20 },
  chartLabels: { marginBottom: 30 },
  chartLabelSmall: { fontSize: 13 },
  chartLabelBig: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  chartContainer: { alignItems: 'center', marginBottom: 40 },
  donutCenter: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  donutTotalLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
  donutTotalValue: { fontSize: 28, fontWeight: '700', marginTop: 4 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 16, padding: 12, borderRadius: 12 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  legendInfo: { flex: 1 },
  legendPercentage: { fontSize: 18, fontWeight: '800' },
  legendName: { fontSize: 12, marginTop: 2 },
  categoryCards: { gap: 12 },
  categoryCard: { borderRadius: 16, padding: 18, borderWidth: 1 },
  categoryCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  categoryCardName: { fontSize: 14, fontWeight: '600' },
  categoryCardAmount: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  categoryProgress: { height: 4, borderRadius: 2, overflow: 'hidden' },
  categoryProgressFill: { height: '100%', borderRadius: 2 },
  emptyState: { marginTop: 40, alignItems: 'center' },
  emptyBorder: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 50, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 13, marginTop: 8 },
});
