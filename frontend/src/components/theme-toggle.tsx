
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="relative group overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
            style={{
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          >
            {/* Animated glow background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(251,146,60,0.2), rgba(59,130,246,0.2))',
                  'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))',
                  'linear-gradient(225deg, rgba(147,51,234,0.2), rgba(251,146,60,0.2))',
                  'linear-gradient(315deg, rgba(251,146,60,0.2), rgba(59,130,246,0.2))',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Sun icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                scale: theme === 'light' ? 1 : 0
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500 drop-shadow-lg" />
            </motion.div>

            {/* Moon icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: [360, 0],
                scale: theme === 'dark' ? 1 : 0
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            >
              <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400 drop-shadow-lg" />
            </motion.div>

            {/* System icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: theme === 'system' ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Monitor className="h-[1.2rem] w-[1.2rem] text-purple-400 drop-shadow-lg" />
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/60 rounded-full"
                  style={{
                    left: `${20 + i * 25}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end"
        className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className="hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 cursor-pointer"
          >
            <Sun className="h-4 w-4 mr-2 text-orange-500" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 cursor-pointer"
          >
            <Moon className="h-4 w-4 mr-2 text-blue-400" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 cursor-pointer"
          >
            <Monitor className="h-4 w-4 mr-2 text-purple-400" />
            System
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
