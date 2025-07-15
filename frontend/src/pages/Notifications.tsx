import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  CheckCircle, 
  Flame, 
  Clock, 
  Trophy,
  X,
  Mail,
  Trash2,
  Volume2
} from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: number
  title: string
  message: string
  type: 'roast' | 'task' | 'streak' | 'achievement' | 'reminder'
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Daily Roast Alert 🔥",
      message: "It's 3 PM and you've only completed 2 tasks. Your phone has seen more action than your to-do list!",
      type: "roast",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Task Deadline Approaching",
      message: "Your 'React Project' is due in 2 hours. Time to panic-code or actually deliver?",
      type: "task",
      timestamp: "1 hour ago",
      read: false,
      priority: "high"
    },
    {
      id: 3,
      title: "Streak Achievement! 🎉",
      message: "Congratulations! You've maintained a 7-day streak. You're actually doing this adulting thing!",
      type: "achievement",
      timestamp: "3 hours ago",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      title: "Motivation Check ⚡",
      message: "Remember when you said you'd be productive today? Pepperidge Farm remembers.",
      type: "roast",
      timestamp: "5 hours ago",
      read: true,
      priority: "medium"
    },
    {
      id: 5,
      title: "Weekly Goal Update",
      message: "You're 60% through your weekly goals. Not bad, not great, but not terrible either.",
      type: "reminder",
      timestamp: "1 day ago",
      read: true,
      priority: "low"
    },
    {
      id: 6,
      title: "Streak Warning ⚠️",
      message: "Your streak is about to break! Don't let yesterday's you down. Complete at least one task today.",
      type: "streak",
      timestamp: "2 days ago",
      read: true,
      priority: "high"
    }
  ])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    toast.success("All notifications marked as read")
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
    toast.success("Notification deleted")
  }

  const clearAll = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'roast': return <Flame className="h-4 w-4 text-orange-500" />
      case 'task': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'streak': return <Flame className="h-4 w-4 text-red-500" />
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'reminder': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'roast': return <Badge variant="destructive">Roast</Badge>
      case 'task': return <Badge variant="default">Task</Badge>
      case 'streak': return <Badge variant="destructive">Streak</Badge>
      case 'achievement': return <Badge variant="secondary">Achievement</Badge>
      case 'reminder': return <Badge variant="outline">Reminder</Badge>
      default: return <Badge>Info</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const roastNotifications = notifications.filter(n => n.type === 'roast')
  const taskNotifications = notifications.filter(n => n.type === 'task')
  const otherNotifications = notifications.filter(n => !['roast', 'task'].includes(n.type))

  return (
    <DashboardLayout title="Notifications">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roasts</p>
                  <p className="text-2xl font-bold">{roastNotifications.length}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                  <p className="text-2xl font-bold">{taskNotifications.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Other</p>
                  <p className="text-2xl font-bold">{otherNotifications.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="roasts">Roasts ({roastNotifications.length})</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({taskNotifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                        <p className="text-muted-foreground">
                          All quiet on the productivity front!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'bg-primary/5' : ''
                      } hover:shadow-md transition-shadow`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                                    {notification.title}
                                  </h4>
                                  {getNotificationBadge(notification.type)}
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {notification.type === 'roast' && (
                                    <Button size="icon" variant="ghost">
                                      <Volume2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {notification.timestamp}
                                </span>
                                
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="roasts">
              <div className="space-y-4">
                {roastNotifications.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No roasts yet</h3>
                        <p className="text-muted-foreground">
                          Either you're being too productive, or we're being too nice! 🔥
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  roastNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`border-l-4 border-l-orange-500 ${
                        !notification.read ? 'bg-orange-50 dark:bg-orange-950/20' : ''
                      }`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Flame className="h-5 w-5 text-orange-500 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{notification.title}</h4>
                                <div className="flex gap-1">
                                  <Button size="icon" variant="ghost">
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm italic text-orange-700 dark:text-orange-300 mb-2">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tasks">
              <div className="space-y-4">
                {taskNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-l-4 border-l-blue-500 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unread">
              <div className="space-y-4">
                {notifications.filter(n => !n.read).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-l-4 ${getPriorityColor(notification.priority)} bg-primary/5`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-primary">{notification.title}</h4>
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Notifications
