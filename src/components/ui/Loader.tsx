import clsx from 'clsx';

type LoaderProps = {
  variant?: 'spinner' | 'skeleton';
  lines?: number;
  className?: string;
  hideText?: boolean;
  spinnerClassName?: string;
  textClassName?: string;
};

function Loader({ variant = 'spinner', lines = 3, className, hideText = false, spinnerClassName, textClassName }: LoaderProps) {
  if (variant === 'skeleton') {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-2 text-sm text-gray-600', className)} role="status" aria-live="polite">
      <span
        className={clsx(
          'h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 motion-reduce:animate-none',
          spinnerClassName,
        )}
        aria-hidden="true"
      />
      <span className={hideText ? 'sr-only' : undefined}>Loading</span>
      {hideText ? null : <span className={textClassName}>Loading...</span>}
    </div>
  );
}

export default Loader;
