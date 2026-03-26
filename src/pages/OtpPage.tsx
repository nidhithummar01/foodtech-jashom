import { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import FormWrapper from '../components/ui/FormWrapper';
import { showErrorToast, showSuccessToast } from '../components/ui/toast';

const OTP_LENGTH = 4;

function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedEmail = (location.state as { email?: string } | null)?.email;
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const joinedOtp = useMemo(() => otp.join(''), [otp]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (joinedOtp.length !== OTP_LENGTH) {
      showErrorToast('Please enter the complete OTP');
      return;
    }

    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsVerifying(false);
    showSuccessToast('OTP verified (demo)');
    navigate('/new-password', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm sm:w-[420px] sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Enter OTP</h1>
          <p className="mt-1 text-sm text-gray-600">
            {passedEmail ? `Enter the code sent to ${passedEmail}` : 'Enter the 4-digit code'}
          </p>
        </div>

        <FormWrapper className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                className="h-12 w-11 rounded-lg border border-gray-300 text-center text-lg font-semibold text-gray-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <Button type="submit" isLoading={isVerifying} className="w-full !bg-emerald-600 hover:!bg-emerald-700">
            Verify OTP
          </Button>
        </FormWrapper>

        <div className="mt-5 flex items-center justify-between">
          <Link to="/reset" className="text-sm font-medium text-gray-600 hover:text-emerald-700">
            Back
          </Link>
          <button type="button" className="text-sm font-medium text-gray-600 hover:text-emerald-700">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;

