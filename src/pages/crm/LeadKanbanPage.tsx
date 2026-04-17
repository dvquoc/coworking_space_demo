import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { List, Eye } from 'lucide-react'
import Header from '../../components/layout/Header'
import { useLeads, useUpdateLead } from '../../hooks/useCRM'
import type { Lead, LeadStage } from '../../types/crm'

const STAGES: LeadStage[] = [
  'inquiry',
  'contacted',
  'tour_scheduled',
  'tour_completed',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost',
]

const STAGE_HEADER_COLORS: Record<LeadStage, string> = {
  inquiry: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-800',
  tour_scheduled: 'bg-amber-100 text-amber-800',
  tour_completed: 'bg-purple-100 text-purple-800',
  proposal_sent: 'bg-orange-100 text-orange-800',
  negotiation: 'bg-rose-100 text-rose-800',
  closed_won: 'bg-emerald-100 text-emerald-800',
  closed_lost: 'bg-slate-200 text-slate-600',
}

const SOURCE_COLORS: Record<string, string> = {
  website: 'bg-blue-50 text-blue-600',
  referral: 'bg-green-50 text-green-600',
  facebook_ad: 'bg-indigo-50 text-indigo-600',
  google_ad: 'bg-red-50 text-red-600',
  walk_in: 'bg-amber-50 text-amber-600',
  other: 'bg-slate-50 text-slate-500',
}

export function LeadKanbanPage() {
  const { t } = useTranslation('crm')
  const navigate = useNavigate()
  const [myLeadsOnly, setMyLeadsOnly] = useState(false)
  const [dragging, setDragging] = useState<Lead | null>(null)
  const [dragOver, setDragOver] = useState<LeadStage | null>(null)

  const { data, refetch } = useLeads({ pageSize: 100 })
  const updateMutation = useUpdateLead()

  const leads = data?.data ?? []
  const filtered = myLeadsOnly
    ? leads.filter((l) => l.assignedTo === 'user-sale-1') // current user mock
    : leads

  const byStage = (stage: LeadStage) => filtered.filter((l) => l.stage === stage)

  const handleDragStart = (lead: Lead) => {
    setDragging(lead)
  }

  const handleDrop = async (targetStage: LeadStage) => {
    if (!dragging || dragging.stage === targetStage) {
      setDragging(null)
      setDragOver(null)
      return
    }
    await updateMutation.mutateAsync({ id: dragging.id, data: { stage: targetStage } })
    refetch()
    setDragging(null)
    setDragOver(null)
  }

  return (
    <>
      <Header title={t('kanban_title')} subtitle={t('kanban_subtitle')} />

      <main className="flex-1 overflow-hidden p-6 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/leads')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <List className="w-4 h-4" />
            {t('btn_list_view')}
          </button>

          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
            <button
              onClick={() => setMyLeadsOnly(false)}
              className={`px-3 py-1.5 ${!myLeadsOnly ? 'bg-sky-100 text-sky-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {t('kanban_all_leads')}
            </button>
            <button
              onClick={() => setMyLeadsOnly(true)}
              className={`px-3 py-1.5 ${myLeadsOnly ? 'bg-sky-100 text-sky-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {t('kanban_my_leads')}
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 h-full min-w-max pb-4">
            {STAGES.map((stage) => {
              const stageLeads = byStage(stage)
              return (
                <div
                  key={stage}
                  className={`w-64 flex flex-col rounded-xl border-2 transition-colors ${
                    dragOver === stage ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(stage) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(stage)}
                >
                  {/* Column Header */}
                  <div className={`px-3 py-2 rounded-t-xl ${STAGE_HEADER_COLORS[stage]}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t(`stage_${stage}`)}</span>
                      <span className="text-xs font-bold bg-white/60 px-1.5 py-0.5 rounded-full">
                        {stageLeads.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                    {stageLeads.length === 0 ? (
                      <div className="flex items-center justify-center h-16 text-xs text-slate-400">
                        {t('kanban_no_leads')}
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead)}
                          onDragEnd={() => { setDragging(null); setDragOver(null) }}
                          className={`bg-white rounded-lg border border-slate-200 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                            dragging?.id === lead.id ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{lead.fullName}</p>
                              {lead.company && (
                                <p className="text-xs text-slate-400 truncate">{lead.company}</p>
                              )}
                            </div>
                            <button
                              onClick={() => navigate(`/crm/leads/${lead.id}`)}
                              className="p-1 text-slate-400 hover:text-slate-600 flex-shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[lead.source]}`}>
                              {t(`source_${lead.source}`)}
                            </span>
                            {lead.assignedToName && (
                              <span className="text-xs text-slate-400 truncate max-w-[80px]">
                                {lead.assignedToName.split(' ').slice(-1)[0]}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-mono text-slate-400 mt-1">{lead.leadCode}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
