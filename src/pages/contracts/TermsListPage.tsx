import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useTerms, useDeleteTerms } from '../../hooks/useContracts'
import type { SpaceType, TermsListItem } from '../../types/contract'

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  private_office: 'Private Office',
  meeting_room: 'Meeting Room',
  event_space: 'Event Space',
}

export function TermsListPage() {
  const { t } = useTranslation('contracts')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get('search') || '')
  const [spaceTypeFilter, setSpaceTypeFilter] = useState<SpaceType | ''>(
    (searchParams.get('spaceType') as SpaceType) || ''
  )
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('status') || ''
  )

  const { data: termsData, isLoading } = useTerms({
    search: searchParams.get('search') || undefined,
    spaceType: (searchParams.get('spaceType') as SpaceType) || undefined,
    isActive:
      searchParams.get('status') === 'active'
        ? true
        : searchParams.get('status') === 'inactive'
        ? false
        : undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  })

  const deleteMutation = useDeleteTerms()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchText) params.set('search', searchText)
    if (spaceTypeFilter) params.set('spaceType', spaceTypeFilter)
    if (statusFilter) params.set('status', statusFilter)
    setSearchParams(params)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleDelete = async (terms: TermsListItem) => {
    if (
      confirm(t('terms_confirm_delete', { title: terms.title }))
    ) {
      try {
        await deleteMutation.mutateAsync(terms.id)
      } catch (error) {
        console.error('Failed to delete terms:', error)
      }
    }
  }

  const handleClone = (terms: TermsListItem) => {
    navigate(`/contracts/terms/new?clone=${terms.id}`)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const stats = {
    total: termsData?.pagination.total || 0,
    active: termsData?.data.filter((t) => t.isActive).length || 0,
    inactive: termsData?.data.filter((t) => !t.isActive).length || 0,
  }

  return (
    <>
      <Header
        title={t('terms_page_title')}
        subtitle={t('terms_page_subtitle')}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div />
          <button
            onClick={() => navigate('/contracts/terms/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            {t('terms_btn_create')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">{t('terms_stat_total')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                <p className="text-sm text-slate-500">{t('terms_stat_active')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-400">{stats.inactive}</p>
                <p className="text-sm text-slate-500">{t('terms_stat_inactive')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('terms_search_placeholder')}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={spaceTypeFilter}
              onChange={(e) => setSpaceTypeFilter(e.target.value as SpaceType | '')}
              className="px-4 py-2 border border-slate-200 rounded-lg"
            >
              <option value="">{t('terms_filter_all_types')}</option>
              {Object.entries(SPACE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg"
            >
              <option value="">{t('filter_all_status')}</option>
              <option value="active">{t('terms_status_active')}</option>
              <option value="inactive">{t('terms_status_inactive')}</option>
            </select>

            <button
              onClick={handleSearch}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700"
            >
              <Filter className="w-4 h-4" />
              {t('terms_btn_filter')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">{t('loading')}</div>
          ) : !termsData?.data.length ? (
            <div className="p-8 text-center text-slate-500">
              {t('terms_empty')}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    {t('terms_col_terms')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    {t('terms_col_applicable')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    {t('terms_col_version')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    {t('col_status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    {t('terms_col_effective_from')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    {t('col_actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {termsData.data.map((terms) => (
                  <tr key={terms.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{terms.title}</p>
                        <p className="text-sm text-slate-500 font-mono">{terms.termsCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {terms.applicableSpaceTypes.slice(0, 2).map((type) => (
                          <span
                            key={type}
                            className="inline-flex px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                          >
                            {SPACE_TYPE_LABELS[type]}
                          </span>
                        ))}
                        {terms.applicableSpaceTypes.length > 2 && (
                          <span className="text-xs text-slate-500">
                            +{terms.applicableSpaceTypes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">v{terms.version}</span>
                    </td>
                    <td className="px-4 py-4">
                      {terms.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3 h-3" />
                          {t('terms_badge_active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          <XCircle className="w-3 h-3" />
                          {t('terms_badge_inactive')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(terms.effectiveFrom)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/contracts/terms/${terms.id}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                          title={t('terms_btn_view_tooltip')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/contracts/terms/${terms.id}/edit`)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded"
                          title={t('terms_btn_edit_tooltip')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleClone(terms)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title={t('terms_btn_clone_tooltip')}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(terms)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title={t('terms_btn_delete_tooltip')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {termsData && termsData.pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {t('terms_pagination_showing', { shown: termsData.data.length, total: termsData.pagination.total })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentPage = parseInt(searchParams.get('page') || '1')
                    if (currentPage > 1) {
                      searchParams.set('page', (currentPage - 1).toString())
                      setSearchParams(searchParams)
                    }
                  }}
                  disabled={termsData.pagination.page === 1}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  {t('page_prev')}
                </button>
                <span className="text-sm text-slate-600">
                  {t('pagination_page', { current: termsData.pagination.page, total: termsData.pagination.totalPages })}
                </span>
                <button
                  onClick={() => {
                    const currentPage = parseInt(searchParams.get('page') || '1')
                    if (currentPage < termsData.pagination.totalPages) {
                      searchParams.set('page', (currentPage + 1).toString())
                      setSearchParams(searchParams)
                    }
                  }}
                  disabled={termsData.pagination.page === termsData.pagination.totalPages}
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
