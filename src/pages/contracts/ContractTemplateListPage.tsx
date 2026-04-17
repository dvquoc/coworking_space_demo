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
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import {
  useContractTemplates,
  useDeleteContractTemplate,
  useSetTemplateActive,
} from '../../hooks/useContracts'
import type {
  ContractTemplateListItem,
} from '../../types/contract'

export function ContractTemplateListPage() {
  const { t } = useTranslation('contracts')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // State from URL params
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Fetch templates
  const { data, isLoading, error } = useContractTemplates({
    search: search || undefined,
    page,
    limit: 10,
  })

  const deleteMutation = useDeleteContractTemplate()
  const setActiveMutation = useSetTemplateActive()

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
    if (!data?.data) return { total: 0, active: 0 }
    return {
      total: data.pagination.total,
      active: data.data.filter((t) => t.isActive).length,
    }
  }, [data])

  const handleViewTemplate = (template: ContractTemplateListItem) => {
    navigate(`/contracts/templates/${template.id}`)
  }

  const handleEditTemplate = (template: ContractTemplateListItem) => {
    navigate(`/contracts/templates/${template.id}/edit`)
    setOpenMenuId(null)
  }

  const handleCloneTemplate = (template: ContractTemplateListItem) => {
    navigate(`/contracts/templates/new?clone=${template.id}`)
    setOpenMenuId(null)
  }

  const handleToggleActive = async (template: ContractTemplateListItem) => {
    try {
      await setActiveMutation.mutateAsync({
        id: template.id,
        isActive: !template.isActive,
      })
    } catch (error) {
      console.error('Failed to toggle template active:', error)
    }
    setOpenMenuId(null)
  }

  const handleDeleteTemplate = async (template: ContractTemplateListItem) => {
    if (
      confirm(`${t('tpl_confirm_delete', { name: template.name })}`)
    ) {
      try {
        await deleteMutation.mutateAsync(template.id)
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
    setOpenMenuId(null)
  }

  const getStatusBadge = (isActive: boolean, isDefault: boolean) => {
    if (isDefault) {
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
          {t('tpl_status_default')}
        </span>
      )
    }
    if (isActive) {
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          {t('tpl_status_active')}
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
        {t('tpl_status_inactive')}
      </span>
    )
  }

  return (
    <>
      <Header
        title={t('tpl_page_title')}
        subtitle={t('tpl_page_subtitle')}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Action Bar */}
          <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => navigate('/contracts/templates/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('tpl_btn_create')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-500">{t('tpl_stat_total')}</p>
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
                <p className="text-sm text-slate-500">{t('tpl_stat_active')}</p>
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
                placeholder={t('tpl_search_placeholder')}
                value={search}
                onChange={(e) => updateParams({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
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
              {t('tpl_empty')}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('tpl_col_code')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('tpl_col_name')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('label_version')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('label_updated_at')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {t('col_actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.data.map((template) => (
                  <tr
                    key={template.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleViewTemplate(template)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-slate-600">
                        {template.templateCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {template.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        v{template.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(template.isActive, template.isDefault)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500">
                        {new Date(template.updatedAt).toLocaleDateString(
                          'vi-VN'
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(
                              openMenuId === template.id ? null : template.id
                            )
                          }}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>

                        {openMenuId === template.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewTemplate(template)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Eye className="w-4 h-4" />
                              {t('menu_view')}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditTemplate(template)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit className="w-4 h-4" />
                              {t('menu_edit')}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCloneTemplate(template)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Copy className="w-4 h-4" />
                              {t('tpl_menu_clone')}
                            </button>
                            <hr className="my-1 border-slate-200" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleActive(template)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              {template.isActive ? (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  {t('tpl_status_inactive')}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  {t('menu_activate')}
                                </>
                              )}
                            </button>
                            {!template.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTemplate(template)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('tpl_menu_delete')}
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

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {t('tpl_pagination_showing', { shown: data.data.length, total: data.pagination.total })}
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
