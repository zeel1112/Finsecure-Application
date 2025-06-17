import React, { useState, useEffect } from 'react';
import { Account } from '../../types';
import { getMockAccounts } from '../../lib/mockData';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon, CreditCard, Wallet, Landmark, TrendingUp } from 'lucide-react';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const data = getMockAccounts();
        setAccounts(data);
        setTotalBalance(data.reduce((sum, account) => sum + account.balance, 0));
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      case 'checking':
      case 'savings':
        return <Landmark className="h-6 w-6" />;
      case 'investment':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'text-danger-500 bg-danger-50 dark:bg-danger-900 dark:text-danger-400';
      case 'checking':
        return 'text-primary-500 bg-primary-50 dark:bg-primary-900 dark:text-primary-400';
      case 'savings':
        return 'text-success-500 bg-success-50 dark:bg-success-900 dark:text-success-400';
      case 'investment':
        return 'text-warning-500 bg-warning-50 dark:bg-warning-900 dark:text-warning-400';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total Balance: {formatCurrency(totalBalance)}
          </p>
        </div>
        <button
          type="button"
          className="mt-4 md:mt-0 btn btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Account
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No accounts found. Add your first account to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="card">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getAccountColor(account.type)}`}>
                  {getAccountIcon(account.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {account.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {account.type} Account
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {account.currency}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  View Transactions
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;