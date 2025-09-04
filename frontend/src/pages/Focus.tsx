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
  ShieldOff,
  CheckCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoContext";
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction";
import { useTheme } from "@/components/theme-provider";
import { useUser } from "@clerk/clerk-react";
import LiveBackground from "@/components/LiveBackground";
import { toast } from "sonner";
import { taskApi } from "@/lib/api";

// Task interface matching the main Tasks page
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Academic' | 'Personal' | 'Work';
  completed: boolean;
  completedAt?: string;
  cancelled?: boolean;
  startDate?: string;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  points: number;
  roast?: string;
  isDaily?: boolean;
  completedDates?: string[];
  calendarEventId?: string;
  reminders?: {
    before?: number;
    after?: number;
  };
  // AI Prioritization fields
  aiPriority?: number; // AI-calculated priority score (0-100)
  aiInsights?: {
    isUrgent?: boolean; // Due within minutes
    isOverdue?: boolean; // Past due date
    isOptimizedForTime?: boolean; // Good for current time
    hasLimitedTime?: boolean; // Limited remaining time
    requiresFocus?: boolean; // Under 1 hour remaining
    nlpEnhanced?: boolean; // Enhanced with NLP analysis
    priorityReason?: string; // AI explanation for priority
    timeRecommendation?: string; // Best time to work on this
  };
  aiScore?: {
    urgency: number; // 0-100
    importance: number; // 0-100
    effort: number; // 0-100
    timefit: number; // 0-100
  };
}

// Focus session interface
interface FocusSession {
  id: string;
  taskId: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  locked: boolean;
}

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

