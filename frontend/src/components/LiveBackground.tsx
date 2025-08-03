import React, { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useTheme } from './theme-provider'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
  type: 'circle' | 'square' | 'triangle' | 'star'
}

interface Wave {
  amplitude: number
  frequency: number
  phase: number
  speed: number
  color: string
  opacity: number
}

const LiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const wavesRef = useRef<Wave[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const { theme } = useTheme()
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Color schemes based on theme
  const colorSchemes = {
    light: {
      particles: ['#f97316', '#ea580c', '#dc2626', '#f1f5f9', '#fed7aa', '#fbbf24'],
      waves: ['rgba(249, 115, 22, 0.2)', 'rgba(234, 88, 12, 0.15)', 'rgba(220, 38, 38, 0.12)'],
      background: 'rgba(255, 255, 255, 0.02)'
    },
    dark: {
      particles: ['#f97316', '#ea580c', '#ffffff', '#fed7aa', '#fbbf24', '#fb923c'],
      waves: ['rgba(249, 115, 22, 0.3)', 'rgba(234, 88, 12, 0.25)', 'rgba(255, 255, 255, 0.18)'],
      background: 'rgba(0, 0, 0, 0.05)'
    }
  }

  const currentColors = colorSchemes[theme === 'dark' ? 'dark' : 'light']

  // Initialize particles - optimized for faster creation
  const createParticle = (x?: number, y?: number): Particle => {
    const types: Particle['type'][] = ['circle', 'circle', 'square', 'triangle'] // More circles for better performance
    const baseOpacity = theme === 'dark' ? 0.6 : 0.3 // Reduced opacity for better performance
    const randomType = Math.floor(Math.random() * 4)
    return {
      x: x ?? Math.random() * dimensions.width,
      y: y ?? Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 1.5, // Reduced velocity for smoother animation
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1, // Smaller particles for better performance
      color: currentColors.particles[Math.floor(Math.random() * currentColors.particles.length)],
      opacity: Math.random() * baseOpacity + 0.15,
      life: 0,
      maxLife: Math.random() * 200 + 150, // Shorter lifespan
      type: types[randomType]
    }
  }

  // Initialize waves - optimized
  const createWaves = () => {
    return Array.from({ length: 4 }, (_, i) => ({ // Reduced from 5 to 4 waves
      amplitude: Math.random() * 80 + 50, // Slightly smaller amplitude
      frequency: (Math.random() * 0.006 + 0.002) * (i + 1), // Optimized frequency
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.008, // Slightly reduced speed
      color: currentColors.waves[i % currentColors.waves.length],
      opacity: Math.random() * 0.35 + 0.25 // Slightly reduced opacity
    }))
  }

  // Draw different particle shapes
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color
    ctx.strokeStyle = particle.color
    ctx.translate(particle.x, particle.y)
    
    const rotation = (particle.life * 0.1) % (Math.PI * 2)
    ctx.rotate(rotation)

    switch (particle.type) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
        ctx.fill()
        break
      
      case 'square':
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size)
        break
      
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(0, -particle.size)
        ctx.lineTo(-particle.size, particle.size)
        ctx.lineTo(particle.size, particle.size)
        ctx.closePath()
        ctx.fill()
        break
      
      case 'star':
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5
          const x = Math.cos(angle) * particle.size
          const y = Math.sin(angle) * particle.size
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
    }
    
    ctx.restore()
  }

  // Draw flowing waves - optimized
  const drawWaves = (ctx: CanvasRenderingContext2D) => {
    wavesRef.current.forEach((wave, index) => {
      ctx.save()
      ctx.globalAlpha = wave.opacity
      ctx.strokeStyle = wave.color
      ctx.lineWidth = 3 // Reduced from 4 to 3
      ctx.beginPath()
      
      // Optimized step size for better performance
      for (let x = 0; x <= dimensions.width; x += 8) { // Increased step from 5 to 8
        const y = dimensions.height / 2 + 
          Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.5 + timeRef.current * wave.speed * 1.2) * wave.amplitude * 0.25 // Reduced multiplier
        
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      
      ctx.stroke()
      ctx.restore()
      
      // Update wave properties for dynamic effect - optimized
      wave.phase += wave.speed * 0.4 // Reduced from 0.5
      wave.amplitude += Math.sin(timeRef.current * 0.008 + index) * 0.08 // Reduced fluctuation
    })
  }

  // Draw neural network connections - optimized
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current
    const maxConnections = 50 // Limit connections for better performance
    let connectionCount = 0
    ctx.save()
    
    for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
        const dx = particles[j].x - particles[i].x
        const dy = particles[j].y - particles[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 120) { // Reduced from 150 to 120
          const opacity = (120 - distance) / 120 * 0.25 // Reduced opacity
          ctx.globalAlpha = opacity
          ctx.strokeStyle = currentColors.particles[0]
          ctx.lineWidth = 0.8 // Reduced from 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
          connectionCount++
        }
      }
    }
    
    ctx.restore()
  }

  // Mouse interaction effects
  const createMouseEffects = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = mouseRef.current
    
    // Ripple effect
    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.strokeStyle = currentColors.particles[0]
    ctx.lineWidth = 2
    
    for (let i = 0; i < 3; i++) {
      const radius = (timeRef.current * 0.5 + i * 30) % 100
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    ctx.restore()
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with subtle background
    ctx.fillStyle = currentColors.background
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)

    timeRef.current++

    // Draw waves
    drawWaves(ctx)

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      // Update particle
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // Mouse attraction
      const dx = mouseRef.current.x - particle.x
      const dy = mouseRef.current.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 200) {
        const force = (200 - distance) / 200 * 0.02
        particle.vx += (dx / distance) * force
        particle.vy += (dy / distance) * force
      }

      // Boundary bouncing
      if (particle.x <= 0 || particle.x >= dimensions.width) particle.vx *= -0.8
      if (particle.y <= 0 || particle.y >= dimensions.height) particle.vy *= -0.8

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(dimensions.width, particle.x))
      particle.y = Math.max(0, Math.min(dimensions.height, particle.y))

      // Fade out near end of life
      if (particle.life > particle.maxLife * 0.8) {
        particle.opacity *= 0.95
      }

      drawParticle(ctx, particle)

      return particle.life < particle.maxLife && particle.opacity > 0.01
    })

    // Add new particles - optimized count
    while (particlesRef.current.length < 75) { // Reduced from 100 to 75
      particlesRef.current.push(createParticle())
    }

    // Draw connections
    drawConnections(ctx)

    // Draw mouse effects
    createMouseEffects(ctx)

    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      // Create particles at mouse position occasionally - reduced frequency
      if (Math.random() < 0.05) { // Reduced from 0.1 to 0.05
        particlesRef.current.push(createParticle(mouseRef.current.x, mouseRef.current.y))
      }
    }
  }

  // Handle click for burst effect
  const handleClick = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Create burst of particles - optimized count
      for (let i = 0; i < 12; i++) { // Reduced from 20 to 12
        const angle = (Math.PI * 2 * i) / 12
        const speed = Math.random() * 4 + 2 // Slightly reduced speed
        const particle = createParticle(x, y)
        particle.vx = Math.cos(angle) * speed
        particle.vy = Math.sin(angle) * speed
        particle.size *= 1.3 // Reduced from 1.5
        particlesRef.current.push(particle)
      }
    }
  }

  // Setup and cleanup
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      // Initialize particles and waves - optimized initial count
      particlesRef.current = Array.from({ length: 30 }, () => createParticle()) // Reduced from 50
      wavesRef.current = createWaves()
      
      // Start animation
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, theme])

  return (
    <motion.canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // Reduced from 2 seconds to 1 second
      style={{
        background: theme === 'dark' 
          ? 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.8) 100%)' // Reduced opacity
          : 'radial-gradient(ellipse at center, rgba(248, 250, 252, 0.2) 0%, rgba(241, 245, 249, 0.4) 100%)' // Reduced opacity
      }}
    />
  )
}

export default LiveBackground
