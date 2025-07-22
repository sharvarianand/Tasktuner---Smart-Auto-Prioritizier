import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus } from "lucide-react";

interface AuthButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showSignUp?: boolean;
  className?: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

const AuthButton = ({ 
  variant = "default", 
  size = "default", 
  showSignUp = false,
  className = "",
  buttonText = "Get Started",
  icon
}: AuthButtonProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </Button>
    );
  }

  // Show user button if signed in
  if (isSignedIn && user) {
    return (
      <div className="flex items-center space-x-2">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-card border-border",
              userButtonPopoverActions: "bg-card",
              userButtonPopoverActionButton: "text-card-foreground hover:bg-accent",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>
    );
  }

  // Show sign in/up buttons if not signed in
  if (showSignUp) {
    return (
      <div className="flex items-center space-x-2">
        <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
          <Button variant="ghost" size={size} className={className}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/onboarding" fallbackRedirectUrl="/onboarding">
          <Button variant={variant} size={size} className={className}>
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal" forceRedirectUrl="/onboarding" fallbackRedirectUrl="/dashboard">
      <Button variant={variant} size={size} className={className}>
        {icon || <User className="w-4 h-4 mr-2" />}
        {buttonText}
      </Button>
    </SignInButton>
  );
};

export default AuthButton;
