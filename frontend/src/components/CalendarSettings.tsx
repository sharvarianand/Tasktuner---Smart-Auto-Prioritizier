import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Calendar, ExternalLink, CheckCircle, AlertCircle, Clock, Settings, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DemoRestrictedButton, DemoRestrictedSwitch } from '@/components/demo-restriction'

interface CalendarSettingsProps {
  isDemo?: boolean
}

export const CalendarSettings: React.FC<CalendarSettingsProps> = ({ isDemo = false }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [calendarSettings, setCalendarSettings] = useState({
    autoSync: true,
    createReminders: true,
    reminderMinutes: 15,
    syncFrequency: 'realtime',
    defaultEventDuration: 60,
    includeTaskDetails: true
  })
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
    loadCalendarSettings()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/calendar/auth/status')
      const data = await response.json()
      setIsConnected(data.isAuthenticated)
      if (data.lastSyncTime) {
        setLastSyncTime(data.lastSyncTime)
      }
    } catch (error) {
      console.error('Error checking calendar auth status:', error)
    }
  }

  const loadCalendarSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('calendar-settings')
    if (savedSettings) {
      setCalendarSettings(JSON.parse(savedSettings))
    }
  }

  const saveCalendarSettings = (newSettings: any) => {
    setCalendarSettings(newSettings)
    localStorage.setItem('calendar-settings', JSON.stringify(newSettings))
    toast.success('Calendar settings saved!')
  }

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...calendarSettings, [key]: value }
    saveCalendarSettings(newSettings)
  }

  const disconnectCalendar = async () => {
    if (isDemo) {
      toast.info("Calendar disconnection is available in the full version!")
      return
    }

    try {
      // Call API to revoke tokens
      const response = await fetch('/api/calendar/disconnect', { method: 'POST' })
      if (response.ok) {
        setIsConnected(false)
        setLastSyncTime(null)
        toast.success('Calendar disconnected successfully')
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error)
      toast.error('Failed to disconnect calendar')
    }
  }

  const syncCalendar = async () => {
    if (isDemo) {
      toast.info("Calendar sync is available in the full version!")
      return
    }

    try {
      const response = await fetch('/api/calendar/sync', { method: 'POST' })
      if (response.ok) {
        setLastSyncTime(new Date().toISOString())
        toast.success('Calendar synced successfully!')
      }
    } catch (error) {
      console.error('Error syncing calendar:', error)
      toast.error('Failed to sync calendar')
    }
  }

  const connectToGoogleCalendar = async () => {
    if (isDemo) {
      toast.info("Calendar integration is available in the full version!")
      return
    }

    try {
      setIsConnecting(true)
      const response = await fetch('/api/calendar/auth/url')
      const data = await response.json()
      
      if (data.authUrl) {
        setAuthUrl(data.authUrl)
        // Open auth URL in a new window
        const authWindow = window.open(
          data.authUrl,
          'google-calendar-auth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        )

        // Poll for auth completion
        const pollForAuth = setInterval(async () => {
          if (authWindow?.closed) {
            clearInterval(pollForAuth)
            setIsConnecting(false)
            // Check if auth was successful
            await checkAuthStatus()
            if (isConnected) {
              toast.success("Google Calendar connected successfully! 📅")
            }
          }
        }, 1000)

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(pollForAuth)
          setIsConnecting(false)
          if (authWindow && !authWindow.closed) {
            authWindow.close()
          }
        }, 300000)
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      toast.error('Failed to connect to Google Calendar')
      setIsConnecting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Automatically sync tasks with time slots to your Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Connected</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
                {lastSyncTime && (
                  <span className="text-xs text-muted-foreground">
                    Last sync: {new Date(lastSyncTime).toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Not Connected</span>
                <Badge variant="outline">
                  Disconnected
                </Badge>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            {isConnected ? (
              <>
                <DemoRestrictedButton
                  onClick={syncCalendar}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Now
                </DemoRestrictedButton>
                <DemoRestrictedButton
                  onClick={disconnectCalendar}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Disconnect
                </DemoRestrictedButton>
              </>
            ) : (
              <DemoRestrictedButton
                onClick={connectToGoogleCalendar}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {isConnecting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Calendar
                  </>
                )}
              </DemoRestrictedButton>
            )}
          </div>
        </div>

        {/* Calendar Settings */}
        {isConnected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <Label className="text-base font-medium">Calendar Settings</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync tasks to calendar</p>
                </div>
                <DemoRestrictedSwitch
                  checked={calendarSettings.autoSync}
                  onCheckedChange={(checked) => updateSetting('autoSync', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Create Reminders</Label>
                  <p className="text-sm text-muted-foreground">Add reminder notifications</p>
                </div>
                <DemoRestrictedSwitch
                  checked={calendarSettings.createReminders}
                  onCheckedChange={(checked) => updateSetting('createReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Task Details</Label>
                  <p className="text-sm text-muted-foreground">Add task description to events</p>
                </div>
                <DemoRestrictedSwitch
                  checked={calendarSettings.includeTaskDetails}
                  onCheckedChange={(checked) => updateSetting('includeTaskDetails', checked)}
                />
              </div>

              <div>
                <Label>Default Event Duration (minutes)</Label>
                <input
                  type="number"
                  value={calendarSettings.defaultEventDuration}
                  onChange={(e) => updateSetting('defaultEventDuration', parseInt(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="15"
                  max="480"
                  step="15"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {isConnected && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Calendar Integration Active</p>
                <p className="text-green-600 mt-1">
                  Tasks with start and end times will automatically be added to your Google Calendar with reminders.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Why Connect Your Calendar?</p>
                <ul className="text-blue-600 mt-1 space-y-1">
                  <li>• Automatic event creation for timed tasks</li>
                  <li>• Smart reminder notifications</li>
                  <li>• Better time management integration</li>
                  <li>• Cross-platform sync with your existing calendar</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CalendarSettings
