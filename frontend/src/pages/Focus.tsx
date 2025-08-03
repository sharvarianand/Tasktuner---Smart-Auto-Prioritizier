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
import { useNavigate, useLocation } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoContext";
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction";
import { useTheme } from "@/components/theme-provider";
import { useUser } from "@clerk/clerk-react";
import LiveBackground from "@/components/LiveBackground";
import { toast } from "sonner";

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
  const location = useLocation();
  const { isDemoMode } = useDemoMode();
  const { theme } = useTheme();
  const { user: clerkUser } = useUser();
  
  // Get user's name for personalization
  const userName = clerkUser?.firstName || clerkUser?.username || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Champion'
  
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
    if (isDemoMode) {
      toast.info("Focus sessions are not available in demo mode. Sign up to start focusing!");
      return;
    }

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
    if (isDemoMode) {
      toast.info("Session controls are not available in demo mode. Sign up to manage your focus sessions!");
      return;
    }
    setIsPaused(!isPaused);
  };

  const stopSession = async () => {
    if (isDemoMode) {
      toast.info("Session controls are not available in demo mode. Sign up to manage your focus sessions!");
      return;
    }
    
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
    if (isDemoMode) {
      toast.info("Focus Lock is not available in demo mode. Sign up to use advanced focus features!");
      return;
    }
    
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

  const handleMusicToggle = () => {
    if (isDemoMode) {
      toast.info("Music controls are not available in demo mode. Sign up to customize your focus experience!");
      return;
    }
    setMusicEnabled(!musicEnabled);
  };

  const handleBackgroundMusicChange = (key: string) => {
    if (isDemoMode) {
      toast.info("Music selection is not available in demo mode. Sign up to customize your focus soundtrack!");
      return;
    }
    setBackgroundMusic(key);
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
    // Always go to dashboard for authenticated users (landing page redirects them anyway)
    const url = isDemoMode ? "/dashboard?demo=true" : "/dashboard";
    navigate(url);
  };

  const progress = ((duration[0] * 60 - timeRemaining) / (duration[0] * 60)) * 100;

  return (
    <div className="min-h-screen relative">
      {/* Live Background */}
      <LiveBackground />
      
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

      <div className={`p-4 md:p-6 lg:p-8 relative z-10 ${focusLocked ? 'pt-12' : ''}`}>
        <div className="w-full max-w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNavigation}
                className={`${
                  theme === 'dark' 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-slate-800 hover:bg-black/10'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className={`text-2xl lg:text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  {isDemoMode ? "Focus Mode Demo" : `${userName}'s Focus Zone`}
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isDemoMode 
                    ? "Experience deep focus with TaskTuner" 
                    : isActive 
                      ? "Deep focus session in progress" 
                      : "Ready to enter deep focus mode?"
                  }
                </p>
              </div>
            </div>
            <DemoRestrictedButton
              variant="ghost"
              size="icon"
              onClick={toggleFocusLock}
              className={`${
                theme === 'dark' 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-slate-800 hover:bg-black/10'
              } ${focusLocked ? 'bg-orange-600/50' : ''}`}
              aria-label={focusLocked ? "Focus Lock Active - Click to disable" : "Enable Focus Lock"}
            >
              {focusLocked ? <Lock className="w-5 h-5 text-orange-300" /> : <Unlock className="w-5 h-5" />}
            </DemoRestrictedButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="lg:col-span-3">
              {/* Main Timer */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
              } shadow-glow h-full`}>
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
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    theme === 'dark' ? 'text-orange-100' : 'text-slate-700'
                  }`}>
                    <Target className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-orange-400' : 'text-blue-500'
                    }`} />
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
                    <SelectTrigger className={`h-12 ${
                      theme === 'dark' 
                        ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
                        : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                    }`}>
                      <SelectValue placeholder="Choose your next challenge" />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                    }`}>
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.id} className={`${
                          theme === 'dark' ? 'text-white hover:bg-slate-700' : 'text-slate-800 hover:bg-slate-100'
                        }`}>
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
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    theme === 'dark' ? 'text-orange-100' : 'text-slate-700'
                  }`}>
                    <Timer className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-orange-400' : 'text-blue-500'
                    }`} />
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
                  <div className={`flex justify-between text-sm ${
                    theme === 'dark' ? 'text-white/70' : 'text-slate-600'
                  }`}>
                    <span>5m</span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-orange-300' : 'text-blue-600'
                    }`}>25m (Pomodoro)</span>
                    <span>120m</span>
                  </div>
                  <div className={`text-xs text-center ${
                    theme === 'dark' ? 'text-orange-200/80' : 'text-slate-500'
                  }`}>
                    {duration[0] === 25 ? "Classic Pomodoro - Perfect for maximum focus!" :
                     duration[0] < 25 ? "Quick burst - Great for small tasks!" :
                     "Deep work - Time to tackle complex challenges!"}
                  </div>
                </CardContent>
              </Card>

              {/* Music Settings */}
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center justify-between text-lg ${
                    theme === 'dark' ? 'text-orange-100' : 'text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Music className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-blue-500'
                      }`} />
                      Focus Soundtrack
                    </div>
                    <DemoRestrictedButton
                      variant="ghost"
                      size="icon"
                      onClick={handleMusicToggle}
                      className={`h-8 w-8 ${
                        theme === 'dark' 
                          ? 'text-white hover:bg-white/10' 
                          : 'text-slate-800 hover:bg-black/10'
                      }`}
                    >
                      {musicEnabled ? 
                        <Volume2 className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-orange-400' : 'text-blue-500'
                        }`} /> : 
                        <VolumeX className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      }
                    </DemoRestrictedButton>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(backgroundSounds).map(([key, sound]) => (
                      <DemoRestrictedButton
                        key={key}
                        variant={backgroundMusic === key ? "default" : "ghost"}
                        onClick={() => handleBackgroundMusicChange(key)}
                        disabled={isActive}
                        className={`w-full justify-start p-3 h-auto ${
                          backgroundMusic === key 
                            ? `bg-gradient-to-r ${sound.color} text-white shadow-md border ${
                              theme === 'dark' ? 'border-white/20' : 'border-black/20'
                            }` 
                            : `${
                              theme === 'dark' 
                                ? 'text-white hover:bg-white/10 border border-white/10' 
                                : 'text-slate-800 hover:bg-black/10 border border-black/10'
                            }`
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
              <Card className={`${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                  : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`flex items-center gap-2 text-lg ${
                    theme === 'dark' ? 'text-orange-100' : 'text-slate-700'
                  }`}>
                    {focusLocked ? 
                      <Shield className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-blue-500'
                      }`} /> : 
                      <ShieldOff className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    }
                    Focus Lock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-slate-800'
                      }`}>
                        {focusLocked ? "Lock Active" : "Lock Disabled"}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                      }`}>
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