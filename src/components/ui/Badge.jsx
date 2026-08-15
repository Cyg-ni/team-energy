import { cn } from '../../utils/helpers'

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    slate: 'bg-slate-100 text-slate-800',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium rounded-md',
    md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
    lg: 'px-4 py-2 text-base font-medium rounded-lg',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
