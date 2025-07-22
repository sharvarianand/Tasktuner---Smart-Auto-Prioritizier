import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check if demo=true is in URL parameters
    const isDemo = searchParams.get('demo') === 'true'
    setIsDemoMode(isDemo)
  }, [searchParams])

  const setDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo)
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
