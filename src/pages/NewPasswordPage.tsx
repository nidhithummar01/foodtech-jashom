import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';
import Input from '../components/ui/Input';
import { showSuccessToast } from '../components/ui/toast';

function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmError, setConfirmError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let valid = true;

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    if (!confirmPassword) {
      setConfirmError('Confirm password is required');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError(undefined);
    }

    if (!valid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    showSuccessToast('Password reset successful (demo)');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:w-[420px] sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Set New Password</h1>
          <p className="mt-1 text-sm text-gray-600">Create a new password for your account</p>
        </div>

        <FormWrapper className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (passwordError) setPasswordError(undefined);
            }}
            error={passwordError}
            className={passwordError ? undefined : '!border-gray-200 focus:!border-emerald-600 focus:!ring-emerald-200'}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (confirmError) setConfirmError(undefined);
            }}
            error={confirmError}
            className={confirmError ? undefined : '!border-gray-200 focus:!border-emerald-600 focus:!ring-emerald-200'}
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full !bg-emerald-600 hover:!bg-emerald-700">
            Reset Password
          </Button>
        </FormWrapper>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-700">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewPasswordPage;

