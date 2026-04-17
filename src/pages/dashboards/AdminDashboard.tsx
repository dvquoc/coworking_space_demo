import { Users, Activity, Server, ClipboardCheck, Shield, Settings, FileText, AlertTriangle, Info, XCircle, CheckCircle, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard } from '../../components/dashboard/KPICard'
import { useAdminDashboard } from '../../hooks/useDashboard'

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatShortDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default function AdminDashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useAdminDashboard()

  const getUptimeBadge = (uptime: number) => {
    if (uptime >= 99) return { text: 'Excellent', color: 'green' as const }
    if (uptime >= 95) return { text: 'Good', color: 'yellow' as const }
    return { text: 'Needs Attention', color: 'red' as const }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-rose-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-50 border-rose-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  if (isLoading) {
    return (
      <>
        <Header title="Admin Dashboard" subtitle={t('admin_subtitle')} />
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
        <Header title="Admin Dashboard" subtitle={t('admin_subtitle')} />
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
      <Header title="Admin Dashboard" subtitle={t('admin_subtitle')} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t('kpi_total_users')}
              value={data.kpis.totalUsers}
              icon={Users}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <KPICard
              title={t('kpi_active_sessions')}
              value={data.kpis.activeSessions}
              icon={Activity}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
              tooltip={t('tooltip_sessions')}
            />
            
            <KPICard
              title={t('kpi_system_uptime')}
              value={`${data.kpis.systemUptime}%`}
              icon={Server}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              badge={getUptimeBadge(data.kpis.systemUptime)}
              tooltip={t('tooltip_uptime')}
            />
            
            <KPICard
              title={t('kpi_pending_approvals')}
              value={data.kpis.pendingApprovals}
              icon={ClipboardCheck}
              iconBgColor={data.kpis.pendingApprovals > 0 ? 'bg-rose-100' : 'bg-slate-100'}
              iconColor={data.kpis.pendingApprovals > 0 ? 'text-rose-600' : 'text-slate-600'}
              badge={data.kpis.pendingApprovals > 0 ? { text: t('badge_needs_action'), color: 'red' as const } : undefined}
              onClick={() => document.getElementById('pending-approvals')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              {t('section_system_alerts')}
            </h3>
            
            {data.systemAlerts.length === 0 ? (
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5" />
                <span>{t('no_alerts')}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {data.systemAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border ${getSeverityBg(alert.severity)}`}
                  >
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">{alert.message}</p>
                      <p className="text-sm text-slate-500 mt-1">{formatDate(alert.timestamp)}</p>
                    </div>
                    <button className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-white/50">
                      {t('dismiss')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{t('section_recent_activities')}</h3>
                <a href="/admin/audit-logs" className="text-sm text-[#b11e29] hover:underline">
                  {t('view_all')}
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_time')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_user')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_action')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_result')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentActivities.slice(0, 8).map(activity => (
                      <tr key={activity.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(activity.timestamp)}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-900">
                          {activity.userName}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-600">
                          {activity.action}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            activity.result === 'success' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {activity.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Login Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_login_stats')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.loginStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    labelFormatter={(label) => `Ngày ${formatShortDate(label)}`}
                  />
                  <Legend />
                  <Bar dataKey="success" name={t('login_success')} fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name={t('login_failed')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Approvals */}
          <div id="pending-approvals" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-slate-600" />
              {t('section_pending_approvals')}
            </h3>
            
            {data.pendingItems.length === 0 ? (
              <div className="flex items-center gap-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>{t('no_pending_items')}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {data.pendingItems.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.requesterName}</p>
                        <p className="text-sm text-slate-500">
                          {item.type === 'new_user' && t('pending_type_new_user', { role: item.requestedRole })}
                          {item.type === 'role_change' && t('pending_type_role_change', { role: item.requestedRole })}
                          {item.type === 'delete_account' && t('pending_type_delete')}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.requestedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium">
                        {t('approve')}
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium">
                        {t('reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="w-4 h-4" />
                {t('btn_manage_users')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/admin/audit-logs'}
              >
                <FileText className="w-4 h-4" />
                {t('btn_audit_logs')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/admin/settings'}
              >
                <Settings className="w-4 h-4" />
                {t('btn_system_settings')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
