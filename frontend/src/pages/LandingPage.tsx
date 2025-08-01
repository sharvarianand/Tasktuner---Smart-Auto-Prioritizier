
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

const Index = () => {
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">TaskTuner</span>
              <span className="text-xs text-muted-foreground">Savage Productivity</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => scrollToSection('features')} className="text-foreground hover:text-primary">
              Features
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('roast')} className="text-foreground hover:text-primary">
              Get Roasted
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection('testimonials')} className="text-foreground hover:text-primary">
              Testimonials
            </Button>
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/dashboard?demo=true')} className="text-foreground hover:text-primary">
              Try Demo
            </Button>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-primary/10">
              🔥 Where Procrastination Dies Screaming
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Welcome to{" "}
              <span className="text-primary">TaskTuner!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The savage AI productivity coach that schedules your tasks, 
              syncs your calendar, and roasts your excuses into oblivion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <AuthButton 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                buttonText="Start Getting Roasted"
                icon={<ArrowRight className="ml-2 h-4 w-4" />}
              />
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border text-foreground hover:bg-card"
                onClick={() => scrollToSection('roast')}
              >
                Try a Free Roast First
              </Button>
            </div>

            {/* Hero Illustration */}
            <motion.div
              className="w-full max-w-2xl mx-auto h-64 bg-card rounded-2xl flex items-center justify-center border border-border"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-6xl">🔥📋</div>
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
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Features That Actually <span className="text-primary">Work</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              >
                <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors duration-300">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
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
              >
                <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors duration-300">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
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
      <section id="roast" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Get Your <span className="text-primary">Free Roast</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience TaskTuner's savage AI coach. No signup required - just pure, unfiltered motivation.
            </p>
          </motion.div>

          <RoastGenerator />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
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
      <section className="py-20 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              How Did That Roast Feel?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              If you're ready to turn that brutal honesty into real productivity, join thousands who finally got their act together.
            </p>
            <AuthButton 
              size="lg" 
              variant="default"
              className="bg-background text-foreground hover:bg-background/90"
              buttonText="Start Your Transformation"
              icon={<CheckCircle className="ml-2 h-4 w-4" />}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card">
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
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-card-foreground">
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