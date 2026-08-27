import { Link, useLocation } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const NAV = [
  { to: '/', label: 'GPA Calculator' },
  { to: '/stats', label: 'Grade Statistics' },
];

interface AppHeaderProps {
  onReset?: () => void;
  canReset?: boolean;
}

export const AppHeader = ({ onReset, canReset }: AppHeaderProps) => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <nav className="flex items-center gap-1" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === item.to
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {onReset && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canReset}
                  aria-label="Reset all grades and choices"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears every grade you have entered and all of your programme
                    choices. It cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onReset}>Reset everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </div>
      </div>
    </header>
  );
};
