import { Account, Budget, Goal, Transaction, User } from '../types';
import { format, subDays } from 'date-fns';

// Mock user data
let mockUser: User = {
  id: 'user1',
  email: 'demo@example.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  role: 'user',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

// Mock transactions data
let mockTransactions: Transaction[] = [];

// Mock accounts data
let mockAccounts: Account[] = [];

// Mock budgets data
let mockBudgets: Budget[] = [];

// Mock goals data
let mockGoals: Goal[] = [];

// Initialize mock data
export const initializeMockData = () => {
  // Only initialize if not already done
  if (mockTransactions.length > 0) return;

  // Create mock accounts
  mockAccounts = [
    {
      id: 'account1',
      userId: 'user1',
      name: 'Checking Account',
      type: 'checking',
      balance: 5230.45,
      currency: 'USD',
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'account2',
      userId: 'user1',
      name: 'Savings Account',
      type: 'savings',
      balance: 12500.00,
      currency: 'USD',
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'account3',
      userId: 'user1',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.30,
      currency: 'USD',
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ];

  // Create mock transactions
  mockTransactions = [
    {
      id: 'transaction1',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      amount: 82.45,
      description: 'Grocery Store',
      type: 'expense',
      category: 'food',
      isRecurring: false,
      createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction2',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      amount: 14.99,
      description: 'Netflix Subscription',
      type: 'expense',
      category: 'entertainment',
      isRecurring: true,
      notes: 'Monthly subscription',
      createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction3',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      amount: 1200.00,
      description: 'Rent Payment',
      type: 'expense',
      category: 'housing',
      isRecurring: true,
      notes: 'Monthly rent',
      createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction4',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      amount: 42.00,
      description: 'Gas Station',
      type: 'expense',
      category: 'transportation',
      isRecurring: false,
      createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction5',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      amount: 3500.00,
      description: 'Salary Deposit',
      type: 'income',
      category: 'income',
      isRecurring: true,
      notes: 'Monthly salary',
      createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction6',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      amount: 120.00,
      description: 'Electric Bill',
      type: 'expense',
      category: 'utilities',
      isRecurring: true,
      createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction7',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
      amount: 55.00,
      description: 'Internet Bill',
      type: 'expense',
      category: 'utilities',
      isRecurring: true,
      createdAt: format(subDays(new Date(), 12), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 12), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
    {
      id: 'transaction8',
      userId: 'user1',
      accountId: 'account1',
      date: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      amount: 35.20,
      description: 'Restaurant',
      type: 'expense',
      category: 'food',
      isRecurring: false,
      createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
      updatedAt: format(subDays(new Date(), 15), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
    },
  ];

  // Create mock budgets
  mockBudgets = [
    {
      id: 'budget1',
      userId: 'user1',
      category: 'housing',
      amount: 1200,
      spent: 1200,
      period: 'monthly',
      startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'budget2',
      userId: 'user1',
      category: 'food',
      amount: 500,
      spent: 117.65,
      period: 'monthly',
      startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'budget3',
      userId: 'user1',
      category: 'transportation',
      amount: 200,
      spent: 42,
      period: 'monthly',
      startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'budget4',
      userId: 'user1',
      category: 'entertainment',
      amount: 150,
      spent: 14.99,
      period: 'monthly',
      startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'budget5',
      userId: 'user1',
      category: 'utilities',
      amount: 250,
      spent: 175,
      period: 'monthly',
      startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ];

  // Create mock goals
  mockGoals = [
    {
      id: 'goal1',
      userId: 'user1',
      name: 'Emergency Fund',
      type: 'savings',
      targetAmount: 10000,
      currentAmount: 6500,
      startDate: '2023-01-01',
      targetDate: '2023-12-31',
      status: 'in_progress',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'goal2',
      userId: 'user1',
      name: 'Vacation',
      type: 'savings',
      targetAmount: 3000,
      currentAmount: 1500,
      startDate: '2023-01-01',
      targetDate: '2023-06-30',
      status: 'in_progress',
      notes: 'Summer vacation fund',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'goal3',
      userId: 'user1',
      name: 'Pay off Credit Card',
      type: 'debt',
      targetAmount: 4000,
      currentAmount: 2750,
      startDate: '2023-01-01',
      targetDate: '2023-09-30',
      status: 'in_progress',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
  ];
};

// User mock data functions
export const getMockUser = (): User => {
  return { ...mockUser };
};

export const setMockUser = (user: User): void => {
  mockUser = { ...user };
};

// Transaction mock data functions
export const getMockTransactions = (): Transaction[] => {
  return [...mockTransactions];
};

export const addMockTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    id: `transaction${mockTransactions.length + 1}`,
    ...transaction,
    createdAt: now,
    updatedAt: now,
  };
  
  mockTransactions.push(newTransaction);
  return newTransaction;
};

export const updateMockTransaction = (id: string, data: Partial<Transaction>): Transaction | null => {
  const index = mockTransactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  mockTransactions[index] = {
    ...mockTransactions[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return mockTransactions[index];
};

export const deleteMockTransaction = (id: string): boolean => {
  const initialLength = mockTransactions.length;
  mockTransactions = mockTransactions.filter(t => t.id !== id);
  return initialLength !== mockTransactions.length;
};

// Account mock data functions
export const getMockAccounts = (): Account[] => {
  return [...mockAccounts];
};

// Budget mock data functions
export const getMockBudgets = (): Budget[] => {
  return [...mockBudgets];
};

// Goal mock data functions
export const getMockGoals = (): Goal[] => {
  return [...mockGoals];
};