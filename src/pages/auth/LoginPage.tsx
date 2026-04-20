import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogIn, Mail, Lock, AlertCircle, Shield, Users } from 'lucide-react'
import { useLogin, getErrorMessage } from '../../hooks/useAuth'
import type { LoginRequest, UserRole } from '../../types/auth'

const DEMO_ACCOUNTS: Array<{ email: string; password: string; nameKey: string; role: UserRole; descKey: string }> = [
  { email: 'admin@cobi.vn', password: 'password', nameKey: 'demo_role_admin', role: 'admin', descKey: 'demo_desc_admin' },
  { email: 'manager@cobi.vn', password: 'password', nameKey: 'demo_role_manager', role: 'manager', descKey: 'demo_desc_manager' },
  { email: 'sale@cobi.vn', password: 'password', nameKey: 'demo_role_sale', role: 'sale', descKey: 'demo_desc_sale' },
  { email: 'accountant@cobi.vn', password: 'password', nameKey: 'demo_role_accountant', role: 'accountant', descKey: 'demo_desc_accountant' },
  { email: 'maintenance@cobi.vn', password: 'password', nameKey: 'demo_role_maintenance', role: 'maintenance', descKey: 'demo_desc_maintenance' },
  { email: 'investor@cobi.vn', password: 'password', nameKey: 'demo_role_investor', role: 'investor', descKey: 'demo_desc_investor' },
]

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-blue-100 text-blue-700',
  sale: 'bg-green-100 text-green-700',
  accountant: 'bg-amber-100 text-amber-700',
  maintenance: 'bg-slate-100 text-slate-700',
  investor: 'bg-purple-100 text-purple-700',
}

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
      email: 'manager@cobi.vn',
      password: 'password',
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

      {/* Demo Account Picker */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-medium text-slate-500">{t('demo_title')}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setValue('email', account.email)
                setValue('password', account.password)
              }}
              className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-[#b11e29]/30 hover:bg-[#b11e29]/5 transition-all text-left group shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#b11e29]/10 transition-colors">
                <Shield className="w-4 h-4 text-slate-500 group-hover:text-[#b11e29] transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700 truncate">{t(account.nameKey)}</p>
                <p className="text-xs text-slate-400 truncate">{account.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase ${ROLE_COLORS[account.role]}`}>
                    {t(`demo_role_${account.role}`)}
                  </span>
                  <span className="text-[10px] text-slate-400">{t(account.descKey)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
