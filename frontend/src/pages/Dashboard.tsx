import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  Plus,
  Zap,
  RefreshCw
} from "lucide-react"
import { FocusMode } from "@/components/focus-mode"
import { DemoRestrictionBanner, DemoRestrictedButton } from "@/components/demo-restriction"
import { useUser } from "@clerk/clerk-react"
import { useDemo } from "@/contexts/DemoContext"
import { useUserData } from "@/hooks/useUserData"
import { useVoiceContext } from "@/contexts/VoiceContext"

const Dashboard = () => {
  const { user } = useUser();
  const { isDemo } = useDemo();
  const { userData, isLoadingUserData, isNewUser } = useUserData();
  const { settings } = useVoiceContext();
  const navigate = useNavigate();
  
  // State for dynamic roast content
  const [currentRoast, setCurrentRoast] = useState("Still scrolling through social media instead of your tasks? Your future self is facepalming right now.");
  const [isGeneratingRoast, setIsGeneratingRoast] = useState(false);
  
  // Array of motivational roasts
  const roasts = [
    "Still scrolling through social media instead of your tasks? Your future self is facepalming right now.",
    "Your procrastination level is legendary... unfortunately, that's not a good thing!",
    "I've seen turtles move faster than your task completion rate!",
    "Your to-do list called. It's filing a missing person report!",
    "Netflix: 47 hours this week. Productivity: Still loading...",
    "You're so good at avoiding work, you should get an award... but you'd probably procrastinate accepting it!",
    "Your future self just sent a message: 'Thanks for nothing!' Stop disappointing them!",
    "Procrastination is not a time management problem, it's an emotional regulation problem. Get therapy AND get to work!",
    "You've mastered the art of being busy without being productive. Congratulations on your useless superpower!",
    "Your productivity level is so low, it's causing a drought in the motivation department!",
    "If excuses were currency, you'd be a billionaire. Too bad they're worthless!",
    "Your tasks are aging like fine wine... except nobody wants expired productivity!",
    "You've been 'starting tomorrow' for so many tomorrows that yesterday is confused!",
    "Your motivation went on vacation and forgot to send a postcard!"
  ];
  
  // Scroll to top when component mounts (especially important for demo mode)
  useEffect(() => {
    // Use instant scroll for better user experience when navigating from Try Demo
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  
  // Helper function to navigate with demo parameter when in demo mode
  const navigateWithDemo = (path: string) => {
    const url = isDemo ? `${path}?demo=true` : path;
    navigate(url);
  };
  
  // Get user's first name or fallback to username/email
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Procrastinator';

  // Function to speak roasts
  const speakRoast = (text: string) => {
    if ('speechSynthesis' in window && settings.enabled) {
      // Cancel any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Small delay to ensure cancellation completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = settings.rate || 1;
        utterance.pitch = settings.pitch || 1;
        utterance.volume = settings.volume || 0.8;
        
        // Use selected voice from settings
        const voices = window.speechSynthesis.getVoices();
        if (settings.voice && voices.length > 0) {
          const selectedVoice = voices.find(voice => voice.name === settings.voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        
        utterance.onerror = (event) => {
          console.error('Speech error:', event.error);
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Failed to start speech:', error);
        }
      }, 100);
    }
  };

  // Function to generate a new roast
  const generateNewRoast = () => {
    setIsGeneratingRoast(true);
    
    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setTimeout(() => {
      // Get a random roast that's different from the current one
      let newRoast;
      do {
        newRoast = roasts[Math.floor(Math.random() * roasts.length)];
      } while (newRoast === currentRoast && roasts.length > 1);
      
      setCurrentRoast(newRoast);
      setIsGeneratingRoast(false);
      
      // Show toast notification
      toast.info(newRoast, { duration: 5000 });
      
      // Speak the roast if voice is enabled
      if (settings.enabled) {
        setTimeout(() => speakRoast(newRoast), 200);
      }
    }, 800); // Slightly longer delay for better UX
  };

  // Dynamic stats based on user data
  const stats = [
    {
      title: "Tasks Completed",
      value: userData.stats.tasksCompleted.toString(),
      change: isNewUser ? "Start your journey!" : `+${Math.floor(userData.stats.tasksCompleted * 0.2)} from yesterday`,
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      title: "Current Streak",
      value: userData.stats.currentStreak > 0 ? `${userData.stats.currentStreak} days` : "Start today!",
      change: isNewUser ? "Build momentum!" : userData.stats.currentStreak > 10 ? "On fire! 🔥" : "Keep going!",
      icon: Flame,
      color: "text-primary"
    },
    {
      title: "XP Earned",
      value: userData.stats.xpEarned.toLocaleString(),
      change: isNewUser ? "Earn your first XP!" : `+${Math.floor(userData.stats.xpEarned * 0.1)} this week`,
      icon: Zap,
      color: "text-secondary"
    },
    {
      title: "Goals Progress",
      value: `${userData.stats.goalsProgress}%`,
      change: isNewUser ? "Set your first goal!" : userData.stats.goalsProgress > 70 ? "Almost there!" : "Keep pushing!",
      icon: Target,
      color: "text-purple-400"
    }
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6 relative z-10">
        {/* Demo Restriction Banner */}
        <DemoRestrictionBanner />
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            {isDemo ? (
              <>
                <h1 className="text-2xl font-bold mb-2">Welcome to the Demo! 👋</h1>
                <p className="text-white/90 mb-4">
                  You're in demo mode. Ready to see what TaskTuner can do for real procrastinators?
                </p>
              </>
            ) : isNewUser ? (
              <>
                <h1 className="text-2xl font-bold mb-2">Welcome to TaskTuner, {userName}! 🎉</h1>
                <p className="text-white/90 mb-4">
                  You've taken the first step! Now let's turn your procrastination into productivity.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
                <p className="text-white/90 mb-4">
                  Ready to turn your "I'll do it tomorrow" into "I did it today"?
                </p>
              </>
            )}
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-muted-foreground">Get started with your productivity journey</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <DemoRestrictedButton 
                  className="h-16 flex flex-col items-center justify-center space-y-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigateWithDemo('/tasks')}
                  glow
                  particles
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">Add Task</span>
                </DemoRestrictedButton>
                <DemoRestrictedButton 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1 border-border text-muted-foreground hover:text-card-foreground"
                  onClick={() => navigateWithDemo('/goals')}
                  glow
                >
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-medium">Set Goal</span>
                </DemoRestrictedButton>
                <DemoRestrictedButton 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1 border-border text-muted-foreground hover:text-card-foreground"
                  onClick={() => navigateWithDemo('/calendar')}
                  glow
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Schedule</span>
                </DemoRestrictedButton>
                <DemoRestrictedButton 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1 border-border text-muted-foreground hover:text-card-foreground"
                  onClick={() => navigateWithDemo('/analytics')}
                  glow
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">Analytics</span>
                </DemoRestrictedButton>
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
            <FocusMode onNavigateToFocus={() => navigateWithDemo('/focus')} isDemo={isDemo} />
            
            {/* Daily Roast with Dynamic Content */}
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Flame className="mr-2 h-4 w-4 text-primary" />
                  Daily Roast
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dynamic roast content */}
                <motion.div
                  key={currentRoast}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-sm italic text-muted-foreground mb-3">
                    "{currentRoast}"
                  </p>
                </motion.div>
                
                {/* Voice indicator */}
                <div className="flex items-center justify-between mb-3">
                  {settings.enabled && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Voice enabled - roasts will be spoken aloud
                    </div>
                  )}
                </div>
                
                {/* Generate new roast button */}
                <DemoRestrictedButton 
                  size="sm" 
                  variant="outline" 
                  className="mt-3 w-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={generateNewRoast}
                  disabled={isGeneratingRoast}
                  glow
                  particles
                >
                  {isGeneratingRoast ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Getting Fresh Roast...
                    </>
                  ) : (
                    <>
                      Get New Roast {settings.enabled ? '🔊' : ''}
                    </>
                  )}
                </DemoRestrictedButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
