
import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Filter
} from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: number
  title: string
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  category: 'Academic' | 'Personal' | 'Work'
  completed: boolean
  dueDate?: string
  points: number
  roast?: string
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete React Project",
      description: "Build the TaskTuner frontend",
      priority: "High",
      category: "Academic",
      completed: false,
      dueDate: "2024-01-20",
      points: 50,
      roast: "Still coding at 2 AM? Your coffee addiction isn't a personality trait ☕"
    },
    {
      id: 2,
      title: "Study for Algorithms Exam",
      description: "Review sorting and searching algorithms",
      priority: "High",
      category: "Academic",
      completed: false,
      dueDate: "2024-01-22",
      points: 75,
      roast: "Procrastinating on algorithms? That's not very... efficient 🤓"
    },
    {
      id: 3,
      title: "Update Portfolio Website",
      description: "Add recent projects and testimonials",
      priority: "Medium",
      category: "Personal",
      completed: true,
      dueDate: "2024-01-15",
      points: 30,
      roast: "Finally! Your portfolio was starting to look like 2019 called 📞"
    },
    {
      id: 4,
      title: "Call Mom",
      description: "Weekly check-in call",
      priority: "Low",
      category: "Personal",
      completed: true,
      points: 10,
      roast: "Basic human decency: achieved ✅"
    }
  ])

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Task['priority'],
    category: 'Personal' as Task['category'],
    dueDate: ''
  })

  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
      dueDate: newTask.dueDate,
      points: newTask.priority === 'High' ? 50 : newTask.priority === 'Medium' ? 30 : 15,
      roast: generateRoast()
    }

    setTasks([task, ...tasks])
    setNewTask({ title: '', description: '', priority: 'Medium', category: 'Personal', dueDate: '' })
    toast.success("Task added! Now stop making excuses and do it 🔥")
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed }
        if (updated.completed) {
          toast.success(`+${task.points} XP! You're on fire! 🎉`)
        }
        return updated
      }
      return task
    }))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.success("Task deleted! Running away from your problems? 🏃‍♀️")
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

  const totalXP = tasks.filter(t => t.completed).reduce((sum, task) => sum + task.points, 0)

  return (
    <DashboardLayout title="Tasks">
      <div className="p-6 space-y-6">
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
                  <p className="text-2xl font-bold">{tasks.length}</p>
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
                  <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
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
                  <p className="text-2xl font-bold">{totalXP}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Task & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <Dialog>
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
                
                <div className="flex gap-2">
                  <Button onClick={addTask} className="flex-1">
                    Add Task
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
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
            
            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide" : "Show"} Completed
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
                    <Button
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
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
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
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
