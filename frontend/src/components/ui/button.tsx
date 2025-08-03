import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl hover:shadow-primary/25 transform hover:scale-[1.02] active:scale-[0.98] border border-primary/20",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/80 shadow-lg hover:shadow-xl hover:shadow-destructive/25 transform hover:scale-[1.02] active:scale-[0.98] border border-destructive/20",
        outline:
          "border border-input bg-gradient-to-r from-background/50 to-muted/30 backdrop-blur-sm hover:from-accent/50 hover:to-accent-foreground/10 hover:text-accent-foreground shadow-md hover:shadow-lg hover:shadow-accent/20 transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 shadow-lg hover:shadow-xl hover:shadow-secondary/25 transform hover:scale-[1.02] active:scale-[0.98] border border-secondary/20",
        ghost: "hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/10 hover:text-accent-foreground backdrop-blur-sm hover:shadow-md hover:shadow-accent/10 transform hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transform hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  glow?: boolean
  particles?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, glow = true, particles = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const buttonContent = (
      <>
        {/* Animated glow background */}
        {glow && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
              style={{
                animation: 'gradientShift 3s ease-in-out infinite'
              }}
            />
          </div>
        )}

        {/* Particle effects */}
        {particles && variant !== 'ghost' && variant !== 'link' && (
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animation: `float 2s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* 3D border highlight */}
        <div className="absolute inset-0 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </>
    )

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Slot>
      )
    }

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ display: 'inline-block' }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          style={{
            transformStyle: 'preserve-3d',
            filter: variant !== 'ghost' && variant !== 'link' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : undefined
          }}
          {...props}
        >
          {buttonContent}
        </Comp>
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
