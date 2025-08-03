import React, { useRef, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Zap, Target, Brain, Sparkles, Flame } from 'lucide-react'

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showText?: boolean
  variant?: 'primary' | 'sidebar' | 'hero' | 'navbar'
  onClick?: () => void
  className?: string
}

const Logo3D: React.FC<Logo3DProps> = ({ 
  size = 'md', 
  animated = true, 
  showText = true, 
  variant = 'primary',
  onClick,
  className = ''
}) => {
  const ref = useRef(null)
  const controls = useAnimation()
  const inView = useInView(ref, { once: true })

  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-lg' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xl' },
    xl: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-3xl' }
  }

  const variants = {
    primary: 'from-orange-500 via-orange-400 to-white',
    sidebar: 'from-orange-500 via-orange-400 to-white', 
    hero: 'from-orange-500 via-orange-400 to-white',
    navbar: 'from-orange-500 via-orange-400 to-white'
  }

  useEffect(() => {
    if (inView && animated) {
      controls.start({ opacity: 1, scale: 1, rotateY: 0 })
    }
  }, [controls, inView, animated])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
      animate={animated ? controls : { opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-center gap-3 group cursor-pointer ${className}`}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      onClick={onClick}
      whileHover={animated && variant !== 'navbar' ? {
        scale: 1.05,
        rotateY: 5,
        rotateX: 2
      } : {}}
    >
      {/* 3D Logo Container */}
      <motion.div
        className={`${sizes[size].container} relative`}
        animate={animated ? (variant === 'navbar' ? {
          y: [-2, 2, -2], // More visible floating for navbar
          rotateY: [0, 15, 0, -15, 0], // More visible Y rotation for navbar
          rotateX: [0, 5, 0, -5, 0], // More visible tilt
        } : {
          y: [-2, 2, -2],
          rotateY: [0, 360], // Full rotation for non-navbar
          rotateX: [0, 10, 0, -10, 0],
        }) : {}}
        transition={animated ? (variant === 'navbar' ? {
          duration: 4, // Faster, more visible animation for navbar
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
        } : {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.25, 0.5, 0.75, 1]
        }) : {}}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main Logo Background with Gradient */}
        <motion.div
          className={`w-full h-full rounded-full bg-gradient-to-br ${variants[variant]} shadow-2xl relative overflow-hidden`}
          style={{
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
            boxShadow: '0 0 30px rgba(249, 115, 22, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)'
          }}
          animate={animated ? (variant === 'navbar' ? {
            rotateZ: [0, 30, 0, -30, 0], // More visible rotation for navbar
          } : {
            rotateZ: [0, 360], // Full rotation for other variants
          }) : {}}
          transition={animated ? (variant === 'navbar' ? {
            duration: 5, // Moderate speed for navbar
            repeat: Infinity,
            ease: "easeInOut"
          } : {
            duration: 12, // Full rotation for others
            repeat: Infinity,
            ease: "linear"
          }) : {}}
          whileHover={animated ? { 
            scale: 1.15, 
            rotateY: 25, 
            rotateX: 15,
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))'
          } : {}}
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent"
            animate={animated ? {
              opacity: [0.2, 0.4, 0.2],
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Central Icon with Target Rings */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-white/30"
              animate={animated ? {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotateZ: [0, -360], // Counter-clockwise rotation
              } : {}}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                delay: 0.5,
                ease: "linear"
              }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-2 rounded-full border border-white/40"
              animate={animated ? {
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4],
                rotateZ: [0, 360], // Clockwise rotation
              } : {}}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: 0.7,
                ease: "linear"
              }}
            />
            
            {/* Central Target Icon */}
            <motion.div
              animate={animated ? (variant === 'navbar' ? {
                rotateZ: [0, 45, 0, -45, 0], // More visible rotation for navbar
                scale: [1, 1.1, 1], // Subtle scale for navbar
              } : {
                rotateZ: [0, 360], // Full rotation for others
                scale: [1, 1.1, 1],
              }) : {}}
              transition={animated ? (variant === 'navbar' ? {
                duration: 4, // Faster for navbar
                repeat: Infinity,
                ease: "easeInOut"
              } : {
                duration: 8, // Full rotation for others
                repeat: Infinity,
                ease: "linear"
              }) : {}}
            >
              <Target className={`${sizes[size].icon} text-white drop-shadow-lg z-10 relative`} />
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={animated ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
              rotateY: [0, 360],
              rotateZ: [0, 180, 360],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.2,
              ease: "linear"
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Sparkles className="w-3 h-3 text-white opacity-80" />
          </motion.div>

          <motion.div
            className="absolute -bottom-1 -left-1"
            animate={animated ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
              rotateX: [0, 360],
              rotateZ: [360, 0],
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 1,
              ease: "linear"
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Zap className="w-3 h-3 text-orange-200 opacity-70" />
          </motion.div>

          <motion.div
            className="absolute -top-1 -left-1"
            animate={animated ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
              rotateY: [360, 0],
              rotateZ: [0, 360],
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: 0.5,
              ease: "linear"
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Brain className="w-2 h-2 text-white opacity-60" />
          </motion.div>

          <motion.div
            className="absolute -bottom-1 -right-1"
            animate={animated ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
              rotateZ: [0, 360],
              rotateX: [0, 180, 360],
            } : {}}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: 1.5,
              ease: "linear"
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Flame className="w-2 h-2 text-orange-400 opacity-60" />
          </motion.div>

          {/* 3D Edge Highlight */}
          <div className="absolute inset-0 rounded-full border border-white/20 shadow-inner" />
          
          {/* Glow Effect */}
          <motion.div
            className="absolute -inset-1 rounded-full opacity-30 blur-md bg-gradient-to-br from-orange-500 via-orange-400 to-white"
            animate={animated ? {
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Text Logo */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.span
            className={`font-bold text-orange-500 dark:text-white ${sizes[size].text}`}
            whileHover={animated && variant !== 'navbar' ? { 
              scale: 1.05
            } : {}}
            transition={{ duration: 0.2 }}
            animate={variant === 'navbar' ? {} : {}} // No animation for navbar text
          >
            TaskTuner
          </motion.span>
          {size !== 'sm' && (
            <motion.span
              className="text-xs text-muted-foreground/80 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Smart Productivity
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Particle Effects for Hero Variant */}
      {variant === 'hero' && animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Logo3D
