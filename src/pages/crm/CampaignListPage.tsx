import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Megaphone, CheckCircle, FileText, PlayCircle } from 'lucide-react'
import Header from '../../components/layout/Header'
import { useCampaigns, useCampaignStats, useCreateCampaign } from '../../hooks/useCRM'
import type { CampaignType, CampaignStatus, CampaignAudience, CreateCampaignRequest } from '../../types/crm'

const STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
}

const TYPE_STYLES: Record<CampaignType, string> = {
  email: 'bg-sky-100 text-sky-700',
  sms: 'bg-violet-100 text-violet-700',
  facebook_ad: 'bg-blue-100 text-blue-700',
}

type CampaignFormData = {
  name: string
  type: CampaignType | ''
  targetAudience: CampaignAudience | ''
  promoCode: string
  discount: string
  startDate: string
  endDate: string
}

const initialForm: CampaignFormData = {
  name: '',
  type: '',
  targetAudience: '',
  promoCode: '',
  discount: '',
  startDate: '',
  endDate: '',
}

type FormErrors = Partial<Record<keyof CampaignFormData, string>>

export function CampaignListPage() {
  const { t } = useTranslation('crm')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<CampaignFormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})

  const { data: campaigns, isLoading } = useCampaigns()
  const { data: stats } = useCampaignStats()
  const createCampaign = useCreateCampaign()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CampaignFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = t('campaign_err_name')
    if (!form.type) errs.type = t('campaign_err_type')
    if (!form.targetAudience) errs.targetAudience = t('campaign_err_target')
    if (!form.startDate) errs.startDate = t('campaign_err_start')
    if (!form.endDate) errs.endDate = t('campaign_err_end')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const payload: CreateCampaignRequest = {
      name: form.name,
      type: form.type as CampaignType,
      targetAudience: form.targetAudience as CampaignAudience,
      promoCode: form.promoCode || undefined,
      discount: form.discount ? Number(form.discount) : undefined,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    }
    await createCampaign.mutateAsync(payload)
    setShowModal(false)
    setForm(initialForm)
    setErrors({})
  }

  const statCards = [
    { label: t('campaign_stat_total'), value: stats?.total ?? '-', icon: <Megaphone className="w-5 h-5 text-slate-400" />, color: 'text-slate-900' },
    { label: t('campaign_stat_active'), value: stats?.active ?? '-', icon: <PlayCircle className="w-5 h-5 text-emerald-500" />, color: 'text-emerald-600' },
    { label: t('campaign_stat_draft'), value: stats?.draft ?? '-', icon: <FileText className="w-5 h-5 text-amber-500" />, color: 'text-amber-600' },
    { label: t('campaign_stat_completed'), value: stats?.completed ?? '-', icon: <CheckCircle className="w-5 h-5 text-sky-500" />, color: 'text-sky-600' },
  ]

  return (
    <>
      <Header title={t('campaigns_title')} subtitle={t('campaigns_subtitle')} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{card.label}</span>
                {card.icon}
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">{t('campaigns_title')}</h2>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824]"
            >
              <Plus className="w-4 h-4" />
              {t('btn_add_campaign')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['campaign_col_name', 'campaign_col_type', 'campaign_col_target', 'campaign_col_status',
                    'campaign_col_date', 'campaign_col_result', 'campaign_col_promo'].map((col) => (
                    <th key={col} className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">
                      {t(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">{t('loading')}</td>
                  </tr>
                ) : !campaigns?.length ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">{t('campaign_empty')}</td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{campaign.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${TYPE_STYLES[campaign.type]}`}>
                          {t(`campaign_type_${campaign.type === 'facebook_ad' ? 'facebook' : campaign.type}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {t(`campaign_target_${campaign.targetAudience === 'all_leads' ? 'all' : campaign.targetAudience === 'hot_leads' ? 'hot' : 'cold'}`)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[campaign.status]}`}>
                          {t(`campaign_status_${campaign.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <p className="text-xs">{new Date(campaign.startDate).toLocaleDateString('vi-VN')}</p>
                        <p className="text-xs">→ {new Date(campaign.endDate).toLocaleDateString('vi-VN')}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {campaign.sentCount > 0 ? (
                          <div className="text-xs space-y-0.5">
                            <p>{t('campaign_stat_sent', { sent: campaign.sentCount })}</p>
                            <p>{t('campaign_stat_open', { open: campaign.openCount })}</p>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {campaign.promoCode ? (
                          <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{campaign.promoCode}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                        {campaign.discount && (
                          <span className="ml-1 text-xs text-emerald-600">-{campaign.discount}%</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">{t('campaign_form_title')}</h2>
              <button onClick={() => { setShowModal(false); setForm(initialForm); setErrors({}) }}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_name')}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('campaign_placeholder_name')}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-rose-300' : 'border-slate-200'}`}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_type')}</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.type ? 'border-rose-300' : 'border-slate-200'}`}
                  >
                    <option value="">{t('filter_all_status')}</option>
                    <option value="email">{t('campaign_type_email')}</option>
                    <option value="sms">{t('campaign_type_sms')}</option>
                    <option value="facebook_ad">{t('campaign_type_facebook')}</option>
                  </select>
                  {errors.type && <p className="text-xs text-rose-500 mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_target')}</label>
                  <select
                    name="targetAudience"
                    value={form.targetAudience}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.targetAudience ? 'border-rose-300' : 'border-slate-200'}`}
                  >
                    <option value="">{t('filter_all_status')}</option>
                    <option value="all_leads">{t('campaign_target_all')}</option>
                    <option value="hot_leads">{t('campaign_target_hot')}</option>
                    <option value="cold_leads">{t('campaign_target_cold')}</option>
                  </select>
                  {errors.targetAudience && <p className="text-xs text-rose-500 mt-1">{errors.targetAudience}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_promo_code')}</label>
                  <input
                    name="promoCode"
                    value={form.promoCode}
                    onChange={handleChange}
                    placeholder={t('campaign_placeholder_promo')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_discount')}</label>
                  <input
                    name="discount"
                    type="number"
                    min={0}
                    max={100}
                    value={form.discount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_start')}</label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.startDate ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_label_end')}</label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.endDate ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => { setShowModal(false); setForm(initialForm); setErrors({}) }}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {t('btn_cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={createCampaign.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-[#b11e29] rounded-lg hover:bg-[#921824] disabled:opacity-50"
              >
                {createCampaign.isPending ? t('btn_saving') : t('btn_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
