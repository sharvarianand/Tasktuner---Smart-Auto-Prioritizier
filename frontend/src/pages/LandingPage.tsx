import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
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
  Github,
  Twitter,
  Mic,
  Users,
  Smartphone,
  ChevronDown
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Auto-Prioritization",
      description: "Smart algorithms analyze task urgency, impact, and context to automatically rank your tasks for maximum productivity"
    },
    {
      icon: Mic,
      title: "Voice & Text Input",
      description: "Natural language processing converts your voice or text into organized, prioritized tasks with deadline detection"
    },
    {
      icon: Calendar,
      title: "Google Calendar Integration", 
      description: "Seamlessly sync with your calendar and auto-schedule tasks in optimal time slots for balanced execution"
    },
    {
      icon: Target,
      title: "Goal-Based Task Generation",
      description: "Define high-level goals and watch AI break them down into actionable subtasks with smart timelines"
    },
    {
      icon: Zap,
      title: "Savage Motivation System",
      description: "GenZ-style roasts and humor that call out procrastination and keep you motivated to actually finish tasks"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn XP, maintain streaks, unlock achievements, and compete with friends for maximum engagement"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Tech Startup",
      content: "TaskTuner's roast engine is hilarious but effective. I've never been more motivated to finish my tasks!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "Product Manager",
      company: "Fortune 500",
      content: "The AI prioritization is incredibly accurate. It knows which tasks matter most before I do.",
      rating: 5
    },
    {
      name: "Emily Park",
      role: "Graduate Student", 
      company: "MIT",
      content: "Voice input + smart scheduling = game changer. I can capture tasks while walking to class.",
      rating: 5
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Tasks Completed" }, 
    { number: "95%", label: "Productivity Increase" },
    { number: "4.9/5", label: "User Rating" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center startup-glow">
                <CheckCircle className="text-primary-foreground h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">TaskTuner</h2>
                <p className="text-xs text-muted-foreground">Savage Productivity</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Reviews</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm" onClick={() => navigate('/dashboard')}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              🚀 The AI-Powered Productivity Revolution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskTuner
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The AI-powered productivity app that <span className="text-primary font-semibold">roasts you into action</span>
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Smart auto-prioritization meets savage motivation. Let AI organize your chaos while GenZ humor keeps you accountable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-lg px-8 py-4 startup-glow" onClick={() => navigate('/dashboard')}>
                Start Being Productive <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
              ⚡ Features That Actually Work
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why TaskTuner is <span className="text-primary">Different</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We built the productivity app we wish existed. No fluff, just results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card hover:startup-glow transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              💬 Real Users, Real Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What People Are <span className="text-primary">Saying</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full professional-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-primary">Tune Your Tasks</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of professionals who've already transformed their productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4 startup-glow" onClick={() => navigate('/dashboard')}>
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">TaskTuner</h3>
                <p className="text-xs text-muted-foreground">Savage Productivity</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <p className="text-sm text-muted-foreground">
                © 2025 TaskTuner. Made with ❤️ and a lot of sass.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
