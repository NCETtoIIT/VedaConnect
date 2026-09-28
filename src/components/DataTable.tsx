import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, onRowClick, rowKey, emptyMessage = 'No data found.' }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-semibold text-ink-mute uppercase tracking-wider whitespace-nowrap',
                  col.sortable && 'cursor-pointer hover:text-ink select-none',
                  col.className
                )}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="flex flex-col">
                      <ChevronUp className={clsx('w-3 h-3', sortKey === col.key && sortDir === 'asc' ? 'text-brand' : 'text-gray-300')} />
                      <ChevronDown className={clsx('w-3 h-3 -mt-1', sortKey === col.key && sortDir === 'desc' ? 'text-brand' : 'text-gray-300')} />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-ink-mute">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map(row => (
              <tr
                key={rowKey(row)}
                className={clsx(
                  'bg-white hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={String(col.key)} className={clsx('px-4 py-3 whitespace-nowrap', col.className)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
