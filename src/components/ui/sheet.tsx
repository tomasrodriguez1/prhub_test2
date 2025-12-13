import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export function Sheet({ open: controlledOpen, onOpenChange, side = 'right', children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: setOpen, side }}>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          {children}
        </div>
      )}
    </SheetContext.Provider>
  );
}

function useSheetContext() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within Sheet');
  }
  return context;
}

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export function SheetContent({ className, children, onClose, ...props }: SheetContentProps) {
  const { onOpenChange, side } = useSheetContext();
  return (
    <div
      className={cn(
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
        side === 'right' && 'right-0 top-0 h-full w-full border-l sm:max-w-sm',
        side === 'left' && 'left-0 top-0 h-full w-full border-r sm:max-w-sm',
        side === 'top' && 'top-0 h-auto w-full border-b',
        side === 'bottom' && 'bottom-0 h-auto w-full border-t',
        className
      )}
      {...props}
    >
      {children}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => {
          onClose?.();
          onOpenChange(false);
        }}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />;
}

export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props} />;
}

export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

