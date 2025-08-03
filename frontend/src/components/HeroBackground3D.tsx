import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Target, Brain, Trophy, Flame, Star, Rocket } from 'lucide-react'

const HeroBackground3D: React.FC = () => {
  const floatingElements = [
    { Icon: Brain, color: 'text-purple-400', size: 'w-8 h-8', delay: 0 },
    { Icon: Zap, color: 'text-yellow-400', size: 'w-6 h-6', delay: 0.5 },
    { Icon: Target, color: 'text-green-400', size: 'w-7 h-7', delay: 1 },
    { Icon: Trophy, color: 'text-orange-400', size: 'w-6 h-6', delay: 1.5 },
    { Icon: Flame, color: 'text-red-400', size: 'w-5 h-5', delay: 2 },
    { Icon: Star, color: 'text-pink-400', size: 'w-6 h-6', delay: 2.5 },
    { Icon: Rocket, color: 'text-blue-400', size: 'w-7 h-7', delay: 3 },
    { Icon: Sparkles, color: 'text-cyan-400', size: 'w-5 h-5', delay: 3.5 },
  ]

  const particleElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(147,51,234,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(251,146,60,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(236,72,153,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(34,197,94,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(147,51,234,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Icons */}
      {floatingElements.map(({ Icon, color, size, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} ${size} opacity-20`}
          style={{
            left: `${10 + (index % 4) * 25}%`,
            top: `${20 + Math.floor(index / 4) * 30}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      ))}

      {/* Animated Particles */}
      {particleElements.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-purple-500/20 rounded-full"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 border border-orange-500/20"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        animate={{
          rotate: [360, 0],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-lg"
        animate={{
          rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Ripple Effects */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-40 h-40 border border-cyan-500/10 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-60 h-60 border border-green-500/10 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
          ease: "easeOut"
        }}
      />

      {/* Glow Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-3 h-3 bg-purple-400/60 rounded-full blur-sm"
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-orange-400/60 rounded-full blur-sm"
        animate={{
          x: [30, -30, 30],
          y: [20, -20, 20],
          scale: [0.8, 1.8, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

export default HeroBackground3D
