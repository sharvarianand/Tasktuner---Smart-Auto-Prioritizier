import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const userName = user?.firstName || user?.username || 'Productivity Champion';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to TaskTuner, {userName}! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You've successfully joined the ranks of reformed procrastinators. 
            Let's get you started on your productivity transformation!
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-primary-foreground/90 mb-6 text-lg">
                Your procrastination ends today. Your productivity journey starts now.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="bg-background text-foreground hover:bg-background/90"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground text-lg mb-4">
            "The best time to plant a tree was 20 years ago. The second best time is now."
          </p>
          <p className="text-primary font-semibold">
            Let's start tuning your productivity today! 🔥
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
