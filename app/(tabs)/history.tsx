import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronDown, Menu, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';

export default function HistoryScreen() {
  const { expenses, deleteExpense, isLoading } = useMainStore();
  const { colors, isDark } = useTheme();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const confirmDelete = (id: number) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    const whole = Math.floor(amount);
    const decimal = Math.round((amount % 1) * 100).toString().padStart(2, '0');
    return { whole: whole.toLocaleString(), decimal };
  };

  const total = formatCurrency(totalSpent);

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
            <Text style={[styles.labelSmall, { color: colors.textMuted }]}>ALL-TIME</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>History</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Expense Synopsis</Text>
          <TouchableOpacity style={[styles.dropdownButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <ChevronDown size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Total Card */}
        <View style={[styles.totalCard, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
          <View style={[styles.totalCardAccent, { backgroundColor: colors.accent }]} />
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Spent to Date</Text>
          <View style={styles.totalAmountRow}>
            <Text style={[styles.currencySymbol, { color: colors.accent }]}>$</Text>
            <Text style={[styles.totalAmount, { color: colors.text }]}>{total.whole}</Text>
            <Text style={[styles.totalDecimal, { color: colors.textMuted }]}>.{total.decimal}</Text>
          </View>
        </View>

        {/* Transactions Header */}
        <View style={styles.transactionsHeader}>
          <View>
            <Text style={[styles.transactionsLabel, { color: colors.textMuted }]}>TRANSACTIONS</Text>
            <Text style={[styles.transactionsTitle, { color: colors.text }]}>Log</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
            <View>
              <Text style={[styles.filterLabel, { color: colors.textMuted }]}>Filter:</Text>
              <Text style={[styles.filterValue, { color: colors.textSecondary }]}>All Records</Text>
            </View>
            <ChevronDown size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {expenses.length > 0 ? (
          expenses.map((exp) => (
            <View key={exp.id} style={[styles.transactionCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
              <View style={styles.transactionTop}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.categoryBadgeText}>{exp.category}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(exp.id)}>
                  <Trash2 size={16} color="#E85D75" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
              <View style={styles.transactionMain}>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                    {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  {exp.note && <Text style={[styles.transactionNote, { color: colors.textMuted }]}>{exp.note}</Text>}
                </View>
                <Text style={[styles.transactionAmount, { color: colors.text }]}>${exp.amount.toFixed(2)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyBorder, { borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions found</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted, opacity: 0.6 }]}>Start tracking your expenses</Text>
            </View>
          </View>
        )}

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
  headerTitle: { fontSize: 32, fontWeight: '700', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, paddingVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  dropdownButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  totalCard: { marginTop: 20, borderRadius: 24, padding: 24, borderWidth: 1, position: 'relative', overflow: 'hidden' },
  totalCardAccent: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%', borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
  totalLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  totalAmountRow: { flexDirection: 'row', alignItems: 'baseline' },
  currencySymbol: { fontSize: 32, fontWeight: '700', marginRight: 4 },
  totalAmount: { fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  totalDecimal: { fontSize: 28, fontWeight: '600' },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, marginBottom: 20 },
  transactionsLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  transactionsTitle: { fontSize: 26, fontWeight: '800', marginTop: 2 },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 10 },
  filterLabel: { fontSize: 10, fontWeight: '600' },
  filterValue: { fontSize: 12, fontWeight: '700' },
  transactionCard: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  transactionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  deleteButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(232, 93, 117, 0.15)', justifyContent: 'center', alignItems: 'center' },
  transactionMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  transactionInfo: { flex: 1 },
  transactionDate: { fontSize: 18, fontWeight: '600' },
  transactionNote: { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  transactionAmount: { fontSize: 22, fontWeight: '800' },
  emptyState: { marginTop: 30, alignItems: 'center' },
  emptyBorder: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 50, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 13, marginTop: 8 },
});
