import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { TransactionCategory, TransactionType } from '../../types';
import { useTransactionStore } from '../../store/transactionStore';
import { useAuthStore } from '../../store/authStore';
import { getMockAccounts } from '../../lib/mockData';

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense', 'transfer'] as const),
  category: z.enum([
    'housing',
    'transportation', 
    'food',
    'utilities',
    'insurance',
    'healthcare',
    'personal',
    'entertainment',
    'education',
    'shopping',
    'income',
    'saving',
    'other'
  ] as const),
  date: z.string().min(1, 'Date is required'),
  accountId: z.string().min(1, 'Account is required'),
  isRecurring: z.boolean().optional(),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
  const { addNewTransaction, isLoading } = useTransactionStore();
  const { user } = useAuthStore();
  const [accounts] = useState(getMockAccounts());

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      accountId: accounts[0]?.id || '',
      isRecurring: false,
      notes: '',
    },
  });

  const transactionType = watch('type');

  const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'personal', label: 'Personal Care' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'education', label: 'Education' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'income', label: 'Income' },
    { value: 'saving', label: 'Savings' },
    { value: 'other', label: 'Other' },
  ];

  const getFilteredCategories = (type: TransactionType) => {
    if (type === 'income') {
      return categories.filter(cat => ['income', 'other'].includes(cat.value));
    }
    return categories.filter(cat => cat.value !== 'income');
  };

  const onSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      await addNewTransaction({
        userId: user.id,
        accountId: data.accountId,
        date: data.date,
        amount: data.amount,
        description: data.description,
        type: data.type,
        category: data.category,
        isRecurring: data.isRecurring || false,
        notes: data.notes || undefined,
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Transaction
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className={`input ${errors.description ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  placeholder="Enter transaction description"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`input ${errors.amount ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                  />
                  {errors.amount && (
                    <p className="form-error">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Type</label>
                  <select
                    className={`input ${errors.type ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                    {...register('type')}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  {errors.type && (
                    <p className="form-error">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Category</label>
                <select
                  className={`input ${errors.category ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  {...register('category')}
                >
                  {getFilteredCategories(transactionType).map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="form-error">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className={`input ${errors.date ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="form-error">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Account</label>
                  <select
                    className={`input ${errors.accountId ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                    {...register('accountId')}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  {errors.accountId && (
                    <p className="form-error">{errors.accountId.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Add any additional notes..."
                  {...register('notes')}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isRecurring"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('isRecurring')}
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  This is a recurring transaction
                </label>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full inline-flex justify-center btn btn-primary sm:ml-3 sm:w-auto"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Add Transaction
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center btn btn-secondary sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;