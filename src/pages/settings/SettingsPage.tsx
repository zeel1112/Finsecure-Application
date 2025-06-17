import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from '../../types';
import { Bell, Lock, User as UserIcon, Moon, Sun, CreditCard, Globe } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            {activeTab === 'profile' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="input"
                      defaultValue={user?.firstName}
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="input"
                      defaultValue={user?.lastName}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="input"
                      defaultValue={user?.email}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Current Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input type="password" className="input" />
                  </div>
                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="input" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn btn-primary">Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Budget Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you're close to your budget limits</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-primary-600"
                      role="switch"
                      aria-checked="true"
                    >
                      <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        <span className="opacity-0 duration-100 ease-in absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="opacity-100 duration-200 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Goal Progress</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates on your financial goals</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-gray-200"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        <span className="opacity-100 duration-200 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="opacity-0 duration-100 ease-in absolute inset-0 flex h-full w-full items-center justify-center transition-opacity" aria-hidden="true">
                          <svg className="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  App Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="form-label">Currency</label>
                    <select className="input">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Date Format</label>
                    <select className="input">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Payment Methods
                </h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">•••• 4242</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/24</p>
                        </div>
                      </div>
                      <button className="text-sm text-danger-600 hover:text-danger-500">Remove</button>
                    </div>
                  </div>
                  <button className="btn btn-secondary w-full">
                    Add New Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;