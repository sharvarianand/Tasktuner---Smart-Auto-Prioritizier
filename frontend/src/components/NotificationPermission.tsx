import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertCircle, X } from 'lucide-react'
import notificationService from '@/services/notificationService'
import { toast } from 'sonner'

interface NotificationPermissionProps {
  onDismiss?: () => void
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onDismiss }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    setPermission(notificationService.getPermissionStatus())
  }, [])

  const requestPermission = async () => {
    setIsRequesting(true)
    try {
      const granted = await notificationService.requestPermission()
      setPermission(notificationService.getPermissionStatus())
      
      if (granted) {
        toast.success("Notifications enabled! You'll get reminders for your tasks 🔔")
        // Show a test notification
        setTimeout(() => {
          notificationService.showNotification("Test Notification", {
            body: "TaskTuner notifications are working! You're ready to stay on top of your tasks.",
            tag: 'test-notification'
          })
        }, 1000)
      } else {
        toast.error("Notifications denied. You can enable them later in your browser settings.")
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast.error("Failed to enable notifications")
    } finally {
      setIsRequesting(false)
    }
  }

  if (permission === 'granted') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Notifications Enabled</p>
                <p className="text-sm text-green-600">You'll receive task reminders</p>
              </div>
            </div>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (permission === 'denied') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Notifications Blocked</p>
                <p className="text-sm text-red-600">
                  To enable task reminders, click the 🔔 icon in your browser's address bar, 
                  or go to Settings → Privacy & Security → Notifications
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setPermission('default')
                  requestPermission()
                }}
              >
                Try Again
              </Button>
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Bell className="h-5 w-5" />
          Enable Task Reminders
        </CardTitle>
        <CardDescription className="text-blue-600">
          Get notified before your tasks start and after they end to stay on track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Bell className="h-4 w-4" />
              <span>Browser notifications for task reminders</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span>Follow-up reminders to mark tasks complete</span>
            </div>
          </div>
          <div className="flex gap-2">
            {onDismiss && (
              <Button variant="outline" size="sm" onClick={onDismiss}>
                Maybe Later
              </Button>
            )}
            <Button 
              onClick={requestPermission} 
              disabled={isRequesting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {isRequesting ? "Requesting..." : "Enable Notifications"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationPermission
