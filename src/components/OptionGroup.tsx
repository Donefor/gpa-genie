import { ReactNode } from 'react';

export const OptionGroup = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-3 rounded-md bg-muted/50 p-3 sm:grid-cols-2 sm:p-4">
    {children}
  </div>
);

export const OptionField = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div>
    <span className="field-label">{label}</span>
    {children}
    {hint && <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/70">{hint}</p>}
  </div>
);
