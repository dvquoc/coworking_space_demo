import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Search,
  LayoutGrid,
  Eye,
  Users,
  TrendingUp,
  Star,
  Calendar,
  X,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useLeads, useCRMStats, useCreateLead } from '../../hooks/useCRM'
import type {
  LeadStage,
  LeadSource,
  LeadStatus,
  CRMSpaceType,
  CreateLeadRequest,
} from '../../types/crm'

const STAGE_COLORS: Record<LeadStage, string> = {
  inquiry: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-100 text-blue-700',
  tour_scheduled: 'bg-amber-100 text-amber-700',
  tour_completed: 'bg-purple-100 text-purple-700',
  proposal_sent: 'bg-orange-100 text-orange-700',
  negotiation: 'bg-rose-100 text-rose-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-slate-200 text-slate-500',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  converted: 'bg-sky-100 text-sky-700',
  lost: 'bg-rose-100 text-rose-700',
  invalid: 'bg-slate-100 text-slate-500',
}

const ALL_STAGES: LeadStage[] = [
  'inquiry',
  'contacted',
  'tour_scheduled',
  'tour_completed',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost',
]

const ALL_SOURCES: LeadSource[] = [
  'website',
  'referral',
  'facebook_ad',
  'google_ad',
  'walk_in',
  'other',
]

const SPACE_TYPES: CRMSpaceType[] = [
  'hot_desk',
  'dedicated_desk',
  'private_office',
  'meeting_room',
  'event_space',
]

type FormData = {
  fullName: string
  email: string
  phone: string
  company: string
  source: LeadSource | ''
  interestedIn: CRMSpaceType[]
  budget: string
  expectedMoveInDate: string
  notes: string
}

const initialForm: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  source: '',
  interestedIn: [],
  budget: '',
  expectedMoveInDate: '',
  notes: '',
}

export function LeadListPage() {
  const { t } = useTranslation('crm')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const stage = (searchParams.get('stage') || '') as LeadStage | ''
  const source = (searchParams.get('source') || '') as LeadSource | ''

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const { data, isLoading } = useLeads({ search, stage, source, page })
  const { data: stats } = useCRMStats()
  const createMutation = useCreateLead()

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page')
    setSearchParams(next)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const toggleSpaceType = (type: CRMSpaceType) => {
    setFormData((prev) => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(type)
        ? prev.interestedIn.filter((t) => t !== type)
        : [...prev.interestedIn, type],
    }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!formData.fullName.trim()) errs.fullName = t('err_name_required')
    if (!formData.email.trim()) errs.email = t('err_email_required')
    if (!formData.phone.trim()) errs.phone = t('err_phone_required')
    if (!formData.source) errs.source = t('err_source_required')
    if (formData.interestedIn.length === 0) errs.interestedIn = t('err_interested_required')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const payload: CreateLeadRequest = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || undefined,
      source: formData.source as LeadSource,
      interestedIn: formData.interestedIn,
      budget: formData.budget ? Number(formData.budget) : undefined,
      expectedMoveInDate: formData.expectedMoveInDate || undefined,
      notes: formData.notes || undefined,
    }
    await createMutation.mutateAsync(payload)
    setShowModal(false)
    setFormData(initialForm)
    setErrors({})
  }

  return (
    <>
      <Header title={t('page_title')} subtitle={t('page_subtitle')} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{t('stat_total')}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalLeads}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm text-slate-500">{t('stat_active')}</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{stats.activeLeads}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sky-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm text-slate-500">{t('stat_converted')}</span>
              </div>
              <p className="text-2xl font-bold text-sky-600">{stats.convertedLeads}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-slate-500">{t('stat_new_month')}</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.newThisMonth}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm text-slate-500">{t('stat_conversion_rate')}</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            {/* Stage filter */}
            <select
              value={stage}
              onChange={(e) => updateParam('stage', e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">{t('filter_all_stages')}</option>
              {ALL_STAGES.map((s) => (
                <option key={s} value={s}>{t(`stage_${s}`)}</option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={source}
              onChange={(e) => updateParam('source', e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">{t('filter_all_sources')}</option>
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>{t(`source_${s}`)}</option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => navigate('/crm/leads/kanban')}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <LayoutGrid className="w-4 h-4" />
                {t('btn_kanban_view')}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824]"
              >
                <Plus className="w-4 h-4" />
                {t('btn_add_lead')}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">{t('loading')}</div>
          ) : !data?.data.length ? (
            <div className="p-8 text-center text-slate-500">{t('empty')}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_lead')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_source')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_stage')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_status')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_assigned')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('col_created')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">{t('col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{lead.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono">{lead.leadCode}</p>
                        {lead.company && (
                          <p className="text-xs text-slate-400">{lead.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">{t(`source_${lead.source}`)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[lead.stage]}`}>
                        {t(`stage_${lead.stage}`)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {t(`status_${lead.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">
                        {lead.assignedToName ?? (
                          <span className="text-slate-400 italic">{t('details_unassigned')}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/crm/leads/${lead.id}`)}
                          title={t('btn_view')}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set('page', String(Math.max(1, page - 1)))
                    setSearchParams(next)
                  }}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  {t('page_prev')}
                </button>
                <span className="text-sm text-slate-600">
                  {t('pagination_page', { current: page, total: data.pagination.totalPages })}
                </span>
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set('page', String(Math.min(data.pagination.totalPages, page + 1)))
                    setSearchParams(next)
                  }}
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

      {/* Create Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{t('form_create_title')}</h2>
              <button onClick={() => { setShowModal(false); setFormData(initialForm); setErrors({}) }} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form_label_name')} <span className="text-rose-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('form_placeholder_name')}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.fullName ? 'border-rose-300' : 'border-slate-200'}`}
                />
                {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form_label_email')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('form_placeholder_email')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form_label_phone')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('form_placeholder_phone')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.phone ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_label_company')}</label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={t('form_placeholder_company')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form_label_source')} <span className="text-rose-500">*</span>
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.source ? 'border-rose-300' : 'border-slate-200'}`}
                >
                  <option value="">{t('form_select_source')}</option>
                  {ALL_SOURCES.map((s) => (
                    <option key={s} value={s}>{t(`source_${s}`)}</option>
                  ))}
                </select>
                {errors.source && <p className="text-xs text-rose-500 mt-1">{errors.source}</p>}
              </div>

              {/* Interested In */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('form_label_interested')} <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPACE_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`inline-flex items-center px-3 py-1.5 border rounded-lg cursor-pointer text-sm ${
                        formData.interestedIn.includes(type)
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.interestedIn.includes(type)}
                        onChange={() => toggleSpaceType(type)}
                        className="sr-only"
                      />
                      {t(`space_${type}`)}
                    </label>
                  ))}
                </div>
                {errors.interestedIn && <p className="text-xs text-rose-500 mt-1">{errors.interestedIn}</p>}
              </div>

              {/* Budget + MoveIn date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_label_budget')}</label>
                  <input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder={t('form_placeholder_budget')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_label_move_in')}</label>
                  <input
                    name="expectedMoveInDate"
                    type="date"
                    value={formData.expectedMoveInDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_label_notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('form_placeholder_notes')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => { setShowModal(false); setFormData(initialForm); setErrors({}) }}
                className="px-4 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {t('btn_cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824] disabled:opacity-50"
              >
                {createMutation.isPending ? t('btn_saving') : t('btn_submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
