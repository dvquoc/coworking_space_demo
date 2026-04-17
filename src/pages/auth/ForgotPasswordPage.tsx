import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { useForgotPassword, getErrorMessage } from '../../hooks/useAuth'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>()

  const forgotPasswordMutation = useForgotPassword()

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b11e29] rounded-full mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Quên mật khẩu</h1>
        <p className="text-slate-600 mt-2">
          Nhập email của bạn để nhận mã OTP
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-8">
          {forgotPasswordMutation.isSuccess ? (
            // Success State
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Mã OTP đã được gửi!
              </h2>
              <p className="text-slate-600 mb-6">
                Vui lòng kiểm tra email của bạn và nhập mã OTP để tiếp tục.
              </p>
              <p className="text-sm text-slate-500">
                Đang chuyển hướng...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {forgotPasswordMutation.isError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-rose-800 font-medium">Có lỗi xảy ra</p>
                    <p className="text-sm text-rose-700 mt-1">
                      {getErrorMessage(forgotPasswordMutation.error)}
                    </p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ',
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full bg-[#b11e29] hover:bg-[#8f1821] disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Gửi mã OTP</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <Link
                to="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </form>
          )}
        </div>
    </div>
  )
}
