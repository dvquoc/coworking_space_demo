import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { useResetPassword, getErrorMessage } from '../../hooks/useAuth'
import type { ResetPasswordRequest } from '../../types/auth'

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  criteria: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token') || ''
  const [showSuccess, setShowSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>()

  const resetPasswordMutation = useResetPassword()
  const password = watch('newPassword', '')

  // Calculate password strength
  const passwordStrength: PasswordStrength = useMemo(() => {
    const criteria = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@#$%^&*!]/.test(password),
    }

    const score = Object.values(criteria).filter(Boolean).length

    let label = 'strength_weak'
    let color = 'red'
    if (score >= 5) {
      label = 'strength_strong'
      color = 'green'
    } else if (score >= 3) {
      label = 'strength_medium'
      color = 'yellow'
    }

    return { score, label, color, criteria }
  }, [password])

  const onSubmit = (data: ResetPasswordFormData) => {
    const payload: ResetPasswordRequest = {
      resetToken,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }
    
    resetPasswordMutation.mutate(payload, {
      onSuccess: () => {
        setShowSuccess(true)
      },
    })
  }

  if (showSuccess) {
    return (
      <div className="w-full">
        <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t('reset_success_title')}
          </h2>
          <p className="text-slate-600 mb-6">
            {t('reset_success_message')}
          </p>
          <Link
            to="/auth/login"
            className="inline-block bg-[#b11e29] hover:bg-[#8f1821] text-white font-medium py-3 px-6 rounded-xl transition"
          >
            {t('login_now')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b11e29] rounded-full mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{t('reset_password_title')}</h1>
        <p className="text-slate-600 mt-2">
          {t('reset_password_subtitle')}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Message */}
          {resetPasswordMutation.isError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-rose-800 font-medium">{t('error_title')}</p>
                <p className="text-sm text-rose-700 mt-1">
                    {getErrorMessage(resetPasswordMutation.error)}
                  </p>
                </div>
              </div>
            )}

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                {t('new_password_label')}
              </label>
              <input
                {...register('newPassword', {
                  required: t('password_required'),
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/,
                    message: t('password_weak'),
                  },
                })}
                type="password"
                id="newPassword"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none transition ${
                  errors.newPassword ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-rose-600">{errors.newPassword.message}</p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-700">{t('password_strength_label')}</span>
                    <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                      {t(passwordStrength.label)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>

                  {/* Criteria Checklist */}
                  <div className="mt-3 space-y-1">
                    {[
                      { key: 'minLength', labelKey: 'criteria_min_length' },
                      { key: 'hasUppercase', labelKey: 'criteria_uppercase' },
                      { key: 'hasLowercase', labelKey: 'criteria_lowercase' },
                      { key: 'hasNumber', labelKey: 'criteria_number' },
                      { key: 'hasSpecial', labelKey: 'criteria_special' },
                    ].map(({ key, labelKey }) => {
                      const met = passwordStrength.criteria[key as keyof typeof passwordStrength.criteria]
                      return (
                        <div key={key} className="flex items-center gap-2">
                          {met ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                          )}
                          <span className={`text-sm ${met ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {t(labelKey)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                {t('confirm_password_label')}
              </label>
              <input
                {...register('confirmPassword', {
                  required: t('confirm_password_required'),
                  validate: (value) =>
                    value === watch('newPassword') || t('passwords_not_match'),
                })}
                type="password"
                id="confirmPassword"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#b11e29] focus:border-transparent outline-none transition ${
                  errors.confirmPassword ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending || passwordStrength.score < 5}
              className="w-full bg-[#b11e29] hover:bg-[#8f1821] disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('processing')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>{t('reset_password_btn')}</span>
                </>
              )}
            </button>
          </form>
        </div>
    </div>
  )
}
