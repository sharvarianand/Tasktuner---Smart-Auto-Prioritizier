
import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction"
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
  User,
  Bell,
  Volume2,
  Trash2,
  Shield,
  Clock,
  Palette,
  LogOut,
  Edit,
  Camera,
  Flame,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { toast } from "sonner"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  
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

  const [profile, setProfile] = useState({
    name: "Aarav Sharma",
    email: "aarav@example.com",
    bio: "Aspiring developer trying to get my life together, one task at a time.",
    timezone: "Asia/Kolkata"
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">
            Customize your TaskTuner experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/64/64" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 h-6 w-6">
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <Badge variant="secondary" className="mt-1">Pro User</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
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
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </Button>
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
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                    />
                  </div>
                ))}
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
                  <Switch
                    checked={settings.voice.enabled}
                    onCheckedChange={(checked) => updateSetting('voice', 'enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Roast Generator</Label>
                    <p className="text-sm text-muted-foreground">Get motivational roasts</p>
                  </div>
                  <Switch
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
                    <Input
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
                    <Input
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
                  <Switch
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
                  <Button variant="outline" onClick={exportData}>
                    Export Data
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All Data
                      </Button>
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
                        <Button variant="destructive" onClick={clearAllData}>
                          Yes, delete everything
                        </Button>
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
