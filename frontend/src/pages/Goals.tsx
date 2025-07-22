
import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Zap,
  Brain,
  Trophy,
  Clock
} from "lucide-react"
import { toast } from "sonner"

interface Goal {
  id: number
  title: string
  description: string
  targetDate: string
  progress: number
  category: string
  subtasks: string[]
  totalTasks: number
  completedTasks: number
  priority: 'High' | 'Medium' | 'Low'
  status: 'active' | 'completed' | 'paused'
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Master React Development",
      description: "Become proficient in React, Next.js, and modern frontend development",
      targetDate: "2024-06-01",
      progress: 75,
      category: "Learning",
      subtasks: [
        "Complete React fundamentals course",
        "Build 3 portfolio projects", 
        "Learn Next.js framework",
        "Master state management"
      ],
      totalTasks: 12,
      completedTasks: 9,
      priority: "High",
      status: "active"
    },
    {
      id: 2,
      title: "Get into Top Tier University",
      description: "Prepare for and ace the entrance exams for computer science program",
      targetDate: "2024-08-15",
      progress: 45,
      category: "Academic",
      subtasks: [
        "Complete math syllabus",
        "Practice coding problems daily",
        "Take mock tests weekly",
        "Improve English scores"
      ],
      totalTasks: 20,
      completedTasks: 9,
      priority: "High", 
      status: "active"
    },
    {
      id: 3,
      title: "Build Fitness Habit",
      description: "Establish a consistent workout routine and improve overall health",
      targetDate: "2024-04-01",
      progress: 60,
      category: "Health",
      subtasks: [
        "Join gym membership",
        "Create workout schedule",
        "Track daily nutrition", 
        "Run 5k without stopping"
      ],
      totalTasks: 8,
      completedTasks: 5,
      priority: "Medium",
      status: "active"
    }
  ])

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    priority: 'Medium' as Goal['priority']
  })

  const addGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error("Goal title is required!")
      return
    }

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      progress: 0,
      category: newGoal.category,
      subtasks: [],
      totalTasks: 0,
      completedTasks: 0,
      priority: newGoal.priority,
      status: 'active'
    }

    setGoals([goal, ...goals])
    setNewGoal({ title: '', description: '', targetDate: '', category: '', priority: 'Medium' })
    toast.success("Goal added! Now let's break it down into tasks 🎯")
  }

  const breakDownGoal = (goalId: number) => {
    toast.success("AI is analyzing your goal... Breaking it down into actionable tasks! 🧠")
    // This would call the backend AI service to break down the goal
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'paused': return 'outline'
      default: return 'default'
    }
  }

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <DashboardLayout title="Goals">
      <div className="p-6 space-y-6">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{goals.filter(g => g.status === 'completed').length}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{goals.reduce((sum, g) => sum + g.totalTasks, 0)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Goal Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-bold">Your Goals</h2>
            <p className="text-muted-foreground">Turn your dreams into actionable plans</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a meaningful goal and let AI help you achieve it
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Input
                  placeholder="Goal title (e.g., Learn Machine Learning)"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
                
                <Textarea
                  placeholder="Describe your goal in detail..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Category (e.g., Learning, Health)"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  />
                  
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
                
                <Button onClick={addGoal} className="w-full">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Goals List */}
        <div className="grid gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{goal.title}</CardTitle>
                        <Badge variant={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {goal.description}
                      </CardDescription>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{goal.progress}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{goal.completedTasks} / {goal.totalTasks} tasks</span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>
                  
                  {/* Goal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{getDaysUntilTarget(goal.targetDate)} days left</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                  </div>
                  
                  {/* Subtasks Preview */}
                  {goal.subtasks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Key Milestones:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {goal.subtasks.slice(0, 4).map((subtask, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{subtask}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => breakDownGoal(goal.id)}
                      className="gap-2"
                    >
                      <Brain className="h-3 w-3" />
                      Break Down with AI
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Zap className="h-3 w-3" />
                      Create Tasks
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <TrendingUp className="h-3 w-3" />
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {goals.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first goal and let AI help you achieve it!
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Your First Goal</Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Goals
