import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TaskTuner...</p>
        </div>
      </div>
    );
  }

  // Allow demo access without authentication
  if (isDemo) {
    return <>{children}</>;
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
