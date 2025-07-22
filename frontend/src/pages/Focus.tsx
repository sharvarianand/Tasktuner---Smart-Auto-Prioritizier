import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Timer, 
  Target,
  ArrowLeft,
  Music,
  Lock,
  Unlock,
  Shield,
  ShieldOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoContext";
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction";

const backgroundSounds = {
  lofi: {
    name: "Lo-fi Hip Hop",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk",
    color: "from-orange-500 to-red-500"
  },
  nature: {
    name: "Nature Sounds", 
    url: "https://www.youtube.com/embed/eKFTSSKCzWA?autoplay=1&loop=1&playlist=eKFTSSKCzWA",
    color: "from-green-500 to-emerald-500"
  },
  white_noise: {
    name: "White Noise",
    url: "https://www.youtube.com/embed/nMfPqeZjc2c?autoplay=1&loop=1&playlist=nMfPqeZjc2c", 
    color: "from-slate-500 to-gray-500"
  },
  classical: {
    name: "Classical Focus",
    url: "https://www.youtube.com/embed/jgpJVI3tDbY?autoplay=1&loop=1&playlist=jgpJVI3tDbY",
    color: "from-blue-500 to-indigo-500"
  }
};

// Mock data for TaskTuner theme
const mockTasks = [
  { id: "1", title: "Complete TaskTuner MVP", priority: "High", focus_time: 45 },
  { id: "2", title: "Design user onboarding flow", priority: "Medium", focus_time: 30 },
  { id: "3", title: "Implement AI roasting feature", priority: "High", focus_time: 60 },
  { id: "4", title: "Write marketing copy", priority: "Low", focus_time: 15 },
  { id: "5", title: "Test focus mode functionality", priority: "Medium", focus_time: 25 }
];

const mockUser = {
  full_name: "Aarav Sharma",
  email: "aarav@example.com"
};

