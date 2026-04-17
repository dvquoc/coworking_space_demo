import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Building2, 
  User, 
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Wallet,
  CirclePlus,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useCustomers, useSuspendCustomer, useReactivateCustomer } from '../../hooks/useCustomers'
import { TagChip } from '../../components/customers/TagChip'
import { CustomerFormModal } from '../../components/customers/CustomerFormModal'
import type { CustomerListItem, CustomerStatus, CustomerType } from '../../types/customer'

export function CustomerListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State from URL params
  const search = searchParams.get('search') || ''
  const statusFilter = (searchParams.get('status') || '') as CustomerStatus | ''
  const typeFilter = (searchParams.get('type') || '') as CustomerType | ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Fetch customers
  const { data, isLoading, error } = useCustomers({
    search: search || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    page,
    pageSize: 10,
  })
  
  const suspendMutation = useSuspendCustomer()
  const reactivateMutation = useReactivateCustomer()

  // Update URL params
  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    // Reset page when filters change
    if (!updates.page) {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  // Stats
  const stats = useMemo(() => {
    if (!data?.items) return { total: 0, active: 0, individual: 0, company: 0, totalCredit: 0 }
    return {
      total: data.pagination.totalItems,
      active: data.items.filter(c => c.status === 'active').length,
      individual: data.items.filter(c => c.customerType === 'individual').length,
      company: data.items.filter(c => c.customerType === 'company').length,
      totalCredit: data.items.reduce((sum, c) => sum + c.creditBalance + c.rewardBalance, 0),
    }
  }, [data])

  const handleViewCustomer = (customer: CustomerListItem) => {
    navigate(`/customers/${customer.id}`)
  }

  const handleEditCustomer = (customer: CustomerListItem) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
    setOpenMenuId(null)
  }

  const handleSuspendCustomer = async (customer: CustomerListItem) => {
    const reason = prompt('Nhập lý do tạm ngưng khách hàng:')
    if (reason) {
      try {
        await suspendMutation.mutateAsync({ id: customer.id, reason })
      } catch (error) {
        console.error('Failed to suspend customer:', error)
      }
    }
    setOpenMenuId(null)
  }

  const handleReactivateCustomer = async (customer: CustomerListItem) => {
    if (confirm('Bạn có chắc muốn kích hoạt lại khách hàng này?')) {
      try {
        await reactivateMutation.mutateAsync(customer.id)
      } catch (error) {
        console.error('Failed to reactivate customer:', error)
      }
    }
    setOpenMenuId(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const getStatusBadge = (status: CustomerStatus) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-slate-100 text-slate-600',
      suspended: 'bg-rose-100 text-rose-700',
    }
    const labels = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      suspended: 'Tạm ngưng',
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getTypeBadge = (type: CustomerType) => {
    if (type === 'company') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          <Building2 className="w-3 h-3" />
          Công ty
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
        <User className="w-3 h-3" />
        Cá nhân
      </span>
    )
  }

  return (
    <>
      <Header 
        title="Khách hàng" 
        subtitle="Quản lý thông tin khách hàng"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Tổng khách hàng</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#b11e29]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#b11e29]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Đang hoạt động</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Cá nhân</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {stats.individual}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Công ty</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {stats.company}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Tổng số dư Credit</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {new Intl.NumberFormat('vi-VN').format(stats.totalCredit)} Credit
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Header & Filters */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Danh sách khách hàng</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm khách hàng
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, SĐT..."
                    value={search}
                    onChange={(e) => updateParams({ search: e.target.value || undefined })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => updateParams({ status: e.target.value || undefined })}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm ngưng</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => updateParams({ type: e.target.value || undefined })}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b11e29] focus:border-transparent"
                >
                  <option value="">Tất cả loại</option>
                  <option value="individual">Cá nhân</option>
                  <option value="company">Công ty</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-[#b11e29] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Đang tải...
                </div>
              ) : error ? (
                <div className="p-12 text-center text-rose-500">
                  Lỗi: {error.message}
                </div>
              ) : !data || data.items.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Không tìm thấy khách hàng</p>
                  <p className="text-sm mt-1">Thêm khách hàng đầu tiên để bắt đầu</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Mã KH
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Thông tin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Số dư Credit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.items.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600">
                            {customer.customerCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              {customer.customerType === 'company' ? (
                                <Building2 className="w-5 h-5 text-slate-500" />
                              ) : (
                                <span className="text-sm font-medium text-slate-600">
                                  {customer.fullName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{customer.fullName}</p>
                              {customer.companyName && (
                                <p className="text-sm text-slate-500">{customer.companyName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-slate-900">{customer.email}</p>
                            <p className="text-slate-500">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(customer.customerType)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.slice(0, 3).map((tag) => (
                              <TagChip key={tag} tagName={tag} size="sm" />
                            ))}
                            {customer.tags.length > 3 && (
                              <span className="text-xs text-slate-500">
                                +{customer.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {new Intl.NumberFormat('vi-VN').format(customer.creditBalance + customer.rewardBalance)} Credit
                            </p>
                            {customer.rewardBalance > 0 && (
                              <p className="text-xs text-amber-600">
                                ({new Intl.NumberFormat('vi-VN').format(customer.rewardBalance)} reward)
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(customer.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === customer.id ? null : customer.id)
                              }}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-5 h-5 text-slate-500" />
                            </button>
                            
                            {openMenuId === customer.id && (
                              <div 
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleViewCustomer(customer)}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem chi tiết
                                </button>
                                <button
                                  onClick={() => handleEditCustomer(customer)}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Chỉnh sửa
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // TODO: Open top-up modal
                                    alert(`Nạp Credit cho ${customer.fullName} - Coming soon`)
                                    setOpenMenuId(null)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                                >
                                  <CirclePlus className="w-4 h-4" />
                                  Nạp Credit
                                </button>
                                <hr className="my-1 border-slate-200" />
                                {customer.status === 'suspended' ? (
                                  <button
                                    onClick={() => handleReactivateCustomer(customer)}
                                    className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Kích hoạt lại
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSuspendCustomer(customer)}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <Ban className="w-4 h-4" />
                                    Tạm ngưng
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Hiển thị {(page - 1) * 10 + 1} - {Math.min(page * 10, data.pagination.totalItems)} / {data.pagination.totalItems} khách hàng
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateParams({ page: String(page - 1) })}
                    disabled={page <= 1}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Trước
                  </button>
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        p === page 
                          ? 'bg-[#b11e29] text-white' 
                          : 'border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParams({ page: String(page + 1) })}
                    disabled={page >= data.pagination.totalPages}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customerId={editingCustomer?.id}
      />
    </>
  )
}
