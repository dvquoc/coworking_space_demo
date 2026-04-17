import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  User,
  Calendar,
  DollarSign,
  PhoneCall,
  Send,
  Users,
  StickyNote,
  Plus,
  X,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useLeadById, useLeadActivities, useCreateActivity, useUpdateLead } from '../../hooks/useCRM'
import type { LeadStage, ActivityType, CreateActivityRequest } from '../../types/crm'

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

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <PhoneCall className="w-4 h-4" />,
  email: <Send className="w-4 h-4" />,
  meeting: <Users className="w-4 h-4" />,
  note: <StickyNote className="w-4 h-4" />,
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  call: 'bg-emerald-100 text-emerald-600',
  email: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  note: 'bg-amber-100 text-amber-600',
}

const ALL_STAGES: LeadStage[] = [
  'inquiry', 'contacted', 'tour_scheduled', 'tour_completed',
  'proposal_sent', 'negotiation', 'closed_won', 'closed_lost',
]

type ActivityFormData = {
  type: ActivityType
  subject: string
  description: string
  activityDate: string
}

const initialActivityForm: ActivityFormData = {
  type: 'call',
  subject: '',
  description: '',
  activityDate: new Date().toISOString().slice(0, 16),
}

export function LeadDetailsPage() {
  const { t } = useTranslation('crm')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityForm, setActivityForm] = useState<ActivityFormData>(initialActivityForm)
  const [actErrors, setActErrors] = useState<Partial<ActivityFormData>>({})

  const { data: lead, isLoading } = useLeadById(id ?? '')
  const { data: activities } = useLeadActivities(id ?? '')
  const createActivity = useCreateActivity()
  const updateLead = useUpdateLead()

  if (isLoading) {
    return (
      <>
        <Header title={t('details_title')} subtitle={t('loading')} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-slate-500">{t('loading')}</div>
        </main>
      </>
    )
  }

  if (!lead) {
    return (
      <>
        <Header title={t('details_title')} subtitle="" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="text-center text-slate-500">{t('details_not_found')}</div>
        </main>
      </>
    )
  }

  const handleStageChange = async (stage: LeadStage) => {
    await updateLead.mutateAsync({ id: lead.id, data: { stage } })
  }

  const handleActivityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setActivityForm((prev) => ({ ...prev, [name]: value }))
    if (actErrors[name as keyof ActivityFormData]) {
      setActErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateActivity = (): boolean => {
    const errs: Partial<ActivityFormData> = {}
    if (!activityForm.subject.trim()) errs.subject = t('act_err_subject')
    if (!activityForm.description.trim()) errs.description = t('act_err_description')
    setActErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitActivity = async () => {
    if (!validateActivity()) return
    const payload: CreateActivityRequest = {
      leadId: lead.id,
      type: activityForm.type,
      subject: activityForm.subject,
      description: activityForm.description,
      activityDate: new Date(activityForm.activityDate).toISOString(),
    }
    await createActivity.mutateAsync(payload)
    setShowActivityForm(false)
    setActivityForm(initialActivityForm)
    setActErrors({})
  }

  const handleConvert = () => {
    if (confirm(t('confirm_convert', { name: lead.fullName }))) {
      updateLead.mutate({ id: lead.id, data: { status: 'converted', stage: 'closed_won' } })
    }
  }

  const handleMarkLost = () => {
    const reason = prompt(t('prompt_lost_reason'))
    if (reason !== null) {
      updateLead.mutate({
        id: lead.id,
        data: { status: 'lost', stage: 'closed_lost', lostReason: reason },
      })
    }
  }

  return (
    <>
      <Header title={t('details_title')} subtitle={lead.leadCode} />

      <main className="flex-1 overflow-y-auto p-6">
        <button
          onClick={() => navigate('/crm/leads')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('btn_back')}
        </button>

        {/* Status banners */}
        {lead.status === 'converted' && (
          <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-700">
            {t('details_converted_note')}
          </div>
        )}
        {lead.status === 'lost' && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
            {t('details_lost_note')}
            {lead.lostReason && <span className="ml-1">{t('details_lost_reason', { reason: lead.lostReason })}</span>}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main column */}
          <div className="col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('details_contact_info')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{t('form_label_name')}</p>
                    <p className="text-sm font-medium text-slate-900">{lead.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{t('form_label_email')}</p>
                    <a href={`mailto:${lead.email}`} className="text-sm text-sky-600 hover:underline">{lead.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{t('form_label_phone')}</p>
                    <a href={`tel:${lead.phone}`} className="text-sm text-sky-600 hover:underline">{lead.phone}</a>
                  </div>
                </div>
                {lead.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">{t('form_label_company')}</p>
                      <p className="text-sm text-slate-900">{lead.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('details_lead_info')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('details_label_source')}</p>
                  <p className="text-sm text-slate-900">{t(`source_${lead.source}`)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('details_label_interested')}</p>
                  <div className="flex flex-wrap gap-1">
                    {lead.interestedIn.map((type) => (
                      <span key={type} className="inline-flex px-2 py-0.5 bg-sky-50 text-sky-700 text-xs rounded">
                        {t(`space_${type}`)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{t('details_label_budget')}</p>
                    <p className="text-sm text-slate-900">
                      {lead.budget
                        ? `${lead.budget.toLocaleString('vi-VN')} VNĐ${t('details_budget_suffix')}`
                        : t('details_not_set')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">{t('details_label_move_in')}</p>
                    <p className="text-sm text-slate-900">
                      {lead.expectedMoveInDate
                        ? new Date(lead.expectedMoveInDate).toLocaleDateString('vi-VN')
                        : t('details_not_set')}
                    </p>
                  </div>
                </div>
                {lead.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">{t('details_label_notes')}</p>
                    <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{lead.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">{t('details_activities')}</h2>
                {lead.status === 'active' && (
                  <button
                    onClick={() => setShowActivityForm(!showActivityForm)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824]"
                  >
                    {showActivityForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {t('btn_add_activity')}
                  </button>
                )}
              </div>

              {/* Activity form */}
              {showActivityForm && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">{t('act_form_title')}</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t('act_label_type')}</label>
                        <select
                          name="type"
                          value={activityForm.type}
                          onChange={handleActivityChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                          {(['call', 'email', 'meeting', 'note'] as ActivityType[]).map((type) => (
                            <option key={type} value={type}>{t(`activity_${type}`)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">{t('act_label_date')}</label>
                        <input
                          name="activityDate"
                          type="datetime-local"
                          value={activityForm.activityDate}
                          onChange={handleActivityChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t('act_label_subject')}</label>
                      <input
                        name="subject"
                        value={activityForm.subject}
                        onChange={handleActivityChange}
                        placeholder={t('act_placeholder_subject')}
                        className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${actErrors.subject ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                      {actErrors.subject && <p className="text-xs text-rose-500 mt-1">{actErrors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t('act_label_description')}</label>
                      <textarea
                        name="description"
                        value={activityForm.description}
                        onChange={handleActivityChange}
                        rows={3}
                        placeholder={t('act_placeholder_description')}
                        className={`w-full px-3 py-2 border rounded-lg text-sm resize-none bg-white ${actErrors.description ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                      {actErrors.description && <p className="text-xs text-rose-500 mt-1">{actErrors.description}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setShowActivityForm(false); setActivityForm(initialActivityForm); setActErrors({}) }}
                        className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100"
                      >
                        {t('btn_cancel')}
                      </button>
                      <button
                        onClick={handleSubmitActivity}
                        disabled={createActivity.isPending}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824] disabled:opacity-50"
                      >
                        {createActivity.isPending ? t('btn_saving') : t('btn_save')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {!activities?.length ? (
                <div className="text-center text-slate-400 text-sm py-8">{t('details_no_activities')}</div>
              ) : (
                <div className="space-y-3">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ACTIVITY_COLORS[act.type]}`}>
                        {ACTIVITY_ICONS[act.type]}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500">{t(`activity_${act.type}`)}</span>
                            <span className="text-sm font-medium text-slate-900">{act.subject}</span>
                          </div>
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {new Date(act.activityDate).toLocaleString('vi-VN', {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{act.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{act.performedByName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pipeline Stage */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">{t('details_pipeline')}</h3>
              <div className="mb-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STAGE_COLORS[lead.stage]}`}>
                  {t(`stage_${lead.stage}`)}
                </span>
              </div>
              {lead.status === 'active' && (
                <select
                  value={lead.stage}
                  onChange={(e) => handleStageChange(e.target.value as LeadStage)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {ALL_STAGES.map((s) => (
                    <option key={s} value={s}>{t(`stage_${s}`)}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Meta Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('details_label_status')}</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lead.status === 'active' ? 'bg-emerald-100 text-emerald-700'
                  : lead.status === 'converted' ? 'bg-sky-100 text-sky-700'
                  : 'bg-rose-100 text-rose-700'
                }`}>
                  {t(`status_${lead.status}`)}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('details_label_assigned')}</p>
                <p className="text-sm text-slate-900">
                  {lead.assignedToName ?? <span className="text-slate-400 italic">{t('details_unassigned')}</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('details_label_created')}</p>
                <p className="text-sm text-slate-900">
                  {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Actions */}
            {lead.status === 'active' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-3">{t('details_actions')}</h3>
                <div className="space-y-2">
                  {(lead.stage === 'proposal_sent' || lead.stage === 'negotiation') && (
                    <button
                      onClick={handleConvert}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                    >
                      {t('btn_convert')}
                    </button>
                  )}
                  <button
                    onClick={handleMarkLost}
                    className="w-full px-4 py-2 text-sm font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                  >
                    {t('btn_mark_lost')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
