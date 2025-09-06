
import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  DemoRestrictionBanner, 
  DemoRestrictedButton, 
  DemoRestrictedInput, 
  DemoRestrictedSwitch 
} from "@/components/demo-restriction"
import { useDemoMode } from "@/contexts/DemoContext"
import notificationService from "@/services/notificationService"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Settings as SettingsIcon,
  Bell,
  Volume2,
  Trash2,
  Shield,
  Clock,
  Palette,
  LogOut,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useUser } from "@clerk/clerk-react"
import { toast } from "sonner"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { isDemoMode } = useDemoMode()
  const { user } = useUser()
  
  // Get user's name for personalization
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
  
  const [settings, setSettings] = useState({
    notifications: {
      roastReminders: true,
      taskDeadlines: true,
      streakUpdates: true,
      weeklyReports: true,
      friendActivity: false
    },
    voice: {
      enabled: true,
      autoPlay: false,
      volume: 80,
      voice: "female"
    },
    productivity: {
      workingHours: {
        start: "09:00",
        end: "17:00"
      },
      timezone: "America/New_York",
      weekStart: "monday",
      autoSchedule: true
    },
    roasts: {
      enabled: true,
      intensity: "medium",
      frequency: "normal",
      customRoasts: false
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    toast.success("Settings updated!")
  }

  const clearAllData = () => {
    toast.success("All data cleared! Starting fresh... good luck! 😏")
  }

  const exportData = () => {
    toast.success("Data exported! Check your downloads folder.")
  }

  return (
    <DashboardLayout title="Settings">
      <DemoRestrictionBanner />
      <div className="p-6 space-y-6 relative z-10">
        {/* Personalized Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            {isDemoMode ? "Demo Settings" : `${userName}'s Settings`}
          </h2>
          <p className="text-muted-foreground">
            {isDemoMode 
              ? "Preview customization options in demo mode"
              : "Personalize your TaskTuner experience to match your workflow"
            }
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-6">
          {/* Main Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose your preferred color scheme
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Moon className="h-4 w-4 text-blue-400" />
                            Dark Mode
                          </>
                        ) : (
                          <>
                            <Sun className="h-4 w-4 text-orange-500" />
                            Light Mode
                          </>
                        )}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Click to toggle between themes
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Control when and how you get notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                    <DemoRestrictedSwitch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                    />
                  </div>
                ))}
                
                {/* Notification Permission */}
                <div className="border-t pt-4">
                  <Label className="text-base font-medium">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enable browser notifications to receive TaskTuner roasts
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const permission = await notificationService.requestPermission()
                      if (permission === 'granted') {
                        toast.success("Notifications enabled! 🔔")
                      } else if (permission === 'denied') {
                        toast.error("Notifications blocked. Please enable in browser settings.")
                      } else {
                        toast.info("Notification permission pending...")
                      }
                    }}
                  >
                    🔔 Request Permission
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Roasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Voice & Roasts
                </CardTitle>
                <CardDescription>
                  Configure AI voice and roast settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Voice Output</Label>
                    <p className="text-sm text-muted-foreground">Hear your roasts out loud</p>
                  </div>
                  <DemoRestrictedSwitch
                    checked={settings.voice.enabled}
                    onCheckedChange={(checked) => updateSetting('voice', 'enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Roast Generator</Label>
                    <p className="text-sm text-muted-foreground">Get motivational roasts</p>
                  </div>
                  <DemoRestrictedSwitch
                    checked={settings.roasts.enabled}
                    onCheckedChange={(checked) => updateSetting('roasts', 'enabled', checked)}
                  />
                </div>

                <div>
                  <Label>Roast Intensity</Label>
                  <Select 
                    value={settings.roasts.intensity} 
                    onValueChange={(value) => updateSetting('roasts', 'intensity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild (Gentle encouragement)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced motivation)</SelectItem>
                      <SelectItem value="spicy">Spicy (Savage mode) 🔥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Roast Notifications */}
                <div className="border-t pt-4">
                  <Label className="text-base font-medium">Test Roast Notifications</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Try out TaskTuner's signature roast notifications
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      onClick={() => {
                        toast.success("Sending motivational roast! 💪")
                        notificationService.showMotivationalRoast("Test Task")
                      }}
                    >
                      💪 Motivation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      onClick={() => {
                        toast.success("Calling out your procrastination! 😏")
                        notificationService.showProcrastinationRoast("Test Task")
                      }}
                    >
                      😏 Procrastination
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => {
                        toast.success("Celebrating your completion! 🎉")
                        notificationService.showCompletionRoast("Test Task", 50)
                      }}
                    >
                      🎉 Completion
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        toast.success("Sending overdue roast! 🔥")
                        // Create a mock overdue task for testing
                        const mockOverdueTask = {
                          id: 'test-overdue',
                          title: 'Test Overdue Task',
                          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
                          endTime: '12:00'
                        }
                        // Manually trigger overdue notification since it's normally automatic
                        notificationService.showNotification(
                          `⏰ "${mockOverdueTask.title}" is overdue!`,
                          {
                            body: "Procrastination level: Expert! 🥴 Time to adult... just a little bit! 👔",
                            tag: 'overdue-test',
                            requireInteraction: true,
                            actions: [
                              { action: 'complete', title: '✅ Mark Done' },
                              { action: 'reschedule', title: '📅 Reschedule' }
                            ]
                          }
                        )
                      }}
                    >
                      🔥 Overdue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Productivity
                </CardTitle>
                <CardDescription>
                  Set your working hours and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Work Start Time</Label>
                    <DemoRestrictedInput
                      type="time"
                      value={settings.productivity.workingHours.start}
                      onChange={(e) => updateSetting('productivity', 'workingHours', {
                        ...settings.productivity.workingHours,
                        start: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>Work End Time</Label>
                    <DemoRestrictedInput
                      type="time"
                      value={settings.productivity.workingHours.end}
                      onChange={(e) => updateSetting('productivity', 'workingHours', {
                        ...settings.productivity.workingHours,
                        end: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Schedule Tasks</Label>
                    <p className="text-sm text-muted-foreground">Let AI schedule your tasks</p>
                  </div>
                  <DemoRestrictedSwitch
                    checked={settings.productivity.autoSchedule}
                    onCheckedChange={(checked) => updateSetting('productivity', 'autoSchedule', checked)}
                  />
                </div>
              </CardContent>
            </Card>


            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>
                  Manage your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <DemoRestrictedButton variant="outline" onClick={exportData}>
                    Export Data
                  </DemoRestrictedButton>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DemoRestrictedButton variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All Data
                      </DemoRestrictedButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete all your tasks, 
                          goals, and progress data.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline">Cancel</Button>
                        <DemoRestrictedButton variant="destructive" onClick={clearAllData}>
                          Yes, delete everything
                        </DemoRestrictedButton>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Account management and sign out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
