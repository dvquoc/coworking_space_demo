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
  CheckCircle2,
  FileText,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  Wallet,
  Gift,
  CirclePlus,
  X,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useCustomer, useCustomerBookings, useCustomerContracts, useCustomerInvoices } from '../../hooks/useCustomers'
import { TagChip } from '../../components/customers/TagChip'
import { CustomerFormModal } from '../../components/customers/CustomerFormModal'
import { EmployeesTab } from '../../components/customers/EmployeesTab'
import type { CustomerBooking, CustomerContract, CustomerInvoice, CreditRewardSource } from '../../types/customer'

type TabType = 'overview' | 'bookings' | 'contracts' | 'invoices' | 'employees'

export function CustomerDetailsPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const activeTab = (searchParams.get('tab') || 'overview') as TabType
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Top-up modal state
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [topUpMethod, setTopUpMethod] = useState<'cash' | 'bank_transfer' | 'card'>('cash')
  const [topUpSuccess, setTopUpSuccess] = useState(false)

  // Gift reward modal state
  const [showGift, setShowGift] = useState(false)
  const [giftAmount, setGiftAmount] = useState('')
  const [giftSource, setGiftSource] = useState<CreditRewardSource>('promotion')
  const [giftExpiry, setGiftExpiry] = useState('')
  const [giftDesc, setGiftDesc] = useState('')
  const [giftSuccess, setGiftSuccess] = useState(false)
  
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
          {/* Wallet Info - Compact */}
          <div className="bg-gradient-to-br from-amber-50 to-purple-50 border border-amber-200 shadow rounded-xl px-4 py-3 my-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Wallets */}
              <div className="flex flex-1 gap-3">
                <div className="flex flex-col items-center bg-white border border-amber-100 rounded-lg px-3 py-2 min-w-[120px]">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Wallet className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700 font-semibold uppercase">Chính</span>
                  </div>
                  <span className="text-lg font-bold text-amber-800">{new Intl.NumberFormat('vi-VN').format(customer.creditBalance || 0)}</span>
                  <span className="text-xs text-slate-400">Credit</span>
                </div>
                <div className="flex flex-col items-center bg-white border border-purple-100 rounded-lg px-3 py-2 min-w-[120px]">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-700 font-semibold uppercase">Reward</span>
                  </div>
                  <span className="text-lg font-bold text-purple-800">{new Intl.NumberFormat('vi-VN').format(customer.rewardBalance || 0)}</span>
                  <span className="text-xs text-slate-400">Credit</span>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => { setTopUpAmount(''); setTopUpMethod('cash'); setTopUpSuccess(false); setShowTopUp(true) }}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 flex items-center gap-1"
                >
                  <CirclePlus className="w-4 h-4" />
                  Nạp
                </button>
                <button
                  onClick={() => navigate(`/credits?customerId=${customerId}`)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-1"
                >
                  <Clock className="w-4 h-4" />
                  Lịch sử
                </button>
                <button
                  onClick={() => { setGiftAmount(''); setGiftSource('promotion'); setGiftExpiry(''); setGiftDesc(''); setGiftSuccess(false); setShowGift(true) }}
                  className="px-3 py-1.5 border border-purple-300 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-50 flex items-center gap-1"
                >
                  <Gift className="w-4 h-4" />
                  Tặng
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 ml-1">
              <span className="text-xs text-slate-500">Quy đổi:</span>
              <span className="text-xs font-bold text-amber-700">1 Credit = 1 VNĐ</span>
              <span className="text-xs text-slate-400">(áp dụng cho thanh toán dịch vụ)</span>
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

      {/* Top-up Credit Modal */}
      {showTopUp && customer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Nạp Credit</h2>
              <button onClick={() => setShowTopUp(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-slate-800 text-lg">Nạp thành công!</p>
                <p className="text-sm text-slate-500 text-center">
                  Đã nạp <strong className="text-amber-700">{Number(topUpAmount).toLocaleString('vi-VN')} Credit</strong> cho <strong>{customer.fullName}</strong>
                </p>
                <button onClick={() => setShowTopUp(false)}
                  className="mt-2 px-6 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                  Đóng
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Customer info */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-600">
                      {customer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{customer.fullName}</p>
                    <p className="text-xs text-slate-500">Số dư hiện tại: <span className="font-semibold text-amber-700">{(customer.creditBalance || 0).toLocaleString('vi-VN')} Credit</span></p>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Số Credit nạp</label>
                  <input
                    type="number"
                    min={100}
                    max={50000}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    placeholder="Nhập số credit (100 - 50.000)"
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(e.target.value)}
                  />
                  {Number(topUpAmount) > 0 && (
                    <p className="text-xs text-[#b11e29] font-semibold mt-1.5">
                      Tương đương: {(Number(topUpAmount) * 1000).toLocaleString('vi-VN')} VNĐ
                      <span className="font-normal text-slate-400 ml-1">(1 Credit = 1.000 VNĐ)</span>
                    </p>
                  )}
                  {Number(topUpAmount) > 0 && (
                    <p className="text-xs text-green-600 mt-0.5">
                      Số dư sau nạp: {((customer.creditBalance || 0) + Number(topUpAmount)).toLocaleString('vi-VN')} Credit
                    </p>
                  )}
                </div>

                {/* Payment method */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Phương thức thanh toán</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ['cash', 'Tiền mặt'],
                      ['bank_transfer', 'Chuyển khoản'],
                      ['card', 'Thẻ'],
                    ] as const).map(([id, label]) => (
                      <label key={id} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all
                        ${topUpMethod === id ? 'border-[#b11e29] bg-[#b11e29]/5 text-[#b11e29]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <input type="radio" name="topup_method" value={id} className="sr-only"
                          checked={topUpMethod === id} onChange={() => setTopUpMethod(id)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowTopUp(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                    Hủy
                  </button>
                  <button onClick={() => setTopUpSuccess(true)}
                    disabled={!topUpAmount || Number(topUpAmount) < 100 || Number(topUpAmount) > 50000}
                    className="flex-1 py-2.5 bg-[#b11e29] text-white rounded-xl text-sm font-semibold hover:bg-[#8f1820] disabled:opacity-40 disabled:cursor-not-allowed">
                    {Number(topUpAmount) >= 100 ? `Nạp ${Number(topUpAmount).toLocaleString('vi-VN')} Credit` : 'Nạp Credit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gift Credit Reward Modal */}
      {showGift && customer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Tặng Credit Reward</h2>
              <button onClick={() => setShowGift(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {giftSuccess ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Gift className="w-7 h-7 text-purple-600" />
                </div>
                <p className="font-semibold text-slate-800 text-lg">Tặng thành công!</p>
                <p className="text-sm text-slate-500 text-center">
                  Đã tặng <strong className="text-purple-700">{Number(giftAmount).toLocaleString('vi-VN')} Credit</strong> reward cho <strong>{customer.fullName}</strong>
                </p>
                <button onClick={() => setShowGift(false)}
                  className="mt-2 px-6 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820]">
                  Đóng
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Customer info */}
                <div className="flex items-center gap-3 p-3 bg-purple-50/60 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{customer.fullName}</p>
                    <p className="text-xs text-slate-500">Reward hiện tại: <span className="font-semibold text-purple-700">{(customer.rewardBalance || 0).toLocaleString('vi-VN')} Credit</span></p>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Số Credit tặng</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    placeholder="Nhập số credit reward"
                    value={giftAmount}
                    onChange={e => setGiftAmount(e.target.value)}
                  />
                  {Number(giftAmount) > 0 && (
                    <p className="text-xs text-purple-600 font-semibold mt-1.5">
                      Tương đương: {(Number(giftAmount) * 1000).toLocaleString('vi-VN')} VNĐ
                    </p>
                  )}
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Nguồn tặng</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ['promotion', 'Khuyến mãi'],
                      ['referral', 'Giới thiệu'],
                      ['birthday', 'Sinh nhật'],
                      ['loyalty', 'Khách thân thiết'],
                      ['compensation', 'Bồi thường'],
                    ] as [CreditRewardSource, string][]).map(([id, label]) => (
                      <label key={id} className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer text-xs font-medium transition-all
                        ${giftSource === id ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <input type="radio" name="gift_source" value={id} className="sr-only"
                          checked={giftSource === id} onChange={() => setGiftSource(id)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Expiry date */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Ngày hết hạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
                    value={giftExpiry}
                    onChange={e => setGiftExpiry(e.target.value)}
                  />
                  {giftExpiry && (
                    <p className="text-xs text-slate-500 mt-1">
                      Hết hạn sau {Math.ceil((new Date(giftExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Mô tả</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30 resize-none"
                    placeholder="VD: Thưởng giới thiệu khách hàng mới"
                    value={giftDesc}
                    onChange={e => setGiftDesc(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowGift(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
                    Hủy
                  </button>
                  <button onClick={() => setGiftSuccess(true)}
                    disabled={!giftAmount || Number(giftAmount) < 1 || !giftExpiry}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    {Number(giftAmount) >= 1 ? `Tặng ${Number(giftAmount).toLocaleString('vi-VN')} Credit` : 'Tặng Credit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
