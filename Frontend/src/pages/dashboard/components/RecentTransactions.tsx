import { Transaction } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      housing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      transportation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      utilities: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      insurance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      healthcare: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      personal: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      entertainment: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      education: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      shopping: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      income: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return categoryColors[category] || categoryColors.other;
  };

  const getAmountColor = (type: string, amount: number): string => {
    if (type === 'income') {
      return 'text-success-600 dark:text-success-400';
    } else if (type === 'expense') {
      return 'text-danger-600 dark:text-danger-400';
    } else {
      return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAmountPrefix = (type: string): string => {
    if (type === 'income') {
      return '+';
    } else if (type === 'expense') {
      return '-';
    } else {
      return '';
    }
  };

  return (
    <div className="overflow-hidden">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent transactions</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span 
                    className={`font-medium ${getAmountColor(transaction.type, transaction.amount)}`}
                  >
                    {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <span 
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(transaction.category)}`}
                  >
                    {transaction.category}
                  </span>
                  {transaction.isRecurring && (
                    <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;