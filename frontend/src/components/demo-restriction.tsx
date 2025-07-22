import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Info, Lock } from 'lucide-react'
import { useDemoMode } from '@/contexts/DemoContext'
import { useNavigate } from 'react-router-dom'

export const DemoRestrictionBanner: React.FC = () => {
  const { isDemoMode } = useDemoMode()
  const navigate = useNavigate()

  if (!isDemoMode) return null

  return (
    <Card className="border-primary/20 bg-primary/5 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Demo Mode</h3>
              <p className="text-sm text-muted-foreground">
                You're viewing a preview. Sign up to unlock all features and save your progress.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sign Up Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface DemoRestrictedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export const DemoRestrictedButton: React.FC<DemoRestrictedButtonProps> = ({
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  ...props
}) => {
  const { isDemoMode, showDemoRestriction } = useDemoMode()

  const handleClick = () => {
    if (isDemoMode) {
      showDemoRestriction()
      return
    }
    onClick?.()
  }

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
      disabled={disabled || isDemoMode}
      {...props}
    >
      {isDemoMode && <Lock className="h-4 w-4 mr-2" />}
      {children}
    </Button>
  )
}

interface DemoRestrictedInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  type?: string
  disabled?: boolean
}

export const DemoRestrictedInput: React.FC<DemoRestrictedInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
  disabled = false,
  ...props
}) => {
  const { isDemoMode, showDemoRestriction } = useDemoMode()

  const handleFocus = () => {
    if (isDemoMode) {
      showDemoRestriction()
    }
  }

  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      type={type}
      disabled={disabled || isDemoMode}
      onFocus={handleFocus}
      {...props}
    />
  )
}

interface DemoRestrictedTextareaProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const DemoRestrictedTextarea: React.FC<DemoRestrictedTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  ...props
}) => {
  const { isDemoMode, showDemoRestriction } = useDemoMode()

  const handleFocus = () => {
    if (isDemoMode) {
      showDemoRestriction()
    }
  }

  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled || isDemoMode}
      onFocus={handleFocus}
      {...props}
    />
  )
}

interface DemoRestrictedSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export const DemoRestrictedSwitch: React.FC<DemoRestrictedSwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  ...props
}) => {
  const { isDemoMode, showDemoRestriction } = useDemoMode()

  const handleCheckedChange = (newChecked: boolean) => {
    if (isDemoMode) {
      showDemoRestriction()
      return
    }
    onCheckedChange?.(newChecked)
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled || isDemoMode}
      {...props}
    />
  )
}
