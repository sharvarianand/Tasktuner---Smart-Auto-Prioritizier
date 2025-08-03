import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Rocket, Star } from 'lucide-react'
import Logo3D from './Logo3D'

interface InteractiveLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'sidebar' | 'hero'
  showText?: boolean
  onActionClick?: (action: string) => void
}

const InteractiveLogo3D: React.FC<InteractiveLogo3DProps> = ({
  size = 'xl',
  variant = 'hero',
  showText = false,
  onActionClick
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const actions = [
    { 
      id: 'roast', 
      icon: Sparkles, 
      label: 'Get Roasted', 
      color: 'bg-gradient-to-r from-pink-500 to-red-500',
      delay: 0 
    },
    { 
      id: 'tasks', 
      icon: Zap, 
      label: 'Smart Tasks', 
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      delay: 0.1 
    },
    { 
      id: 'focus', 
      icon: Rocket, 
      label: 'Focus Mode', 
      color: 'bg-gradient-to-r from-green-500 to-blue-500',
      delay: 0.2 
    },
    { 
      id: 'analytics', 
      icon: Star, 
      label: 'Analytics', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      delay: 0.3 
    }
  ]

  const handleLogoClick = () => {
    setShowActions(!showActions)
  }

  const handleActionClick = (actionId: string) => {
    setShowActions(false)
    if (onActionClick) {
      onActionClick(actionId)
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Main Logo */}
      <motion.div
        className="relative z-10 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleLogoClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Logo3D
          size={size}
          variant={variant}
          showText={showText}
          animated={true}
        />
        
        {/* Click indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <div className="px-2 py-1 bg-black/80 text-white text-xs rounded-full whitespace-nowrap">
                Click for actions
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {showActions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowActions(false)}
            />

            {/* Action Buttons Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 pointer-events-none"
            >
              {actions.map((action, index) => {
                const angle = (index * 90) - 45 // Start from top-right, go clockwise
                const radius = 120
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <motion.div
                    key={action.id}
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: x,
                      y: y
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: action.delay
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <Button
                      onClick={() => handleActionClick(action.id)}
                      className={`
                        w-16 h-16 rounded-full ${action.color} text-white shadow-2xl
                        hover:scale-110 transition-all duration-200
                        flex items-center justify-center group relative
                      `}
                      title={action.label}
                    >
                      <action.icon className="w-6 h-6" />
                      
                      {/* Label on hover */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                          {action.label}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Close button */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <Button
                onClick={() => setShowActions(false)}
                variant="ghost"
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              >
                ×
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pulse effect when actions are shown */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [1, 2, 3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-2 border-primary/30 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveLogo3D
