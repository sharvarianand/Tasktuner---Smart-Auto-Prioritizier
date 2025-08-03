import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { toast } from '@/hooks/use-toast'

interface DemoContextType {
  isDemoMode: boolean
  isDemo: boolean // Add alias for backwards compatibility
  setDemoMode: (isDemo: boolean) => void
  showDemoRestriction: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export const useDemoMode = () => {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoProvider')
  }
  return context
}

// Add useDemo as an alias for backwards compatibility
export const useDemo = () => {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

interface DemoProviderProps {
  children: React.ReactNode
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Initialize from sessionStorage on mount
    return sessionStorage.getItem('tasktuner-demo-mode') === 'true'
  })
  const [searchParams] = useSearchParams()
  const { isSignedIn, isLoaded } = useAuth()

  // Clear demo mode when user signs up/signs in
  useEffect(() => {
    if (isLoaded && isSignedIn && isDemoMode) {
      console.log('User signed in, clearing demo mode')
      setIsDemoMode(false)
      sessionStorage.removeItem('tasktuner-demo-mode')
      
      // Show welcome message only for first-time users (not when navigating)
      const hasShownWelcome = sessionStorage.getItem('tasktuner-welcome-shown')
      if (!hasShownWelcome) {
        sessionStorage.setItem('tasktuner-welcome-shown', 'true')
        toast({
          title: "🎉 Welcome to TaskTuner!",
          description: "Demo mode disabled. You now have full access to all features!",
          duration: 5000,
        })
      }
    }
  }, [isSignedIn, isLoaded, isDemoMode])

  // Also clear demo mode from URL params when authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn && searchParams.get('demo') === 'true') {
      // Remove demo parameter from URL without page reload
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('demo')
      window.history.replaceState({}, '', `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`)
    }
  }, [isLoaded, isSignedIn, searchParams])

  useEffect(() => {
    // Don't enable demo mode if user is already authenticated
    if (isLoaded && isSignedIn) {
      return
    }

    // Check if demo=true is in URL parameters
    const isDemo = searchParams.get('demo') === 'true'
    if (isDemo) {
      setIsDemoMode(true)
      // Store demo state in sessionStorage to persist across navigation
      sessionStorage.setItem('tasktuner-demo-mode', 'true')
    } else if (!isDemo && !isDemoMode) {
      // Only check sessionStorage if not already in demo mode and no URL param
      const storedDemoMode = sessionStorage.getItem('tasktuner-demo-mode') === 'true'
      if (storedDemoMode) {
        setIsDemoMode(true)
      }
    }
  }, [searchParams, isLoaded, isSignedIn]) // Updated dependencies

  const setDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo)
    if (isDemo) {
      sessionStorage.setItem('tasktuner-demo-mode', 'true')
    } else {
      sessionStorage.removeItem('tasktuner-demo-mode')
    }
  }

  const showDemoRestriction = () => {
    toast({
      title: "🔒 Demo Mode Active",
      description: "You're in demo mode. Sign up to unlock all features and save your progress!",
      duration: 5000,
    })
  }

  return (
    <DemoContext.Provider value={{ 
      isDemoMode, 
      isDemo: isDemoMode, // Add alias for backwards compatibility
      setDemoMode, 
      showDemoRestriction 
    }}>
      {children}
    </DemoContext.Provider>
  )
}
