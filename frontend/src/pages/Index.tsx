
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/clerk-react"
import { 
  Zap, 
  Calendar, 
  Brain, 
  Trophy, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Target,
  BarChart3,
  Clock,
  Github,
  Twitter,
  Instagram,
  ChevronDown
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"
import AuthButton from "@/components/AuthButton"
import RoastGenerator from "@/components/RoastGenerator"
import Logo3D from "@/components/Logo3D"
import InteractiveLogo3D from "@/components/InteractiveLogo3D"
import LiveBackground from "@/components/LiveBackground"
import { useDemoMode } from "@/contexts/DemoContext"

const Index = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const { setDemoMode } = useDemoMode()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleTryDemo = () => {
    setDemoMode(true)
    navigate('/dashboard?demo=true')
  }

  const handleLogoAction = (action: string) => {
    switch (action) {
      case 'roast':
        navigate('/roast')
        break
      case 'tasks':
        navigate('/tasks')
        break
      case 'focus':
        navigate('/focus')
        break
      case 'analytics':
        navigate('/analytics')
        break
      default:
        break
    }
  }

  const features = [
    {
      icon: Brain,
      title: "AI Roast Generator",
      description: "Get brutally honest feedback on your procrastination habits"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Auto-sync with Google Calendar and optimize your time blocks"
    },
    {
      icon: Target,
      title: "Goal Breakdown",
      description: "Turn massive goals into bite-sized, achievable tasks"
    },
    {
      icon: Clock,
      title: "Focus Mode",
      description: "Pomodoro timer with AI-powered break suggestions and distraction blocking"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn XP, build streaks, and compete with friends"
    }
  ]

  const testimonials = [
    {
      quote: "TaskTuner roasted me so hard I actually started doing my assignments 😭",
      author: "Priya, College Student",
      rating: 5
    },
    {
      quote: "Finally, an app that doesn't sugarcoat my productivity issues",  
      author: "Rohit, Developer",
      rating: 5
    },
    {
      quote: "The AI coach is savage but it WORKS. 10/10 would get roasted again",
      author: "Arjun, Entrepreneur", 
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen relative">
      <LiveBackground />
      
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo3D 
            size="md" 
            variant="navbar" 
            animated={true} 
            showText={true}
          />
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => scrollToSection('features')} className="text-foreground hover:text-primary" glow>
              Features
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('roast')} className="text-foreground hover:text-primary" glow>
              Get Roasted
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('testimonials')} className="text-foreground hover:text-primary" glow>
              Testimonials
            </Button>
            <ThemeToggle />
            {!isSignedIn && (
              <Button variant="ghost" onClick={handleTryDemo} className="text-foreground hover:text-primary" glow>
                Try Demo
              </Button>
            )}
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 min-h-screen flex items-center z-10">
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-primary/10">
              🔥 Where Procrastination Dies Screaming
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-lg">
              Welcome to{" "}
              <span className="text-primary drop-shadow-lg">TaskTuner!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto drop-shadow-md">
              The savage AI productivity coach that schedules your tasks, 
              syncs your calendar, and roasts your excuses into oblivion.
            </p>

            {/* Hero 3D Logo Display */}
            <motion.div
              className="w-full max-w-2xl mx-auto h-80 bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-border/50 shadow-2xl relative overflow-hidden"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(251,146,60,0.1),transparent)]" />
              
              {/* Main 3D Interactive Logo */}
              <div className="relative z-10">
                <InteractiveLogo3D 
                  size="xl" 
                  variant="hero" 
                  showText={false}
                  onActionClick={handleLogoAction}
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-8 left-8 opacity-60"
                animate={{ 
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-purple-400" />
              </motion.div>

              <motion.div
                className="absolute top-12 right-12 opacity-60"
                animate={{ 
                  rotate: [360, 0],
                  y: [-10, 10, -10]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Zap className="w-6 h-6 text-yellow-400" />
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-12 opacity-60"
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              >
                <Target className="w-7 h-7 text-green-400" />
              </motion.div>

              <motion.div
                className="absolute bottom-12 right-8 opacity-60"
                animate={{ 
                  x: [-5, 5, -5],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <Trophy className="w-6 h-6 text-orange-400" />
              </motion.div>

              {/* Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-pulse" />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!isSignedIn && (
                <AuthButton 
                  className="px-8 py-3 text-lg font-semibold rounded-xl"
                  buttonText="Start Getting Roasted"
                  size="lg"
                />
              )}
              <Button
                variant="outline"
                onClick={() => scrollToSection('features')}
                className="px-8 py-3 text-lg rounded-xl"
                size="lg"
                glow
                particles
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-12 flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground drop-shadow-lg">
              Features That Actually <span className="text-primary">Work</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-lg">
              Stop lying to yourself about "tomorrow." Start today with tools that call out your BS.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group-hover:glow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.slice(3).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group-hover:glow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roast Generator Section */}
      <section id="roast" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground drop-shadow-lg">
              Get Your <span className="text-primary">Free Roast</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-lg">
              Experience TaskTuner's savage AI coach. No signup required - just pure, unfiltered motivation.
            </p>
          </motion.div>

          <RoastGenerator />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              What People Are <span className="text-primary">Saying</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from real procrastinators (just like you)
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-lg mb-4 text-card-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="text-sm text-muted-foreground">
                      — {testimonial.author}
                    </cite>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden z-10">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 drop-shadow-lg">
              How Did That Roast Feel?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto drop-shadow-lg">
              If you're ready to turn that brutal honesty into real productivity, join thousands who finally got their act together.
            </p>
            {!isSignedIn && (
              <AuthButton 
                size="lg" 
                variant="default"
                className="bg-background text-foreground hover:bg-background/90"
                buttonText="Start Your Transformation"
                icon={<CheckCircle className="ml-2 h-4 w-4" />}
                glow
                particles
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-card-foreground">TaskTuner</span>
                <span className="text-xs text-muted-foreground">Savage Productivity</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground" glow>
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground" glow>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground" glow>
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
