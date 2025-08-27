import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "bg-primary text-primary-foreground hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98]",
        glass: "glass hover:bg-surface/90 text-foreground border-accent/30 hover:border-accent/60 hover-lift",
        hero: "bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98]",
        outline: "border border-accent/50 bg-transparent hover:bg-accent/10 text-foreground hover:border-accent",
        ghost: "hover:bg-accent/10 text-foreground hover:text-accent-foreground"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg font-semibold"
      }
    },
    defaultVariants: {
      variant: "gold",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PremiumButton.displayName = "PremiumButton"

export { PremiumButton, buttonVariants }