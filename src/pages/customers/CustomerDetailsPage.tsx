import { useState } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Edit,
  Ban,
  CheckCircle,
  FileText,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  Wallet,
  Gift,
  CirclePlus,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useCustomer, useCustomerBookings, useCustomerContracts, useCustomerInvoices } from '../../hooks/useCustomers'
import { TagChip } from '../../components/customers/TagChip'
import { CustomerFormModal } from '../../components/customers/CustomerFormModal'
import { EmployeesTab } from '../../components/customers/EmployeesTab'
import type { CustomerBooking, CustomerContract, CustomerInvoice } from '../../types/customer'

type TabType = 'overview' | 'credit' | 'bookings' | 'contracts' | 'invoices' | 'employees'

export function CustomerDetailsPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const activeTab = (searchParams.get('tab') || 'overview') as TabType
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { data: customer, isLoading, error } = useCustomer(customerId || '')
  const { data: bookings } = useCustomerBookings(customerId || '', activeTab === 'bookings' ? undefined : undefined)
  const { data: contracts } = useCustomerContracts(customerId || '', activeTab === 'contracts' ? undefined : undefined)
  const { data: invoices } = useCustomerInvoices(customerId || '', activeTab === 'invoices' ? undefined : undefined)
  
  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab })
  }
  
  if (isLoading) {
    return (
      <>
        <Header title="Chi tiết khách hàng" subtitle="Đang tải..." />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  if (error || !customer) {
    return (
      <>
        <Header title="Chi tiết khách hàng" subtitle="Lỗi" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-rose-500 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Không tìm thấy khách hàng</h2>
              <p className="text-slate-600 mb-4">Khách hàng này không tồn tại hoặc đã bị xóa.</p>
              <button
                onClick={() => navigate('/customers')}
                className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-slate-100 text-slate-600',
      suspended: 'bg-rose-100 text-rose-700',
    }
    const labels: Record<string, string> = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      suspended: 'Tạm ngưng',
    }
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'credit', label: 'Ví Cobi', icon: Wallet },
    { id: 'bookings', label: 'Đặt chỗ', icon: Calendar },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: CreditCard },
    ...(customer.customerType === 'company' ? [{ id: 'employees', label: 'Nhân viên', icon: Users }] : []),
  ]
  
  return (
    <>
      <Header 
        title={customer.fullName}
        subtitle={customer.customerCode}
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/customers" className="text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Khách hàng
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">{customer.customerCode}</span>
          </nav>
          
          {/* Customer Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            {/* Suspended Warning Banner */}
            {customer.status === 'suspended' && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
                <Ban className="w-5 h-5 text-rose-600" />
                <span className="text-rose-700 font-medium">Khách hàng này đang bị tạm ngưng</span>
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                  {customer.customerType === 'company' ? (
                    <Building2 className="w-8 h-8 text-slate-500" />
                  ) : (
                    <span className="text-2xl font-semibold text-slate-600">
                      {customer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                
                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{customer.fullName}</h1>
                    {getStatusBadge(customer.status)}
                    {customer.customerType === 'company' && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        CÔNG TY
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-mono">{customer.customerCode}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-[#b11e29]">
                      <Mail className="w-4 h-4" />
                      {customer.email}
                    </a>
                    <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-[#b11e29]">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                {customer.status === 'suspended' ? (
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Kích hoạt
                  </button>
                ) : (
                  <button className="px-4 py-2 border border-rose-300 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    Tạm ngưng
                  </button>
                )}
              </div>
            </div>
            
            {/* Tags */}
            {customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {customer.tags.map((tag) => (
                  <TagChip key={tag} tagName={tag} />
                ))}
              </div>
            )}
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Tổng Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{customer.stats.totalBookings}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Hợp đồng Active</p>
              <p className="text-2xl font-bold text-slate-900">{customer.stats.activeContracts}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Đã thanh toán</p>
              <p className="text-2xl font-bold text-emerald-600">
                {(customer.stats.totalSpent / 1000000).toFixed(0)}M
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-600 mb-1">Còn nợ</p>
              <p className="text-2xl font-bold text-rose-600">
                {customer.stats.outstandingBalance > 0 
                  ? `${(customer.stats.outstandingBalance / 1000000).toFixed(0)}M` 
                  : '0'}
              </p>
            </div>
          </div>
          
          {/* Content with Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#b11e29] text-[#b11e29]'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <OverviewTab customer={customer} />
              )}
              {activeTab === 'credit' && (
                <CreditTab customer={customer} />
              )}
              {activeTab === 'bookings' && (
                <BookingsTab bookings={bookings || []} />
              )}
              {activeTab === 'contracts' && (
                <ContractsTab contracts={contracts || []} />
              )}
              {activeTab === 'invoices' && (
                <InvoicesTab invoices={invoices || []} />
              )}
              {activeTab === 'employees' && customer.customerType === 'company' && (
                <EmployeesTab customerId={customerId || ''} />
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Edit Modal */}
      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customerId={customerId}
      />
    </>
  )
}

// Overview Tab Component
function OverviewTab({ customer }: { customer: NonNullable<ReturnType<typeof useCustomer>['data']> }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer Info */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Thông tin khách hàng</h3>
        <div className="space-y-3">
          {customer.customerType === 'individual' ? (
            <>
              <InfoRow label="Họ tên" value={customer.fullName} />
              {customer.dateOfBirth && (
                <InfoRow label="Ngày sinh" value={customer.dateOfBirth} />
              )}
              {customer.nationalId && (
                <InfoRow label="CCCD/CMND" value={customer.nationalId} masked />
              )}
            </>
          ) : (
            <>
              {customer.company && (
                <>
                  <InfoRow label="Tên công ty" value={customer.company.companyName} />
                  <InfoRow label="Mã số thuế" value={customer.company.taxCode} />
                  {customer.company.industry && (
                    <InfoRow label="Ngành nghề" value={customer.company.industry} />
                  )}
                  {customer.company.companySize && (
                    <InfoRow label="Quy mô" value={
                      customer.company.companySize === 'startup' ? 'Startup (1-10)' :
                      customer.company.companySize === 'sme' ? 'SME (11-50)' : 'Enterprise (50+)'
                    } />
                  )}
                </>
              )}
              {customer.contactPersonName && (
                <InfoRow label="Người liên hệ" value={`${customer.contactPersonName}${customer.contactPersonTitle ? ` - ${customer.contactPersonTitle}` : ''}`} />
              )}
            </>
          )}
          <InfoRow label="Email" value={customer.email} type="email" />
          <InfoRow label="Điện thoại" value={customer.phone} type="phone" />
          {customer.alternativePhone && (
            <InfoRow label="SĐT phụ" value={customer.alternativePhone} type="phone" />
          )}
          {customer.address && (
            <InfoRow label="Địa chỉ" value={customer.address} icon={<MapPin className="w-4 h-4" />} />
          )}
        </div>
      </div>
      
      {/* Metadata */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Thông tin bổ sung</h3>
        <div className="space-y-3">
          {customer.accountManagerInfo && (
            <InfoRow label="Account Manager" value={customer.accountManagerInfo.name} />
          )}
          {customer.referredByCustomer && (
            <InfoRow 
              label="Giới thiệu bởi" 
              value={`${customer.referredByCustomer.fullName} (${customer.referredByCustomer.customerCode})`} 
            />
          )}
          <InfoRow label="Ngày tạo" value={new Date(customer.createdAt).toLocaleDateString('vi-VN')} icon={<Clock className="w-4 h-4" />} />
          {customer.createdByInfo && (
            <InfoRow label="Người tạo" value={customer.createdByInfo.name} />
          )}
        </div>
        
        {/* Notes */}
        {customer.notes && (
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Ghi chú</h3>
            <p className="text-slate-600 p-3 bg-slate-50 rounded-xl">{customer.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Info Row Component
function InfoRow({ 
  label, 
  value, 
  type,
  icon,
  masked 
}: { 
  label: string; 
  value: string; 
  type?: 'email' | 'phone';
  icon?: React.ReactNode;
  masked?: boolean;
}) {
  let displayValue = value
  if (masked) {
    displayValue = value.slice(0, 3) + '****' + value.slice(-3)
  }
  
  let content = <span className="text-slate-900">{displayValue}</span>
  if (type === 'email') {
    content = <a href={`mailto:${value}`} className="text-[#b11e29] hover:underline">{value}</a>
  } else if (type === 'phone') {
    content = <a href={`tel:${value}`} className="text-[#b11e29] hover:underline">{value}</a>
  }
  
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      {icon && <span className="text-slate-400 mt-0.5">{icon}</span>}
      <span className="text-sm text-slate-500 w-32 shrink-0">{label}</span>
      <span className="text-sm flex-1">{content}</span>
    </div>
  )
}

// Bookings Tab Component
function BookingsTab({ bookings }: { bookings: CustomerBooking[] }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      checked_in: 'bg-emerald-100 text-emerald-700',
      completed: 'bg-slate-100 text-slate-600',
      cancelled: 'bg-rose-100 text-rose-700',
    }
    const labels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      checked_in: 'Đã check-in',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600">Chưa có booking nào</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mã</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Space</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Vị trí</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Ngày</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Giờ</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trạng thái</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Số tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-mono text-slate-600">{booking.bookingCode}</td>
              <td className="px-4 py-3 text-sm font-medium text-slate-900">{booking.spaceName}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{booking.buildingName} / {booking.floorLabel}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{booking.date}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{booking.startTime} - {booking.endTime}</td>
              <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
              <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                {booking.totalAmount.toLocaleString('vi-VN')}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Contracts Tab Component
function ContractsTab({ contracts }: { contracts: CustomerContract[] }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700',
      expired: 'bg-slate-100 text-slate-600',
      terminated: 'bg-rose-100 text-rose-700',
    }
    const labels: Record<string, string> = {
      active: 'Đang hiệu lực',
      expired: 'Hết hạn',
      terminated: 'Đã chấm dứt',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  if (contracts.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600">Chưa có hợp đồng nào</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mã HĐ</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Space</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Bắt đầu</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Kết thúc</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trạng thái</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Giá/tháng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-mono text-slate-600">{contract.contractCode}</td>
              <td className="px-4 py-3 text-sm font-medium text-slate-900">{contract.spaceName}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{contract.startDate}</td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {contract.endDate}
                {contract.status === 'active' && contract.daysRemaining <= 30 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                    Còn {contract.daysRemaining} ngày
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{getStatusBadge(contract.status)}</td>
              <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                {(contract.monthlyValue / 1000000).toFixed(0)}M/tháng
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Invoices Tab Component
function InvoicesTab({ invoices }: { invoices: CustomerInvoice[] }) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-600',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-emerald-100 text-emerald-700',
      overdue: 'bg-rose-100 text-rose-700',
      cancelled: 'bg-slate-100 text-slate-500',
    }
    const labels: Record<string, string> = {
      draft: 'Nháp',
      sent: 'Đã gửi',
      paid: 'Đã thanh toán',
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  // Calculate summary
  const summary = invoices.reduce((acc, inv) => {
    if (inv.status === 'paid') acc.paid += inv.amount
    if (['sent', 'overdue'].includes(inv.status)) acc.outstanding += inv.amount - inv.paidAmount
    if (inv.status === 'overdue') acc.overdue += inv.amount - inv.paidAmount
    return acc
  }, { paid: 0, outstanding: 0, overdue: 0 })
  
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600">Chưa có hóa đơn nào</p>
      </div>
    )
  }
  
  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-emerald-50 rounded-xl">
          <p className="text-sm text-emerald-600 mb-1">Đã thanh toán</p>
          <p className="text-xl font-bold text-emerald-700">{(summary.paid / 1000000).toFixed(0)}M</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-600 mb-1">Còn phải thu</p>
          <p className="text-xl font-bold text-amber-700">{(summary.outstanding / 1000000).toFixed(0)}M</p>
        </div>
        <div className="p-4 bg-rose-50 rounded-xl">
          <p className="text-sm text-rose-600 mb-1">Quá hạn</p>
          <p className="text-xl font-bold text-rose-700">{(summary.overdue / 1000000).toFixed(0)}M</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mã HĐ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mô tả</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Hạn TT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className={`hover:bg-slate-50 ${invoice.status === 'overdue' ? 'bg-rose-50/50' : ''}`}>
                <td className="px-4 py-3 text-sm font-mono text-slate-600">{invoice.invoiceCode}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{invoice.description}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{invoice.issueDate}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{invoice.dueDate}</td>
                <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">
                  {invoice.amount.toLocaleString('vi-VN')}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Credit Tab Component (Ví Cobi)
function CreditTab({ customer }: { customer: NonNullable<ReturnType<typeof useCustomer>['data']> }) {
  const totalBalance = customer.creditBalance + customer.rewardBalance
  
  return (
    <div className="space-y-6">
      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-xs text-amber-600 font-medium">TỔNG SỐ DƯ</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">
            {new Intl.NumberFormat('vi-VN').format(totalBalance)}
          </p>
          <p className="text-sm text-amber-600 mt-1">Cobi</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-slate-500 font-medium">CREDIT</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('vi-VN').format(customer.creditBalance)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Không hết hạn</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-slate-500 font-medium">REWARD</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('vi-VN').format(customer.rewardBalance)}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {customer.creditSummary?.expiringWithin7Days 
              ? `${customer.creditSummary.expiringWithin7Days} sắp hết hạn` 
              : 'Có hạn sử dụng'}
          </p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert('Nạp Cobi - Coming soon')}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <CirclePlus className="w-4 h-4" />
          Nạp Cobi
        </button>
        <button 
          onClick={() => alert('Tặng Reward - Coming soon')}
          className="px-4 py-2 border border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Tặng Reward
        </button>
      </div>
      
      {/* Active Rewards */}
      {customer.activeRewards && customer.activeRewards.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Credit Rewards đang hoạt động</h3>
          <div className="space-y-3">
            {customer.activeRewards.map((reward) => {
              const progress = (reward.remainingAmount / reward.amount) * 100
              const expiresAt = new Date(reward.expiresAt)
              const now = new Date()
              const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              const isExpiringSoon = daysLeft <= 7
              
              return (
                <div 
                  key={reward.id}
                  className={`p-4 rounded-xl border ${isExpiringSoon ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Gift className={`w-4 h-4 ${isExpiringSoon ? 'text-amber-600' : 'text-purple-600'}`} />
                        <span className="font-medium text-slate-900">
                          {new Intl.NumberFormat('vi-VN').format(reward.amount)} Cobi
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          reward.source === 'promotion' ? 'bg-blue-100 text-blue-700' :
                          reward.source === 'referral' ? 'bg-emerald-100 text-emerald-700' :
                          reward.source === 'birthday' ? 'bg-pink-100 text-pink-700' :
                          reward.source === 'loyalty' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {reward.source === 'promotion' ? 'Khuyến mãi' :
                           reward.source === 'referral' ? 'Giới thiệu' :
                           reward.source === 'birthday' ? 'Sinh nhật' :
                           reward.source === 'loyalty' ? 'Thân thiết' :
                           'Đền bù'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-600' : 'text-slate-600'}`}>
                        {isExpiringSoon ? `⚠️ Còn ${daysLeft} ngày` : `HSD: ${expiresAt.toLocaleDateString('vi-VN')}`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Còn lại: {new Intl.NumberFormat('vi-VN').format(reward.remainingAmount)} Cobi</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isExpiringSoon ? 'bg-amber-500' : 'bg-purple-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Empty state for rewards */}
      {(!customer.activeRewards || customer.activeRewards.length === 0) && customer.rewardBalance === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <Gift className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600">Chưa có credit reward nào</p>
          <p className="text-sm text-slate-500 mt-1">Tặng reward để khuyến khích khách hàng</p>
        </div>
      )}
      
      {/* Conversion note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-800">Quy đổi Cobi</p>
            <p className="text-sm text-blue-600 mt-1">
              1 Cobi = 1.000 VND. Tổng giá trị ví: {new Intl.NumberFormat('vi-VN').format(totalBalance * 1000)}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
