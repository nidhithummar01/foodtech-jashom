import { useId, type ReactNode } from 'react';
import clsx from 'clsx';

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  className?: string;
};

function Modal({ children, isOpen, title, description, onClose, className }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className={clsx('w-full max-w-lg rounded-lg bg-white p-5 shadow-sm', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h2 id={title ? titleId : undefined} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        {description ? (
          <p id={descriptionId} className="mb-3 text-sm text-gray-600">
            {description}
          </p>
        ) : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
