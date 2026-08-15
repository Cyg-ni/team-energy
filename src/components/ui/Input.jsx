import { cn } from '../../utils/helpers'

export function Input({
  label,
  error,
  help,
  icon: Icon,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />}
        <input
          className={cn(
            'w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {help && !error && <p className="text-sm text-slate-500 mt-1">{help}</p>}
    </div>
  )
}
