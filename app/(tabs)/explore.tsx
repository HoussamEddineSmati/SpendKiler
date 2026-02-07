import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Filter, Menu, Search, Trash2, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';

export default function ExploreScreen() {
  const { expenses, deleteExpense, isLoading } = useMainStore();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        exp =>
          exp.category.toLowerCase().includes(query) ||
          (exp.note && exp.note.toLowerCase().includes(query))
      );
    }

    switch (sortOrder) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [expenses, searchQuery, sortOrder]);

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

  const stats = useMemo(() => {
    if (expenses.length === 0) return { total: 0, average: 0, highest: 0, count: 0 };
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const highest = Math.max(...expenses.map(e => e.amount));
    return { total, average: total / expenses.length, highest, count: expenses.length };
  }, [expenses]);

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
          <Text style={[styles.labelSmall, { color: colors.textMuted }]}>DISCOVER</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search expenses..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Filter size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.accentLight }]}>
              <TrendingUp size={20} color={colors.accent} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>${stats.total.toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Spent</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(232, 93, 117, 0.2)' }]}>
              <TrendingDown size={20} color="#E85D75" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>${stats.average.toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Average</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(247, 183, 49, 0.2)' }]}>
              <TrendingUp size={20} color="#F7B731" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>${stats.highest.toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Highest</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.2)' }]}>
              <Text style={[styles.statCount, { color: '#4ECDC4' }]}>#</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.count}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Transactions</Text>
          </View>
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.textMuted }]}>Sort by</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortOptions}>
              {[
                { key: 'newest', label: 'Newest' },
                { key: 'oldest', label: 'Oldest' },
                { key: 'highest', label: 'Highest' },
                { key: 'lowest', label: 'Lowest' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    sortOrder === option.key && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                  onPress={() => setSortOrder(option.key as any)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    { color: colors.textMuted },
                    sortOrder === option.key && { color: '#FFFFFF' },
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>Results</Text>
          <Text style={[styles.resultsCount, { color: colors.textMuted }]}>{filteredExpenses.length} items</Text>
        </View>

        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((item, index) => (
            <View key={item.id} style={[styles.expenseCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
              <View style={styles.expenseLeft}>
                <View style={[styles.expenseNumber, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.expenseNumberText, { color: colors.accent }]}>{index + 1}</Text>
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={[styles.expenseCategory, { color: colors.text }]}>{item.category}</Text>
                  <Text style={[styles.expenseDate, { color: colors.textMuted }]}>
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  {item.note && <Text style={[styles.expenseNote, { color: colors.textMuted }]}>{item.note}</Text>}
                </View>
              </View>
              <View style={styles.expenseRight}>
                <Text style={[styles.expenseAmount, { color: colors.text }]}>${item.amount.toFixed(2)}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                  <Trash2 size={16} color="#E85D75" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyBorder, { borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {searchQuery ? 'No matching expenses found' : 'No expenses recorded yet'}
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted, opacity: 0.6 }]}>
                {searchQuery ? 'Try a different search term' : 'Start tracking your spending'}
              </Text>
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
  header: { marginTop: 10, marginBottom: 24 },
  labelSmall: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  headerTitle: { fontSize: 32, fontWeight: '700', marginTop: 2 },
  searchContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
  filterButton: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  statsContainer: { gap: 12, paddingBottom: 8 },
  statCard: { borderRadius: 16, padding: 16, width: 130, borderWidth: 1 },
  statIconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statCount: { fontSize: 18, fontWeight: '700' },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  sortContainer: { marginTop: 24, marginBottom: 20 },
  sortLabel: { fontSize: 12, fontWeight: '600', marginBottom: 12 },
  sortOptions: { flexDirection: 'row', gap: 10 },
  sortOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  sortOptionText: { fontSize: 13, fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultsTitle: { fontSize: 18, fontWeight: '700' },
  resultsCount: { fontSize: 13 },
  expenseCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1 },
  expenseLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  expenseNumber: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  expenseNumberText: { fontSize: 12, fontWeight: '700' },
  expenseInfo: { flex: 1 },
  expenseCategory: { fontSize: 15, fontWeight: '600' },
  expenseDate: { fontSize: 12, marginTop: 2 },
  expenseNote: { fontSize: 12, marginTop: 4, fontStyle: 'italic', opacity: 0.7 },
  expenseRight: { alignItems: 'flex-end', gap: 8 },
  expenseAmount: { fontSize: 16, fontWeight: '700' },
  deleteButton: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(232, 93, 117, 0.15)', justifyContent: 'center', alignItems: 'center' },
  emptyState: { marginTop: 30, alignItems: 'center' },
  emptyBorder: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, paddingVertical: 50, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 13, marginTop: 8 },
});
