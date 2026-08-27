import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export type Accessors<T> = Record<string, (item: T) => string | number | null>;

/**
 * Column sorting for a table. Nulls always sink to the bottom, whichever way
 * the column is pointed, so "no data" never masquerades as a lowest value.
 */
export const useTableSort = <T, A extends Accessors<T>>(
  accessors: A,
  initialKey: keyof A & string,
  initialDirection: SortDirection = 'asc',
) => {
  const [key, setKey] = useState<keyof A & string>(initialKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const toggle = useCallback((next: keyof A & string) => {
    setKey((currentKey) => {
      if (currentKey === next) {
        setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      } else {
        setDirection('asc');
      }
      return next;
    });
  }, []);

  const sort = useCallback(
    (items: T[]): T[] => {
      const accessor = accessors[key];
      if (!accessor) return items;
      const factor = direction === 'asc' ? 1 : -1;

      return [...items].sort((a, b) => {
        const left = accessor(a);
        const right = accessor(b);
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left).localeCompare(String(right)) * factor;
        }
        return (left - right) * factor;
      });
    },
    [accessors, key, direction],
  );

  return { key, direction, toggle, sort };
};

export const useSortedItems = <T, A extends Accessors<T>>(
  items: T[],
  accessors: A,
  initialKey: keyof A & string,
  initialDirection: SortDirection = 'asc',
) => {
  const { key, direction, toggle, sort } = useTableSort<T, A>(
    accessors,
    initialKey,
    initialDirection,
  );
  const sorted = useMemo(() => sort(items), [items, sort]);
  return { key, direction, toggle, sorted };
};
