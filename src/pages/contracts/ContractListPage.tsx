import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  XCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Ban,
  LayoutTemplate,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBuildings, mockFloors } from '../../mocks/propertyMocks'
import {
  useContracts,
  useActivateContract,
  useTerminateContract,
} from '../../hooks/useContracts'
import type {
  ContractListItem,
  ContractStatus,
} from '../../types/contract'

export function ContractListPage() {
  const { t } = useTranslation('contracts')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // State from URL params
  const search = searchParams.get('search') || ''
  const statusFilter = (searchParams.get('status') || '') as ContractStatus | ''
  const buildingFilter = searchParams.get('building') || ''
  const floorFilter = searchParams.get('floor') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const availableFloors = useMemo(
    () => (buildingFilter ? mockFloors.filter((f) => f.buildingId === buildingFilter) : []),
    [buildingFilter]
  )

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Fetch contracts
  const { data, isLoading, error } = useContracts({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    limit: 10,
  })

  const activateMutation = useActivateContract()
  const terminateMutation = useTerminateContract()

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
    if (!updates.page) {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  // Stats
  const stats = useMemo(() => {
    if (!data?.data)
      return { total: 0, active: 0, expiring: 0, draft: 0 }
    return {
      total: data.pagination.total,
      active: data.data.filter((c) => c.status === 'active').length,
      expiring: data.data.filter((c) => c.status === 'expiring_soon').length,
      draft: data.data.filter((c) => c.status === 'draft').length,
    }
  }, [data])

  const handleViewContract = (contract: ContractListItem) => {
    navigate(`/contracts/${contract.id}`)
  }

  const handleEditContract = (contract: ContractListItem) => {
    navigate(`/contracts/${contract.id}/edit`)
    setOpenMenuId(null)
  }

  const handleActivateContract = async (contract: ContractListItem) => {
    if (confirm(t('confirm_activate', { code: contract.contractCode }))) {
      try {
        await activateMutation.mutateAsync({ id: contract.id })
      } catch (error) {
        console.error('Failed to activate contract:', error)
      }
    }
    setOpenMenuId(null)
  }

  const handleTerminateContract = async (contract: ContractListItem) => {
    const reason = prompt(t('prompt_terminate'))
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
    setOpenMenuId(null)
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
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}
      >
        <Icon className="w-3 h-3" />
        {t(`status_${status}`)}
      </span>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getDaysRemainingBadge = (days: number, status: ContractStatus) => {
    if (
      status === 'expired' ||
      status === 'terminated' ||
      status === 'renewed'
    ) {
      return <span className="text-sm text-slate-400">—</span>
    }
    if (days <= 0) {
      return (
        <span className="text-sm font-medium text-rose-600">{t('days_expired')}</span>
      )
    }
    if (days <= 30) {
      return (
        <span className="text-sm font-medium text-amber-600">
          {t('days_remaining', { count: days })}
        </span>
      )
    }
    return <span className="text-sm text-slate-600">{t('days_remaining', { count: days })}</span>
  }

  return (
    <>
      <Header
        title={t('page_title')}
        subtitle={t('page_subtitle')}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            onClick={() => navigate('/contracts/templates')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" />
            {t('btn_template_setup')}
          </button>
          <button
            onClick={() => navigate('/contracts/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#8f1820] transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('btn_create')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-500">{t('stat_total')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.active}
                </p>
                <p className="text-sm text-slate-500">{t('stat_active')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.expiring}
                </p>
                <p className="text-sm text-slate-500">{t('stat_expiring')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.draft}
                </p>
                <p className="text-sm text-slate-500">{t('stat_draft')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => updateParams({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Building Filter */}
            <select
              value={buildingFilter}
              onChange={(e) =>
                updateParams({ building: e.target.value, floor: undefined })
              }
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">{t('filter_all_buildings')}</option>
              {mockBuildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Floor Filter */}
            <select
              value={floorFilter}
              onChange={(e) => updateParams({ floor: e.target.value })}
              disabled={!buildingFilter}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">{t('filter_all_floors')}</option>
              {availableFloors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.floorName || `Tầng ${f.floorNumber}`}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => updateParams({ status: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">{t('filter_all_status')}</option>
              <option value="draft">{t('status_draft')}</option>
              <option value="active">{t('status_active')}</option>
              <option value="expiring_soon">{t('status_expiring_soon')}</option>
              <option value="expired">{t('status_expired')}</option>
              <option value="renewed">{t('status_renewed')}</option>
              <option value="terminated">{t('status_terminated')}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">{t('loading')}</div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500">
              {t('error_load')}
            </div>
          ) : !data?.data.length ? (
            <div className="p-8 text-center text-slate-500">
              {t('empty')}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_code')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_customer')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_location')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_duration')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_monthly_fee')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_remaining')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_status')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.data.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleViewContract(contract)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-slate-600">
                        {contract.contractCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {contract.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {contract.customerType === 'company'
                            ? t('customer_company')
                            : t('customer_individual')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-900">
                          {contract.buildingName}
                        </p>
                        {contract.spaceName && (
                          <p className="text-xs text-slate-500">
                            {contract.spaceName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="text-slate-900">
                          {new Date(contract.startDate).toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                        <p className="text-slate-500">
                          → {new Date(contract.endDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(contract.monthlyFee)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getDaysRemainingBadge(
                        contract.daysRemaining,
                        contract.status
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(contract.status)}
                        {contract.autoRenewEnabled && (
                          <span title={t('auto_renew_title')}>
                            <RefreshCw className="w-3 h-3 text-blue-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(
                              openMenuId === contract.id ? null : contract.id
                            )
                          }}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>

                        {openMenuId === contract.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewContract(contract)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Eye className="w-4 h-4" />
                              {t('menu_view')}
                            </button>

                            {contract.status === 'draft' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditContract(contract)
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <Edit className="w-4 h-4" />
                                  {t('menu_edit')}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleActivateContract(contract)
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  {t('menu_activate')}
                                </button>
                              </>
                            )}

                            {(contract.status === 'active' ||
                              contract.status === 'expiring_soon') && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/contracts/${contract.id}/extend`)
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  {t('menu_renew')}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTerminateContract(contract)
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  {t('menu_terminate')}
                                </button>
                              </>
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

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {t('pagination_showing', { shown: data.data.length, total: data.pagination.total })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateParams({ page: String(Math.max(1, page - 1)) })
                  }
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  {t('page_prev')}
                </button>
                <span className="text-sm text-slate-600">
                  {t('pagination_page', { current: page, total: data.pagination.totalPages })}
                </span>
                <button
                  onClick={() =>
                    updateParams({
                      page: String(
                        Math.min(data.pagination.totalPages, page + 1)
                      ),
                    })
                  }
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  {t('page_next')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
