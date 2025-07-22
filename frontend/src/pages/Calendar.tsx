
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  RefreshCw, 
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { useState } from "react"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')

  // Mock calendar data
  const events = [
    { 
      id: 1, 
      title: "React Project Work", 
      time: "09:00 - 11:00", 
      type: "task", 
      priority: "High",
      status: "scheduled" 
    },
    { 
      id: 2, 
      title: "Team Meeting", 
      time: "14:00 - 15:00", 
      type: "meeting", 
      priority: "Medium",
      status: "confirmed" 
    },
    { 
      id: 3, 
      title: "Study Session", 
      time: "16:00 - 18:00", 
      type: "study", 
      priority: "High",
      status: "scheduled" 
    },
    { 
      id: 4, 
      title: "Gym Workout", 
      time: "19:00 - 20:30", 
      type: "personal", 
      priority: "Low",
      status: "scheduled" 
    }
  ]

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'task': return 'bg-primary/20 border-primary text-primary-foreground'
      case 'meeting': return 'bg-accent/20 border-accent text-accent-foreground'
      case 'study': return 'bg-secondary/20 border-secondary text-secondary-foreground'
      case 'personal': return 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-muted border-muted-foreground'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <DashboardLayout title="Calendar">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold">Your Schedule</h2>
            <p className="text-muted-foreground">{formatDate(currentDate)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className="rounded-r-none"
              >
                Week
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className="rounded-l-none"
              >
                Month
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Calendar
            </Button>
            
            <Button className="bg-gradient-primary gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Weekly View
                </CardTitle>
                <CardDescription>
                  Your tasks automatically blocked in your calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-8 gap-1 text-sm">
                  {/* Header */}
                  <div></div>
                  {daysOfWeek.map(day => (
                    <div key={day} className="font-semibold text-center p-2 border-b">
                      {day}
                    </div>
                  ))}
                  
                  {/* Time slots */}
                  {timeSlots.slice(8, 22).map(time => (
                    <div key={time} className="contents">
                      <div className="text-right p-2 text-xs text-muted-foreground border-r">
                        {time}
                      </div>
                      {daysOfWeek.map((day, dayIndex) => (
                        <div key={`${day}-${time}`} className="p-1 border border-muted min-h-[60px] relative">
                          {/* Sample events */}
                          {dayIndex === 2 && time === '09:00' && (
                            <div className="absolute inset-1 bg-primary/20 border border-primary rounded p-1 text-xs">
                              <div className="font-medium">React Project</div>
                              <div className="text-xs opacity-75">09:00-11:00</div>
                            </div>
                          )}
                          {dayIndex === 2 && time === '14:00' && (
                            <div className="absolute inset-1 bg-accent/20 border border-accent rounded p-1 text-xs">
                              <div className="font-medium">Team Meeting</div>
                              <div className="text-xs opacity-75">14:00-15:00</div>
                            </div>
                          )}
                          {dayIndex === 2 && time === '16:00' && (
                            <div className="absolute inset-1 bg-secondary/20 border border-secondary rounded p-1 text-xs">
                              <div className="font-medium">Study Block</div>
                              <div className="text-xs opacity-75">16:00-18:00</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Today's Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Today's Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getEventStyle(event.type)}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-75">{event.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Google Calendar Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar</CardTitle>
                <CardDescription>
                  Sync with your existing calendar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Connected</p>
                    <p className="text-xs text-muted-foreground">aarav@example.com</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Open in Google Calendar
                </Button>
                
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Force Sync
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="mr-2 h-3 w-3" />
                  Block Study Time
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="mr-2 h-3 w-3" />
                  Schedule Break
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  Plan Tomorrow
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Tips */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  💡 Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  TaskTuner automatically blocks time for your high-priority tasks. 
                  The AI learns your patterns and optimizes your schedule!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Calendar
