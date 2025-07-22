
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { taskApi } from "@/lib/api"

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
        <div className="p-6 space-y-6">
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
      <div className="p-6 space-y-6">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
        </motion.div>

        {/* Add Task & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to procrastinate on... I mean, accomplish!
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                
                <Textarea
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
                
                <Input
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
    </DashboardLayout>
  )
}

export default Tasks
