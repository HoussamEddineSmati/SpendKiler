import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Bus,
    Car,
    Heart,
    Home,
    MoreHorizontal,
    Phone,
    ShoppingCart,
    Smartphone,
    UtensilsCrossed,
    Wallet
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useMainStore } from '@/src/store/useMainStore';
import { Category } from '@/src/types';

const CATEGORY_ITEMS = [
    { label: 'Taxi', value: 'Taxi' as Category, icon: Car },
    { label: 'Metro', value: 'Metro' as Category, icon: Bus },
    { label: 'Restaurant', value: 'Restaurant' as Category, icon: UtensilsCrossed },
    { label: 'Grocery', value: 'Grocery' as Category, icon: ShoppingCart },
    { label: 'Rent', value: 'Rent' as Category, icon: Home },
    { label: 'Health', value: 'Health' as Category, icon: Heart },
    { label: 'Phone', value: 'Phone' as Category, icon: Smartphone },
    { label: 'App', value: 'App' as Category, icon: Phone },
    { label: 'Other', value: 'Other' as Category, icon: MoreHorizontal },
];

export default function AddExpenseScreen() {
    const { colors, isDark } = useTheme();
    const addExpense = useMainStore((state) => state.addExpense);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<Category>('Other');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (!amount || isNaN(parseFloat(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        await addExpense({ amount: parseFloat(amount), category, date: date.toISOString(), note });
        router.back();
    };

    const ContentWrapper = isDark ? LinearGradient : View;
    const wrapperProps = isDark
        ? { colors: colors.gradient, locations: [0, 0.5, 1] as const, style: styles.container }
        : { style: [styles.container, { backgroundColor: colors.background }] };

    return (
        <ContentWrapper {...wrapperProps as any}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={20} color={colors.text} strokeWidth={2} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>NEW</Text>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Expense</Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Amount Card */}
                    <View style={[styles.amountCard, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
                        <View style={[styles.walletIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,77,64,0.1)' }]}>
                            <Wallet size={24} color={colors.accent} strokeWidth={1.5} />
                        </View>
                        <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Enter Amount</Text>
                        <View style={styles.amountInputRow}>
                            <Text style={[styles.currencySign, { color: colors.accent }]}>$</Text>
                            <TextInput
                                style={[styles.amountInput, { color: colors.text }]}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                placeholder="0.00"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>

                    {/* Category Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CATEGORY</Text>
                        <View style={styles.categoriesGrid}>
                            {CATEGORY_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isSelected = category === item.value;
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.categoryItem,
                                            { backgroundColor: colors.card, borderColor: colors.border },
                                            isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                                        ]}
                                        onPress={() => setCategory(item.value)}
                                    >
                                        <View style={[
                                            styles.categoryIconWrapper,
                                            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                                            isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }
                                        ]}>
                                            <Icon size={20} color={isSelected ? '#FFFFFF' : colors.textSecondary} strokeWidth={1.5} />
                                        </View>
                                        <Text style={[
                                            styles.categoryLabel,
                                            { color: colors.textSecondary },
                                            isSelected && { color: '#FFFFFF' }
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Date Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>DATE</Text>
                        <TouchableOpacity
                            style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[styles.dateText, { color: colors.text }]}>
                                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(_, selectedDate) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (selectedDate) setDate(selectedDate);
                                }}
                                themeVariant={isDark ? 'dark' : 'light'}
                            />
                        )}
                    </View>

                    {/* Note Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>NOTE (OPTIONAL)</Text>
                        <TextInput
                            style={[styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Add a note..."
                            placeholderTextColor={colors.textMuted}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Save Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.buttonPrimary }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.saveText, { color: colors.buttonPrimaryText }]}>Save Transaction</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ContentWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardAvoid: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    backButton: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    headerCenter: { alignItems: 'center' },
    headerSubtitle: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700', marginTop: 2 },
    headerRight: { width: 44 },
    scrollContent: { paddingHorizontal: 24 },
    amountCard: { borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, marginBottom: 30 },
    walletIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    amountLabel: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
    amountInputRow: { flexDirection: 'row', alignItems: 'baseline' },
    currencySign: { fontSize: 36, fontWeight: '700', marginRight: 4 },
    amountInput: { fontSize: 52, fontWeight: '300', minWidth: 120, textAlign: 'center' },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14, marginLeft: 4 },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 25, justifyContent: 'center' },
    categoryItem: { width: '23%', aspectRatio: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    categoryIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    categoryLabel: { fontSize: 11, fontWeight: '600' },
    dateButton: { paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1 },
    dateText: { fontSize: 16, fontWeight: '600' },
    noteInput: { borderRadius: 16, padding: 18, fontSize: 15, borderWidth: 1, minHeight: 100, textAlignVertical: 'top' },
    buttonContainer: { paddingTop: 10 },
    saveButton: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
    saveText: { fontSize: 16, fontWeight: '700' },
});
