import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 outline-none transition-all duration-150 focus:ring-2 focus:ring-gray-300',
          error ? 'border-red-500 focus:ring-red-200' : '',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default Input;
