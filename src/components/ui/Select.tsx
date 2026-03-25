import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 outline-none transition-all duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200',
          error ? 'border-red-500 focus:ring-red-200' : '',
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export default Select;
