
import { Calendar, CheckSquare, Target, BarChart3, Trophy, Settings, Home, Timer, User } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo3D from "@/components/Logo3D"

import { useDemo } from "@/contexts/DemoContext"
import { useUser } from "@clerk/clerk-react"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Focus Mode", url: "/focus", icon: Timer },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { isDemo } = useDemo()
  const { user } = useUser()
  const location = useLocation()
  
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  // Get user's name and initials
  const userName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
  const userInitials = user?.firstName?.charAt(0).toUpperCase() + (user?.lastName?.charAt(0).toUpperCase() || user?.username?.charAt(1).toUpperCase() || 'U')

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-secondary/10 text-sidebar-foreground hover:text-sidebar-foreground"

  // Helper function to add demo parameter to URLs when in demo mode
  const getUrl = (baseUrl: string) => {
    return isDemo ? `${baseUrl}?demo=true` : baseUrl
  }

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} bg-sidebar/80 backdrop-blur-sm border-r border-sidebar-border`} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {!isCollapsed && (
              <Logo3D 
                size="md" 
                variant="sidebar" 
                animated={true} 
                showText={true}
              />
            )}
            {isCollapsed && (
              <Logo3D 
                size="sm" 
                variant="sidebar" 
                animated={true} 
                showText={false}
              />
            )}
          </div>

        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar/80 backdrop-blur-sm">
        <SidebarGroup>
          <SidebarGroupLabel className={`${isCollapsed ? "sr-only" : ""} text-sidebar-foreground/60`}>
            Main Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={getUrl(item.url)} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar/80 backdrop-blur-sm p-4">
        {!isCollapsed && user && (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={userName} />
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userName}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        )}
        {isCollapsed && user && (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={userName} />
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        {isDemo && (
          <div className="flex items-center justify-center">
            <div className="text-xs text-sidebar-foreground/60 text-center">
              Demo Mode
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
