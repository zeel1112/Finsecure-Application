import api from '../../lib/api';
import { Transaction } from '../../types';

interface TransactionResponse {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  amount: number;
  description: string;
  type: string;
  category: string;
  is_recurring: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const mapTransactionResponse = (data: TransactionResponse): Transaction => ({
  id: data.id,
  userId: data.user_id,
  accountId: data.account_id,
  date: data.date,
  amount: data.amount,
  description: data.description,
  type: data.type as Transaction['type'],
  category: data.category as Transaction['category'],
  isRecurring: data.is_recurring,
  notes: data.notes,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

const mapTransactionRequest = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => ({
  account_id: transaction.accountId,
  date: transaction.date,
  amount: transaction.amount,
  description: transaction.description,
  type: transaction.type,
  category: transaction.category,
  is_recurring: transaction.isRecurring,
  notes: transaction.notes,
});

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<TransactionResponse[]>('/transactions');
  return response.data.map(mapTransactionResponse);
};

export const addTransaction = async (
  transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> => {
  const response = await api.post<TransactionResponse>(
    '/transactions',
    mapTransactionRequest(transaction)
  );
  return mapTransactionResponse(response.data);
};

export const updateTransaction = async (
  id: string,
  data: Partial<Transaction>
): Promise<Transaction> => {
  const updateData: any = {};

  if (data.accountId) updateData.account_id = data.accountId;
  if (data.date) updateData.date = data.date;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.description) updateData.description = data.description;
  if (data.type) updateData.type = data.type;
  if (data.category) updateData.category = data.category;
  if (data.isRecurring !== undefined) updateData.is_recurring = data.isRecurring;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const response = await api.put<TransactionResponse>(`/transactions/${id}`, updateData);
  return mapTransactionResponse(response.data);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const categorizeTransaction = async (description: string): Promise<string> => {
  const response = await api.post<{ category: string; confidence: number }>(
    '/transactions/categorize',
    { description }
  );
  return response.data.category;
};
