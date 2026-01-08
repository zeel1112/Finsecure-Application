import { Transaction } from '../types';
import { getMockTransactions, updateMockTransaction, addMockTransaction, deleteMockTransaction } from '../lib/mockData';

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be an API call to fetch transactions from the backend
  const transactions = getMockTransactions();
  return transactions;
};

// Add a new transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be an API call to add a transaction in the backend
  const newTransaction = addMockTransaction(transaction);
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would be an API call to update a transaction in the backend
  const updatedTransaction = updateMockTransaction(id, data);
  
  if (!updatedTransaction) {
    throw new Error('Transaction not found');
  }
  
  return updatedTransaction;
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would be an API call to delete a transaction in the backend
  const success = deleteMockTransaction(id);
  
  if (!success) {
    throw new Error('Transaction not found');
  }
};

// Categorize a transaction (simulating ML-based categorization)
export const categorizeTransaction = async (description: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simple keyword-based categorization (in a real app, this would use ML)
  const description_lower = description.toLowerCase();
  
  if (description_lower.includes('rent') || description_lower.includes('mortgage')) {
    return 'housing';
  } else if (description_lower.includes('uber') || description_lower.includes('lyft') || description_lower.includes('gas')) {
    return 'transportation';
  } else if (description_lower.includes('grocery') || description_lower.includes('restaurant') || 
             description_lower.includes('food') || description_lower.includes('cafe')) {
    return 'food';
  } else if (description_lower.includes('netflix') || description_lower.includes('movie') || 
             description_lower.includes('spotify') || description_lower.includes('ticket')) {
    return 'entertainment';
  } else if (description_lower.includes('electricity') || description_lower.includes('water') || 
             description_lower.includes('internet') || description_lower.includes('phone')) {
    return 'utilities';
  } else if (description_lower.includes('salary') || description_lower.includes('paycheck') || 
             description_lower.includes('deposit')) {
    return 'income';
  } else if (description_lower.includes('amazon') || description_lower.includes('walmart') || 
             description_lower.includes('target') || description_lower.includes('shop')) {
    return 'shopping';
  } else if (description_lower.includes('doctor') || description_lower.includes('pharmacy') || 
             description_lower.includes('hospital')) {
    return 'healthcare';
  }
  
  return 'other';
};