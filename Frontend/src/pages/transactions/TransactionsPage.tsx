import { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../../types';
import { PlusIcon, ArrowDownIcon, ArrowUpIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTransactionStore } from '../../store/transactionStore';
import { formatCurrency } from '../../utils/formatters';
import AddTransactionModal from '../../components/transactions/AddTransactionModal';

const TransactionsPage = () => {
  const { 
    transactions, 
    filteredTransactions, 
    fetchTransactions, 
    isLoading, 
    filters, 
    setFilters, 
    clearFilters,
  } = useTransactionStore();

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getCategoryBadgeClass = (category: TransactionCategory) => {
    const baseClasses = 'text-xs font-medium px-2.5 py-0.5 rounded-full';
    
    const categoryClasses: Record<TransactionCategory, string> = {
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
      income: 'bg-success-50 text-success-800 dark:bg-success-900 dark:text-success-200',
      saving: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return `${baseClasses} ${categoryClasses[category]}`;
  };

  const getAmountClass = (type: TransactionType) => {
    if (type === 'income') {
      return 'text-success-600 dark:text-success-400';
    } else if (type === 'expense') {
      return 'text-danger-600 dark:text-danger-400';
    }
    return 'text-gray-700 dark:text-gray-300';
  };

  const getAmountPrefix = (type: TransactionType) => {
    if (type === 'income') {
      return '+';
    } else if (type === 'expense') {
      return '-';
    }
    return '';
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryFilter = (category: TransactionCategory | null) => {
    setFilters({ category });
    setIsFilterMenuOpen(false);
  };

  const handleTypeFilter = (type: TransactionType | null) => {
    setFilters({ type });
    setIsFilterMenuOpen(false);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ startDate: e.target.value || null });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ endDate: e.target.value || null });
  };

  const handleClearFilters = () => {
    clearFilters();
    setIsFilterMenuOpen(false);
  };

  const categories: TransactionCategory[] = [
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
    'other',
  ];

  const types: TransactionType[] = ['income', 'expense', 'transfer'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 md:mt-0 btn btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          
          <div className="relative">
            <button
              type="button"
              className="btn btn-secondary flex items-center"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
              {(filters.category || filters.type || filters.startDate || filters.endDate) && (
                <span className="ml-2 w-2 h-2 rounded-full bg-primary-500"></span>
              )}
            </button>
            
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 p-4 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="form-label text-xs">From</label>
                        <input
                          type="date"
                          className="input"
                          value={filters.startDate || ''}
                          onChange={handleStartDateChange}
                        />
                      </div>
                      <div>
                        <label className="form-label text-xs">To</label>
                        <input
                          type="date"
                          className="input"
                          value={filters.endDate || ''}
                          onChange={handleEndDateChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Transaction Type</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {types.map(type => (
                        <button
                          key={type}
                          className={`px-2 py-1 text-xs rounded-full ${
                            filters.type === type
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => handleTypeFilter(filters.type === type ? null : type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {categories.map(category => (
                        <button
                          key={category}
                          className={`px-2 py-1 text-xs rounded-full ${
                            filters.category === category
                              ? getCategoryBadgeClass(category)
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => handleCategoryFilter(filters.category === category ? null : category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="btn btn-secondary w-full"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                      {transaction.notes && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {transaction.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getCategoryBadgeClass(transaction.category)}>
                        {transaction.category}
                      </span>
                      {transaction.isRecurring && (
                        <span className="ml-2 inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          recurring
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={getAmountClass(transaction.type)}>
                        {getAmountPrefix(transaction.type)}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default TransactionsPage;