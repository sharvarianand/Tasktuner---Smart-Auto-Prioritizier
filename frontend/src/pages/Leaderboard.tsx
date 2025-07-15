
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Star,
  Users,
  TrendingUp,
  Award,
  Zap,
  Target
} from "lucide-react"

interface LeaderboardUser {
  id: number
  name: string
  avatar?: string
  xp: number
  streak: number
  tasksCompleted: number
  rank: number
  change: 'up' | 'down' | 'same'
  badge?: string
}

const Leaderboard = () => {
  const globalLeaderboard: LeaderboardUser[] = [
    {
      id: 1,
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40",
      xp: 4250,
      streak: 28,
      tasksCompleted: 185,
      rank: 1,
      change: 'same',
      badge: "Productivity King 👑"
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      xp: 3890,
      streak: 21,
      tasksCompleted: 167,
      rank: 2,
      change: 'up',
      badge: "Streak Master 🔥"
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      xp: 3650,
      streak: 15,
      tasksCompleted: 145,
      rank: 3,
      change: 'down',
      badge: "Task Crusher 💪"
    },
    {
      id: 4,
      name: "Emma Davis",
      avatar: "/api/placeholder/40/40",
      xp: 3420,
      streak: 19,
      tasksCompleted: 134,
      rank: 4,
      change: 'up',
      badge: "Goal Getter 🎯"
    },
    {
      id: 5,
      name: "You",
      avatar: "/api/placeholder/40/40",
      xp: 2340,
      streak: 8,
      tasksCompleted: 89,
      rank: 12,
      change: 'up',
      badge: "Rising Star ⭐"
    }
  ]

  const friendsLeaderboard: LeaderboardUser[] = [
    {
      id: 1,
      name: "Jessica Park",
      avatar: "/api/placeholder/40/40",
      xp: 2850,
      streak: 12,
      tasksCompleted: 95,
      rank: 1,
      change: 'same'
    },
    {
      id: 2,
      name: "You",
      avatar: "/api/placeholder/40/40",
      xp: 2340,
      streak: 8,
      tasksCompleted: 89,
      rank: 2,
      change: 'up'
    },
    {
      id: 3,
      name: "David Kim",
      avatar: "/api/placeholder/40/40",
      xp: 1950,
      streak: 5,
      tasksCompleted: 67,
      rank: 3,
      change: 'down'
    }
  ]

  const achievements = [
    {
      title: "First Week",
      description: "Complete 7 consecutive days",
      icon: Flame,
      earned: true,
      rarity: "common"
    },
    {
      title: "Century Club",
      description: "Complete 100 tasks",
      icon: Target,
      earned: false,
      rarity: "rare"
    },
    {
      title: "Early Bird",
      description: "Complete task before 6 AM",
      icon: Star,
      earned: true,
      rarity: "uncommon"
    },
    {
      title: "Perfectionist",
      description: "100% completion rate for a week",
      icon: Award,
      earned: false,
      rarity: "legendary"
    }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />
      default: return <span className="text-sm font-bold">#{rank}</span>
    }
  }

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default: return null
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'uncommon': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'legendary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout title="Leaderboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2">Productivity Champions</h2>
          <p className="text-muted-foreground">
            See how you stack up against other productivity warriors
          </p>
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white/20">
                    <AvatarImage src="/api/placeholder/64/64" />
                    <AvatarFallback>YU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">Your Rank: #12</h3>
                    <p className="text-white/80">Rising Star ⭐</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+3 positions this week</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">2,340</div>
                  <div className="text-white/80">Total XP</div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div>
                      <div className="font-semibold">8</div>
                      <div className="text-white/80">Streak</div>
                    </div>
                    <div>
                      <div className="font-semibold">89</div>
                      <div className="text-white/80">Tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="global" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global" className="gap-2">
                <Trophy className="h-4 w-4" />
                Global
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-2">
                <Users className="h-4 w-4" />
                Friends
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Global Leaderboard</CardTitle>
                  <CardDescription>
                    Top productivity warriors from around the world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {globalLeaderboard.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                          user.name === 'You' ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.name}</h4>
                            {user.name === 'You' && <Badge>You</Badge>}
                            {getChangeIcon(user.change)}
                          </div>
                          {user.badge && (
                            <p className="text-xs text-muted-foreground">{user.badge}</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-primary">{user.xp.toLocaleString()} XP</div>
                          <div className="text-xs text-muted-foreground">
                            {user.streak} day streak • {user.tasksCompleted} tasks
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="friends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Friends Leaderboard</CardTitle>
                  <CardDescription>
                    Compete with your friends and study buddies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friendsLeaderboard.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                          user.name === 'You' ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.name}</h4>
                            {user.name === 'You' && <Badge>You</Badge>}
                            {getChangeIcon(user.change)}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-primary">{user.xp.toLocaleString()} XP</div>
                          <div className="text-xs text-muted-foreground">
                            {user.streak} day streak • {user.tasksCompleted} tasks
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Unlock badges by hitting productivity milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-lg border text-center ${
                      achievement.earned ? 
                        'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20' : 
                        'bg-muted/20 border-muted opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      achievement.earned ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-accent" />
                Weekly Challenge
              </CardTitle>
              <CardDescription>
                Complete this week's challenge to earn bonus XP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Consistency Master</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete at least 5 tasks for 7 consecutive days
                  </p>
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">Progress: 3/7 days</div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '43%' }} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">+500</div>
                  <div className="text-xs text-muted-foreground">Bonus XP</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Leaderboard
