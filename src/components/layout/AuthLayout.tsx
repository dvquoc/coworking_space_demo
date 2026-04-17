import { Outlet } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#b11e29] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <Building2 className="w-10 h-10" />
            <span className="text-2xl font-bold">COBI TOWER</span>
          </div>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            Quản lý không gian làm việc chuyên nghiệp
          </h1>
          <p className="text-lg text-white/90">
            Giải pháp toàn diện cho việc quản lý bất động sản và dịch vụ coworking space
          </p>
        </div>

        <div className="text-white/70 text-sm">
          © 2026 COBI TOWER. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-100">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
