import { Users, Target, TrendingUp, UserPlus, Phone, Mail, Plus, Calendar, ArrowRight, Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard, KPICardWithProgress } from '../../components/dashboard/KPICard'
import { useSalesDashboard } from '../../hooks/useDashboard'
import { useAuthStore } from '../../stores/authStore'

const FUNNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString('vi-VN')
}

const getLeadStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-700'
    case 'contacted': return 'bg-purple-100 text-purple-700'
    case 'tour_scheduled': return 'bg-amber-100 text-amber-700'
    case 'proposal_sent': return 'bg-indigo-100 text-indigo-700'
    case 'closed_won': return 'bg-emerald-100 text-emerald-700'
    case 'closed_lost': return 'bg-slate-100 text-slate-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const getLeadStatusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'new': return t('lead_status_new')
    case 'contacted': return t('lead_status_contacted')
    case 'tour_scheduled': return t('lead_status_tour_scheduled')
    case 'proposal_sent': return t('lead_status_proposal_sent')
    case 'closed_won': return t('lead_status_closed_won')
    case 'closed_lost': return t('lead_status_lost')
    default: return status
  }
}

const getActivityTypeLabel = (type: string, t: (key: string) => string) => {
  switch (type) {
    case 'tour': return t('activity_type_tour')
    case 'meeting': return t('activity_type_meeting')
    case 'call': return t('activity_type_call')
    default: return type
  }
}

export default function SalesDashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useSalesDashboard()
  const user = useAuthStore(state => state.user)

  const getTodayString = () => {
    return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <>
        <Header title={t('title_sales')} subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                  <div className="h-8 bg-slate-200 rounded w-32" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error || !data) {
    return (
      <>
        <Header title={t('title_sales')} subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
              <p className="text-rose-700 mb-4">{t('error_load')}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                {t('retry')}
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header 
        title={t('title_sales')} 
        subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} 
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]"
                onClick={() => window.location.href = '/leads/create'}
              >
                <Plus className="w-4 h-4" />
                {t('btn_add_lead')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                onClick={() => window.location.href = '/tours/schedule'}
              >
                <Calendar className="w-4 h-4" />
                {t('btn_schedule_tour')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/leads'}
              >
                <Users className="w-4 h-4" />
                {t('btn_manage_leads')}
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t('kpi_new_customers')}
              value={data.kpis.newCustomers}
              icon={UserPlus}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              change={data.kpis.newCustomersChange}
            />
            
            <KPICard
              title={t('kpi_conversion_rate')}
              value={`${data.kpis.conversionRate}%`}
              icon={TrendingUp}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
              change={data.kpis.conversionRateChange}
            />
            
            <KPICard
              title={t('kpi_active_leads')}
              value={data.kpis.activeLeads}
              icon={Users}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            
            <KPICardWithProgress
              title={t('kpi_monthly_target')}
              value={`${data.kpis.targetPercent}%`}
              target={data.kpis.monthlyTarget}
              current={data.kpis.monthlyAchieved}
              icon={Target}
              iconBgColor={data.kpis.targetPercent >= 80 ? 'bg-emerald-100' : 'bg-amber-100'}
              iconColor={data.kpis.targetPercent >= 80 ? 'text-emerald-600' : 'text-amber-600'}
            />
          </div>

          {/* Lead Funnel and Conversion Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Funnel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_lead_funnel')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={data.charts.leadFunnel} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="label" width={80} />
                  <Tooltip formatter={(value) => [`${value} ${t('leads_unit')}`, '']} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.charts.leadFunnel.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              {/* Funnel Summary */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {data.charts.leadFunnel.map((item, index) => (
                  <div key={item.stage} className="flex items-center gap-1.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }}
                    />
                    <span className="text-slate-500">{item.label}:</span>
                    <span className="font-medium text-slate-700">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Trend */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_conversion_trend')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.charts.conversionByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${Number(value)}%`} />
                  <Tooltip formatter={(value) => [`${Number(value)}%`, t('conversion_rate_label')]} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#b11e29" 
                    strokeWidth={2}
                    dot={{ fill: '#b11e29', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* My Leads and Upcoming Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Leads */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{t('section_my_leads')}</h3>
                <a href="/leads" className="text-sm text-[#b11e29] hover:underline flex items-center gap-1">
                  {t('view_all')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="space-y-3">
                {data.myLeads.slice(0, 5).map(lead => (
                  <div 
                    key={lead.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      lead.isStale ? 'border-amber-200 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                    } hover:shadow-sm transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          {lead.isStale && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">{t('label_stale')}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{lead.company || t('individual_customer')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeadStatusColor(lead.status)}`}>
                        {getLeadStatusLabel(lead.status, t)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  {t('section_upcoming_activities')}
                </h3>
              </div>
              
              {data.upcomingActivities.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>{t('no_upcoming_activities')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.upcomingActivities.map(activity => (
                    <div 
                      key={activity.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getActivityTypeLabel(activity.type, t)}</span>
                            <p className="font-medium text-slate-900">{activity.leadName}</p>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            📅 {formatDateTime(activity.scheduledAt)}
                          </p>
                          {activity.location && (
                            <p className="text-sm text-slate-500">📍 {activity.location}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          activity.status === 'scheduled' ? t('activity_status_scheduled') : 
                           activity.status === 'completed' ? t('activity_status_completed') : t('activity_status_cancelled')
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Deals */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                {t('section_recent_deals')}
              </h3>
            </div>
            
            {data.recentDeals.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <p>{t('no_recent_deals')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recentDeals.map(deal => (
                  <div 
                    key={deal.id}
                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-600">🎉</span>
                      <p className="font-semibold text-slate-900">{deal.customerName}</p>
                    </div>
                    <p className="text-sm text-slate-600">{deal.spaceName}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-emerald-600 font-medium">
                        {formatCurrency(deal.contractValue)} ₫
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(deal.closedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      </main>
    </>
  )
}
