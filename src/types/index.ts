export type Category =
  | 'Taxi'
  | 'Metro'
  | 'Restaurant'
  | 'Grocery'
  | 'Rent'
  | 'Health'
  | 'Phone'
  | 'App'
  | 'Other';

export interface Expense {
  id: number;
  category: Category;
  amount: number;
  date: string; // ISO string
  note?: string;
}

export interface MonthlyCycle {
  startDay: number; // 1-28 (to avoid Feb issues)
}

export interface Settings {
  salary: number;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}
