import { cn } from '../../utils/helpers'
import { getInitials } from '../../utils/helpers'

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name || 'User')}</span>
      )}
    </div>
  )
}

export function Loader({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        className={cn(
          'animate-spin text-blue-600',
          sizes[size],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'bg-slate-200 rounded-lg animate-pulse',
        className
      )}
    />
  )
}

export function Alert({
  variant = 'info',
  title,
  description,
  onClose,
  className,
}) {
  const variants = {
    info: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  }

  return (
    <div
      className={cn(
        'border-l-4 p-4 rounded-lg mb-4 flex items-start justify-between',
        variants[variant],
        className
      )}
    >
      <div>
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        {description && <p className="text-sm">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4',
        className
      )}
    >
      {Icon && (
        <div className="text-slate-300 mb-4">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 text-center mb-6 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}

export function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  className,
}) {
  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 pl-10 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}
