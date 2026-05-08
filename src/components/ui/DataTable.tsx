import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyFn: (row: T) => string
  onRowClick?: (row: T) => void
  emptyState?: ReactNode
}

export function DataTable<T>({ columns, data, keyFn, onRowClick, emptyState }: DataTableProps<T>) {
  if (data.length === 0 && emptyState) return <>{emptyState}</>

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          color: 'var(--text)',
        }}
        role="table"
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--bdr)',
                  background: 'var(--surface)',
                  whiteSpace: 'nowrap',
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyFn(row)}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--bdr)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => {
                if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.background = ''
              }}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(row)}
              role={onRowClick ? 'button' : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{ padding: '13px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
