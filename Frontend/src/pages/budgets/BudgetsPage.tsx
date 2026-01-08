import React from 'react';
import { Budget } from '../../types';
import { getMockBudgets } from '../../lib/mockData';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon } from 'lucide-react';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBudgets = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const data = getMockBudgets();
        setBudgets(data);
      } catch (error) {
        console.error('Error loading budgets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const getProgressBarColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 50) return 'bg-success-500';
    if (percentage < 85) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Budget Management
        </h1>
        <button
          type="button"
          className="mt-4 md:mt-0 btn btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Budget
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No budgets found. Create your first budget to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <div key={budget.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {budget.category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(budget.amount)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(budget.spent)} spent
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {((budget.spent / budget.amount) * 100).toFixed(0)}% used
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(budget.amount - budget.spent)} remaining
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getProgressBarColor(budget.spent, budget.amount)}`}
                    style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;