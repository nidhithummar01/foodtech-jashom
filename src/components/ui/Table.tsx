import type { ReactNode } from 'react';
import clsx from 'clsx';

type TableProps = {
  headers?: ReactNode[];
  children: ReactNode;
  className?: string;
};

type TableRowProps = {
  children: ReactNode;
  className?: string;
};

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableRow({ children, className }: TableRowProps) {
  return <tr className={className}>{children}</tr>;
}

export function TableCell({ children, className }: TableCellProps) {
  return <td className={clsx('px-4 py-3', className)}>{children}</td>;
}

function Table({ headers, children, className }: TableProps) {
  return (
    <div className={clsx('w-full overflow-x-auto rounded-lg border bg-white shadow-sm', className)}>
      <table className="min-w-full text-left text-sm">
        {headers && headers.length > 0 ? (
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody className="divide-y divide-gray-100 text-gray-600">{children}</tbody>
      </table>
    </div>
  );
}

export default Table;
