import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame, Zap, Target, Clock, RefreshCw } from "lucide-react";
import AuthButton from "@/components/AuthButton";

const roasts = [
  {
    id: 1,
    message: "Still scrolling social media instead of being productive? Time to get your act together!",
    severity: "mild",
    icon: Clock
  },
  {
    id: 2,
    message: "Your to-do list is longer than a CVS receipt. Maybe it's time to actually DO something about it?",
    severity: "medium",
    icon: Target
  },
  {
    id: 3,
    message: "You've been 'planning to start tomorrow' for 47 tomorrows. Today IS tomorrow!",
    severity: "spicy",
    icon: Flame
  },
  {
    id: 4,
    message: "Your procrastination skills are Olympic-level. Too bad they don't give medals for that.",
    severity: "brutal",
    icon: Zap
  },
  {
    id: 5,
    message: "You know what's harder than starting? Explaining why you didn't start. Again.",
    severity: "medium",
    icon: Target
  },
  {
    id: 6,
    message: "Your future self called. They're disappointed but not surprised.",
    severity: "spicy",
    icon: Flame
  }
];

const RoastGenerator = () => {
  const [currentRoast, setCurrentRoast] = useState(roasts[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateNewRoast = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setCurrentRoast(randomRoast);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(generateNewRoast, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "spicy": return "bg-orange-100 text-orange-800 border-orange-200";
      case "brutal": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "mild": return "🧊 Mild";
      case "medium": return "🌶️ Medium";
      case "spicy": return "🔥 Spicy";
      case "brutal": return "💀 Brutal";
      default: return "Roast";
    }
  };

  const IconComponent = currentRoast.icon;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        key={currentRoast.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: isAnimating ? 0.5 : 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getSeverityColor(currentRoast.severity)} font-medium`}
            >
              {getSeverityLabel(currentRoast.severity)}
            </Badge>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <blockquote className="text-xl font-medium text-card-foreground leading-relaxed">
              "{currentRoast.message}"
            </blockquote>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="outline"
                onClick={generateNewRoast}
                disabled={isAnimating}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                Get Another Roast
              </Button>
              
              <AuthButton 
                buttonText="Start Being Productive"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                icon={<Zap className="w-4 h-4 mr-2" />}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Ready to turn that roast into real results? Sign up to access the full TaskTuner experience!
        </p>
      </div>
    </div>
  );
};

export default RoastGenerator;
