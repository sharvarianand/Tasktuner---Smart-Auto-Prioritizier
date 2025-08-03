import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { DemoRestrictedButton } from "@/components/demo-restriction"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Play,
  Pause,
  Square,
  Settings,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Timer,
  Coffee,
  Brain,
  Target
} from "lucide-react"

interface FocusSession {
  duration: number
  completed: boolean
  startTime: Date
  endTime?: Date
}

interface FocusModeProps {
  onNavigateToFocus?: () => void
  isDemo?: boolean
}

export function FocusMode({ onNavigateToFocus, isDemo = false }: FocusModeProps) {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(0) // in seconds
  const [duration, setDuration] = useState(25 * 60) // 25 minutes default
  const [customMinutes, setCustomMinutes] = useState(25)
  const [lockApp, setLockApp] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [musicVolume, setMusicVolume] = useState([50])
  const [selectedMusic, setSelectedMusic] = useState("rain")
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const musicTracks = {
    rain: "https://www.soundjay.com/misc/sounds/rain-01.mp3",
    forest: "https://www.soundjay.com/nature/sounds/forest-01.mp3", 
    ocean: "https://www.soundjay.com/water/sounds/ocean-01.mp3",
    coffee: "https://www.soundjay.com/ambient/sounds/cafe-01.mp3"
  }

  const presetTimes = [
    { label: "Pomodoro", minutes: 25, icon: Timer },
    { label: "Short Break", minutes: 5, icon: Coffee },
    { label: "Long Break", minutes: 15, icon: Coffee },
    { label: "Deep Focus", minutes: 45, icon: Brain },
    { label: "Study Session", minutes: 90, icon: Target }
  ]

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(time => {
          if (time >= duration) {
            handleSessionComplete()
            return 0
          }
          return time + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, duration])

  // Music control
  useEffect(() => {
    if (musicEnabled && isActive && !isPaused) {
      if (audioRef.current) {
        audioRef.current.volume = musicVolume[0] / 100
        audioRef.current.play()
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [musicEnabled, isActive, isPaused, musicVolume])

  // Prevent leaving app during focus mode
  useEffect(() => {
    if (lockApp && isActive) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = "You're in focus mode! Are you sure you want to leave?"
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          // You could add more aggressive measures here
          console.log("User tried to leave during focus mode!")
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [lockApp, isActive])

  const handleSessionComplete = () => {
    setIsActive(false)
    setIsPaused(false)
    setTime(0)
    
    const session: FocusSession = {
      duration,
      completed: true,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date()
    }
    
    setSessions(prev => [...prev, session])
    
    // Show completion notification
    if (Notification.permission === "granted") {
      new Notification("Focus session completed! 🎉", {
        body: `Great job! You focused for ${Math.floor(duration / 60)} minutes.`
      })
    }
  }

  const startTimer = () => {
    // If lock is enabled, redirect to full focus page instead
    if (lockApp && onNavigateToFocus) {
      onNavigateToFocus()
      return
    }
    
    setIsActive(true)
    setIsPaused(false)
    
    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
  }

  const stopTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setTime(0)
  }

  const setPresetTime = (minutes: number) => {
    if (!isActive) {
      setDuration(minutes * 60)
      setCustomMinutes(minutes)
      setTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (time / duration) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-card-foreground">
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-primary" />
            <span>Focus Mode</span>
            {isActive && lockApp && <Lock className="h-4 w-4 text-yellow-500" />}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <DemoRestrictedButton 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                allowInDemo={false}
              >
                <Settings className="h-4 w-4" />
              </DemoRestrictedButton>
            </DialogTrigger>
            <DialogContent className="bg-popover border-border">
              <DialogHeader>
                <DialogTitle className="text-popover-foreground">Focus Mode Settings</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Customize your focus session
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Duration Settings */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-popover-foreground">Session Duration</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetTimes.map((preset) => (
                      <Button
                        key={preset.label}
                        variant={duration === preset.minutes * 60 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPresetTime(preset.minutes)}
                        disabled={isActive}
                        className="text-xs"
                      >
                        <preset.icon className="h-3 w-3 mr-1" />
                        {preset.minutes}m
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={customMinutes}
                      onChange={(e) => {
                        const mins = parseInt(e.target.value) || 1
                        setCustomMinutes(mins)
                        if (!isActive) {
                          setDuration(mins * 60)
                          setTime(0)
                        }
                      }}
                      min={1}
                      max={180}
                      disabled={isActive}
                      className="w-20 bg-background border-border text-foreground"
                    />
                    <Label className="text-sm text-popover-foreground">minutes</Label>
                  </div>
                </div>

                {/* App Lock */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-popover-foreground">Lock App</Label>
                    <p className="text-xs text-muted-foreground">Prevent leaving during focus session</p>
                  </div>
                  <Switch
                    checked={lockApp}
                    onCheckedChange={setLockApp}
                  />
                </div>

                {/* Music Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-popover-foreground">Background Music</Label>
                    <Switch
                      checked={musicEnabled}
                      onCheckedChange={setMusicEnabled}
                    />
                  </div>
                  
                  {musicEnabled && (
                    <>
                      <Select value={selectedMusic} onValueChange={setSelectedMusic}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select music" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="rain">Rain Sounds</SelectItem>
                          <SelectItem value="forest">Forest Ambience</SelectItem>
                          <SelectItem value="ocean">Ocean Waves</SelectItem>
                          <SelectItem value="coffee">Coffee Shop</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Volume: {musicVolume[0]}%</Label>
                        <Slider
                          value={musicVolume}
                          onValueChange={setMusicVolume}
                          max={100}
                          step={1}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <motion.div 
              className="text-4xl font-mono font-bold text-card-foreground"
              animate={{ scale: isActive && !isPaused ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
            >
              {formatTime(isActive ? time : duration)}
            </motion.div>
            {isActive && (
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
          
          {/* Status Badges */}
          <div className="flex justify-center space-x-2">
            {isDemo && (
              <Badge variant="outline" className="text-muted-foreground border-muted-foreground/50">
                <Lock className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
            {isActive && (
              <Badge variant="default" className="animate-pulse">
                {isPaused ? "Paused" : "Focusing"}
              </Badge>
            )}
            {lockApp && isActive && (
              <Badge variant="secondary" className="text-yellow-600">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
            {musicEnabled && isActive && !isPaused && (
              <Badge variant="outline">
                <Volume2 className="h-3 w-3 mr-1" />
                Music On
              </Badge>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <DemoRestrictedButton 
              onClick={startTimer} 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              allowInDemo={false}
            >
              <Play className="h-4 w-4 mr-2" />
              {lockApp ? "Start in Full Mode" : "Start Focus"}
            </DemoRestrictedButton>
          ) : (
            <>
              <DemoRestrictedButton 
                onClick={pauseTimer} 
                variant="outline"
                allowInDemo={false}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </DemoRestrictedButton>
              <DemoRestrictedButton 
                onClick={stopTimer} 
                variant="destructive"
                allowInDemo={false}
              >
                <Square className="h-4 w-4" />
              </DemoRestrictedButton>
            </>
          )}
        </div>

        {/* Full Focus Mode Link */}
        {onNavigateToFocus && (
          <div className="text-center">
            <DemoRestrictedButton 
              variant="ghost" 
              size="sm" 
              onClick={onNavigateToFocus}
              className="text-muted-foreground hover:text-card-foreground"
              allowInDemo={false}
            >
              <Target className="h-3 w-3 mr-1" />
              {isActive && lockApp ? "Unlock in Full Mode" : "Full Focus Mode"}
            </DemoRestrictedButton>
          </div>
        )}

        {/* Session Stats */}
        {sessions.length > 0 && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Today's Sessions</p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">{sessions.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">
                  {Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}m
                </div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        {musicEnabled && (
          <audio
            ref={audioRef}
            loop
            preload="none"
          >
            <source src={musicTracks[selectedMusic as keyof typeof musicTracks]} type="audio/mpeg" />
          </audio>
        )}
      </CardContent>
    </Card>
  )
}