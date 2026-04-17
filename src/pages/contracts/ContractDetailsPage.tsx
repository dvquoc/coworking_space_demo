import { useParams, useNavigate } from 'react-router-dom'
import {
  FileText,
  ArrowLeft,
  Edit,
  RefreshCw,
  XCircle,
  CheckCircle,
  Download,
  Clock,
  Building2,
  User,
  AlertTriangle,
  Ban,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useContract, useActivateContract, useTerminateContract } from '../../hooks/useContracts'
import {
  CONTRACT_STATUS_LABELS,
} from '../../types/contract'
import type { ContractStatus } from '../../types/contract'

export function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: contract, isLoading, error } = useContract(id!)
  const activateMutation = useActivateContract()
  const terminateMutation = useTerminateContract()

  const handleActivate = async () => {
    if (!contract) return
    if (confirm(`Bạn có chắc muốn kích hoạt hợp đồng "${contract.contractCode}"?`)) {
      try {
        await activateMutation.mutateAsync({ id: contract.id })
      } catch (error) {
        console.error('Failed to activate contract:', error)
      }
    }
  }

  const handleTerminate = async () => {
    if (!contract) return
    const reason = prompt('Nhập lý do chấm dứt hợp đồng:')
    if (reason) {
      try {
        await terminateMutation.mutateAsync({
          id: contract.id,
          terminationDate: new Date().toISOString().slice(0, 10),
          reason: 'customer_request',
          reasonNotes: reason,
        })
      } catch (error) {
        console.error('Failed to terminate contract:', error)
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: ContractStatus) => {
    const colorMap: Record<ContractStatus, string> = {
      draft: 'bg-slate-100 text-slate-600',
      active: 'bg-emerald-100 text-emerald-700',
      expiring_soon: 'bg-amber-100 text-amber-700',
      expired: 'bg-rose-100 text-rose-700',
      renewed: 'bg-blue-100 text-blue-700',
      terminated: 'bg-red-100 text-red-700',
    }
    const iconMap: Record<ContractStatus, typeof CheckCircle> = {
      draft: FileText,
      active: CheckCircle,
      expiring_soon: AlertTriangle,
      expired: XCircle,
      renewed: RefreshCw,
      terminated: Ban,
    }
    const Icon = iconMap[status]

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${colorMap[status]}`}
      >
        <Icon className="w-4 h-4" />
        {CONTRACT_STATUS_LABELS[status]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <>
        <Header
          title="Chi tiết hợp đồng"
          subtitle="Đang tải..."
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-slate-500">Đang tải...</div>
        </main>
      </>
    )
  }

  if (error || !contract) {
    return (
      <>
        <Header
          title="Chi tiết hợp đồng"
          subtitle="Lỗi"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-rose-500">
            Không tìm thấy hợp đồng
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header
        title={contract.contractCode}
        subtitle={`${contract.spaceName} • ${contract.customerName}`}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Back button and Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/contracts')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </button>
          <div className="flex items-center gap-2">
            {contract.status === 'draft' && (
              <>
                <button
                  onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleActivate}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Kích hoạt
                </button>
              </>
            )}
            {(contract.status === 'active' ||
              contract.status === 'expiring_soon') && (
              <>
                <button
                  onClick={() => navigate(`/contracts/${contract.id}/extend`)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                >
                  <RefreshCw className="w-4 h-4" />
                  Gia hạn
                </button>
                <button
                  onClick={handleTerminate}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                >
                  <XCircle className="w-4 h-4" />
                  Chấm dứt
                </button>
              </>
            )}
            <button
              onClick={() => {
                /* TODO: Export PDF */
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              Xuất PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Contract Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Thông tin hợp đồng
                </h2>
                {getStatusBadge(contract.status)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Mã hợp đồng
                  </label>
                  <p className="font-mono text-slate-900">
                    {contract.contractCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Không gian thuê
                  </label>
                  <p className="text-slate-900">
                    {contract.spaceName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Ngày bắt đầu
                  </label>
                  <p className="text-slate-900">
                    {new Date(contract.startDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Ngày kết thúc
                  </label>
                  <p className="text-slate-900">
                    {new Date(contract.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Thời hạn
                  </label>
                  <p className="text-slate-900">
                    {contract.durationMonths} tháng
                  </p>
                </div>
                {contract.signedDate && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">
                      Ngày ký
                    </label>
                    <p className="text-slate-900">
                      {new Date(contract.signedDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Thông tin giá
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Phí hàng tháng
                  </label>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatCurrency(contract.monthlyFee)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Tiền đặt cọc
                  </label>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatCurrency(contract.depositAmount)}
                  </p>
                </div>
                {contract.setupFee && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">
                      Phí setup
                    </label>
                    <p className="text-slate-900">
                      {formatCurrency(contract.setupFee)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Tổng giá trị HĐ
                  </label>
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatCurrency(contract.totalValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-renewal Card */}
            {contract.autoRenewalSettings && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Gia hạn tự động
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      contract.autoRenewalSettings.enabled
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="font-medium text-slate-900">
                    {contract.autoRenewalSettings.enabled
                      ? 'Đã bật gia hạn tự động'
                      : 'Chưa bật gia hạn tự động'}
                  </span>
                </div>

                {contract.autoRenewalSettings.enabled && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        Thời hạn gia hạn
                      </label>
                      <p className="text-slate-900">
                        {contract.autoRenewalSettings.renewalDuration} tháng
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        Giá khi gia hạn
                      </label>
                      <p className="text-slate-900">
                        {contract.autoRenewalSettings.renewalPricing === 'same'
                          ? 'Giữ nguyên'
                          : contract.autoRenewalSettings.renewalPricing ===
                            'current_rate'
                          ? 'Theo bảng giá hiện tại'
                          : formatCurrency(
                              contract.autoRenewalSettings.customMonthlyFee || 0
                            )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-1">
                        Thông báo trước
                      </label>
                      <p className="text-slate-900">
                        {contract.autoRenewalSettings.notifyDaysBefore} ngày
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Lịch sử trạng thái
              </h2>

              <div className="space-y-4">
                {contract.statusHistory?.map((history, index) => (
                  <div key={history.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-sky-500 rounded-full" />
                      {index < (contract.statusHistory?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-slate-900">
                        {history.toStatus === 'draft'
                          ? 'Hợp đồng được tạo'
                          : `Trạng thái: ${CONTRACT_STATUS_LABELS[history.toStatus]}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(history.changedAt).toLocaleString('vi-VN')} •{' '}
                        {history.changedBy === 'system'
                          ? 'Hệ thống'
                          : history.changedBy}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-slate-600 mt-1">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Khách hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Tên
                  </label>
                  <p className="font-medium text-slate-900">
                    {contract.customerName}
                  </p>
                </div>
                {contract.customer && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Mã KH
                      </label>
                      <p className="text-slate-700">
                        {contract.customer.customerCode}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Email
                      </label>
                      <p className="text-slate-700">{contract.customer.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Điện thoại
                      </label>
                      <p className="text-slate-700">{contract.customer.phone}</p>
                    </div>
                  </>
                )}
                <button
                  onClick={() => navigate(`/customers/${contract.customerId}`)}
                  className="text-sm text-sky-600 hover:text-sky-700"
                >
                  Xem hồ sơ khách hàng →
                </button>
              </div>
            </div>

            {/* Building Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Địa điểm
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Tòa nhà
                  </label>
                  <p className="font-medium text-slate-900">
                    {contract.buildingName}
                  </p>
                </div>
                {contract.building && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Địa chỉ
                    </label>
                    <p className="text-slate-700">
                      {contract.building.address}
                    </p>
                  </div>
                )}
                {contract.spaceName && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Không gian
                    </label>
                    <p className="text-slate-700">{contract.spaceName}</p>
                  </div>
                )}
                {contract.floorLabel && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Tầng
                    </label>
                    <p className="text-slate-700">{contract.floorLabel}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Template Info */}
            {contract.template && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Mẫu hợp đồng
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Mẫu
                    </label>
                    <p className="font-medium text-slate-900">
                      {contract.template.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Phiên bản
                    </label>
                    <p className="text-slate-700">v{contract.templateVersion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Thông tin khác
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tạo lúc</span>
                  <span className="text-slate-700">
                    {new Date(contract.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {contract.createdByInfo && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tạo bởi</span>
                    <span className="text-slate-700">
                      {contract.createdByInfo.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Cập nhật</span>
                  <span className="text-slate-700">
                    {new Date(contract.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