const Focus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDemoMode } = useDemoMode();
  const { theme } = useTheme();
  const { user: clerkUser } = useUser();
  
  // Get user's name for personalization
  const userName = clerkUser?.firstName || clerkUser?.username || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Champion'
  
  // State management
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [duration, setDuration] = useState([25]); // Pomodoro default
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState("lofi");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [focusLocked, setFocusLocked] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI Prioritization state
  const [aiInsights, setAiInsights] = useState({
    totalPrioritized: 0,
    urgentTasks: 0,
    overdueTasks: 0,
    optimizedTasks: 0,
    limitedTimeTasks: 0,
    focusTasks: 0,
    nlpEnhanced: 0
  });

  // Load user's actual tasks from the Tasks page with AI prioritization
  useEffect(() => {
    const loadUserTasks = async () => {
      try {
        console.log('🎯 Loading user tasks for Focus page...');
        setIsLoadingTasks(true);
        const response = await taskApi.getTasks();
        
        // Only show incomplete, non-cancelled tasks that are actionable
        let focusableTasks = response.filter((task: Task) => 
          !task.completed && 
          !task.cancelled &&
          task.title && 
          task.title.trim() !== ''
        );

        // Apply AI prioritization logic
        focusableTasks = await applyAIPrioritization(focusableTasks);
        
        // Sort tasks by AI priority (highest first)
        focusableTasks.sort((a, b) => (b.aiPriority || 0) - (a.aiPriority || 0));
        
        setTasks(focusableTasks);
        console.log('✅ Loaded', focusableTasks.length, 'focusable tasks for Focus mode with AI prioritization');
        
        // Calculate AI insights
        calculateAIInsights(focusableTasks);
        
        // If current selected task is no longer available, clear selection
        if (selectedTask && !focusableTasks.find(t => t.id === selectedTask.id)) {
          setSelectedTask(null);
        }
      } catch (error) {
        console.error('❌ Failed to load tasks for Focus:', error);
        toast.error('Failed to load your tasks for Focus mode');
        setTasks([]); // Fallback to empty array
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadUserTasks();
  }, [selectedTask]);

  // AI Prioritization logic
  const applyAIPrioritization = async (tasks: Task[]): Promise<Task[]> => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    return tasks.map(task => {
      const aiInsights: Task['aiInsights'] = {};
      const aiScore: Task['aiScore'] = { urgency: 0, importance: 0, effort: 0, timefit: 0 };
      
      // Check if task is due within minutes (urgent)
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - currentTime.getTime();
        const minutesUntilDue = Math.floor(timeDiff / (1000 * 60));
        
        if (minutesUntilDue <= 30 && minutesUntilDue > 0) {
          aiInsights.isUrgent = true;
          aiScore.urgency = 95;
          aiInsights.priorityReason = `Due in ${minutesUntilDue} minutes - IMMEDIATE priority`;
        } else if (minutesUntilDue <= 0) {
          aiInsights.isOverdue = true;
          aiScore.urgency = 100;
          aiInsights.priorityReason = 'OVERDUE - Critical priority';
        } else if (minutesUntilDue <= 120) {
          aiInsights.hasLimitedTime = true;
          aiScore.urgency = 80;
          aiInsights.priorityReason = `Due in ${Math.floor(minutesUntilDue / 60)} hours - High priority`;
        }
      }
      
      // Time-based optimization (good time to work)
      const taskCategory = task.category;
      let timeOptimal = false;
      
      if (taskCategory === 'Academic' && currentHour >= 9 && currentHour <= 17) {
        timeOptimal = true;
        aiInsights.isOptimizedForTime = true;
        aiScore.timefit = 85;
      } else if (taskCategory === 'Work' && currentHour >= 8 && currentHour <= 18) {
        timeOptimal = true;
        aiInsights.isOptimizedForTime = true;
        aiScore.timefit = 90;
      } else if (taskCategory === 'Personal' && (currentHour >= 18 || currentHour <= 8)) {
        timeOptimal = true;
        aiInsights.isOptimizedForTime = true;
        aiScore.timefit = 80;
      }
      
      // Priority mapping
      const priorityScores = { 'High': 90, 'Medium': 60, 'Low': 30 };
      aiScore.importance = priorityScores[task.priority];
      
      // Effort estimation based on task title/description length and keywords
      const taskText = `${task.title} ${task.description || ''}`.toLowerCase();
      const complexKeywords = ['analyze', 'research', 'develop', 'create', 'design', 'write', 'plan'];
      const simpleKeywords = ['call', 'email', 'check', 'review', 'update', 'send'];
      
      if (complexKeywords.some(keyword => taskText.includes(keyword))) {
        aiScore.effort = 80; // High effort
      } else if (simpleKeywords.some(keyword => taskText.includes(keyword))) {
        aiScore.effort = 30; // Low effort
      } else {
        aiScore.effort = 55; // Medium effort
      }
      
      // Focus recommendation for tasks under 1 hour
      if (aiScore.effort <= 40) {
        aiInsights.requiresFocus = true;
        aiInsights.timeRecommendation = 'Perfect for focused session - quick completion possible';
      }
      
      // NLP enhancement simulation
      if (taskText.includes('important') || taskText.includes('urgent') || taskText.includes('asap')) {
        aiInsights.nlpEnhanced = true;
        aiScore.importance += 15;
        aiInsights.priorityReason = (aiInsights.priorityReason || '') + ' (NLP: Contains urgency indicators)';
      }
      
      // Calculate overall AI priority (weighted average)
      const aiPriority = Math.round(
        (aiScore.urgency * 0.4) + 
        (aiScore.importance * 0.3) + 
        (aiScore.timefit * 0.2) + 
        ((100 - aiScore.effort) * 0.1) // Lower effort = higher priority
      );
      
      return {
        ...task,
        aiPriority,
        aiInsights,
        aiScore
      };
    });
  };

  // Calculate AI insights summary
  const calculateAIInsights = (tasks: Task[]) => {
    const insights = {
      totalPrioritized: tasks.filter(t => t.aiPriority && t.aiPriority > 50).length,
      urgentTasks: tasks.filter(t => t.aiInsights?.isUrgent).length,
      overdueTasks: tasks.filter(t => t.aiInsights?.isOverdue).length,
      optimizedTasks: tasks.filter(t => t.aiInsights?.isOptimizedForTime).length,
      limitedTimeTasks: tasks.filter(t => t.aiInsights?.hasLimitedTime).length,
      focusTasks: tasks.filter(t => t.aiInsights?.requiresFocus).length,
      nlpEnhanced: tasks.filter(t => t.aiInsights?.nlpEnhanced).length
    };
    
    setAiInsights(insights);
    
    // Show AI insights notification
    if (insights.totalPrioritized > 0) {
      toast.info(`🧠 AI analyzed ${tasks.length} tasks: ${insights.totalPrioritized} prioritized, ${insights.urgentTasks} urgent`, {
        duration: 5000
      });
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeRemaining]);

  // ULTRA-STRICT focus lock enforcement - MAXIMUM SECURITY MODE
  useEffect(() => {
    let lockInterval: NodeJS.Timeout | null = null;
    let navTrapInterval: NodeJS.Timeout | null = null;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        e.returnValue = "🔒 FOCUS LOCK ACTIVE! Breaking focus will end your session. Stay focused!";
        // Show aggressive warning
        toast.error('🚨 FOCUS LOCK: Cannot leave during session!', { duration: 10000 });
        return e.returnValue;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusLocked && isActive) {
        // Block ALL possible escape keys and shortcuts
        const blockedKeys = [
          'F5', 'F11', 'F12', 'Escape',
          'Tab', 'Enter', 'Backspace'
        ];
        
        // Special handling for backspace to prevent navigation
        if (e.key === 'Backspace' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          toast.error('🚨 BACKSPACE NAVIGATION BLOCKED! Stay in focus session!', { duration: 2000 });
          return false;
        }
        
        const blockedCombos = [
          e.ctrlKey && (e.key === 'r' || e.key === 'R'), // Refresh
          e.ctrlKey && e.key === 'w', // Close tab
          e.ctrlKey && e.key === 't', // New tab
          e.ctrlKey && e.key === 'n', // New window
          e.ctrlKey && e.key === 'l', // Address bar
          e.ctrlKey && e.key === 'h', // History
          e.ctrlKey && e.key === 'j', // Downloads
          e.ctrlKey && e.key === 'k', // Search
          e.ctrlKey && e.key === 'u', // View source
          e.ctrlKey && e.key === 'd', // Bookmark
          e.ctrlKey && e.shiftKey && e.key === 'Delete', // Clear data
          e.ctrlKey && e.shiftKey && e.key === 'T', // Reopen tab
          e.ctrlKey && e.shiftKey && e.key === 'N', // Incognito
          e.ctrlKey && e.shiftKey && e.key === 'I', // DevTools
          e.ctrlKey && e.shiftKey && e.key === 'J', // DevTools Console
          e.ctrlKey && e.shiftKey && e.key === 'C', // DevTools Elements
          e.altKey && e.key === 'Tab', // Alt+Tab
          e.altKey && e.key === 'F4', // Alt+F4
          e.altKey && e.key === 'Left', // Back
          e.altKey && e.key === 'Right', // Forward
          e.metaKey && e.key === 'r', // Mac refresh
          e.metaKey && e.key === 'w', // Mac close
          e.metaKey && e.key === 't', // Mac new tab
          e.metaKey && e.key === 'n', // Mac new window
          e.metaKey && e.key === 'q', // Mac quit
          e.metaKey && e.key === 'Tab', // Mac app switcher
        ];

        if (blockedKeys.includes(e.key) || blockedCombos.some(combo => combo)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          toast.error('🔒 FOCUS LOCK: All shortcuts blocked! Stay focused!', { duration: 3000 });
          return false;
        }
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error('� FOCUS LOCK: Navigation blocked! Complete your session!', { duration: 5000 });
        // Force the URL back to current page
        window.history.pushState(null, '', window.location.pathname);
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (focusLocked && isActive && document.hidden) {
        toast.error('👀 FOCUS VIOLATION: Switching tabs detected! Return to focus!', { duration: 10000 });
        // Try to bring focus back to this tab
        if (document.hasFocus) {
          window.focus();
        }
      }
    };

    const handleFocusOut = () => {
      if (focusLocked && isActive) {
        toast.warning('⚠️ FOCUS ALERT: Window lost focus! Stay on task!', { duration: 5000 });
        // Try to regain focus
        setTimeout(() => {
          window.focus();
        }, 100);
      }
    };

    const handleMouseLeave = () => {
      if (focusLocked && isActive) {
        toast.warning('🖱️ FOCUS WARNING: Mouse left window area!', { duration: 2000 });
      }
    };

    // Disable right-click context menu during locked session
    const handleContextMenu = (e: MouseEvent) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        toast.warning('🔒 Context menu disabled during locked session!', { duration: 2000 });
        return false;
      }
    };

    // Prevent text selection during locked session
    const handleSelectStart = (e: Event) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag and drop during locked session
    const handleDragStart = (e: DragEvent) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        return false;
      }
    };

    // Additional protection against hash navigation
    const handleHashChange = (e: HashChangeEvent) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        toast.error('🚨 URL NAVIGATION BLOCKED!', { duration: 2000 });
        // Reset hash to prevent navigation
        window.location.hash = '';
        return false;
      }
    };
    
    // Additional unload protection
    const handleUnload = (e: Event) => {
      if (focusLocked && isActive) {
        e.preventDefault();
        toast.error('🚨 CANNOT LEAVE DURING FOCUS SESSION!', { duration: 3000 });
        return false;
      }
    };

    if (focusLocked && isActive) {
      // Add all event listeners with capture phase for maximum control
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleFocusOut);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('contextmenu', handleContextMenu, true);
      document.addEventListener('selectstart', handleSelectStart, true);
      document.addEventListener('dragstart', handleDragStart, true);
      window.addEventListener('hashchange', handleHashChange);
      window.addEventListener('unload', handleUnload);
      
      // Force history state to prevent navigation - AGGRESSIVE TRAP
      // Push multiple history states to create a navigation trap
      for (let i = 0; i < 15; i++) {
        window.history.pushState({ locked: true, trap: i }, '', window.location.pathname);
      }
      
      // Additional history trap to prevent ALL back navigation
      const trapNavigation = () => {
        if (focusLocked && isActive) {
          // Continuously add more history entries to prevent escape
          for (let i = 0; i < 5; i++) {
            window.history.pushState({ superTrap: true, timestamp: Date.now() }, '', window.location.pathname);
          }
          toast.error('🚨 BACK NAVIGATION INTERCEPTED! Cannot escape focus session!', { duration: 3000 });
        }
      };
      
      // Set up navigation trap every few seconds
      navTrapInterval = setInterval(trapNavigation, 3000);
      
      // Override browser navigation methods completely
      const originalBack = window.history.back;
      const originalForward = window.history.forward;
      const originalGo = window.history.go;
      
      window.history.back = () => {
        toast.error('🚨 BACK NAVIGATION DISABLED! Complete focus session first!', { duration: 3000 });
        // Re-trap navigation
        for (let i = 0; i < 10; i++) {
          window.history.pushState({ locked: true, reblock: i }, '', window.location.pathname);
        }
      };
      
      window.history.forward = () => {
        toast.error('🚨 FORWARD NAVIGATION DISABLED!', { duration: 2000 });
      };
      
      window.history.go = (delta?: number) => {
        toast.error('🚨 NAVIGATION COMPLETELY DISABLED!', { duration: 2000 });
        // Re-trap navigation
        for (let i = 0; i < 10; i++) {
          window.history.pushState({ locked: true, reblock: i }, '', window.location.pathname);
        }
      };
      
      // Set up aggressive focus retention
      lockInterval = setInterval(() => {
        if (document.hidden || !document.hasFocus()) {
          window.focus();
          toast.warning('🎯 FOCUS ENFORCED: Returning to session!', { duration: 1000 });
        }
      }, 5000); // Check every 5 seconds
      
      // Disable browser zoom during locked session
      document.body.style.zoom = '1';
      document.body.style.transform = 'scale(1)';
      
      // Prevent page scrolling during locked session
      document.body.style.overflow = 'hidden';
      
      console.log('🔒 ULTRA-STRICT FOCUS LOCK ACTIVATED'); 
      toast.warning('🔒 ULTRA-STRICT MODE: All escape routes blocked!', { duration: 8000 });
    }

    return () => {
      // Clean up all event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleFocusOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      
      if (lockInterval) {
        clearInterval(lockInterval);
      }
      
      if (navTrapInterval) {
        clearInterval(navTrapInterval);
      }
      
      // Restore normal page behavior
      document.body.style.overflow = '';
      document.body.style.zoom = '';
      document.body.style.transform = '';
      
      console.log('🔓 Focus lock protection removed');
    };
  }, [focusLocked, isActive]);

  const startSession = async () => {
    if (isDemoMode) {
      toast.info("🎯 Focus sessions are limited in demo mode. Sign up to unlock full focus power!");
      return;
    }

    if (!selectedTask) {
      toast.error("🎯 Please select a task to focus on!");
      return;
    }

    if (focusLocked) {
      const confirmed = window.confirm(
        `� ULTRA-STRICT FOCUS LOCK ACTIVE! 🚨\n\n` +
        `Starting this session will:\n` +
        `• COMPLETELY LOCK your browser\n` +
        `• BLOCK all keyboard shortcuts\n` +
        `• PREVENT navigation and tab switching\n` +
        `• DISABLE pause and stop buttons\n` +
        `• FORCE you to complete ${duration[0]} minutes\n\n` +
        `Task: "${selectedTask.title}"\n` +
        `Duration: ${duration[0]} minutes\n\n` +
        `⚠️ NO ESCAPE UNTIL COMPLETION! ⚠️\n\n` +
        `Are you absolutely ready to commit?`
      );
      
      if (!confirmed) {
        toast.info('🔓 Session cancelled. You can disable Focus Lock if needed.');
        return;
      }
      
      // Final countdown warning
      let countdown = 5;
      toast.info(`🚨 LOCKING IN ${countdown} SECONDS... Press ESC to cancel`, { 
        duration: 6000
      });
      
      let cancelled = false;
      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0 && !cancelled) {
          toast.info(`🚨 LOCKING IN ${countdown} SECONDS... Press ESC to cancel`, { 
            duration: 1000
          });
        } else if (!cancelled) {
          clearInterval(countdownInterval);
          proceedWithSession();
        }
      }, 1000);
      
      // Allow ESC to cancel during countdown
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !cancelled) {
          cancelled = true;
          clearInterval(countdownInterval);
          document.removeEventListener('keydown', escHandler);
          toast.info('🔓 Session cancelled.');
        }
      };
      document.addEventListener('keydown', escHandler);
      
      // Clean up after countdown
      setTimeout(() => {
        document.removeEventListener('keydown', escHandler);
      }, 6000);
      
      return;
    }

    proceedWithSession();
  };

  const proceedWithSession = () => {
    setTimeRemaining(duration[0] * 60);
    setIsActive(true);
    setIsPaused(false);

    // Create focus session
    const session: FocusSession = {
      id: Date.now().toString(),
      taskId: selectedTask!.id,
      duration: duration[0],
      startTime: new Date(),
      completed: false,
      locked: focusLocked
    };
    setCurrentSession(session);

    if (focusLocked) {
      toast.success(`🔒 ULTRA-STRICT SESSION STARTED!\n"${selectedTask!.title}" (${duration[0]} min)\nYOU ARE NOW LOCKED IN!`, {
        duration: 10000
      });
      toast.warning('� ALL ESCAPE ROUTES BLOCKED! Complete your session to unlock!', {
        duration: 15000
      });
    } else {
      toast.success(`🎯 Focus session started for "${selectedTask!.title}" (${duration[0]} min)`, {
        duration: 3000
      });
    }
  };

  const pauseSession = () => {
    if (isDemoMode) {
      toast.info("⏸️ Session controls are limited in demo mode. Sign up to manage your focus sessions!");
      return;
    }

    if (focusLocked && isActive) {
      toast.error('🔒 Cannot pause during locked session! Complete your focus time first.');
      return;
    }
    
    setIsPaused(!isPaused);
    toast.info(isPaused ? '▶️ Focus session resumed' : '⏸️ Focus session paused');
  };

  const stopSession = async () => {
    if (isDemoMode) {
      toast.info("⏹️ Session controls are limited in demo mode. Sign up to manage your focus sessions!");
      return;
    }
    
    if (focusLocked && isActive && timeRemaining > 0) {
      toast.error('🔒 Cannot stop locked session! Complete your focus time first.');
      return;
    }
    
    if (isActive && !window.confirm("⏹️ Are you sure you want to end this focus session?")) {
      return;
    }
    
    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(null);
    setTimeRemaining(duration[0] * 60);
    setFocusLocked(false); // Release focus lock when stopping manually
    
    toast.info('⏹️ Focus session ended');
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    setIsPaused(false);
    setCompletedSessions(prev => prev + 1);
    
    if (currentSession && selectedTask) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true
      };
      setCurrentSession(completedSession);
      
      toast.success(`🎉 Focus session completed for "${selectedTask.title}"! Great job ${userName}!`, {
        duration: 5000
      });
      
      // Release focus lock when session completes naturally
      if (focusLocked) {
        setFocusLocked(false);
        toast.success('🔓 Session unlocked! You maintained perfect focus!', {
          duration: 3000
        });
      }
    }
    
    // Reset timer for next session
    setTimeRemaining(duration[0] * 60);
  };

  // Mark selected task as complete and sync with main Tasks page
  const markTaskComplete = async () => {
    if (!selectedTask) {
      toast.error('No task selected to mark as complete!');
      return;
    }

    if (focusLocked && isActive) {
      toast.error('🔒 Cannot mark task complete during locked session!');
      return;
    }

    try {
      await taskApi.updateTask(selectedTask.id, { completed: true });
      
      // Remove from focus tasks list
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      setSelectedTask(null);
      
      // Stop current session if running
      if (isActive) {
        setIsActive(false);
        setIsPaused(false);
        setCurrentSession(null);
        setTimeRemaining(duration[0] * 60);
      }
      
      toast.success(`✅ Task "${selectedTask.title}" marked as complete! Well done ${userName}!`);
    } catch (error) {
      console.error('Failed to mark task complete:', error);
      toast.error('Failed to mark task as complete. Please try again.');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFocusLock = () => {
    if (isDemoMode) {
      toast.info("🔒 Focus Lock is not available in demo mode. Sign up to use advanced focus features!");
      return;
    }
    
    if (isActive && focusLocked) {
      toast.error('🔒 Cannot disable Focus Lock during active locked session! Complete your session first.');
      return;
    }
    
    if (!focusLocked) {
      if (window.confirm("🔒 ULTRA-STRICT FOCUS LOCK will:\n\n• Block ALL keyboard shortcuts\n• Prevent tab/window switching\n• Disable navigation and refresh\n• Block context menus and text selection\n• Force focus retention\n• Prevent page scrolling\n\nYou will be COMPLETELY LOCKED IN until session completion!\n\nAre you absolutely sure?")) {
        setFocusLocked(true);
        toast.success('🔒 ULTRA-STRICT FOCUS LOCK ENABLED! No escape until completion!', { duration: 10000 });
        
        // Optional: Request fullscreen for maximum immersion
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen request denied');
          });
        }
      }
    } else {
      if (window.confirm("🔓 Are you sure you want to disable ULTRA-STRICT Focus Lock? This will restore all normal browser functionality.")) {
        setFocusLocked(false);
        
        // Exit fullscreen if it was activated
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {
            console.log('Exit fullscreen failed');
          });
        }
        
        toast.info('🔓 Focus Lock disabled. All restrictions removed.', { duration: 5000 });
      }
    }
  };

  const handleMusicToggle = () => {
    if (isDemoMode) {
      toast.info("🎵 Music controls are not available in demo mode. Sign up to customize your focus experience!");
      return;
    }
    setMusicEnabled(!musicEnabled);
    toast.info(musicEnabled ? '🔇 Focus music disabled' : '🎵 Focus music enabled');
  };

  const handleBackgroundMusicChange = (key: string) => {
    if (isDemoMode) {
      toast.info("🎵 Music selection is not available in demo mode. Sign up to customize your focus soundtrack!");
      return;
    }
    setBackgroundMusic(key);
    const sound = backgroundSounds[key as keyof typeof backgroundSounds];
    toast.info(`🎵 Switched to ${sound.name}`);
  };

  const handleNavigation = () => {
    if (focusLocked && isActive) {
      toast.error('🔒 Cannot navigate away during locked focus session! Complete your session first.', { 
        duration: 5000 
      });
      
      // Add extra emphasis with multiple notifications
      setTimeout(() => {
        toast.warning('🚨 FOCUS LOCK ACTIVE: Navigation blocked until session completion!', { 
          duration: 3000 
        });
      }, 500);
      
      return;
    }
    
    if (isActive && !window.confirm("You have an active focus session. Leaving will end it. Continue?")) {
      return;
    }
    
    if (isActive) {
      setIsActive(false);
      setIsPaused(false);
      setCurrentSession(null);
      setFocusLocked(false);
    }
    
    // Navigate to dashboard
    navigate(isDemoMode ? "/dashboard?demo=true" : "/dashboard");
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNavigation}
                  disabled={focusLocked && isActive}
                  className={`${
                    theme === 'dark' 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-slate-800 hover:bg-black/10'
                  } ${focusLocked && isActive ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                {focusLocked && isActive && (
                  <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
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
            {/* Stats Cards */}
            <div className="lg:col-span-5 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-300">{completedSessions}</div>
                    <div className="text-sm text-gray-300">Completed Sessions</div>
                  </CardContent>
                </Card>
                
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-300">{tasks.length}</div>
                    <div className="text-sm text-gray-300">Available Tasks</div>
                  </CardContent>
                </Card>
                
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-300">
                      {currentSession ? `${duration[0]}m` : '--'}
                    </div>
                    <div className="text-sm text-gray-300">Current Session</div>
                  </CardContent>
                </Card>
                
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-300">{aiInsights.totalPrioritized}</div>
                    <div className="text-sm text-gray-300">AI Prioritized</div>
                  </CardContent>
                </Card>
                
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' 
                    : 'bg-black/5 backdrop-blur-md border-black/10 text-slate-800'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {focusLocked ? '🔒' : '🔓'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {focusLocked ? 'Locked Mode' : 'Flexible Mode'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* AI Insights Panel */}
              {aiInsights.totalPrioritized > 0 && (
                <Card className={`mt-4 ${
                  theme === 'dark' 
                    ? 'bg-purple-900/20 backdrop-blur-md border-purple-500/30 text-white' 
                    : 'bg-purple-50/80 backdrop-blur-md border-purple-200/50 text-slate-800'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-purple-300">
                      🧠 AI Insights: Advanced algorithm active
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                      {aiInsights.urgentTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-red-400">⚡</span>
                          <span>{aiInsights.urgentTasks} tasks due within minutes - IMMEDIATE priority</span>
                        </div>
                      )}
                      {aiInsights.overdueTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">⚠️</span>
                          <span>{aiInsights.overdueTasks} overdue tasks - critical priority</span>
                        </div>
                      )}
                      {aiInsights.optimizedTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">⭐</span>
                          <span>{aiInsights.optimizedTasks} task optimized for current time of day</span>
                        </div>
                      )}
                      {aiInsights.limitedTimeTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">⏰</span>
                          <span>{aiInsights.limitedTimeTasks} tasks prioritized due to limited remaining time</span>
                        </div>
                      )}
                      {aiInsights.focusTasks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">🎯</span>
                          <span>With only 0.0 hours left, focus on {aiInsights.focusTasks} tasks under 1 hour</span>
                        </div>
                      )}
                      {aiInsights.nlpEnhanced > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">🔍</span>
                          <span>{aiInsights.nlpEnhanced} tasks enhanced with NLP analysis</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

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
                        disabled={!selectedTask || isLoadingTasks || tasks.length === 0}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {focusLocked ? 'Start Locked Session' : 'Start Focus Session'}
                      </DemoRestrictedButton>
                    ) : (
                      <>
                        <DemoRestrictedButton
                          onClick={pauseSession}
                          disabled={focusLocked && isActive}
                          className={`px-6 py-3 ${
                            focusLocked && isActive 
                              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                              : 'bg-yellow-600 hover:bg-yellow-700'
                          } text-white`}
                        >
                          {focusLocked && isActive ? (
                            <>
                              <Lock className="w-5 h-5 mr-2" />
                              Locked
                            </>
                          ) : isPaused ? (
                            <>
                              <Play className="w-5 h-5 mr-2" />
                              Resume
                            </>
                          ) : (
                            <>
                              <Pause className="w-5 h-5 mr-2" />
                              Pause
                            </>
                          )}
                        </DemoRestrictedButton>
                        <DemoRestrictedButton
                          onClick={stopSession}
                          disabled={focusLocked && isActive && timeRemaining > 0}
                          className={`px-6 py-3 ${
                            focusLocked && isActive && timeRemaining > 0
                              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                              : 'bg-red-600 hover:bg-red-700'
                          } text-white`}
                        >
                          {focusLocked && isActive && timeRemaining > 0 ? (
                            <>
                              <Lock className="w-5 h-5 mr-2" />
                              Locked
                            </>
                          ) : (
                            <>
                              <Square className="w-5 h-5 mr-2" />
                              Stop
                            </>
                          )}
                        </DemoRestrictedButton>
                      </>
                    )}
                  </div>
                  
                  {/* Session Status */}
                  {isActive && (
                    <div className="text-center mt-4">
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-orange-300' : 'text-blue-600'
                      }`}>
                        {isPaused ? '⏸️ Session Paused' : '▶️ Focus Session Active'}
                        {focusLocked && ' • 🔒 LOCKED'}
                      </div>
                      {currentSession && (
                        <div className="text-xs text-gray-400 mt-1">
                          Started: {currentSession.startTime.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}
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
                  {isLoadingTasks ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                      <span className="ml-2 text-gray-300">Loading your tasks...</span>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300 mb-4">No tasks available for focus!</p>
                      <p className="text-gray-400 text-sm">
                        Add some tasks in the Tasks page to get started with focused work sessions.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(isDemoMode ? "/tasks?demo=true" : "/tasks")}
                        className="mt-3"
                      >
                        Go to Tasks
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={selectedTask?.id || ""}
                        onValueChange={(taskId) => {
                          if (focusLocked && isActive) {
                            toast.error('🔒 Cannot change tasks during locked session!');
                            return;
                          }
                          const task = tasks.find(t => t.id === taskId);
                          setSelectedTask(task || null);
                          if (task) {
                            toast.info(`🎯 Selected: "${task.title}"`);
                          }
                        }}
                        disabled={isActive || isDemoMode || (focusLocked && isActive)}
                      >
                        <SelectTrigger className={`h-12 ${
                          theme === 'dark' 
                            ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
                            : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                        } ${(focusLocked && isActive) ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                                {/* AI Priority Indicator */}
                                {task.aiPriority && task.aiPriority >= 80 && (
                                  <span className="text-purple-400 text-xs" title="AI High Priority">🧠</span>
                                )}
                                {task.aiInsights?.isUrgent && (
                                  <span className="text-red-400 text-xs" title="Urgent - Due Soon">⚡</span>
                                )}
                                {task.aiInsights?.isOverdue && (
                                  <span className="text-red-500 text-xs" title="Overdue">⚠️</span>
                                )}
                                {task.aiInsights?.isOptimizedForTime && (
                                  <span className="text-green-400 text-xs" title="Optimal Time">⭐</span>
                                )}
                                {task.aiInsights?.requiresFocus && (
                                  <span className="text-blue-400 text-xs" title="Focus Recommended">🎯</span>
                                )}
                                
                                <span className="flex-1 truncate">{task.title}</span>
                                
                                {/* AI Priority Score */}
                                {task.aiPriority && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-purple-400 text-purple-400 mr-1"
                                  >
                                    AI: {task.aiPriority}
                                  </Badge>
                                )}
                                
                                <Badge 
                                  variant="outline" 
                                  className={`ml-auto text-xs ${
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
                        <div className="mt-3 space-y-3">
                          {/* Standard Task Info */}
                          <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                            <div className="space-y-2">
                              <p className="text-sm text-orange-200">
                                <span className="font-semibold">Priority:</span> {selectedTask.priority}
                              </p>
                              <p className="text-sm text-orange-200">
                                <span className="font-semibold">Category:</span> {selectedTask.category}
                              </p>
                              {selectedTask.description && (
                                <p className="text-xs text-orange-300 italic">
                                  "{selectedTask.description}"
                                </p>
                              )}
                              {selectedTask.dueDate && (
                                <p className="text-xs text-orange-300">
                                  Due: {new Date(selectedTask.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* AI Insights */}
                          {selectedTask.aiPriority && (
                            <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-purple-200 font-semibold">🧠 AI Analysis</span>
                                  <Badge className="bg-purple-600 text-white text-xs">
                                    Score: {selectedTask.aiPriority}/100
                                  </Badge>
                                </div>
                                
                                {selectedTask.aiInsights?.priorityReason && (
                                  <p className="text-xs text-purple-300">
                                    {selectedTask.aiInsights.priorityReason}
                                  </p>
                                )}
                                
                                {selectedTask.aiInsights?.timeRecommendation && (
                                  <p className="text-xs text-purple-300">
                                    💡 {selectedTask.aiInsights.timeRecommendation}
                                  </p>
                                )}
                                
                                {/* AI Insights Badges */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedTask.aiInsights?.isUrgent && (
                                    <Badge variant="outline" className="text-xs border-red-400 text-red-400">
                                      ⚡ Urgent
                                    </Badge>
                                  )}
                                  {selectedTask.aiInsights?.isOverdue && (
                                    <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                                      ⚠️ Overdue
                                    </Badge>
                                  )}
                                  {selectedTask.aiInsights?.isOptimizedForTime && (
                                    <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                                      ⭐ Optimal Time
                                    </Badge>
                                  )}
                                  {selectedTask.aiInsights?.requiresFocus && (
                                    <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                                      🎯 Focus Rec.
                                    </Badge>
                                  )}
                                  {selectedTask.aiInsights?.nlpEnhanced && (
                                    <Badge variant="outline" className="text-xs border-cyan-400 text-cyan-400">
                                      🔍 NLP Enhanced
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* AI Scores */}
                                {selectedTask.aiScore && (
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                    <div className="text-purple-300">
                                      Urgency: {selectedTask.aiScore.urgency}/100
                                    </div>
                                    <div className="text-purple-300">
                                      Importance: {selectedTask.aiScore.importance}/100
                                    </div>
                                    <div className="text-purple-300">
                                      Time Fit: {selectedTask.aiScore.timefit}/100
                                    </div>
                                    <div className="text-purple-300">
                                      Effort: {selectedTask.aiScore.effort}/100
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Task Completion Button */}
                      {selectedTask && (
                        <div className="mt-4 pt-4 border-t border-orange-400/30">
                          <Button
                            onClick={markTaskComplete}
                            disabled={focusLocked && isActive}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Task Complete
                          </Button>
                        </div>
                      )}
                    </>
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
                    disabled={isActive || isDemoMode || (focusLocked && isActive)}
                    className={`w-full [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-400 ${
                      (isActive || (focusLocked && isActive)) ? 'opacity-50' : ''
                    }`}
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
                    {duration[0] === 25 ? "🍅 Classic Pomodoro - Perfect for maximum focus!" :
                     duration[0] < 25 ? "⚡ Quick burst - Great for small tasks!" :
                     "🎯 Deep work - Time to tackle complex challenges!"}
                  </div>
                  {(isActive || (focusLocked && isActive)) && (
                    <div className="text-xs text-center text-orange-300/60">
                      Duration locked during active session
                    </div>
                  )}
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
                        disabled={isActive || (focusLocked && isActive)}
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
                        } ${(isActive || (focusLocked && isActive)) ? 'opacity-50' : ''}`}
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
                  {(isActive || (focusLocked && isActive)) && (
                    <div className="text-xs text-center text-orange-300/60 mt-2">
                      Music selection locked during active session
                    </div>
                  )}
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