'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const variantClasses = {
  primary:
    'bg-accent-purple hover:bg-accent-purple-light text-white shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40',
  secondary:
    'bg-surface hover:bg-surface-hover text-white border border-white/10 hover:border-white/20',
  ghost: 'hover:bg-surface-hover text-white/70 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  gradient:
    'bg-gradient-companion text-white shadow-lg shadow-accent-purple/25 hover:opacity-90',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  icon: 'w-9 h-9 rounded-xl flex items-center justify-center',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