const Focus = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useDemoMode();
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [duration, setDuration] = useState([25]); // Pomodoro default
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState("lofi");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [focusLocked, setFocusLocked] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const intervalRef = useRef(null);
  const [user, setUser] = useState(mockUser);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      handleSessionComplete();
    }
  }, [timeRemaining, isActive]);

  // Focus lock effect - prevent navigation when locked
  useEffect(() => {
    if (focusLocked) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to break your focus session?";
        return e.returnValue;
      };

      const handlePopState = (e) => {
        if (window.confirm("Breaking focus will end your session. Are you sure?")) {
          setFocusLocked(false);
          return true;
        } else {
          e.preventDefault();
          window.history.pushState(null, null, window.location.pathname);
          return false;
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push current state to prevent back navigation
      window.history.pushState(null, null, window.location.pathname);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [focusLocked]);

  const startSession = async () => {
    if (!selectedTask) {
      alert("Please select a task to focus on!");
      return;
    }

    setTimeRemaining(duration[0] * 60);
    setIsActive(true);
    setIsPaused(false);

    // Mock session creation
    const session = {
      id: Date.now(),
      task_id: selectedTask.id,
      duration: duration[0],
      start_time: new Date().toISOString(),
      background_music: musicEnabled ? backgroundMusic : null
    };
    setCurrentSession(session);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = async () => {
    if (focusLocked && !window.confirm("Are you sure you want to break your focus lock and end this session?")) {
      return;
    }
    
    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(null);
    setTimeRemaining(duration[0] * 60);
    setFocusLocked(false); // Release focus lock when stopping
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    setFocusLocked(false); // Release focus lock when session completes
    alert(`Great job! You completed a ${duration[0]}-minute focus session on "${selectedTask?.title}"`);
    setCurrentSession(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFocusLock = () => {
    if (!focusLocked) {
      if (window.confirm("Focus Lock will prevent you from leaving this page until your session ends. Continue?")) {
        setFocusLocked(true);
      }
    } else {
      if (window.confirm("Are you sure you want to disable Focus Lock? You'll be able to leave the session.")) {
        setFocusLocked(false);
      }
    }
  };

  const handleNavigation = () => {
    if (focusLocked) {
      if (!window.confirm("You have Focus Lock enabled. Breaking focus will end your session. Are you sure?")) {
        return;
      }
      setFocusLocked(false);
      setIsActive(false);
      setCurrentSession(null);
    }
    navigate("/dashboard");
  };

  const progress = ((duration[0] * 60 - timeRemaining) / (duration[0] * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-orange-900 dark:from-slate-950 dark:via-blue-950 dark:to-orange-950">
      {/* Demo Banner */}
      {isDemoMode && <DemoRestrictionBanner />}
      
      {/* Focus Lock Warning */}
      {focusLocked && (
        <div className="fixed top-0 left-0 right-0 bg-orange-600/90 backdrop-blur text-white p-2 text-center text-sm font-medium z-50">
          🔒 Focus Lock Active - You cannot leave this page until your session ends
        </div>
      )}
      
      {/* Background Music */}
      {musicEnabled && isActive && (
        <iframe
          src={backgroundSounds[backgroundMusic].url}
          width="0"
          height="0"
          frameBorder="0"
          allow="autoplay"
          className="hidden"
        />
      )}

      <div className={`p-4 md:p-6 lg:p-8 ${focusLocked ? 'pt-12' : ''}`}>
        <div className="w-full max-w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNavigation}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Focus Mode</h1>
                <p className="text-orange-200 text-sm lg:text-base">
                  {user?.full_name?.split(' ')[0]}, time to get in the zone and get roasted by productivity!
                </p>
              </div>
            </div>
            <DemoRestrictedButton
              variant="ghost"
              size="icon"
              onClick={toggleFocusLock}
              className={`text-white hover:bg-white/10 ${focusLocked ? 'bg-orange-600/50' : ''}`}
              aria-label={focusLocked ? "Focus Lock Active - Click to disable" : "Enable Focus Lock"}
            >
              {focusLocked ? <Lock className="w-5 h-5 text-orange-300" /> : <Unlock className="w-5 h-5" />}
            </DemoRestrictedButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="lg:col-span-3">
              {/* Main Timer */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-glow h-full">
                <CardHeader>
                  <CardTitle className="text-center text-orange-100 text-lg lg:text-xl">
                    {selectedTask ? selectedTask.title : "Select a task to begin your focus journey"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  {/* Timer Display */}
                  <div className="relative flex justify-center">
                    <div className="w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full border-4 border-orange-300/30 bg-gradient-to-br from-orange-500/10 to-blue-500/10 flex items-center justify-center shadow-glow">
                      <div className="text-3xl lg:text-5xl xl:text-6xl font-mono font-bold text-orange-100">
                        {formatTime(timeRemaining)}
                      </div>
                    </div>
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 transition-transform duration-1000 w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 mx-auto"
                        style={{
                          transform: `rotate(${progress * 3.6}deg)`,
                        }}
                      />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    {!isActive ? (
                      <DemoRestrictedButton
                        onClick={startSession}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-glow"
                        disabled={!selectedTask}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Focus Session
                      </DemoRestrictedButton>
                    ) : (
                      <>
                        <DemoRestrictedButton
                          onClick={pauseSession}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3"
                        >
                          {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                          {isPaused ? "Resume" : "Pause"}
                        </DemoRestrictedButton>
                        <DemoRestrictedButton
                          onClick={stopSession}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                        >
                          <Square className="w-5 h-5 mr-2" />
                          Stop
                        </DemoRestrictedButton>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Task Selection */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-100 text-lg">
                    <Target className="w-5 h-5 text-orange-400" />
                    Select Task to Conquer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedTask?.id || ""}
                    onValueChange={(taskId) => {
                      const task = tasks.find(t => t.id === taskId);
                      setSelectedTask(task);
                    }}
                    disabled={isActive || isDemoMode}
                  >
                    <SelectTrigger className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-12">
                      <SelectValue placeholder="Choose your next challenge" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.id} className="text-white hover:bg-slate-700">
                          <div className="flex items-center gap-2 w-full">
                            <span className="flex-1">{task.title}</span>
                            <Badge 
                              variant="outline" 
                              className={`ml-auto ${
                                task.priority === 'High' ? 'border-red-400 text-red-400' :
                                task.priority === 'Medium' ? 'border-yellow-400 text-yellow-400' :
                                'border-green-400 text-green-400'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTask && (
                    <div className="mt-3 p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                      <p className="text-sm text-orange-200">
                        Previous focus time: <span className="font-semibold text-orange-100">{selectedTask.focus_time} minutes</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Duration Setting */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-100 text-lg">
                    <Timer className="w-5 h-5 text-orange-400" />
                    Focus Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-orange-100">{duration[0]}</span>
                    <span className="text-lg text-orange-200 ml-1">minutes</span>
                  </div>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={5}
                    max={120}
                    step={5}
                    disabled={isActive || isDemoMode}
                    className="w-full [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-400"
                  />
                  <div className="flex justify-between text-sm text-white/70">
                    <span>5m</span>
                    <span className="text-orange-300 font-semibold">25m (Pomodoro)</span>
                    <span>120m</span>
                  </div>
                  <div className="text-xs text-center text-orange-200/80">
                    {duration[0] === 25 ? "Classic Pomodoro - Perfect for maximum focus!" :
                     duration[0] < 25 ? "Quick burst - Great for small tasks!" :
                     "Deep work - Time to tackle complex challenges!"}
                  </div>
                </CardContent>
              </Card>

              {/* Music Settings */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-orange-100 text-lg">
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-orange-400" />
                      Focus Soundtrack
                    </div>
                    <DemoRestrictedButton
                      variant="ghost"
                      size="icon"
                      onClick={() => setMusicEnabled(!musicEnabled)}
                      className="text-white hover:bg-white/10 h-8 w-8"
                    >
                      {musicEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                    </DemoRestrictedButton>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(backgroundSounds).map(([key, sound]) => (
                      <DemoRestrictedButton
                        key={key}
                        variant={backgroundMusic === key ? "default" : "ghost"}
                        onClick={() => setBackgroundMusic(key)}
                        disabled={isActive}
                        className={`w-full justify-start p-3 h-auto ${
                          backgroundMusic === key 
                            ? `bg-gradient-to-r ${sound.color} text-white shadow-md border border-white/20` 
                            : 'text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sound.color}`} />
                          <span className="font-medium text-sm">{sound.name}</span>
                          {backgroundMusic === key && (
                            <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Active</span>
                          )}
                        </div>
                      </DemoRestrictedButton>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Focus Lock Settings */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-100 text-lg">
                    {focusLocked ? <Shield className="w-5 h-5 text-orange-400" /> : <ShieldOff className="w-5 h-5 text-gray-400" />}
                    Focus Lock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {focusLocked ? "Lock Active" : "Lock Disabled"}
                      </p>
                      <p className="text-xs text-gray-300">
                        {focusLocked 
                          ? "Cannot leave page until session ends"
                          : "Free navigation available"
                        }
                      </p>
                    </div>
                    <DemoRestrictedButton
                      variant={focusLocked ? "destructive" : "default"}
                      size="sm"
                      onClick={toggleFocusLock}
                      className={focusLocked ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}
                    >
                      {focusLocked ? (
                        <>
                          <Unlock className="w-4 h-4 mr-1" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          Lock
                        </>
                      )}
                    </DemoRestrictedButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Focus;