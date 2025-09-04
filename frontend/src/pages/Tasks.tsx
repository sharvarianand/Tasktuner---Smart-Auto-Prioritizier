import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  DemoRestrictionBanner, 
  DemoRestrictedButton, 
  DemoRestrictedInput, 
  DemoRestrictedTextarea 
} from "@/components/demo-restriction"
import { NotificationPermission } from "@/components/NotificationPermission"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Trash2, 
  Flame,
  Star,
  Filter,
  RefreshCw,
  Calendar as CalendarIcon,
  Sparkles,
  Brain,
  Zap,
  Edit,
  Save,
  X,
  CheckSquare,
  Bell,
  Undo
} from "lucide-react"
import { toast } from "sonner"
import { taskApi } from "@/lib/api"
import { useUser } from "@clerk/clerk-react"
import { useDemo, useDemoMode } from "@/contexts/DemoContext"
import { useVoiceContext } from "@/contexts/VoiceContext"
import { useVoiceNotifications, TASK_VOICE_MESSAGES } from "@/hooks/useVoiceNotifications"
import notificationService from "@/services/notificationService"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  category: 'Academic' | 'Personal' | 'Work'
  completed: boolean
  completedAt?: string // Timestamp when task was completed
  cancelled?: boolean // New field for cancelled tasks
  startDate?: string
  dueDate?: string
  startTime?: string
  endTime?: string
  points: number
  roast?: string
  isDaily?: boolean
  completedDates?: string[]
  calendarEventId?: string
  reminders?: {
    before?: number // minutes before start
    after?: number  // minutes after end
  }
  // AI Prioritization fields
  aiPriority?: number // AI priority score (0-100)
  aiRank?: number // Position in AI ranking
  aiInsights?: {
    isUrgent?: boolean
    isOverdue?: boolean
    isOptimizedForTime?: boolean
    requiresFocus?: boolean
    nlpEnhanced?: boolean
    priorityReason?: string
    timeRecommendation?: string
  }
  aiScore?: {
    urgency: number
    importance: number
    timefit: number
    effort: number
  }
}

interface PrioritizedTasksResponse {
  prioritizedTasks: Task[]
  insights: {
    summary: string
    recommendations: string[]
    aiAnalysis: {
      totalTasks: number
      urgentTasks: number
      overdueTasks: number
      timeOptimizedTasks: number
      focusRecommended: number
    }
  }
}

interface UserStats {
  tasksCompleted: number
  totalTasks: number
  currentStreak: number
  xpEarned: number
  goalsProgress: number
}

