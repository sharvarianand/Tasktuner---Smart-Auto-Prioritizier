import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AuthButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showSignUp?: boolean;
  className?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  glow?: boolean;
  particles?: boolean;
}

const AuthButton = ({ 
  variant = "default", 
  size = "default", 
  showSignUp = false,
  className = "",
  buttonText = "Get Started",
  icon,
  glow = false,
  particles = false
}: AuthButtonProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <motion.div 
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </Button>
    );
  }

  // Show user button if signed in
  if (isSignedIn && user) {
    return (
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 shadow-lg ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300",
                userButtonPopoverCard: "bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl",
                userButtonPopoverActions: "bg-card/50",
                userButtonPopoverActionButton: "text-card-foreground hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/10 transition-all duration-200",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
          {/* Glow effect around avatar */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
        </motion.div>
      </motion.div>
    );
  }

  // Show sign in/up buttons if not signed in
  if (showSignUp) {
    return (
      <div className="flex items-center space-x-2">
        <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
          <Button variant="ghost" size={size} className={className} glow={glow} particles={particles}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/onboarding" fallbackRedirectUrl="/onboarding">
          <Button variant={variant} size={size} className={className} glow={glow} particles={particles}>
            <UserPlus className="w-4 h-4 mr-2" />
            <span>Sign Up</span>
            <Sparkles className="w-3 h-3 ml-1 opacity-75" />
          </Button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal" forceRedirectUrl="/onboarding" fallbackRedirectUrl="/dashboard">
      <Button variant={variant} size={size} className={className} glow={glow} particles={particles}>
        {icon || <User className="w-4 h-4 mr-2" />}
        <span>{buttonText}</span>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: 1
          }}
        >
          <Sparkles className="w-3 h-3 ml-2 opacity-75" />
        </motion.div>
      </Button>
    </SignInButton>
  );
};

export default AuthButton;
