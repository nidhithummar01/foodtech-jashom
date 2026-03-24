import type { ReactNode } from 'react';
import Button from './Button';

type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

function EmptyState({ title, message, icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
      {icon ? <div className="mb-3 flex justify-center text-gray-500">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {message ? <p className="mt-2 text-sm text-gray-600">{message}</p> : null}
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
