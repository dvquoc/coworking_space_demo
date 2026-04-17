import { useState } from 'react'
import {
  Plus,
  Search,
  Edit,
  Ban,
  CheckCircle,
  Users,
  MoreVertical,
} from 'lucide-react'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeactivateEmployee, useReactivateEmployee } from '../../hooks/useCustomers'
import type { CompanyEmployee, CreateEmployeeRequest } from '../../types/customer'

interface EmployeesTabProps {
  customerId: string
}

export function EmployeesTab({ customerId }: EmployeesTabProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<CompanyEmployee | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  const { data: employeesResponse, isLoading } = useEmployees(customerId)
  
  // Filter employees locally based on search and status
  const employees = (employeesResponse?.items || []).filter(emp => {
    const matchesSearch = !search || 
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  const createMutation = useCreateEmployee(customerId)
  const updateMutation = useUpdateEmployee(customerId)
  const deactivateMutation = useDeactivateEmployee(customerId)
  const reactivateMutation = useReactivateEmployee(customerId)
  
  const handleCreate = (data: CreateEmployeeRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false)
      }
    })
  }
  
  const handleUpdate = (id: string, data: Partial<CreateEmployeeRequest>) => {
    updateMutation.mutate({ id, ...data }, {
      onSuccess: () => {
        setEditingEmployee(null)
      }
    })
  }
  
  const handleDeactivate = (id: string) => {
    if (confirm('Bạn có chắc muốn vô hiệu hóa nhân viên này?')) {
      deactivateMutation.mutate({ employeeId: id, options: {} })
    }
    setOpenMenuId(null)
  }
  
  const handleReactivate = (id: string) => {
    reactivateMutation.mutate(id)
    setOpenMenuId(null)
  }
  
  const getRoleBadge = (emp: CompanyEmployee) => {
    if (emp.canManageEmployees) {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Admin</span>
    }
    if (emp.canBookSpaces) {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Member</span>
    }
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">Guest</span>
  }
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700',
      inactive: 'bg-slate-100 text-slate-600',
    }
    const labels: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  // Stats
  const allEmployees = employeesResponse?.items || []
  const stats = {
    total: allEmployees.length,
    active: allEmployees.filter(e => e.status === 'active').length,
    admin: allEmployees.filter(e => e.canManageEmployees).length,
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#b11e29] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div>
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            Tổng: <span className="font-semibold">{stats.total}</span>
          </div>
          <div className="text-sm text-slate-600">
            Đang hoạt động: <span className="font-semibold text-emerald-600">{stats.active}</span>
          </div>
          <div className="text-sm text-slate-600">
            Admin: <span className="font-semibold text-purple-600">{stats.admin}</span>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingEmployee(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm nhân viên
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Vô hiệu hóa</option>
        </select>
      </div>
      
      {/* Employee List */}
      {employees.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600">
            {search || statusFilter !== 'all' 
              ? 'Không tìm thấy nhân viên phù hợp' 
              : 'Chưa có nhân viên nào'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nhân viên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Chức danh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((employee: CompanyEmployee) => (
                <tr key={employee.id} className={`hover:bg-slate-50 ${employee.status === 'inactive' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-600">
                          {employee.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{employee.fullName}</div>
                        <div className="text-xs text-slate-500">{employee.phone || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{employee.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{employee.title || '-'}</td>
                  <td className="px-4 py-3">{getRoleBadge(employee)}</td>
                  <td className="px-4 py-3">{getStatusBadge(employee.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === employee.id ? null : employee.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </button>
                      
                      {/* Context Menu */}
                      {openMenuId === employee.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          ></div>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              onClick={() => {
                                setEditingEmployee(employee)
                                setIsFormOpen(true)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Chỉnh sửa
                            </button>
                            {employee.status === 'active' ? (
                              <button
                                onClick={() => handleDeactivate(employee.id)}
                                className="w-full px-4 py-2 text-sm text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Ban className="w-4 h-4" />
                                Vô hiệu hóa
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivate(employee.id)}
                                className="w-full px-4 py-2 text-sm text-left text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Kích hoạt lại
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Employee Form Modal */}
      {isFormOpen && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => {
            setIsFormOpen(false)
            setEditingEmployee(null)
          }}
          onSubmit={(data) => {
            if (editingEmployee) {
              handleUpdate(editingEmployee.id, data)
            } else {
              handleCreate(data)
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}

// Employee Form Modal
interface EmployeeFormModalProps {
  employee: CompanyEmployee | null
  onClose: () => void
  onSubmit: (data: CreateEmployeeRequest) => void
  isLoading: boolean
}

type RoleType = 'admin' | 'member' | 'guest'

function EmployeeFormModal({ employee, onClose, onSubmit, isLoading }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    title: employee?.title || '',
    department: employee?.department || '',
    role: (employee?.canManageEmployees ? 'admin' : employee?.canBookSpaces ? 'member' : 'guest') as RoleType,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Vui lòng nhập họ'
    if (!formData.lastName.trim()) newErrors.lastName = 'Vui lòng nhập tên'
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const data: CreateEmployeeRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        title: formData.title || undefined,
        department: formData.department || undefined,
        canBookSpaces: formData.role === 'member' || formData.role === 'admin',
        canViewInvoices: formData.role === 'admin',
        canManageEmployees: formData.role === 'admin',
      }
      onSubmit(data)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* First Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Họ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                  errors.firstName 
                    ? 'border-rose-300 focus:ring-rose-200' 
                    : 'border-slate-300 focus:ring-[#b11e29]/20 focus:border-[#b11e29]'
                }`}
                placeholder="Nguyễn"
              />
              {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                  errors.lastName 
                    ? 'border-rose-300 focus:ring-rose-200' 
                    : 'border-slate-300 focus:ring-[#b11e29]/20 focus:border-[#b11e29]'
                }`}
                placeholder="Văn A"
              />
              {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-rose-300 focus:ring-rose-200' 
                  : 'border-slate-300 focus:ring-[#b11e29]/20 focus:border-[#b11e29]'
              }`}
              placeholder="email@company.com"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
              placeholder="0901234567"
            />
          </div>
          
          {/* Title & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Chức danh
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
                placeholder="Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phòng ban
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
                placeholder="IT"
              />
            </div>
          </div>
          
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vai trò
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as RoleType }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/20 focus:border-[#b11e29]"
            >
              <option value="admin">Admin - Có quyền quản lý</option>
              <option value="member">Member - Có quyền đặt chỗ</option>
              <option value="guest">Guest - Chỉ xem</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {employee ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
