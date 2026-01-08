import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Notification } from '../../types';
import { format } from 'date-fns';

interface NotificationPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NotificationPanel = ({ open, setOpen }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications data - would come from an API
  useEffect(() => {
    // Simulate loading notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: 'user1',
        type: 'budget_alert',
        message: 'Your Food budget is at 90% of the limit',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        id: '2',
        userId: 'user1',
        type: 'recurring_transaction',
        message: 'Netflix subscription ($12.99) due tomorrow',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
      {
        id: '3',
        userId: 'user1',
        type: 'goal_achieved',
        message: 'Congratulations! You\'ve reached your Emergency Fund goal',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'budget_alert':
        return (
          <div className="h-8 w-8 rounded-full bg-warning-50 dark:bg-warning-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-warning-500\" xmlns="http://www.w3.org/2000/svg\" viewBox="0 0 20 20\" fill="currentColor">
              <path fillRule="evenodd\" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z\" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'goal_achieved':
        return (
          <div className="h-8 w-8 rounded-full bg-success-50 dark:bg-success-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-success-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'recurring_transaction':
        return (
          <div className="h-8 w-8 rounded-full bg-primary-50 dark:bg-primary-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`fixed inset-0 overflow-hidden z-20 ${open ? '' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setOpen(false)}
        />
        
        {/* Panel */}
        <section 
          className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform ease-in-out duration-300`}
        >
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col py-6 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
              <div className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {unreadCount} new
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center space-x-4">
                    {unreadCount > 0 && (
                      <button 
                        type="button" 
                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 relative flex-1 px-4 sm:px-6">
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border ${notification.isRead ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-700'}`}
                      >
                        <div className="flex items-start">
                          {getNotificationIcon(notification.type)}
                          <div className="ml-3 flex-1">
                            <p className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'font-medium text-gray-900 dark:text-white'}`}>
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <button
                              type="button"
                              className="ml-4 bg-white dark:bg-gray-700 rounded-full h-2 w-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <span className="sr-only">Mark as read</span>
                              <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationPanel;