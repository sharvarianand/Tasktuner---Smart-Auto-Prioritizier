
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  Plus,
  Zap
} from "lucide-react"
import { FocusMode } from "@/components/focus-mode"

const Dashboard = () => {
  const stats = [
    {
      title: "Tasks Completed",
      value: "12",
      change: "+3 from yesterday",
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      title: "Current Streak",
      value: "7 days",
      change: "Personal best!",
      icon: Flame,
      color: "text-primary"
    },
    {
      title: "XP Earned",
      value: "1,240",
      change: "+180 this week",
      icon: Zap,
      color: "text-secondary"
    },
    {
      title: "Goals Progress",
      value: "65%",
      change: "On track",
      icon: Target,
      color: "text-purple-400"
    }
  ]

  const recentTasks = [
    { id: 1, title: "Finish React project", completed: true, priority: "High", roast: "Finally! Only took you 3 days 🙄" },
    { id: 2, title: "Study for algorithms exam", completed: false, priority: "High", roast: "This isn't going to study itself, genius" },
    { id: 3, title: "Update portfolio", completed: false, priority: "Medium", roast: "Your future self will thank you... eventually" },
    { id: 4, title: "Call mom", completed: true, priority: "Low", roast: "Basic human decency achieved ✅" }
  ]

  const upcomingEvents = [
    { time: "2:00 PM", title: "Team Meeting", type: "meeting" },
    { time: "4:30 PM", title: "Gym Session", type: "personal" },
    { time: "7:00 PM", title: "Study Block", type: "academic" }
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">Welcome back, Procrastinator! 👋</h1>
            <p className="text-white/90 mb-4">
              Ready to turn your "I'll do it tomorrow" into "I did it today"?
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  Recent Tasks
                  <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-card-foreground">View All</Button>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Your latest battles with productivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-3">
                      <CheckCircle 
                        className={`h-5 w-5 ${task.completed ? 'text-green-400' : 'text-muted-foreground'}`}
                      />
                      <div>
                        <p className={`font-medium text-card-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground italic">{task.roast}</p>
                      </div>
                    </div>
                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Focus Mode */}
            <FocusMode />
            {/* Today's Schedule */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      {event.time}
                    </Badge>
                    <p className="text-sm text-card-foreground">{event.title}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3 border-border text-muted-foreground hover:text-card-foreground">
                  <Plus className="mr-2 h-3 w-3" />
                  Add Event
                </Button>
              </CardContent>
            </Card>

            {/* Goal Progress */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Target className="mr-2 h-4 w-4" />
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-card-foreground">Learn React</span>
                    <span className="text-muted-foreground">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-card-foreground">Get Fit</span>
                    <span className="text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-card-foreground">Side Project</span>
                    <span className="text-muted-foreground">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Motivation Corner */}
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Flame className="mr-2 h-4 w-4 text-primary" />
                  Daily Roast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-muted-foreground">
                  "Still scrolling through social media instead of your tasks? 
                  Your future self is facepalming right now. 🤦‍♀️"
                </p>
                <Button size="sm" variant="outline" className="mt-3 w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Get Another Roast
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
