import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { showErrorToast, showSuccessToast } from '../components/ui/toast';
import { setAuthenticated } from '../utils/auth';

function isValidEmail(value: string) {
  // Simple UI-only email validation: "something@something.tld"
  return /^\S+@\S+\.\S+$/.test(value);
}

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  const validate = () => {
    let ok = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      ok = false;
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Enter a valid email address');
      ok = false;
    } else {
      setEmailError(undefined);
    }

    if (!password) {
      setPasswordError('Password is required');
      ok = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      ok = false;
    } else {
      setPasswordError(undefined);
    }

    return ok;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate backend delay (800–1200ms)
    const delayMs = 800 + Math.floor(Math.random() * 401);
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Mock credential check (demo)
    const isDemoValid = email.trim().toLowerCase() === 'admin@example.com' && password === 'admin123';

    if (isDemoValid) {
      setAuthenticated(true);
      showSuccessToast('Login successful (demo)');
      setIsSubmitting(false);
      navigate('/dashboard', { replace: true });
    } else {
      showErrorToast('Invalid email or password (demo)');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:w-[420px] sm:p-8">
        {/* Logo / Title Section */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to access the dashboard</p>
        </div>

        {/* Form Section */}
        <FormWrapper className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            id="admin-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            error={emailError}
            className={emailError ? undefined : '!border-gray-200 focus:!border-emerald-600 focus:!ring-emerald-200'}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="admin-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(undefined);
            }}
            error={passwordError}
            className={passwordError ? undefined : '!border-gray-200 focus:!border-emerald-600 focus:!ring-emerald-200'}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="rounded-md p-1 text-gray-500 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {/* Forgot Password? (right-aligned) */}
          <div className="flex justify-end">
            <Link to="/reset" className="text-sm font-medium text-gray-600 hover:text-green-700">
              Forgot Password?
            </Link>
          </div>

          {/* Action Section */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            loadingText={
              <span className="flex items-center gap-2">
                <Loader
                  variant="spinner"
                  hideText
                  className="text-white"
                  spinnerClassName="border-white/60 border-t-transparent"
                />
                <span>Login</span>
              </span>
            }
            className="w-full !bg-emerald-600 !text-white hover:!bg-emerald-700 disabled:!bg-gray-200 disabled:!text-gray-500 disabled:hover:!bg-gray-200 focus-visible:!ring-emerald-500/40"
            disabled={false}
          >
            Login
          </Button>
        </FormWrapper>

      </div>
    </div>
  );
}

export default LoginPage;

