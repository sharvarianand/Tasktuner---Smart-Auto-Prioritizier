
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DemoProvider } from "@/contexts/DemoContext";
import Index from "./pages/Index";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="tasktuner-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DemoProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <SidebarProvider>
                <Dashboard />
              </SidebarProvider>
            } />
            <Route path="/tasks" element={
              <SidebarProvider>
                <Tasks />
              </SidebarProvider>
            } />
            <Route path="/focus" element={
              <SidebarProvider>
                <Focus />
              </SidebarProvider>
            } />
            <Route path="/calendar" element={
              <SidebarProvider>
                <Calendar />
              </SidebarProvider>
            } />
            <Route path="/goals" element={
              <SidebarProvider>
                <Goals />
              </SidebarProvider>
            } />
            <Route path="/analytics" element={
              <SidebarProvider>
                <Analytics />
              </SidebarProvider>
            } />
            <Route path="/leaderboard" element={
              <SidebarProvider>
                <Leaderboard />
              </SidebarProvider>
            } />
            <Route path="/settings" element={
              <SidebarProvider>
                <Settings />
              </SidebarProvider>
            } />
            <Route path="/notifications" element={
              <SidebarProvider>
                <Notifications />
              </SidebarProvider>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </DemoProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
