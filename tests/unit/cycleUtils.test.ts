import { Expense } from '../../src/types';
import { filterExpensesByCycle, getCurrentCycleDates } from '../../src/utils/cycleUtils';

describe('cycleUtils', () => {
    test('getCurrentCycleDates should return correct range for mid-month start', () => {
        // Mock current date to 2024-02-10
        jest.useFakeTimers().setSystemTime(new Date('2024-02-10'));

        // Start day 1
        const range1 = getCurrentCycleDates(1);
        expect(range1.start.getDate()).toBe(1);
        expect(range1.start.getMonth()).toBe(1); // Feb (0-indexed)

        // Start day 15
        const range15 = getCurrentCycleDates(15);
        expect(range15.start.getDate()).toBe(15);
        expect(range15.start.getMonth()).toBe(0); // Jan
    });

    test('filterExpensesByCycle should filter correctly', () => {
        const start = new Date('2024-01-01');
        const end = new Date('2024-01-31');
        const expenses: Expense[] = [
            { id: 1, amount: 10, category: 'Rent', date: '2024-01-15' },
            { id: 2, amount: 20, category: 'Taxi', date: '2023-12-31' },
            { id: 3, amount: 30, category: 'Other', date: '2024-02-01' as any },
        ];

        const filtered = filterExpensesByCycle(expenses, start, end);
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe(1);
    });
});
