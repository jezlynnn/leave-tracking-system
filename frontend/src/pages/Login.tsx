import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { getErrorMessage } from '@/services/api';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
            <CalendarDays className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
