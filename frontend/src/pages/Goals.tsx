
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  DemoRestrictionBanner, 
  DemoRestrictedButton, 
  DemoRestrictedInput, 
  DemoRestrictedTextarea 
} from "@/components/demo-restriction"
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
  Brain,
  Trophy,
  Clock,
  Loader2,
  Trash2,
  Edit
} from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/clerk-react"
import { useDemoMode } from "@/contexts/DemoContext"
import { goalApi } from "@/lib/api"
import notificationService from "@/services/notificationService"

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  category: string
  subtasks: string[]
  totalTasks: number
  completedTasks: number
  completedSubtasks?: number[]
  priority: 'High' | 'Medium' | 'Low'
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
}

const Goals = () => {
  const { user } = useUser()
  const { isDemo } = useDemoMode()
  
  // Get user's name for personalization
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Goal Crusher'
  
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isBreakingDown, setIsBreakingDown] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    avgProgress: 0,
    totalTasks: 0
  })

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    priority: 'Medium' as Goal['priority']
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load goals on component mount
  useEffect(() => {
    loadGoals()
    loadStats()
  }, [])

  const loadGoals = async () => {
    try {
      setIsLoading(true)
      const goalsData = await goalApi.getGoals()
      setGoals(goalsData || [])
    } catch (error) {
      console.error('Failed to load goals:', error)
      toast.error(`Failed to load goals: ${error.message}`)
      setGoals([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await goalApi.getGoalStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const addGoal = async () => {
    if (!newGoal.title.trim()) {
      toast.error("Goal title is required!")
      return
    }

    try {
      setIsCreating(true)
      
      const createdGoal = await goalApi.createGoal({
        title: newGoal.title,
        description: newGoal.description,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        priority: newGoal.priority
      })

      // Refresh the goals list to ensure we have the latest data from the server
      await loadGoals()
      await loadStats()
      
      // Reset form and close dialog
      setNewGoal({ title: '', description: '', targetDate: '', category: '', priority: 'Medium' })
      setIsDialogOpen(false)
      
      notificationService.showGoalRoast(newGoal.title, 'created')
    } catch (error) {
      console.error('Failed to create goal:', error)
      toast.error(`Failed to create goal: ${error.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  const breakDownGoal = async (goalId: string) => {
    try {
      setIsBreakingDown(goalId)
      toast.success("🧠 AI is analyzing your goal description and generating specific, actionable tasks...")
      
      const result = await goalApi.breakDownGoal(goalId)
      
      // Refresh the goals list to ensure we have the latest data from the server
      await loadGoals()
      await loadStats()
      
      // Find the goal to get its title
      const goal = goals.find(g => g.id === goalId)
      if (goal) {
        notificationService.showGoalRoast(goal.title, 'broken_down')
      }
    } catch (error) {
      console.error('Failed to break down goal:', error)
      toast.error(`Failed to break down goal with AI: ${error.message}`)
    } finally {
      setIsBreakingDown(null)
    }
  }


  const deleteGoal = async (goalId: string) => {
    try {
      await goalApi.deleteGoal(goalId)
      
      // Refresh the goals list to ensure we have the latest data from the server
      await loadGoals()
      await loadStats()
      
      toast.success("Goal deleted successfully")
    } catch (error) {
      console.error('Failed to delete goal:', error)
      toast.error(`Failed to delete goal: ${error.message}`)
    }
  }

  const markGoalComplete = async (goalId: string) => {
    try {
      await goalApi.updateGoal(goalId, { status: 'completed', progress: 100 })
      
      // Refresh the goals list to ensure we have the latest data from the server
      await loadGoals()
      await loadStats()
      
      // Find the goal to get its title
      const goal = goals.find(g => g.id === goalId)
      if (goal) {
        notificationService.showGoalRoast(goal.title, 'completed')
      }
    } catch (error) {
      console.error('Failed to mark goal as complete:', error)
      toast.error(`Failed to mark goal as complete: ${error.message}`)
    }
  }

  const toggleSubtask = async (goalId: string, subtaskIndex: number) => {
    try {
      const goal = goals.find(g => g.id === goalId)
      if (!goal) return

      const currentCompleted = goal.completedSubtasks || []
      const isCompleted = currentCompleted.includes(subtaskIndex)
      
      let newCompleted: number[]
      if (isCompleted) {
        // Remove from completed list
        newCompleted = currentCompleted.filter(idx => idx !== subtaskIndex)
      } else {
        // Add to completed list
        newCompleted = [...currentCompleted, subtaskIndex]
      }

      // Calculate new progress
      const newProgress = Math.round((newCompleted.length / goal.subtasks.length) * 100)
      const newCompletedTasks = newCompleted.length

      await goalApi.updateGoal(goalId, { 
        completedSubtasks: newCompleted,
        completedTasks: newCompletedTasks,
        progress: newProgress
      })
      
      // Refresh the goals list
      await loadGoals()
      await loadStats()
      
      if (isCompleted) {
        toast.info("Task marked as incomplete")
      } else {
        notificationService.showCompletionRoast(goal.subtasks[subtaskIndex], 10)
      }
    } catch (error) {
      console.error('Failed to toggle subtask:', error)
      toast.error(`Failed to update task: ${error.message}`)
    }
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
    
    // Handle past dates gracefully
    if (diffDays < 0) {
      return 0 // Show 0 days left for overdue goals
    }
    return diffDays
  }

  return (
    <DashboardLayout title="Goals">
      <div className="p-6 space-y-6 relative z-10">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Personalized Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isDemo ? "Goal Setting Demo" : `${userName}'s Goals Dashboard`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isDemo 
                  ? "Explore powerful goal-setting and tracking features"
                  : goals.length > 0 
                    ? `Track your progress across ${goals.length} goals and turn dreams into achievements`
                    : "Ready to set your first goal? Let's turn your aspirations into action plans!"
                }
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{stats.activeGoals}</p>
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
                  <p className="text-2xl font-bold">{stats.completedGoals}</p>
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
                  <p className="text-2xl font-bold">{stats.avgProgress}%</p>
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
                  <p className="text-2xl font-bold">{stats.totalTasks}</p>
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
            <button 
              onClick={loadGoals}
              className="text-sm text-blue-500 hover:text-blue-700 mt-2"
            >
              🔄 Refresh Goals
            </button>
          </div>
          
          {goals.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DemoRestrictedButton 
                  className="bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </DemoRestrictedButton>
              </DialogTrigger>
            </Dialog>
          )}
        </motion.div>


        {/* Goals List */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading goals...</span>
            </div>
          ) : goals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first goal and let AI help you achieve it!
                  </p>
                  <DemoRestrictedButton 
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Add Your First Goal
                  </DemoRestrictedButton>
                </div>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal, index) => (
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
                    {goal.targetDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {goal.targetDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{getDaysUntilTarget(goal.targetDate)} days left</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                  </div>
                  
                  {/* Subtasks */}
                  {goal.subtasks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Key Milestones:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {goal.subtasks.map((subtask, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <button
                              onClick={() => toggleSubtask(goal.id, idx)}
                              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded transition-colors"
                            >
                              {goal.completedSubtasks && goal.completedSubtasks.includes(idx) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <div className="h-3 w-3 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                              )}
                              <span className={goal.completedSubtasks && goal.completedSubtasks.includes(idx) ? 'line-through text-gray-500' : ''}>
                                {subtask}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {/* Show Break Down button only if no subtasks exist */}
                    {goal.subtasks.length === 0 ? (
                      <DemoRestrictedButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => breakDownGoal(goal.id)}
                        className="gap-2"
                        disabled={isBreakingDown === goal.id}
                      >
                        {isBreakingDown === goal.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Brain className="h-3 w-3" />
                        )}
                        {isBreakingDown === goal.id ? 'AI Analyzing...' : 'Break Down with AI'}
                      </DemoRestrictedButton>
                    ) : (
                      /* Show Mark as Complete button if subtasks exist */
                      <DemoRestrictedButton 
                        variant="default" 
                        size="sm"
                        onClick={() => markGoalComplete(goal.id)}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Mark as Completed
                      </DemoRestrictedButton>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </div>

        {/* Goal Creation Dialog - Shared between both buttons */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a meaningful goal and let AI help you achieve it
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <DemoRestrictedInput
                placeholder="Goal title (e.g., Learn Machine Learning)"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
              
              <DemoRestrictedTextarea
                placeholder="Describe your goal in detail..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <DemoRestrictedInput
                  placeholder="Category (e.g., Learning, Health)"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                />
                
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as Goal['priority']})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              
              <DemoRestrictedInput
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              />
              
              <DemoRestrictedButton 
                onClick={addGoal} 
                className="w-full"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Goal...
                  </>
                ) : (
                  'Create Goal'
                )}
              </DemoRestrictedButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default Goals
