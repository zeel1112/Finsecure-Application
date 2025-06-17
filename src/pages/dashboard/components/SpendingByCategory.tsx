import { useEffect, useState } from 'react';
import { Budget } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

// Mock data for budget categories
const mockBudgets: Budget[] = [
  {
    id: '1',
    userId: 'user1',
    category: 'housing',
    amount: 1200,
    spent: 1150,
    period: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    userId: 'user1',
    category: 'food',
    amount: 500,
    spent: 425,
    period: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '3',
    userId: 'user1',
    category: 'transportation',
    amount: 300,
    spent: 210,
    period: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '4',
    userId: 'user1',
    category: 'entertainment',
    amount: 200,
    spent: 180,
    period: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '5',
    userId: 'user1',
    category: 'utilities',
    amount: 250,
    spent: 220,
    period: 'monthly',
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
];

const SpendingByCategory = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with proper cleanup
    let isMounted = true;
    
    const loadBudgets = () => {
      setTimeout(() => {
        if (isMounted) {
          setBudgets(mockBudgets);
          setIsLoading(false);
        }
      }, 500);
    };

    loadBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'housing':
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'food':
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'transportation':
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'entertainment':
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'utilities':
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getProgressBarColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 50) return 'bg-success-500';
    if (percentage < 85) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  if (isLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-96 overflow-y-auto">
      <div className="space-y-4 pr-2">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-3 flex-shrink-0">
                  {getCategoryIcon(budget.category)}
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white capitalize">
                  {budget.category}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {((budget.spent / budget.amount) * 100).toFixed(0)}% used
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${getProgressBarColor(budget.spent, budget.amount)}`}
                style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingByCategory;