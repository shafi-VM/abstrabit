import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 hover:from-amber-600 hover:to-yellow-700 active:from-amber-700 active:to-yellow-800 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 font-semibold',
      outline: 'border border-amber-500/30 bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:border-amber-500/50 active:bg-slate-600/50 shadow-md',
      destructive: 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 active:from-rose-700 active:to-red-800 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
