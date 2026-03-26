import type { ReactNode } from 'react';
import clsx from 'clsx';
import Modal from './Modal';
import Button from './Button';

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || '?';
}

export type ViewDetailsRow = {
  label: string;
  value: ReactNode;
};

type ViewDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  initialsFrom: string;
  rows: ViewDetailsRow[];
  /** Optional content between the detail grid and the OK footer (e.g. linked list). */
  belowDetails?: ReactNode;
  /** Narrower modal, smaller avatar and typography (e.g. Users table view). */
  compact?: boolean;
  /** Extra classes for the modal panel (merged with defaults). */
  className?: string;
};

/** Status chip with dot — green / amber / red for common admin statuses. */
export function viewStatusPill(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        {status}
      </span>
    );
  }
  if (s === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
      {status}
    </span>
  );
}

export function emailPill(text: string, compact?: boolean) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full bg-emerald-100 text-emerald-900',
        compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      )}
    >
      {text}
    </span>
  );
}

function ViewDetailsModal({
  isOpen,
  onClose,
  title,
  description = 'View action (demo mode)',
  initialsFrom,
  rows,
  belowDetails,
  compact = false,
  className,
}: ViewDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      showCloseButton={false}
      className={clsx(compact ? '!max-w-md !p-5' : '!max-w-2xl !p-6', className)}
    >
      <>
        <div
          className={clsx(
            'flex flex-col sm:flex-row sm:items-start',
            compact ? 'gap-4' : 'gap-6',
          )}
        >
          <div className="flex justify-center sm:justify-start">
            <div
              className={clsx(
                'flex shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 font-semibold tracking-tight text-emerald-900 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]',
                compact ? 'h-16 w-16 text-base' : 'h-24 w-24 text-xl'
              )}
              aria-hidden
            >
              {getInitials(initialsFrom)}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <dl
              className={clsx(
                'grid grid-cols-[minmax(0,auto)_1fr]',
                compact
                  ? 'gap-x-3 gap-y-2 text-xs sm:grid-cols-[5.5rem_1fr]'
                  : 'gap-x-6 gap-y-3 text-sm sm:grid-cols-[8rem_1fr]',
              )}
            >
              {rows.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="text-right font-medium text-gray-600">{row.label}</dt>
                  <dd className="text-gray-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {belowDetails ? (
          <div
            className={clsx(
              'border-t border-gray-100 pt-4 text-sm text-gray-700',
              compact ? 'mt-4' : 'mt-6',
            )}
          >
            {belowDetails}
          </div>
        ) : null}

        <div className={clsx('border-t border-gray-200 pt-4', compact ? 'mt-3' : 'mt-4')}>
          <div className="flex justify-end">
            <Button
              variant="primary"
              className={clsx('rounded-full shadow-sm', compact ? 'px-6 py-2 text-sm' : 'px-8')}
              onClick={onClose}
            >
              OK
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default ViewDetailsModal;
