import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { DemoRestrictedButton } from '@/components/demo-restriction'

interface CalendarSettingsProps {
  isDemo?: boolean
}

export const CalendarSettings: React.FC<CalendarSettingsProps> = ({ isDemo = false }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [authUrl, setAuthUrl] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/calendar/auth/status')
      const data = await response.json()
      setIsConnected(data.isAuthenticated)
    } catch (error) {
      console.error('Error checking calendar auth status:', error)
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
          Automatically add tasks with time slots to your Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Connected</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
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
          
          {!isConnected && (
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