// Helper function to analyze task complexity for display
const getTaskComplexityInfo = (task: Task) => {
  const description = task.description || '';
  const title = task.title || '';
  const text = (title + ' ' + description).toLowerCase();
  
  // High complexity indicators
  const complexKeywords = ['research', 'analyze', 'create', 'develop', 'design', 'write', 'study', 'learn', 'plan', 'organize', 'project'];
  const simpleKeywords = ['call', 'email', 'buy', 'pick up', 'check', 'review', 'submit', 'send'];
  
  if (complexKeywords.some(word => text.includes(word))) {
    return { level: 'High', icon: '🧠', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  } else if (simpleKeywords.some(word => text.includes(word))) {
    return { level: 'Quick', icon: '⚡', color: 'bg-green-100 text-green-700 border-green-200' };
  } else {
    return { level: 'Medium', icon: '⚙️', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  }
};

// Helper function to get urgency info
const getUrgencyInfo = (task: Task) => {
  if (!task.dueDate) return null;
  
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return { level: 'Overdue', icon: '🚨', color: 'bg-red-100 text-red-700 border-red-200' };
  if (daysUntilDue === 0) return { level: 'Today', icon: '🔥', color: 'bg-orange-100 text-orange-700 border-orange-200' };
  if (daysUntilDue === 1) return { level: 'Tomorrow', icon: '⏰', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  if (daysUntilDue <= 3) return { level: `${daysUntilDue}d left`, icon: '⚠️', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  
  return null;
};

const Tasks = () => {
  const { user } = useUser()
  const { isDemo } = useDemo()
  const { isDemoMode, showDemoRestriction } = useDemoMode()
  const { settings: voiceSettings } = useVoiceContext()
  const { speak } = useVoiceNotifications(voiceSettings)
  
  // Get user's name for personalization
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Champion'
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    tasksCompleted: 0,
    totalTasks: 0,
    currentStreak: 0,
    xpEarned: 0,
    goalsProgress: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Task['priority'],
    category: 'Personal' as Task['category'],
    startDate: '', // When the task should begin
    dueDate: '',   // When the task should be completed
    startTime: '',
    endTime: '',
    isDaily: false,
    reminders: {
      before: 0, // No reminder by default
      after: 0   // No reminder by default
    }
  })

  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)
  const [isPrioritizing, setIsPrioritizing] = useState(false)
  const [lastPrioritized, setLastPrioritized] = useState<Date | null>(null)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [addToCalendar, setAddToCalendar] = useState(false)
  const [editAddToCalendar, setEditAddToCalendar] = useState(false)
  const [hasRoastedOverdue, setHasRoastedOverdue] = useState(false)
  
  // AI Prioritization state
  const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<PrioritizedTasksResponse['insights'] | null>(null)
  const [lastReprioritized, setLastReprioritized] = useState<Date | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [smartView, setSmartView] = useState<'priority' | 'urgency' | 'optimal'>('priority')

  // Clear all tasks functionality
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])
  const [showUndoButton, setShowUndoButton] = useState(false)
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null)

  // Load tasks and stats on component mount
  useEffect(() => {
    loadTasksAndStats()
    // Request notification permission
    if (notificationService?.requestPermission) {
      notificationService.requestPermission()
    }
    // Initialize roast notifications
    if (notificationService?.scheduleMotivationalRoasts) {
      notificationService.scheduleMotivationalRoasts()
    }
  }, [])

  // Load tasks and stats on component mount
  useEffect(() => {
    if (tasks.length > 0) { // Only reload if we have tasks
      loadTasksAndStats()
    }
  }, [])

  // Handle task actions from notifications
  useEffect(() => {
    const handleTaskAction = (event: CustomEvent) => {
      const { action, taskId } = event.detail;
      
      switch (action) {
        case 'complete':
          toggleTask(taskId);
          break;
        case 'reschedule':
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            startEditTask(task);
          }
          break;
        case 'cancel':
          deleteTask(taskId);
          break;
      }
    };

    window.addEventListener('taskAction', handleTaskAction as EventListener);
    
    return () => {
      window.removeEventListener('taskAction', handleTaskAction as EventListener);
    };
  }, [tasks]);

  // Update stored tasks whenever tasks change (for deadline monitoring)
  useEffect(() => {
    try {
      if (notificationService && notificationService.updateStoredTasks) {
        notificationService.updateStoredTasks(tasks);
      }
    } catch (error) {
      console.error('Error updating stored tasks:', error);
    }
  }, [tasks]);

  // Cleanup notifications when component unmounts
  useEffect(() => {
    return () => {
      // Don't fully cleanup as notifications should persist across page changes
      // notificationService.cleanup();
    };
  }, []);

  // Auto-roast for overdue tasks (once per session)
  useEffect(() => {
    const overdueTasks = tasks.filter(task => !task.completed && isTaskOverdue(task))
    
    if (overdueTasks.length > 0 && !hasRoastedOverdue) {
      // Delay to let the component render, then roast
      const timer = setTimeout(async () => {
        if (notificationService?.showProcrastinationRoast) {
          notificationService.showProcrastinationRoast(overdueTasks[0].title)
          setHasRoastedOverdue(true)
          
          // Speak the roast if voice is enabled
          if (voiceSettings.enabled && voiceSettings.autoSpeak) {
            try {
              await speak(TASK_VOICE_MESSAGES.taskOverdue(overdueTasks[0].title))
            } catch (error) {
              console.warn('Voice notification failed:', error)
            }
          }
        }
      }, 2000) // 2 second delay after page load
      
      return () => clearTimeout(timer)
    }
    
    // Reset roast flag if no overdue tasks
    if (overdueTasks.length === 0 && hasRoastedOverdue) {
      setHasRoastedOverdue(false)
    }
  }, [tasks, hasRoastedOverdue])

  // Auto-delete completed tasks after 24 hours
  useEffect(() => {
    const checkAndDeleteOldTasks = async () => {
      if (!Array.isArray(tasks) || tasks.length === 0) return;
      
      const now = new Date()
      const tasksToDelete = tasks.filter(task => {
        // Only check completed tasks
        if (!task.completed) return false
        
        // If task has completedAt timestamp, use it
        if (task.completedAt) {
          try {
            const completedDate = new Date(task.completedAt)
            const hoursSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60)
            
            return hoursSinceCompletion >= 24 // 24 hours
          } catch (error) {
            console.error(`Error parsing completion date for task ${task.id}:`, error)
            return false
          }
        }
        
        // For legacy tasks without completedAt, don't auto-delete them
        // They were completed before we started tracking completion timestamps
        return false
      })

      if (tasksToDelete.length > 0) {
        for (const task of tasksToDelete) {
          try {
            if (!task.id) {
              console.warn('Skipping task deletion - no ID found:', task)
              continue
            }
            
            await taskApi.deleteTask(task.id)
            // Cancel notifications silently
            if (notificationService?.cancelAllTaskNotifications) {
              notificationService.cancelAllTaskNotifications(task.id)
            }
          } catch (error) {
            console.error(`Failed to auto-delete task ${task.id}:`, error)
          }
        }
        
        // Update local state
        setTasks(prevTasks => prevTasks.filter(task => !tasksToDelete.includes(task)))
        
        // Show subtle notification
        if (tasksToDelete.length === 1) {
          toast.success(`✨ Cleaned up completed task: "${tasksToDelete[0].title}"`)
        } else {
          toast.success(`✨ Cleaned up ${tasksToDelete.length} old completed tasks`)
        }
      }
    }

    // Check every hour for old completed tasks
    const interval = setInterval(checkAndDeleteOldTasks, 60 * 60 * 1000) // 1 hour
    
    // Also check immediately on mount
    checkAndDeleteOldTasks()
    
    return () => clearInterval(interval)
  }, [tasks])

  const loadTasksAndStats = async () => {
    try {
      setIsLoading(true)
      
        // Load AI-prioritized tasks
        const prioritizedData = await taskApi.getPrioritizedTasks()
        setPrioritizedTasks(prioritizedData.prioritizedTasks)
        setTasks(prioritizedData.prioritizedTasks) // Keep both for compatibility
        setAiAnalysis(prioritizedData.insights)
        setAiRecommendations(prioritizedData.insights.recommendations)
        setLastPrioritized(new Date())
      
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load tasks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }





  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    // Validate time fields if provided
    if (newTask.startTime && newTask.endTime) {
      const start = new Date(`2000-01-01T${newTask.startTime}`)
      const end = new Date(`2000-01-01T${newTask.endTime}`)
      
      // If start and due dates are the same, end time must be after start time
      if (newTask.startDate && newTask.dueDate && newTask.startDate === newTask.dueDate) {
        if (start >= end) {
          toast.error("End time must be after start time for same-day tasks!")
          return
        }
      } else if (start >= end) {
        toast.error("End time must be after start time!")
        return
      }
    }

    try {
      const taskData = {
        ...newTask,
        addToCalendar: addToCalendar && !!(newTask.startTime && newTask.endTime && newTask.startDate) // Only add to calendar if user opted in and time/date fields are filled
      }
      
      const task = await taskApi.createTask(taskData)
      
      // Schedule browser notifications if task has time and reminders
      if (task.startTime && task.reminders && task.reminders.before > 0) {
        if (notificationService?.showTaskNotifications) {
          notificationService.showTaskNotifications(task);
        }
      }
      
      // Reload tasks to get fresh AI prioritization
        await loadTasksAndStats() // This will reprioritize with the new task
      
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'Medium', 
        category: 'Personal', 
        startDate: '',
        dueDate: '',
        startTime: '',
        endTime: '',
        isDaily: false,
        reminders: {
          before: 0, // No default reminder
          after: 0   // No default reminder
        }
      })
      setAddToCalendar(false)
      setIsDialogOpen(false)
      
      let successMessage = "Task added! Now stop making excuses and do it 🔥"
      if (task.calendarEventId) {
        successMessage += " | Added to Google Calendar 📅"
      }
      if (task.startTime && task.reminders && task.reminders.before > 0) {
        successMessage += " | Reminders scheduled 🔔"
      }
      
      toast.success(successMessage)
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task. Please try again.')
    }
  }

  const toggleTask = async (taskId: string) => {
    console.log('🔄 toggleTask called for taskId:', taskId); // Debug log
    if (!taskId) {
      console.error('toggleTask called with undefined taskId')
      return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
      console.error(`Task not found for ID: ${taskId}`)
      return
    }

    console.log('✅ Toggling task:', task.title, 'from', task.completed, 'to', !task.completed); // Debug log

    try {
      const updatedTask = await taskApi.updateTask(taskId, {
        completed: !task.completed
      })
      
      // Update local state immediately for responsiveness
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
      
      // Handle notifications based on completion status
      if (updatedTask.completed) {
        // Cancel all notifications when task is completed
        if (notificationService?.cancelAllTaskNotifications) {
          notificationService.cancelAllTaskNotifications(taskId)
        }
        const points = task.points || (task.priority === 'High' ? 50 : task.priority === 'Medium' ? 30 : 15)
        // Show completion roast
        if (notificationService?.showCompletionRoast) {
          notificationService.showCompletionRoast(task.title, points)
        }
        
        // Speak completion message if voice is enabled
        if (voiceSettings.enabled && voiceSettings.autoSpeak) {
          try {
            await speak(TASK_VOICE_MESSAGES.taskCompleted(task.title))
          } catch (error) {
            console.warn('Voice completion notification failed:', error)
          }
        }
        
        toast.success(`+${points} XP! You're on fire! 🎉`)
      } else {
        // Reschedule notifications when task is uncompleted
        if (updatedTask.startTime && updatedTask.reminders && notificationService?.showTaskNotifications) {
          notificationService.showTaskNotifications(updatedTask)
        }
      }
      
      // Reload AI prioritization (after a short delay to avoid too many calls)
        setTimeout(() => {
          loadTasksAndStats()
        }, 1000)
      
    } catch (error) {
      console.error('Error toggling task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
      
      // Cancel all notifications for this task
      if (notificationService?.cancelAllTaskNotifications) {
        notificationService.cancelAllTaskNotifications(taskId)
      }
      
      // Reload stats to get updated counts  
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
      
      toast.success("Task deleted successfully! ✅")
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task. Please try again.')
    }
  }

  // Edit task functionality
  const startEditTask = (task: Task) => {
    setEditingTask({
      ...task,
      // Convert Date objects to strings for form inputs
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      startTime: task.startTime || '',
      endTime: task.endTime || '',
              reminders: task.reminders || { before: 0 }
    })
    // Set calendar sync state based on whether task already has a calendar event
    setEditAddToCalendar(!!task.calendarEventId)
    setIsEditDialogOpen(true)
  }

  const saveEditTask = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    // Validate time fields if provided
    if (editingTask.startTime && editingTask.endTime) {
      const start = new Date(`2000-01-01T${editingTask.startTime}`)
      const end = new Date(`2000-01-01T${editingTask.endTime}`)
      
      // If start and due dates are the same, end time must be after start time
      if (editingTask.startDate && editingTask.dueDate && editingTask.startDate === editingTask.dueDate) {
        if (start >= end) {
          toast.error("End time must be after start time for same-day tasks!")
          return
        }
      } else if (start >= end) {
        toast.error("End time must be after start time!")
        return
      }
    }

    try {
      // Make sure reminders have required properties if included
      const reminders = editingTask.reminders ? {
        before: editingTask.reminders.before ?? 0, // Use nullish coalescing to ensure values
        after: editingTask.reminders.after ?? 0
      } : undefined;

      const updatedTaskData = {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        category: editingTask.category,
        dueDate: editingTask.dueDate,
        isDaily: editingTask.isDaily,
        // Include additional fields if they exist
        ...(editingTask.startDate && { startDate: editingTask.startDate }),
        ...(editingTask.startTime && { startTime: editingTask.startTime }),
        ...(editingTask.endTime && { endTime: editingTask.endTime }),
        ...(reminders && { reminders }),
        // Handle Google Calendar integration
        addToCalendar: editAddToCalendar && !!(editingTask.startTime && editingTask.endTime && editingTask.startDate) && !editingTask.calendarEventId
      }
      
      const updatedTask = await taskApi.updateTask(editingTask.id, updatedTaskData)
      
      // Update the local task with all the edited data
      const fullUpdatedTask = {
        ...tasks.find(t => t.id === editingTask.id),
        ...updatedTask,
        ...updatedTaskData // Ensure all local changes are reflected
      }
      
      setTasks(tasks.map(t => t.id === editingTask.id ? fullUpdatedTask : t))
      setIsEditDialogOpen(false)
      setEditingTask(null)
      setEditAddToCalendar(false)
      
      let successMessage = "Task updated successfully! 📝"
      if (updatedTask.calendarEventId && editAddToCalendar) {
        successMessage += " | Added to Google Calendar 📅"
      } else if (updatedTask.calendarEventId) {
        successMessage += " | Google Calendar event updated 📅"
      }
      
      toast.success(successMessage)
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const cancelEdit = () => {
    setIsEditDialogOpen(false)
    setEditingTask(null)
    setEditAddToCalendar(false)
  }

  // Smart Auto Prioritization function
  const smartPrioritizeTasks = async () => {
    if (tasks.length < 2) {
      toast.error("Add at least 2 tasks to use Smart Auto Prioritization!")
      return
    }

    try {
      setIsPrioritizing(true)
      toast.loading("AI is analyzing your tasks with advanced algorithms... 🧠", { id: 'prioritizing' })

      // Prepare tasks data for AI analysis with all necessary fields including timing
      const tasksForAI = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        startDate: task.startDate,
        startTime: task.startTime,
        endTime: task.endTime,
        completed: task.completed,
        completedAt: task.completedAt,
        cancelled: task.cancelled,
        isDaily: task.isDaily,
        points: task.points,
        roast: task.roast,
        completedDates: task.completedDates,
        calendarEventId: task.calendarEventId,
        reminders: task.reminders
      }))

      console.log('📊 Sending tasks for advanced AI prioritization:', tasksForAI.length, 'tasks')

      const response = await taskApi.prioritizeTasks(tasksForAI)
      
      console.log('🤖 Advanced AI prioritization response:', response)
      console.log('📊 AI returned tasks with fields:', response.prioritizedTasks?.map(t => ({
        id: t.id,
        title: t.title,
        startTime: t.startTime,
        endTime: t.endTime,
        hasTimingFromAI: !!(t.startTime && t.endTime)
      })))
      
      if (response.prioritizedTasks && response.prioritizedTasks.length > 0) {
        // Reorder tasks based on AI prioritization while preserving all original task data
        const prioritizedOrder = response.prioritizedTasks
        
        // Merge AI prioritized tasks with original task data to preserve all fields including timing
        console.log('📊 Original tasks with timing:', tasks.map(t => ({
          id: t.id, 
          title: t.title, 
          startTime: t.startTime, 
          endTime: t.endTime,
          hasTimingFields: !!(t.startTime && t.endTime)
        })))

        const reorderedTasks = prioritizedOrder
          .filter(Boolean)
          .map(aiTask => {
            const originalTask = tasks.find(task => task.id === aiTask.id)
            if (originalTask) {
              // Merge AI changes (like updated priority) with original task data
              const mergedTask = {
                ...originalTask, // Preserve all original fields including timing
                ...aiTask,       // Apply AI updates like priority changes  
                // Ensure timing fields are preserved from original
                startTime: originalTask.startTime || aiTask.startTime,
                endTime: originalTask.endTime || aiTask.endTime,
                reminders: originalTask.reminders || aiTask.reminders,
                calendarEventId: originalTask.calendarEventId || aiTask.calendarEventId
              } as Task
              
              console.log('🔄 Merged task:', {
                id: mergedTask.id,
                title: mergedTask.title,
                originalTiming: { startTime: originalTask.startTime, endTime: originalTask.endTime },
                aiTiming: { startTime: aiTask.startTime, endTime: aiTask.endTime },
                finalTiming: { startTime: mergedTask.startTime, endTime: mergedTask.endTime },
                hasTimingAfterMerge: !!(mergedTask.startTime && mergedTask.endTime)
              })
              
              return mergedTask
            }
            return aiTask as Task
          })
          .filter(Boolean)

        console.log('✅ Final tasks with timing after merge:', reorderedTasks.map(t => ({
          id: t.id, 
          title: t.title, 
          startTime: t.startTime, 
          endTime: t.endTime,
          hasTimingFields: !!(t.startTime && t.endTime)
        })))

        // Add any tasks that might have been missed (fallback safety)
        const missingTasks = tasks.filter(task => 
          !reorderedTasks.find(reordered => reordered.id === task.id)
        )
        
        const finalTaskOrder = [...reorderedTasks, ...missingTasks]
        
        console.log('✅ Final task order with advanced prioritization:', finalTaskOrder.map(t => `${t.title} (${t.priority})`))
        
        setTasks(finalTaskOrder)
        setLastPrioritized(new Date())
        
        // Store AI insights if provided
        if (response.insights && Array.isArray(response.insights)) {
          setAiInsights(response.insights)
          console.log('💡 AI Insights:', response.insights)
        } else {
          setAiInsights([])
        }
        
        let successMessage = "🎯 Tasks prioritized with advanced AI algorithms!"
        if (response.insights && response.insights.length > 0) {
          successMessage += ` Found ${response.insights.length} optimization insights.`
        }
        if (response.note) {
          successMessage += ` (${response.note})`
        }
        
        toast.success(successMessage, { id: 'prioritizing' })
      } else {
        console.error('❌ Invalid AI response:', response)
        toast.error("AI prioritization failed. Try again later.", { id: 'prioritizing' })
      }
    } catch (error) {
      console.error('❌ Error prioritizing tasks:', error)
      toast.error('Smart prioritization failed. Please try again.', { id: 'prioritizing' })
    } finally {
      setIsPrioritizing(false)
    }
  }

  const generateRoast = () => {
    const roasts = [
      "Another task? At this rate you'll finish by 2030 🐌",
      "Let me guess... you'll start this 'tomorrow' 🙄", 
      "Adding tasks is easy. Doing them? That's where you struggle 💪",
      "Your task list is longer than your attention span 📝",
      "Oh look, another shiny task to procrastinate on ✨"
    ]
    return roasts[Math.floor(Math.random() * roasts.length)]
  }

  const filteredTasks = tasks.filter(task => {
    // Filter out cancelled tasks unless specifically showing them
    if (task.cancelled && !showCancelled) return false
    
    if (!showCompleted && task.completed) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    if (filterCategory !== 'all' && task.category !== filterCategory) return false
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'default'
    }
  }

  // Helper function to check if task is overdue
  const isTaskOverdue = (task: Task): boolean => {
    if (task.completed || task.cancelled || !task.dueDate) return false
    
    const now = new Date()
    const dueDateTime = task.endTime 
      ? new Date(`${task.dueDate}T${task.endTime}`)
      : new Date(`${task.dueDate}T23:59:59`)
    
    return now > dueDateTime
  }

  // Helper function to get deadline status
  const getDeadlineStatus = (task: Task): { text: string, color: string, urgent: boolean } => {
    if (task.completed) return { text: 'Completed', color: 'text-green-600', urgent: false }
    if (task.cancelled) return { text: 'Cancelled', color: 'text-gray-500', urgent: false }
    if (!task.dueDate) return { text: 'No deadline', color: 'text-muted-foreground', urgent: false }
    
    const now = new Date()
    const dueDateTime = task.endTime 
      ? new Date(`${task.dueDate}T${task.endTime}`)
      : new Date(`${task.dueDate}T23:59:59`)
    
    const timeDiff = dueDateTime.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
    
    if (timeDiff < 0) {
      const hoursOverdue = Math.abs(hoursDiff)
      if (hoursOverdue < 24) {
        return { 
          text: `Overdue by ${Math.floor(hoursOverdue)}h`, 
          color: 'text-red-600 font-semibold', 
          urgent: true 
        }
      } else {
        return { 
          text: `Overdue by ${Math.floor(Math.abs(daysDiff))}d`, 
          color: 'text-red-600 font-semibold', 
          urgent: true 
        }
      }
    } else if (hoursDiff < 24) {
      return { 
        text: `Due in ${Math.floor(hoursDiff)}h`, 
        color: 'text-orange-600 font-medium', 
        urgent: true 
      }
    } else if (daysDiff < 7) {
      return { 
        text: `Due in ${Math.floor(daysDiff)}d`, 
        color: 'text-yellow-600', 
        urgent: false 
      }
    } else {
      return { 
        text: `Due in ${Math.floor(daysDiff)}d`, 
        color: 'text-muted-foreground', 
        urgent: false 
      }
    }
  }

  const clearAllTasks = async () => {
    try {
      // Store tasks for undo functionality
      setDeletedTasks(tasks)
      setShowUndoButton(true)
      
      // Call backend API to actually delete all tasks
      await taskApi.clearAllTasks()
      
      // Clear local state
      setTasks([])
      
      // Update user stats
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
      
      toast.success("All tasks have been cleared!")
      
      // Auto-hide undo button after 30 seconds
      setTimeout(() => {
        setShowUndoButton(false)
        setDeletedTasks([])
      }, 30000)
      
    } catch (error) {
      console.error('Error clearing all tasks:', error)
      toast.error('Failed to clear all tasks. Please try again.')
      
      // Reset undo state on error
      setShowUndoButton(false)
      setDeletedTasks([])
    }
  }

  const undoClearAllTasks = async () => {
    try {
      // Restore tasks to backend
      for (const task of deletedTasks) {
        await taskApi.createTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate,
          startDate: task.startDate,
          startTime: task.startTime,
          endTime: task.endTime,
          reminders: { 
            before: task.reminders?.before || 0,
            after: task.reminders?.after || 0 
          },
          isDaily: task.isDaily
        })
      }
      
      // Reload tasks and stats from backend
      await loadTasksAndStats()
      
      // Clear undo state
      setDeletedTasks([])
      setShowUndoButton(false)
      
      toast.success("Clearing tasks has been undone!")
      
    } catch (error) {
      console.error('Error undoing clear all tasks:', error)
      toast.error('Failed to undo clearing tasks. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Tasks">
        <div className="p-6 space-y-6 relative z-10">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading tasks...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Tasks">
      <div className="p-6 space-y-6 relative z-10">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Notification Permission Request - Only show if needed */}
        {/* <NotificationPermission /> */}
        
        {/* Personalized Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isDemo ? "Demo Task Management" : `${userName}'s Task Hub`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isDemo 
                  ? "Experience the power of AI-driven task management"
                  : tasks.length > 0 
                    ? `You have ${filteredTasks.length} active tasks. Time to get things done!`
                    : "Ready to tackle your goals? Add your first task to get started!"
                }
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* AI Prioritization Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">AI Smart Prioritization</h3>
                <p className="text-sm text-muted-foreground">
                  Tasks automatically prioritized by advanced AI algorithms
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Insights Panel */}
          {aiAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Urgent</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{aiAnalysis.aiAnalysis.urgentTasks}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Overdue</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{aiAnalysis.aiAnalysis.overdueTasks}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Optimal</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{aiAnalysis.aiAnalysis.timeOptimizedTasks}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Focus</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{aiAnalysis.aiAnalysis.focusRecommended}</p>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  AI Recommendations
                </h4>
                <div className="space-y-1">
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {rec}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* AI Summary */}
          {aiAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{aiAnalysis.summary}</p>
                  {lastReprioritized && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {lastReprioritized.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Overdue Tasks Alert */}
        {(() => {
          const overdueTasks = tasks.filter(task => !task.completed && isTaskOverdue(task))
          if (overdueTasks.length > 0) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full">
                      <Clock className="h-4 w-4 text-red-600 dark:text-red-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                      ⚠️ {overdueTasks.length} Task{overdueTasks.length > 1 ? 's' : ''} Overdue!
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      {overdueTasks.length === 1 
                        ? `"${overdueTasks[0].title}" is giving you the silent treatment. Time to make amends! 💔`
                        : `${overdueTasks.length} tasks are officially disappointed in you. They expected better! 😤`
                      }
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-gray-800 text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        // Reset filters to show all tasks, then scroll to first overdue
                        setFilterPriority('all')
                        setFilterCategory('all')
                        setShowCompleted(true)
                        
                        // Small delay to let state update, then scroll
                        setTimeout(() => {
                          const firstOverdueTask = document.querySelector('[data-overdue="true"]')
                          if (firstOverdueTask) {
                            firstOverdueTask.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }
                        }, 100)
                      }}
                    >
                      View Tasks
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          }
          return null
        })()}
        
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid grid-cols-1 md:grid-cols-${lastPrioritized ? '4' : '3'} gap-4`}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{userStats.totalTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{userStats.tasksCompleted}</p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold">{userStats.xpEarned}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card - Enhanced with detailed insights */}
          {lastPrioritized && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Prioritized</p>
                    <p className="text-2xl font-bold">{filteredTasks.length}</p>
                    <p className="text-xs text-purple-600">Advanced algorithm active</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                
                {/* AI Insights */}
                {aiInsights.length > 0 && (
                  <div className="space-y-1 border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">💡 AI Insights:</p>
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="text-xs text-muted-foreground bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-500 flex-shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {aiInsights.length === 0 && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground">Tasks optimized for productivity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Add Task & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if (open && isDemoMode) {
                showDemoRestriction();
                return;
              }
              setIsDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground shadow-glow hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to procrastinate on... I mean, accomplish!
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <DemoRestrictedInput
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                
                <DemoRestrictedTextarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={newTask.category} onValueChange={(value: Task['category']) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date with Calendar Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTask.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.startDate ? format(new Date(newTask.startDate), "PPP") : "Pick start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newTask.startDate ? new Date(newTask.startDate) : undefined}
                          onSelect={(date) => setNewTask({...newTask, startDate: date ? format(date, "yyyy-MM-dd") : ''})}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Due Date with Calendar Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Due Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTask.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : "Pick due date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                          onSelect={(date) => setNewTask({...newTask, dueDate: date ? format(date, "yyyy-MM-dd") : ''})}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            
                            // Don't allow dates before today
                            if (date < today) return true
                            
                            // If start date is set, don't allow due date before start date
                            if (newTask.startDate) {
                              const startDate = new Date(newTask.startDate + 'T00:00:00')
                              const checkDate = new Date(date)
                              checkDate.setHours(0, 0, 0, 0)
                              
                              // Allow same day (>=) but prevent before start date
                              return checkDate < startDate
                            }
                            
                            return false
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Same Day Task Indicator */}
                {newTask.startDate && newTask.dueDate && newTask.startDate === newTask.dueDate && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Same-day task: Make sure end time is after start time
                    </span>
                  </div>
                )}

                {/* Time Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </label>
                    <DemoRestrictedInput
                      type="time"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time
                    </label>
                    <DemoRestrictedInput
                      type="time"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                    />
                  </div>
                </div>

                {/* Reminder Settings */}
                {(newTask.startTime || newTask.endTime) && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Notification Reminders
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Before start (minutes)</label>
                        <Select 
                          value={newTask.reminders.before.toString()} 
                          onValueChange={(value) => setNewTask({
                            ...newTask, 
                            reminders: {...newTask.reminders, before: parseInt(value)}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No reminder</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="1440">1 day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                    </div>
                  </div>
                )}

                {/* Daily Task Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDaily"
                    checked={newTask.isDaily}
                    onCheckedChange={(checked) => setNewTask({...newTask, isDaily: !!checked})}
                  />
                  <label htmlFor="isDaily" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Daily recurring task
                  </label>
                </div>

                {/* Google Calendar Integration */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="addToCalendar"
                    checked={addToCalendar}
                    onCheckedChange={(checked) => setAddToCalendar(checked === true)}
                  />
                  <label htmlFor="addToCalendar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                    Add to Google Calendar
                    {!newTask.startTime || !newTask.endTime || !newTask.startDate ? (
                      <span className="text-xs text-muted-foreground">(Requires start date and time)</span>
                    ) : null}
                  </label>
                </div>
                
                <DemoRestrictedButton onClick={addTask} className="w-full" allowInDemo={true}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </DemoRestrictedButton>
              </div>
            </DialogContent>
          </Dialog>

          {/* Smart Auto Prioritization Button - Enhanced */}
          {tasks.length >= 2 && (
            <div className="flex flex-col gap-2">
              <DemoRestrictedButton
                onClick={smartPrioritizeTasks}
                disabled={isPrioritizing}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border-0"
              >
                {isPrioritizing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing Tasks...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Advanced AI Prioritization
                  </>
                )}
              </DemoRestrictedButton>
              {!lastPrioritized && (
                <p className="text-xs text-muted-foreground text-center max-w-48">
                  Advanced algorithms: urgency analysis, cognitive load optimization, energy management
                </p>
              )}
              
              {lastPrioritized && aiInsights.length > 0 && (
                <div className="text-xs text-center">
                  <p className="text-green-600 font-medium">✅ {aiInsights.length} optimization insights applied</p>
                </div>
              )}
            </div>
          )}
          </div>
          {/* Filters */}
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
              </SelectContent>
            </Select>
            
            <DemoRestrictedButton
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide" : "Show"} Completed
            </DemoRestrictedButton>

            {/* Clear All Tasks Button */}
            {tasks.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllTasks}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All Tasks
              </Button>
            )}

            {/* Undo Clear Button */}
            {showUndoButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={undoClearAllTasks}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo Clear
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={loadTasksAndStats}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Smart Prioritization Indicator */}
        {lastPrioritized && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-300">
                Tasks automatically prioritized by AI on {lastPrioritized.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLastPrioritized(null)}
                className="ml-auto h-6 w-6 p-0 text-purple-600 hover:text-purple-700"
              >
                ×
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`transition-all duration-500 hover:shadow-lg ${
                  task.completed ? 'opacity-60' : 
                  isTaskOverdue(task) ? 'border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-900/10' : 
                  task.aiInsights?.isUrgent ? 'border-red-300 bg-red-50/50 shadow-red-100 dark:border-red-700 dark:bg-red-900/20' :
                  index === 0 ? 'border-purple-300 bg-purple-50/50 shadow-purple-100 dark:border-purple-700 dark:bg-purple-900/20 ring-2 ring-purple-200 dark:ring-purple-800' :
                  index < 3 ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10' :
                  ''
                }`}
                data-overdue={isTaskOverdue(task) ? 'true' : 'false'}
                data-ai-priority={task.aiRank || index + 1}
                onClick={(e) => {
                  // Prevent card clicks from toggling task completion
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <DemoRestrictedButton
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('📋 Checkbox clicked for task:', task.title); // Debug log
                        toggleTask(task.id);
                      }}
                      className="mt-1 flex-shrink-0 hover:bg-muted/50 rounded-full transition-colors"
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </DemoRestrictedButton>
                    
                    <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>{/* min-w-0 prevents flex overflow */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.isDaily && (
                            <Badge key="daily" variant="outline" className="text-xs">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Daily
                            </Badge>
                          )}
                          
                          {/* AI Priority Indicators */}
                          {task.aiInsights && (
                            <>
                              {task.aiInsights.isOverdue && (
                                <Badge key="ai-overdue" variant="destructive" className="text-xs animate-pulse">
                                  ⚠️ Overdue
                                </Badge>
                              )}
                              {task.aiInsights.isUrgent && !task.aiInsights.isOverdue && (
                                <Badge key="ai-urgent" className="text-xs bg-red-100 text-red-700 border-red-200">
                                  ⚡ Urgent
                                </Badge>
                              )}
                              {task.aiInsights.isOptimizedForTime && (
                                <Badge key="ai-optimal" className="text-xs bg-green-100 text-green-700 border-green-200">
                                  ⭐ Optimal Time
                                </Badge>
                              )}
                              {task.aiInsights.requiresFocus && (
                                <Badge key="ai-focus" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                  🎯 Focus Rec.
                                </Badge>
                              )}
                              {task.aiRank && task.aiRank <= 3 && (
                                <Badge key="ai-top" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                  🧠 #{task.aiRank} AI Priority
                                </Badge>
                              )}
                            </>
                          )}
                          
                          {/* Deadline Status Indicator */}
                          {(() => {
                            const status = getDeadlineStatus(task)
                            return status.urgent && (
                              <Badge 
                                key="deadline-status"
                                variant={status.text.includes('Overdue') ? 'destructive' : 'secondary'} 
                                className={`text-xs ${status.color}`}
                              >
                                {status.text.includes('Overdue') ? '⚠️' : '⏰'} {status.text}
                              </Badge>
                            )
                          })()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* AI Priority Score */}
                          {task.aiPriority && (
                            <Badge key="ai-score" variant="secondary" className="text-xs bg-purple-600 text-purple-600 border-purple-200">
                              AI: {task.aiPriority}/100
                            </Badge>
                          )}
                          

                          
                          <Badge key="priority" variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge key="category" variant="outline">
                            {task.category}
                          </Badge>
                          <Badge key="points" variant="secondary">
                            +{task.points} XP
                          </Badge>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      
                      {task.roast && (
                        <div className="bg-secondary/20 border border-secondary/30 rounded p-2 mb-2">
                          <p className="text-sm italic text-secondary-600 dark:text-secondary-400">
                            🔥 {task.roast}
                          </p>
                        </div>
                      )}
                      
                      {/* AI Insights Panel */}
                      {task.aiInsights && (task.aiInsights.priorityReason || task.aiInsights.timeRecommendation) && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              {task.aiInsights.priorityReason && (
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                  <span className="font-medium">Priority:</span> {task.aiInsights.priorityReason}
                                </p>
                              )}
                              {task.aiInsights.timeRecommendation && (
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                  <span className="font-medium">💡 Timing:</span> {task.aiInsights.timeRecommendation}
                                </p>
                              )}
                              {task.aiScore && (
                                <div className="flex gap-3 text-xs text-purple-600 dark:text-purple-400 mt-2">
                                  <span>Urgency: {task.aiScore.urgency}/100</span>
                                  <span>Impact: {task.aiScore.importance}/100</span>
                                  <span>Time Fit: {task.aiScore.timefit}/100</span>
                                  <span>Effort: {task.aiScore.effort}/100</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          {task.startDate && task.dueDate && task.startDate === task.dueDate ? (
                            <div className="flex items-center text-sm text-purple-600">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              Same-day task: {new Date(task.startDate).toLocaleDateString()}
                              {task.startTime && task.endTime && (
                                <span className="ml-2">
                                  ({task.startTime} - {task.endTime})
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              {task.startDate && (
                                <div className="flex items-center text-sm text-blue-600">
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                  Start: {new Date(task.startDate).toLocaleDateString()}
                                  {task.startTime && (
                                    <span className="ml-2">at {task.startTime}</span>
                                  )}
                                </div>
                              )}
                              
                              {task.dueDate && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                  {task.endTime && (
                                    <span className="ml-2">by {task.endTime}</span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          
                          {(task.startTime && task.endTime) && (
                            <div className="flex items-center text-sm text-green-600">
                              <Clock className="mr-1 h-3 w-3" />
                              {task.startTime} - {task.endTime}
                              {task.calendarEventId && (
                                <CalendarIcon className="ml-2 h-3 w-3" />
                              )}
                            </div>
                          )}
                          
                          {/* Only show reminders if task has times AND reminders are set */}
                          {(task.startTime || task.endTime) && task.reminders && task.reminders.before > 0 && (
                            <div className="flex items-center text-sm text-blue-600">
                              <Bell className="mr-1 h-3 w-3" />
                              Reminder: {task.reminders.before}min before start
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          {/* Start Now button for top priority task */}
                          {index === 0 && !task.completed && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigate to Focus mode with this task
                                window.location.href = '/focus';
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white mr-2"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Start Now
                            </Button>
                          )}
                          
                          <DemoRestrictedButton
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditTask(task);
                            }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </DemoRestrictedButton>
                          <DemoRestrictedButton
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </DemoRestrictedButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredTasks.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground">
                    {tasks.length === 0 
                      ? "Add your first task to get started!" 
                      : "Try adjusting your filters or add new tasks."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(value) => setEditingTask({...editingTask, priority: value as Task['priority']})}
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select 
                    value={editingTask.category} 
                    onValueChange={(value) => setEditingTask({...editingTask, category: value as Task['category']})}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingTask.startDate || ''}
                    onChange={(e) => setEditingTask({...editingTask, startDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-dueDate" className="text-sm font-medium">
                    Due Date
                  </label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-startTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={editingTask.startTime || ''}
                    onChange={(e) => setEditingTask({...editingTask, startTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-endTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Time
                  </label>
                  <Input
                    id="edit-endTime"
                    type="time"
                    value={editingTask.endTime || ''}
                    onChange={(e) => setEditingTask({...editingTask, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Same Day Task Indicator for Edit */}
              {editingTask.startDate && editingTask.dueDate && editingTask.startDate === editingTask.dueDate && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Same-day task: Make sure end time is after start time
                  </span>
                </div>
              )}
              
              {/* Reminder Settings */}
              {(editingTask.startTime || editingTask.endTime) && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Notification Reminders
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Before Start</label>
                      <Select 
                        value={editingTask.reminders?.before?.toString() || "0"}
                        onValueChange={(value) => setEditingTask({
                          ...editingTask, 
                          reminders: {
                            before: parseInt(value),
                            after: editingTask.reminders?.after ?? 0
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No reminder</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="1440">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">After End</label>
                      <Select 
                        value={editingTask.reminders?.after?.toString() || "0"}
                        onValueChange={(value) => setEditingTask({
                          ...editingTask, 
                          reminders: {
                            before: editingTask.reminders?.before ?? 0,
                            after: parseInt(value)
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No reminder</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isDaily"
                  checked={editingTask.isDaily || false}
                  onCheckedChange={(checked) => setEditingTask({...editingTask, isDaily: !!checked})}
                />
                <label htmlFor="edit-isDaily" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Daily recurring task
                </label>
              </div>

              {/* Google Calendar Integration for Edit */}
              <div className="space-y-2">
                {editingTask.calendarEventId && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Currently synced with Google Calendar
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-addToCalendar"
                    checked={editAddToCalendar}
                    onCheckedChange={(checked) => setEditAddToCalendar(checked === true)}
                  />
                  <label htmlFor="edit-addToCalendar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                    {editingTask.calendarEventId ? "Update Google Calendar event" : "Add to Google Calendar"}
                    {!editingTask.startTime || !editingTask.endTime || !editingTask.startDate ? (
                      <span className="text-xs text-muted-foreground">(Requires start date and time)</span>
                    ) : null}
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="button" onClick={saveEditTask} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default Tasks
