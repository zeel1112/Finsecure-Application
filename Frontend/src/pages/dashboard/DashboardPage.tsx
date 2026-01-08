import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ChartData, Transaction, Budget } from '../../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  TrendingUpIcon, 
  BellIcon, 
  DollarSignIcon 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { getMockTransactions } from '../../lib/mockData';
import SpendingByCategory from './components/SpendingByCategory';
import RecentTransactions from './components/RecentTransactions';

// Register ChartJS components
Chart.register(...registerables);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spendingData, setSpendingData] = useState<ChartData | null>(null);
  const [incomeData, setIncomeData] = useState<ChartData | null>(null);
  const [balanceData, setBalanceData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        // Get mock transactions data
        const transactions = getMockTransactions();
        setTransactions(transactions);
        
        // Calculate stats
        const totalBalance = 12500;
        const monthlyIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const savingsRate = monthlyIncome > 0 
          ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
          : 0;
        
        setStats({
          totalBalance,
          monthlyIncome,
          monthlyExpenses,
          savingsRate,
        });

        // Prepare chart data
        prepareChartData(transactions);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const prepareChartData = (transactions: Transaction[]) => {
    // Spending by category chart
    const categoryData = prepareSpendingByCategoryData(transactions);
    setSpendingData(categoryData);

    // Income vs Expenses chart (last 6 months)
    const incomeVsExpensesData = prepareIncomeVsExpensesData();
    setIncomeData(incomeVsExpensesData);

    // Balance over time
    const balanceOverTimeData = prepareBalanceOverTimeData();
    setBalanceData(balanceOverTimeData);
  };

  const prepareSpendingByCategoryData = (transactions: Transaction[]): ChartData => {
    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    // Prepare data for chart
    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);
    
    return {
      labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [
        {
          label: 'Spending by Category',
          data: amounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 159, 64, 0.8)',
            'rgba(210, 99, 132, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareIncomeVsExpensesData = (): ChartData => {
    // Mock data for last 6 months
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: [4200, 4500, 4300, 4800, 5200, 5500],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: [3800, 3600, 4100, 3900, 4300, 4100],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareBalanceOverTimeData = (): ChartData => {
    // Mock data for last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Balance',
          data: [8000, 8200, 8500, 8700, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500],
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total balance card */}
        <div className="card card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200">
              <DollarSignIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalBalance)}</p>
            </div>
          </div>
        </div>

        {/* Monthly income card */}
        <div className="card card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-50 dark:bg-success-900 text-success-600 dark:text-success-200">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.monthlyIncome)}</p>
            </div>
          </div>
        </div>

        {/* Monthly expenses card */}
        <div className="card card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-danger-50 dark:bg-danger-900 text-danger-600 dark:text-danger-200">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.monthlyExpenses)}</p>
            </div>
          </div>
        </div>

        {/* Savings rate card */}
        <div className="card card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-50 dark:bg-warning-900 text-warning-600 dark:text-warning-200">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.savingsRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Spending by Category */}
        <div className="card lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Spending by Category</h2>
          <div className="h-64">
            {spendingData && (
              <Doughnut 
                data={spendingData} 
                options={{ 
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>

        {/* Chart: Income vs Expenses */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Income vs Expenses</h2>
          <div className="h-64">
            {incomeData && (
              <Bar
                data={incomeData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* More sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <a href="/transactions" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              View all
            </a>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <RecentTransactions transactions={transactions.slice(0, 5)} />
          </div>
        </div>

        {/* Chart: Balance Over Time */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Balance Over Time</h2>
          <div className="h-64">
            {balanceData && (
              <Bar
                data={balanceData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Budget Overview & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Overview */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h2>
            <a href="/budgets" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Manage budgets
            </a>
          </div>
          <SpendingByCategory />
        </div>

        {/* Alerts & Notifications */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BellIcon className="h-5 w-5 text-warning-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h2>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            <div className="p-3 bg-warning-50 dark:bg-warning-900 rounded-lg">
              <p className="text-sm text-warning-800 dark:text-warning-200">
                Food budget at 85% of monthly limit
              </p>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Netflix subscription due in 3 days
              </p>
            </div>
            <div className="p-3 bg-success-50 dark:bg-success-900 rounded-lg">
              <p className="text-sm text-success-800 dark:text-success-200">
                You've saved $250 more than last month!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;