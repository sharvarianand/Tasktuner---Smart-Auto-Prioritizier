
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DemoRestrictionBanner, 
  DemoRestrictedButton, 
  DemoRestrictedInput, 
  DemoRestrictedTextarea 
} from "@/components/demo-restriction"
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
  Mic,
  Flame,
  Star,
  Filter,
  RefreshCw,
  Calendar,
  Sparkles,
  Brain,
  Zap,
  Edit,
  Save,
  X,
  CheckSquare
} from "lucide-react"
import { toast } from "sonner"
import { taskApi } from "@/lib/api"
import { useUser } from "@clerk/clerk-react"
import { useDemo } from "@/contexts/DemoContext"

interface Task {
  id: string
  title: string
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  category: 'Academic' | 'Personal' | 'Work'
  completed: boolean
  dueDate?: string
  points: number
  roast?: string
  isDaily?: boolean
  completedDates?: string[]
}

interface UserStats {
  tasksCompleted: number
  totalTasks: number
  currentStreak: number
  xpEarned: number
  goalsProgress: number
}

const Tasks = () => {
  const { user } = useUser()
  const { isDemo } = useDemo()
  
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
    dueDate: '',
    isDaily: false
  })

  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [isPrioritizing, setIsPrioritizing] = useState(false)
  const [lastPrioritized, setLastPrioritized] = useState<Date | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Load tasks and stats on component mount
  useEffect(() => {
    loadTasksAndStats()
  }, [])

  const loadTasksAndStats = async () => {
    try {
      setIsLoading(true)
      const [tasksData, statsData] = await Promise.all([
        taskApi.getTasks(),
        taskApi.getUserStats()
      ])
      setTasks(tasksData)
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

    try {
      const task = await taskApi.createTask(newTask)
      setTasks([task, ...tasks])
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'Medium', 
        category: 'Personal', 
        dueDate: '',
        isDaily: false
      })
      setIsDialogOpen(false)
      
      // Reload stats to get updated counts
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
      
      toast.success("Task added! Now stop making excuses and do it 🔥")
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task. Please try again.')
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const updatedTask = await taskApi.updateTask(taskId, {
        completed: !task.completed
      })
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
      
      // Reload stats to get updated XP and completion counts
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
      
      if (updatedTask.completed) {
        const points = task.points || (task.priority === 'High' ? 50 : task.priority === 'Medium' ? 30 : 15)
        toast.success(`+${points} XP! You're on fire! 🎉`)
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
      
      // Reload stats to get updated counts
      const statsData = await taskApi.getUserStats()
      setUserStats(statsData)
      
      toast.success("Task deleted! Running away from your problems? 🏃‍♀️")
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
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    })
    setIsEditDialogOpen(true)
  }

  const saveEditTask = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    try {
      const updatedTask = await taskApi.updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        category: editingTask.category,
        dueDate: editingTask.dueDate,
        isDaily: editingTask.isDaily
      })
      
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...updatedTask } : t))
      setIsEditDialogOpen(false)
      setEditingTask(null)
      
      toast.success("Task updated successfully! 📝")
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const cancelEdit = () => {
    setIsEditDialogOpen(false)
    setEditingTask(null)
  }

  // Smart Auto Prioritization function
  const smartPrioritizeTasks = async () => {
    if (tasks.length < 2) {
      toast.error("Add at least 2 tasks to use Smart Auto Prioritization!")
      return
    }

    try {
      setIsPrioritizing(true)
      toast.loading("AI is analyzing your tasks... 🧠", { id: 'prioritizing' })

      // Prepare tasks data for AI analysis
      const tasksForAI = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        completed: task.completed,
        isDaily: task.isDaily,
        points: task.points
      }))

      const response = await taskApi.prioritizeTasks(tasksForAI)
      
      if (response.prioritizedTasks && response.prioritizedTasks.length > 0) {
        // Reorder tasks based on AI prioritization
        const prioritizedOrder = response.prioritizedTasks
        const reorderedTasks = prioritizedOrder.map((prioritizedTask: any) => 
          tasks.find(task => task.id === prioritizedTask.id)
        ).filter(Boolean) as Task[]

        // Add any tasks that might have been missed
        const missingTasks = tasks.filter(task => 
          !reorderedTasks.find(reordered => reordered.id === task.id)
        )
        
        setTasks([...reorderedTasks, ...missingTasks])
        setLastPrioritized(new Date())
        
        toast.success("🎯 Tasks prioritized by AI! Check the new order.", { id: 'prioritizing' })
      } else {
        toast.error("AI prioritization failed. Try again later.", { id: 'prioritizing' })
      }
    } catch (error) {
      console.error('Error prioritizing tasks:', error)
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

          {/* AI Insights Card - Only show if tasks have been prioritized */}
          {lastPrioritized && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Prioritized</p>
                    <p className="text-2xl font-bold">{filteredTasks.length}</p>
                    <p className="text-xs text-purple-600 mt-1">Smart order active</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Add Task & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DemoRestrictedButton className="bg-primary text-primary-foreground shadow-glow hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </DemoRestrictedButton>
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to procrastinate on... I mean, accomplish!
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
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
                
                <DemoRestrictedInput
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />

                {/* Daily Task Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDaily"
                    checked={newTask.isDaily}
                    onCheckedChange={(checked) => setNewTask({...newTask, isDaily: !!checked})}
                  />
                  <label htmlFor="isDaily" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Daily recurring task
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <DemoRestrictedButton onClick={addTask} className="flex-1">
                    Add Task
                  </DemoRestrictedButton>
                  <DemoRestrictedButton variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </DemoRestrictedButton>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Smart Auto Prioritization Button */}
          {tasks.length >= 2 && (
            <div className="flex flex-col gap-2">
              <DemoRestrictedButton
                onClick={smartPrioritizeTasks}
                disabled={isPrioritizing}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              >
                {isPrioritizing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Smart Auto Prioritize
                  </>
                )}
              </DemoRestrictedButton>
              {!lastPrioritized && (
                <p className="text-xs text-muted-foreground text-center max-w-48">
                  AI analyzes deadlines, priority, and impact to reorder your tasks optimally
                </p>
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
              <Card className={`transition-all duration-200 hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <DemoRestrictedButton
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTask(task.id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </DemoRestrictedButton>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.isDaily && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              Daily
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* AI Priority Position Indicator */}
                          {lastPrioritized && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                              <Zap className="h-3 w-3 mr-1" />
                              #{index + 1} AI
                            </Badge>
                          )}
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {task.category}
                          </Badge>
                          <Badge variant="secondary">
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
                      
                      <div className="flex items-center justify-between">
                        {task.dueDate && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex gap-1">
                          <DemoRestrictedButton
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditTask(task)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </DemoRestrictedButton>
                          <DemoRestrictedButton
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
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
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
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
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="edit-dueDate"
                  type="datetime-local"
                  value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isDaily"
                  checked={editingTask.isDaily || false}
                  onCheckedChange={(checked) => setEditingTask({...editingTask, isDaily: !!checked})}
                />
                <label htmlFor="edit-isDaily" className="text-sm font-medium">
                  Daily recurring task
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEditTask}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default Tasks
