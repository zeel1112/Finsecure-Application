import { create } from 'zustand';
import { Transaction, TransactionCategory, TransactionType } from '../types';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: {
    startDate: string | null;
    endDate: string | null;
    category: TransactionCategory | null;
    type: TransactionType | null;
    search: string;
  };
}

interface TransactionStore extends TransactionState {
  fetchTransactions: () => Promise<void>;
  addNewTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TransactionState['filters']>) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    category: null,
    type: null,
    search: '',
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getTransactions();
      set({ 
        transactions, 
        filteredTransactions: applyFilters(transactions, get().filters),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch transactions', 
        isLoading: false 
      });
    }
  },

  addNewTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const newTransaction = await addTransaction(transaction);
      const updatedTransactions = [...get().transactions, newTransaction];
      set({ 
        transactions: updatedTransactions,
        filteredTransactions: applyFilters(updatedTransactions, get().filters),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add transaction', 
        isLoading: false 
      });
    }
  },

  editTransaction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTransaction = await updateTransaction(id, data);
      const updatedTransactions = get().transactions.map(
        t => t.id === id ? updatedTransaction : t
      );
      set({ 
        transactions: updatedTransactions,
        filteredTransactions: applyFilters(updatedTransactions, get().filters),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update transaction', 
        isLoading: false 
      });
    }
  },

  removeTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTransaction(id);
      const updatedTransactions = get().transactions.filter(t => t.id !== id);
      set({ 
        transactions: updatedTransactions,
        filteredTransactions: applyFilters(updatedTransactions, get().filters),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete transaction', 
        isLoading: false 
      });
    }
  },

  setFilters: (filters) => {
    const newFilters = { ...get().filters, ...filters };
    set({
      filters: newFilters,
      filteredTransactions: applyFilters(get().transactions, newFilters)
    });
  },

  clearFilters: () => {
    const defaultFilters = {
      startDate: null,
      endDate: null,
      category: null,
      type: null,
      search: '',
    };
    set({
      filters: defaultFilters,
      filteredTransactions: get().transactions
    });
  }
}));

// Helper function to apply filters
function applyFilters(
  transactions: Transaction[], 
  filters: TransactionState['filters']
): Transaction[] {
  return transactions.filter(transaction => {
    // Filter by date range
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Filter by category
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Filter by type
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchTerm) ||
        transaction.notes?.toLowerCase().includes(searchTerm) ||
        transaction.category.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });
}