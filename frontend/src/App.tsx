
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DemoProvider } from "@/contexts/DemoContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ClerkProvider } from "@clerk/clerk-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Focus from "./pages/Focus";
import Calendar from "./pages/Calendar";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Roast from "./pages/Roast";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk publishable key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="tasktuner-theme">
        <NotificationProvider>
          <VoiceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <DemoProvider>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/roast" element={<Roast />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Dashboard />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Tasks />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/focus" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Focus />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Calendar />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Goals />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Analytics />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Leaderboard />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Settings />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Notifications />
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </DemoProvider>
          </BrowserRouter>
        </TooltipProvider>
        </VoiceProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
