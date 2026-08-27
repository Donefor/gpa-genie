import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { SortDirection } from './useTableSort';

interface SortableHeadProps<K extends string> {
  column: K;
  active: K;
  direction: SortDirection;
  onSort: (column: K) => void;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const SortableHead = <K extends string>({
  column,
  active,
  direction,
  onSort,
  children,
  align = 'left',
  className,
}: SortableHeadProps<K>) => {
  const isActive = column === active;

  return (
    <TableHead
      className={cn(align === 'right' && 'text-right', className)}
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'group inline-flex items-center gap-1 whitespace-nowrap text-foreground',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {children}
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          )
        ) : (
          <ChevronsUpDown
            className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60"
            aria-hidden
          />
        )}
      </button>
    </TableHead>
  );
};
