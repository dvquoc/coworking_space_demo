import { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Shield, ArrowLeft, AlertCircle } from 'lucide-react'
import { useVerifyOTP, useResendOTP, getErrorMessage } from '../../hooks/useAuth'

export default function VerifyOTPPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(600) // 10 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  const verifyOTPMutation = useVerifyOTP()
  const resendOTPMutation = useResendOTP()

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [countdown])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.every((digit) => digit !== '') && !verifyOTPMutation.isPending) {
      const otpString = otp.join('')
      verifyOTPMutation.mutate({ email, otp: otpString })
    }
  }, [otp, email, verifyOTPMutation])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleResend = () => {
    if (resendCooldown > 0) return
    
    resendOTPMutation.mutate(email, {
      onSuccess: () => {
        setResendCooldown(60) // 60 seconds cooldown
        setCountdown(600) // Reset countdown
        setOtp(['', '', '', '', '', '']) // Clear OTP
        inputRefs.current[0]?.focus()
      },
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b11e29] rounded-full mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Xác thực OTP</h1>
        <p className="text-slate-600 mt-2">
          Mã OTP đã được gửi đến email
        </p>
        <p className="text-[#b11e29] font-medium mt-1">
          {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-8">
          <div className="space-y-6">
            {/* Error Message */}
            {verifyOTPMutation.isError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-rose-800 font-medium">Mã OTP không hợp lệ</p>
                  <p className="text-sm text-rose-700 mt-1">
                    {getErrorMessage(verifyOTPMutation.error)}
                  </p>
                </div>
              </div>
            )}

            {/* OTP Input Boxes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                Nhập mã OTP (6 chữ số)
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {inputRefs.current[index] = el}}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-xl focus:border-[#b11e29] focus:ring-2 focus:ring-[#b11e29] outline-none transition"
                    disabled={verifyOTPMutation.isPending}
                  />
                ))}
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Mã OTP hết hạn sau:{' '}
                <span className={`font-bold ${countdown < 60 ? 'text-rose-600' : 'text-[#b11e29]'}`}>
                  {formatTime(countdown)}
                </span>
              </p>
            </div>

            {/* Resend Button */}
            <div className="text-center">
              {resendCooldown > 0 ? (
                <p className="text-sm text-slate-500">
                  Gửi lại mã sau {resendCooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendOTPMutation.isPending}
                  className="text-sm text-[#b11e29] hover:text-[#8f1821] font-medium disabled:text-slate-400"
                >
                  {resendOTPMutation.isPending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
                </button>
              )}
            </div>

            {/* Loading State */}
            {verifyOTPMutation.isPending && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-[#b11e29]">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Đang xác thực...</span>
                </div>
              </div>
            )}

            {/* Back Link */}
            <Link
              to="/auth/forgot-password"
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
          </div>
        </div>
    </div>
  )
}
