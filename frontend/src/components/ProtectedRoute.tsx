import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useDemo } from "@/contexts/DemoContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isDemo, setDemoMode } = useDemo();
  const [searchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Clear demo mode if user is authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn && isDemo) {
      console.log('Authenticated user detected, clearing demo mode in ProtectedRoute')
      setDemoMode(false)
    }
  }, [isLoaded, isSignedIn, isDemo, setDemoMode])

  // Give demo context time to initialize from URL params
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100); // Small delay to allow demo context to process URL params

    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute state:', {
      isLoaded,
      isSignedIn,
      isDemo,
      isInitialized,
      demoParam: searchParams.get('demo'),
      sessionDemo: sessionStorage.getItem('tasktuner-demo-mode')
    });
  }, [isLoaded, isSignedIn, isDemo, isInitialized, searchParams]);

  // Show loading while Clerk is initializing or demo context is initializing
  if (!isLoaded || !isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TaskTuner...</p>
        </div>
      </div>
    );
  }

  // Check for demo parameter in URL as backup
  const isDemoFromUrl = searchParams.get('demo') === 'true';
  const isDemoFromSession = sessionStorage.getItem('tasktuner-demo-mode') === 'true';
  
  // Allow demo access without authentication
  if (isDemo || isDemoFromUrl || isDemoFromSession) {
    console.log('Allowing demo access');
    return <>{children}</>;
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    console.log('Redirecting to sign-in');
    return <RedirectToSignIn afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />;
  }

  console.log('Allowing authenticated access');
  return <>{children}</>;
};

export default ProtectedRoute;
