
import { Bell, Search, User, Volume2, VolumeX, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { useUser, UserButton } from "@clerk/clerk-react"
import LiveBackground from "@/components/LiveBackground"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [notifications] = useState(3)
  const { user } = useUser()

  return (
    <div className="min-h-screen flex w-full">
      <LiveBackground />
      <div className="relative z-10">
        <AppSidebar />
      </div>
      
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Navigation */}
        <header className="h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-foreground hover:text-primary relative z-30" />
            {title && (
              <h1 className="text-2xl font-bold text-foreground drop-shadow-sm relative z-30 select-none">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center space-x-4 relative z-30">
            {/* Search */}
            <div className="relative z-30">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-30" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-64 bg-background border-border text-foreground placeholder:text-muted-foreground relative z-30"
              />
            </div>

            {/* Voice Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`${voiceEnabled ? "text-primary" : "text-muted-foreground"} hover:text-foreground relative z-30`}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary z-30">
              <Bell className="h-4 w-4" />
            </Button>

            <ThemeToggle />

            {/* User Menu with Clerk */}
            <div className="flex items-center space-x-2 relative z-30">
              {user && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.firstName || user.username || 'User'}
                </span>
              )}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-popover border-border",
                    userButtonPopoverActions: "bg-popover",
                    userButtonPopoverActionButton: "text-popover-foreground hover:bg-accent",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
