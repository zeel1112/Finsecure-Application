// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Transaction Types
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory = 
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'insurance'
  | 'healthcare' 
  | 'saving' 
  | 'personal' 
  | 'entertainment' 
  | 'education'
  | 'shopping'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: TransactionCategory;
  isRecurring: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Account Types
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// Goal Types
export type GoalType = 'savings' | 'debt' | 'purchase' | 'emergency' | 'other';
export type GoalStatus = 'in_progress' | 'achieved' | 'failed';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  status: GoalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType = 'budget_alert' | 'goal_achieved' | 'recurring_transaction' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// For Chart Data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}