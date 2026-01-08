import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/authStore';
import { Mail, ArrowLeft } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
}

const OTPVerification = ({ email, onBack, onVerified }: OTPVerificationProps) => {
  const { verifyOTP, sendOTP, error, isLoading, otpVerified, clearError } = useAuthStore();
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = watch('otp');

  useEffect(() => {
    if (otpVerified) {
      onVerified();
    }
  }, [otpVerified, onVerified]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: OTPFormData) => {
    clearError();
    await verifyOTP(email, data.otp);
  };

  const handleResendOTP = async () => {
    clearError();
    await sendOTP(email);
    setCountdown(300);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <Mail className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit code to
        </p>
        <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
          {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-md bg-danger-50 dark:bg-danger-900 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-danger-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="otp" className="form-label">
                Enter verification code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  className={`input text-center text-2xl tracking-widest ${errors.otp ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                  placeholder="000000"
                  {...register('otp')}
                />
                {errors.otp && (
                  <p className="form-error">{errors.otp.message}</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Code expires in: <span className="font-medium text-gray-900 dark:text-white">{formatTime(countdown)}</span>
              </p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  disabled={isLoading}
                >
                  Resend code
                </button>
              ) : (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the code? You can resend in {formatTime(countdown)}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center"
                disabled={isLoading || otpValue.length !== 6}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Verify Code
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary w-full flex justify-center items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;