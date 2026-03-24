import type { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
};

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium shadow-sm',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
