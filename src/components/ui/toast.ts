import toast, { Toaster, type ToastOptions } from 'react-hot-toast';

const baseOptions: ToastOptions = {
  duration: 3000,
  style: {
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, baseOptions);
};

export const showErrorToast = (message: string) => {
  toast.error(message, baseOptions);
};

export const showInfoToast = (message: string) => {
  toast(message, baseOptions);
};

export const AppToaster = Toaster;
