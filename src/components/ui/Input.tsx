import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
};

function Input({ label, error, className, id, rightElement, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={clsx(
            'w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none transition-all duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
            rightElement ? 'pr-10' : '',
            className,
          )}
          {...props}
        />
        {rightElement ? (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </div>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default Input;
