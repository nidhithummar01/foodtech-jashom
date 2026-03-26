import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';
import Input from '../components/ui/Input';

function ResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    setEmailError(undefined);
    navigate('/otp', { state: { email: email.trim() } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:w-[420px] sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-600">Enter your email to continue</p>
        </div>

        <FormWrapper className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) setEmailError(undefined);
            }}
            error={emailError}
            className={emailError ? undefined : '!border-gray-200 focus:!border-emerald-600 focus:!ring-emerald-200'}
          />
          <Button type="submit" className="w-full !bg-emerald-600 hover:!bg-emerald-700">
            Send OTP
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

export default ResetPage;

