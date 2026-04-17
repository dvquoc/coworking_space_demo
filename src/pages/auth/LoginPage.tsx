import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { useLogin, getErrorMessage } from '../../hooks/useAuth'
import type { LoginRequest } from '../../types/auth'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  })

  const loginMutation = useLogin()

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setValue('email', rememberedEmail)
      setValue('rememberMe', true)
    }
  }, [setValue])

  const onSubmit = (data: LoginFormData) => {
    const payload: LoginRequest = {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    }
    
    loginMutation.mutate(payload)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b11e29] rounded-full mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{t('login_title')}</h1>
        <p className="text-slate-600 mt-2">{t('login_subtitle')}</p>
      </div>

      {/* Login Form */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Message */}
          {loginMutation.isError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-rose-800 font-medium">{t('login_error_title')}</p>
                <p className="text-sm text-rose-700 mt-1">
                  {getErrorMessage(loginMutation.error)}
                </p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              {t('email_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register('email', {
                  required: t('email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('email_invalid'),
                  },
                })}
                type="email"
                id="email"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none transition ${
                  errors.email ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
                placeholder="example@cobi.vn"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              {t('password_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register('password', {
                  required: t('password_required'),
                  minLength: {
                    value: 6,
                    message: t('password_min_length'),
                  },
                })}
                type="password"
                id="password"
                autoComplete="current-password"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none transition ${
                  errors.password ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 text-[#b11e29] border-slate-300 rounded focus:ring-[#b11e29]"
              />
              <span className="ml-2 text-sm text-slate-700">{t('remember_me')}</span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-[#b11e29] hover:text-[#8f1821] font-medium"
            >
              {t('forgot_password_link')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#b11e29] hover:bg-[#8f1821] disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('processing')}</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{t('login_btn')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
