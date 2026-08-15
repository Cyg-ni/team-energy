import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Button } from '../ui/Button'
import { cn } from '../../utils/helpers'

export function Table({
  columns,
  data,
  className,
  rowClassName,
  onRowClick,
  loading = false,
  empty = null,
}) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-200', className)}>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <div className="flex justify-center">
                  <svg
                    className="animate-spin text-blue-600 w-8 h-8"
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
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                {empty || (
                  <p className="text-slate-500">No data available</p>
                )}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  'border-b border-slate-200 hover:bg-slate-50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  rowClassName
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={`${idx}-${column.key}`}
                    className="px-6 py-4 text-sm text-slate-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) {
  const pages = []
  const delta = 1

  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    pages.push(i)
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft size={16} />
        </Button>

        {pages[0] > 1 && (
          <>
            <Button
              variant={1 === currentPage ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {pages[0] > 2 && (
              <span className="px-2 py-2 text-slate-600">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-slate-600">...</span>
            )}
            <Button
              variant={totalPages === currentPage ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
