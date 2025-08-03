
import { Calendar, CheckSquare, Target, BarChart3, Trophy, Settings, Bell, Home, Timer } from "lucide-react"
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
  useSidebar,
} from "@/components/ui/sidebar"
import Logo3D from "@/components/Logo3D"
import { useDemo } from "@/contexts/DemoContext"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Focus Mode", url: "/focus", icon: Timer },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { isDemo } = useDemo()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

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
    </Sidebar>
  )
}
