import { create } from 'zustand';
import { getDb } from '../db/database';
import { Expense, Settings } from '../types';

interface MainStore {
    expenses: Expense[];
    settings: Settings & { cycleStartDay: number };
    isLoading: boolean;

    // Actions
    fetchData: () => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    updateSettings: (settings: Partial<Settings & { cycleStartDay: number }>) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
}

export const useMainStore = create<MainStore>((set, get) => ({
    expenses: [],
    settings: {
        salary: 0,
        theme: 'system',
        notificationsEnabled: true,
        cycleStartDay: 1,
    },
    isLoading: true,

    fetchData: async () => {
        set({ isLoading: true });
        const db = await getDb();

        const expenses = await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC');
        const settingsRows = await db.getAllAsync<any>('SELECT * FROM settings WHERE id = 1');

        if (settingsRows.length > 0) {
            const s = settingsRows[0];
            set({
                expenses,
                settings: {
                    salary: s.salary,
                    theme: s.theme as any,
                    notificationsEnabled: !!s.notifications_enabled,
                    cycleStartDay: s.cycle_start_day,
                },
                isLoading: false,
            });
        } else {
            set({ expenses, isLoading: false });
        }
    },

    addExpense: async (expense) => {
        const db = await getDb();
        const result = await db.runAsync(
            'INSERT INTO expenses (category, amount, date, note) VALUES (?, ?, ?, ?)',
            [expense.category, expense.amount, expense.date, expense.note || '']
        );
        await get().fetchData();
    },

    deleteExpense: async (id) => {
        const db = await getDb();
        await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
        await get().fetchData();
    },

    updateSettings: async (newSettings) => {
        const db = await getDb();
        const current = get().settings;
        const updated = { ...current, ...newSettings };

        await db.runAsync(
            'UPDATE settings SET salary = ?, cycle_start_day = ?, theme = ?, notifications_enabled = ? WHERE id = 1',
            [
                updated.salary,
                updated.cycleStartDay,
                updated.theme,
                updated.notificationsEnabled ? 1 : 0
            ]
        );
        set({ settings: updated });
    }
}));
