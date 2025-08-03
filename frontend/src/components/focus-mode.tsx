import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DemoRestrictedButton } from "@/components/demo-restriction"

import {
  Play,
  Pause,
  Square,
  Lock,
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
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (time / duration) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          <Timer className="h-5 w-5 text-primary" />
          <span>Focus Mode</span>
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
              Start Focus
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
              Full Focus Mode
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

      </CardContent>
    </Card>
  )
}