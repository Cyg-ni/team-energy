import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { AuthLayout } from '../layouts/MainLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'
import { validateEmail } from '../utils/helpers'

const demoCredentials = [
  { label: 'Admin', email: 'admin@teamenergy.com', password: 'password123' },
  { label: 'Approver', email: 'approver@teamenergy.com', password: 'password123' },
  { label: 'Staff', email: 'staff@teamenergy.com', password: 'password123' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@teamenergy.com',
      password: 'password123',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      toast.success('Login successful.')
      navigate('/dashboard')
    } catch (error) {
      toast.error(authError || 'Login failed. Please try again.')
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-6xl rounded-[32px] bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.15)] backdrop-blur-sm border border-white/50 overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-900 to-sky-700 p-10 text-white">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-xl font-bold">
                N
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Enterprise Suite</p>
                <h2 className="text-2xl font-bold">Northstar Operations</h2>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-4xl font-semibold leading-tight">
                Modern bill management, built for faster approvals.
              </p>
              <p className="max-w-md text-base text-slate-200">
                Track invoices, automate processing, and maintain full visibility from submission to payment.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-200">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Approval routing in under 10 minutes
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              Audit-ready document tracking
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Faster finance close cycles
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 lg:p-12">
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-center lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                N
              </div>
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Sign In</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">Access your organization’s bill workflow dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="name@company.com"
              icon={FaEnvelope}
              {...register('email', {
                required: 'Email is required',
                validate: (value) => validateEmail(value) || 'Please enter a valid email address',
              })}
              error={errors.email?.message}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-10 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {showPassword ? (
                  <FaEyeSlash className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                ) : (
                  <FaEye className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link to="/login" className="font-medium text-blue-600 transition hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Demo accounts</p>
            <div className="space-y-2 text-sm text-slate-700">
              {demoCredentials.map((credential) => (
                <div key={credential.email} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <div>
                    <span className="font-medium">{credential.label}</span>
                    <p className="text-xs text-slate-500">{credential.email}</p>
                  </div>
                  <span className="text-xs text-slate-500">{credential.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
