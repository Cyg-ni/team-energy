import { cn } from '../../utils/helpers'

export function Card({
  children,
  className,
  header,
  footer,
  onClick,
  hoverable = false,
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden transition-all duration-200',
        hoverable && 'hover:shadow-medium hover:border-slate-300 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-200">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-slate-900">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          {footer}
        </div>
      )}
    </div>
  )
}
