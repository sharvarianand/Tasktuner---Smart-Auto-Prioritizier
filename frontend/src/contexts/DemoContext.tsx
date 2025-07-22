import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

interface DemoContextType {
  isDemoMode: boolean
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
      title: "Demo Mode Restriction",
      description: "Sign up to unlock all features and make changes to your dashboard!",
      duration: 3000,
    })
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, setDemoMode, showDemoRestriction }}>
      {children}
    </DemoContext.Provider>
  )
}
