import React, { useState } from 'react';
import { Bell, X, CheckCircle, Clock, Zap, Trophy } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'procrastination':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'motivation':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'completion':
        return <Trophy className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'procrastination':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'motivation':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'completion':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">🔥 TaskTuner Roasts</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No roasts yet!</p>
                  <p className="text-sm">We'll roast you when you procrastinate 😈</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-1 p-2">
                    {notifications.map((notification, index) => (
                      <div key={notification.id}>
                        <div
                          className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-accent/50 ${
                            getNotificationColor(notification.type)
                          } ${!notification.read ? 'ring-1 ring-primary/20' : 'opacity-75'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {notification.task?.title && (
                                  <span className="font-medium text-sm truncate">
                                    {notification.task.title}
                                  </span>
                                )}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {notification.task?.points && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{notification.task.points} XP
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < notifications.length - 1 && <Separator className="my-1" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {notifications.length > 0 && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Clear All Notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
