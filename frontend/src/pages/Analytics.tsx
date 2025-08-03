
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Flame,
  Award,
  Calendar,
  Zap
} from "lucide-react"

const Analytics = () => {
  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', completed: 8, total: 10 },
    { day: 'Tue', completed: 6, total: 8 },
    { day: 'Wed', completed: 12, total: 15 },
    { day: 'Thu', completed: 9, total: 12 },
    { day: 'Fri', completed: 15, total: 18 },
    { day: 'Sat', completed: 7, total: 9 },
    { day: 'Sun', completed: 5, total: 6 },
  ]

  const streakData = [
    { date: '1/1', streak: 1 },
    { date: '1/2', streak: 2 },
    { date: '1/3', streak: 3 },
    { date: '1/4', streak: 0 },
    { date: '1/5', streak: 1 },
    { date: '1/6', streak: 2 },
    { date: '1/7', streak: 3 },
    { date: '1/8', streak: 4 },
    { date: '1/9', streak: 5 },
    { date: '1/10', streak: 6 },
    { date: '1/11', streak: 7 },
    { date: '1/12', streak: 8 },
  ]

  const priorityData = [
    { name: 'High', value: 45, color: '#ef4444' },
    { name: 'Medium', value: 35, color: '#f97316' },
    { name: 'Low', value: 20, color: '#22c55e' },
  ]

  const categoryData = [
    { category: 'Academic', tasks: 25, completed: 20 },
    { category: 'Personal', tasks: 18, completed: 15 },
    { category: 'Work', tasks: 12, completed: 10 },
    { category: 'Health', tasks: 8, completed: 6 },
  ]

  const roastStats = [
    { type: 'Motivational', count: 45 },
    { type: 'Sarcastic', count: 38 },
    { type: 'Encouraging', count: 22 },
    { type: 'Savage', count: 15 },
  ]

  const stats = [
    {
      title: "Completion Rate",
      value: "78%",
      change: "+12%",
      trend: "up",
      description: "This week vs last week",
      icon: Target
    },
    {
      title: "Current Streak",
      value: "8 days",
      change: "Personal best!",
      trend: "up", 
      description: "Consecutive active days",
      icon: Flame
    },
    {
      title: "Avg Tasks/Day",
      value: "9.2",
      change: "+1.4",
      trend: "up",
      description: "Daily task completion",
      icon: Calendar
    },
    {
      title: "Total XP",
      value: "2,340",
      change: "+480",
      trend: "up",
      description: "Experience points earned",
      icon: Zap
    }
  ]

  return (
    <DashboardLayout title="Analytics">
      <div className="p-6 space-y-6 relative z-10">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2">Your Productivity Journey</h2>
          <p className="text-muted-foreground">
            Data-driven insights into your task completion habits
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Completion Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Task Completion</CardTitle>
                <CardDescription>
                  Tasks completed vs assigned this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#e2e8f0" name="Total Tasks" />
                    <Bar dataKey="completed" fill="#f97316" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Daily Streak Progress</CardTitle>
                <CardDescription>
                  Your consistency over the past 12 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={streakData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="streak" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>
                  How you prioritize your tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {priorityData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Completion rates by category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category) => {
                  const percentage = Math.round((category.completed / category.tasks) * 100)
                  return (
                    <div key={category.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category.category}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {category.completed} of {category.tasks} tasks
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Roast Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="mr-2 h-5 w-5 text-primary" />
                  Roast Statistics
                </CardTitle>
                <CardDescription>
                  You've been roasted 120 times this month 🔥
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roastStats.map((stat) => (
                  <div key={stat.type} className="flex items-center justify-between">
                    <span className="text-sm">{stat.type}</span>
                    <Badge variant="outline">{stat.count}</Badge>
                  </div>
                ))}
                
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Latest Roast:</p>
                  <p className="text-xs italic text-muted-foreground">
                    "Still checking social media? Your tasks aren't going to complete themselves! 📱➡️📝"
                  </p>
                </div>
                
                <DemoRestrictedButton variant="outline" size="sm" className="w-full">
                  <Award className="mr-2 h-3 w-3" />
                  View All Roasts
                </DemoRestrictedButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                Milestones you've unlocked on your productivity journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Week Warrior</p>
                    <p className="text-xs text-muted-foreground">Completed 7-day streak</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Task Master</p>
                    <p className="text-xs text-muted-foreground">Completed 100 tasks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-800">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Early Bird</p>
                    <p className="text-xs text-muted-foreground">5 AM task completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics
