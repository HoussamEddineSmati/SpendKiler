import { Expense } from '../types';

export const getCurrentCycleDates = (startDay: number) => {
    const now = new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), startDay);

    if (start > now) {
        // If the start day hasn't happened yet this month, the cycle started last month
        start = new Date(now.getFullYear(), now.getMonth() - 1, startDay);
    }

    const end = new Date(start.getFullYear(), start.getMonth() + 1, startDay);
    end.setMilliseconds(end.getMilliseconds() - 1); // 1ms before the next cycle starts

    return { start, end };
};

export const filterExpensesByCycle = (expenses: Expense[], start: Date, end: Date) => {
    return expenses.filter(exp => {
        const d = new Date(exp.date);
        return d >= start && d <= end;
    });
};

export const calculateTotalsByCategory = (expenses: Expense[]) => {
    return expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);
};
