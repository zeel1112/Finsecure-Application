import React, { useState, useEffect } from 'react';
import { Goal } from '../../types';
import { getMockGoals } from '../../lib/mockData';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon } from 'lucide-react';

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const data = getMockGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, []);

  const getProgressBarColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 50) return 'bg-primary-500';
    if (percentage < 85) return 'bg-success-500';
    return 'bg-warning-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financial Goals
        </h1>
        <button
          type="button"
          className="mt-4 md:mt-0 btn btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Goal
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No goals found. Create your first financial goal to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {goal.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {goal.type} Goal
                  </p>
                </div>
                <span className={`badge ${
                  goal.status === 'achieved' ? 'badge-success' :
                  goal.status === 'in_progress' ? 'badge-primary' :
                  'badge-danger'
                }`}>
                  {goal.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% complete
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Target: {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getProgressBarColor(goal.currentAmount, goal.targetAmount)}`}
                    style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: {formatCurrency(goal.currentAmount)}
                </p>
              </div>

              {goal.notes && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {goal.notes}
                </p>
              )}

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

export default GoalsPage;