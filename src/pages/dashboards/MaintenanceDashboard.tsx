import { Package, Wrench, AlertTriangle, CalendarCheck, Plus, List, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard } from '../../components/dashboard/KPICard'
import { useMaintenanceDashboard } from '../../hooks/useDashboard'
import { useAuthStore } from '../../stores/authStore'

const ASSET_STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  in_maintenance: '#f59e0b',
  broken: '#ef4444',
  retired: '#94a3b8',
}


const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getTaskStatus = (deadline: string): 'overdue' | 'today' | 'upcoming' => {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  
  if (deadlineDate < today) return 'overdue'
  if (deadlineDate.getTime() === today.getTime()) return 'today'
  return 'upcoming'
}

export default function MaintenanceDashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useMaintenanceDashboard()
  const user = useAuthStore(state => state.user)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return t('today_label')
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday_label')
    
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  const getTodayString = () => {
    return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <>
        <Header title="Maintenance Dashboard" subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
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
        <Header title="Maintenance Dashboard" subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
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

  // Sort tasks: overdue -> today -> upcoming, then by priority
  const sortedTasks = [...data.tasks].sort((a, b) => {
    const statusOrder = { overdue: 0, today: 1, upcoming: 2 }
    const priorityOrder = { critical: 0, normal: 1 }
    
    const aStatus = getTaskStatus(a.deadline)
    const bStatus = getTaskStatus(b.deadline)
    
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[aStatus] - statusOrder[bStatus]
    }
    
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <>
      <Header 
        title="Maintenance Dashboard" 
        subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} 
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t('kpi_total_assets')}
              value={data.kpis.totalAssets}
              icon={Package}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <KPICard
              title={t('kpi_in_maintenance')}
              value={data.kpis.assetsInMaintenance}
              icon={Wrench}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
            />
            
            <KPICard
              title={t('kpi_broken_assets')}
              value={data.kpis.brokenAssets}
              icon={AlertTriangle}
              iconBgColor={data.kpis.brokenAssets > 0 ? 'bg-rose-100' : 'bg-slate-100'}
              iconColor={data.kpis.brokenAssets > 0 ? 'text-rose-600' : 'text-slate-600'}
              badge={data.kpis.brokenAssets > 0 ? { text: t('badge_needs_action'), color: 'red' as const } : undefined}
              onClick={() => document.getElementById('broken-assets')?.scrollIntoView({ behavior: 'smooth' })}
            />
            
            <KPICard
              title={t('kpi_tasks_this_week')}
              value={data.kpis.scheduledTasksThisWeek}
              icon={CalendarCheck}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* Task List and Asset Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task List */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-slate-600" />
                  {t('section_task_list')}
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                    All
                  </button>
                  <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">
                    {t('filter_today')}
                  </button>
                  <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">
                    {t('filter_overdue')}
                  </button>
                </div>
              </div>
              
              {sortedTasks.length === 0 ? (
                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('no_tasks')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedTasks.map(task => {
                    const taskStatus = getTaskStatus(task.deadline)
                    
                    return (
                      <div 
                        key={task.id}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          taskStatus === 'overdue' ? 'bg-rose-50 border-rose-200' :
                          taskStatus === 'today' ? 'bg-amber-50 border-amber-200' :
                          'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            taskStatus === 'overdue' ? 'bg-rose-100' :
                            taskStatus === 'today' ? 'bg-amber-100' :
                            'bg-slate-100'
                          }`}>
                            {taskStatus === 'overdue' ? (
                              <AlertCircle className="w-5 h-5 text-rose-600" />
                            ) : taskStatus === 'today' ? (
                              <Clock className="w-5 h-5 text-amber-600" />
                            ) : (
                              <CalendarCheck className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">{task.name}</p>
                              {task.priority === 'critical' && (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                                  Critical
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{task.location}</p>
                            <p className="text-xs text-slate-400 mt-1">
                            {taskStatus === 'overdue' && '🔴 '}
                              {taskStatus === 'today' && '🟡 '}
                              {t('deadline_label')} {formatDate(task.deadline)}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700">
                          {t('btn_complete')}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Assets by Status Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_assets_by_status')}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.assetsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="label"
                  >
                    {data.assetsByStatus.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={ASSET_STATUS_COLORS[entry.status] || '#94a3b8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} items (${data.assetsByStatus.find(a => a.label === name)?.percent}%)`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend with counts */}
              <div className="mt-4 space-y-2">
                {data.assetsByStatus.map(item => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: ASSET_STATUS_COLORS[item.status] }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-medium text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Broken Assets & Recent Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broken Assets */}
            <div id="broken-assets" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                {t('section_broken_assets')}
              </h3>
              
              {data.brokenAssetList.length === 0 ? (
                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('no_broken_assets')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.brokenAssetList.map(asset => (
                    <div 
                      key={asset.id}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        asset.severity === 'critical' 
                          ? 'bg-rose-50 border-rose-300' 
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {asset.severity === 'critical' && <span>🚨</span>}
                          <p className="font-medium text-slate-900">{asset.name}</p>
                        </div>
                        <p className="text-sm text-slate-500">{asset.location}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {t('detected_label')} {formatDateTime(asset.detectedAt)}
                        </p>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50">
                        {t('btn_report_resolved')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Maintenance Logs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{t('section_maintenance_log')}</h3>
                <a href="/assets/maintenance-logs" className="text-sm text-[#b11e29] hover:underline">
                  {t('view_all')}
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_time')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_asset')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_description')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-sm text-slate-500 whitespace-nowrap">
                          {formatDateTime(log.timestamp)}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-900">
                          {log.assetName}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-600">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]"
                onClick={() => window.location.href = '/assets/maintenance/create'}
              >
                <Plus className="w-4 h-4" />
                {t('btn_record_maintenance')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700"
              >
                <AlertTriangle className="w-4 h-4" />
                {t('btn_report_broken')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/assets'}
              >
                <List className="w-4 h-4" />
                {t('btn_view_assets')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
