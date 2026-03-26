import type { FormHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type FormWrapperProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

function FormWrapper({ children, className, ...props }: FormWrapperProps) {
  return (
    <form className={clsx(className)} {...props}>
      {children}
    </form>
  );
}

export default FormWrapper;

