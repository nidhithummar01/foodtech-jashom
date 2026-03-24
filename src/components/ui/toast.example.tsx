import Button from './Button';
import { showErrorToast, showInfoToast, showSuccessToast } from './toast';

function ToastExample() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="primary" onClick={() => showSuccessToast('Saved successfully')}>
        Success Toast
      </Button>
      <Button variant="danger" onClick={() => showErrorToast('Something went wrong')}>
        Error Toast
      </Button>
      <Button variant="secondary" onClick={() => showInfoToast('Informational message')}>
        Info Toast
      </Button>
    </div>
  );
}

export default ToastExample;
