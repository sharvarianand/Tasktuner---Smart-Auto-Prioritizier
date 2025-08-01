
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
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-secondary/10 text-sidebar-foreground hover:text-sidebar-foreground"

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} bg-sidebar border-r border-sidebar-border`} collapsible="icon">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="/Tasktuner_logo.png" alt="TaskTuner Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-sidebar-foreground">TaskTuner</h2>
              <p className="text-xs text-sidebar-foreground/60">Savage Productivity</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl overflow-hidden mx-auto">
            <img src="/Tasktuner_logo.png" alt="TaskTuner Logo" className="w-full h-full object-cover" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
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
                      to={item.url} 
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
