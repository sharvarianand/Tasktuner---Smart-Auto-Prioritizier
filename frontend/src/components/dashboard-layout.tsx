
import { Bell, Search, User, Volume2, VolumeX, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { useUser, UserButton } from "@clerk/clerk-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [notifications] = useState(3)
  const { user } = useUser()

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-foreground hover:text-primary" />
            {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-64 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Voice Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`${voiceEnabled ? "text-primary" : "text-muted-foreground"} hover:text-foreground`}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            <ThemeToggle />

            {/* User Menu with Clerk */}
            <div className="flex items-center space-x-2">
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
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
