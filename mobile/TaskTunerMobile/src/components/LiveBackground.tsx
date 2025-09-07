import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'circle' | 'square' | 'triangle' | 'star';
}

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  color: string;
  opacity: number;
}

const LiveBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>();

  // Color schemes matching web app exactly
  const colorSchemes = {
    dark: {
      particles: ['#f97316', '#ea580c', '#ffffff', '#fed7aa', '#fbbf24', '#fb923c'],
      waves: ['rgba(249, 115, 22, 0.3)', 'rgba(234, 88, 12, 0.25)', 'rgba(255, 255, 255, 0.18)'],
      background: 'rgba(0, 0, 0, 0.05)'
    }
  };

  const currentColors = colorSchemes.dark; // Mobile app uses dark theme

  // Create particle matching web app
  const createParticle = (x?: number, y?: number): Particle => {
    const types: Particle['type'][] = ['circle', 'circle', 'square', 'triangle'];
    const baseOpacity = 0.6;
    const randomType = Math.floor(Math.random() * 4);
    return {
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1,
      color: currentColors.particles[Math.floor(Math.random() * currentColors.particles.length)],
      opacity: Math.random() * baseOpacity + 0.15,
      life: 0,
      maxLife: Math.random() * 200 + 150,
      type: types[randomType]
    };
  };

  // Create waves matching web app
  const createWaves = () => {
    return Array.from({ length: 4 }, (_, i) => ({
      amplitude: Math.random() * 80 + 50,
      frequency: (Math.random() * 0.006 + 0.002) * (i + 1),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.008,
      color: currentColors.waves[i % currentColors.waves.length],
      opacity: Math.random() * 0.35 + 0.25
    }));
  };

  // Animation loop matching web app
  const animate = () => {
    timeRef.current++;

    // Update particles
    setParticles(prevParticles => {
      return prevParticles
        .map(particle => {
          // Update particle
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life++;

          // Boundary bouncing
          if (particle.x <= 0 || particle.x >= width) particle.vx *= -0.8;
          if (particle.y <= 0 || particle.y >= height) particle.vy *= -0.8;

          // Keep particles in bounds
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));

          // Fade out near end of life
          if (particle.life > particle.maxLife * 0.8) {
            particle.opacity *= 0.95;
          }

          return particle;
        })
        .filter(particle => particle.life < particle.maxLife && particle.opacity > 0.01);
    });

    // Add new particles
    setParticles(prevParticles => {
      const newParticles = [...prevParticles];
      while (newParticles.length < 75) {
        newParticles.push(createParticle());
      }
      return newParticles;
    });

    // Update waves
    setWaves(prevWaves => {
      return prevWaves.map((wave, index) => ({
        ...wave,
        phase: wave.phase + wave.speed * 0.4,
        amplitude: wave.amplitude + Math.sin(timeRef.current * 0.008 + index) * 0.08
      }));
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initialize particles and waves
    setParticles(Array.from({ length: 30 }, () => createParticle()));
    setWaves(createWaves());
    
    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Base gradient background matching web app */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.6)', 'rgba(2, 6, 23, 0.8)']}
        style={styles.baseGradient}
      />

      {/* Animated particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size * 2,
              height: particle.size * 2,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              borderRadius: particle.type === 'circle' ? particle.size : 0,
            },
          ]}
        />
      ))}

      {/* Animated waves */}
      {waves.map((wave, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              opacity: wave.opacity,
              backgroundColor: wave.color,
            },
          ]}
        />
      ))}

      {/* Overlay gradient for depth */}
      <LinearGradient
        colors={['transparent', 'rgba(15, 15, 35, 0.3)', 'rgba(15, 15, 35, 0.8)']}
        style={styles.overlayGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  baseGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
  },
  wave: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default LiveBackground;