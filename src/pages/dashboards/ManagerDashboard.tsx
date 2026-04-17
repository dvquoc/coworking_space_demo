import { Calendar, LogIn, LogOut, Clock, Plus, Users, CalendarDays, AlertCircle, CheckCircle, MessageSquare, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard } from '../../components/dashboard/KPICard'
import { useManagerDashboard } from '../../hooks/useDashboard'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ₫`
  }
  return `${value.toLocaleString('vi-VN')} ₫`
}

const getUtilizationColor = (rate: number) => {
  if (rate >= 70) return '#10b981'
  if (rate >= 50) return '#f59e0b'
  return '#ef4444'
}

const getTodayString = () => {
  return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ManagerDashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useManagerDashboard()

  if (isLoading) {
    return (
      <>
        <Header title="Manager Dashboard" subtitle={getTodayString()} />
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
        <Header title="Manager Dashboard" subtitle={getTodayString()} />
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
      <Header title="Manager Dashboard" subtitle={getTodayString()} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('quick_actions')}</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-xl hover:bg-[#8f1821]"
                onClick={() => window.location.href = '/bookings/new'}
              >
                <Plus className="w-4 h-4" />
                {t('btn_create_booking')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/customers'}
              >
                <Users className="w-4 h-4" />
                {t('btn_add_customer')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/bookings/calendar'}
              >
                <CalendarDays className="w-4 h-4" />
                {t('btn_view_calendar')}
              </button>
            </div>
        </div>  
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t('kpi_bookings_today')}
              value={data.kpis.todayBookings}
              icon={Calendar}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <KPICard
              title={t('kpi_checkins_today')}
              value={data.kpis.checkInsToday}
              icon={LogIn}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            
            <KPICard
              title={t('kpi_checkouts_today')}
              value={data.kpis.checkOutsToday}
              icon={LogOut}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
            />
            
            <KPICard
              title={t('kpi_pending_requests')}
              value={data.kpis.pendingRequests}
              icon={Clock}
              iconBgColor={data.kpis.pendingRequests > 0 ? 'bg-rose-100' : 'bg-slate-100'}
              iconColor={data.kpis.pendingRequests > 0 ? 'text-rose-600' : 'text-slate-600'}
              badge={data.kpis.pendingRequests > 0 ? { text: t('badge_needs_action'), color: 'red' as const } : undefined}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Booking Trend */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_booking_trend')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.charts.bookingByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    labelFormatter={(label) => formatDate(label)}
                    formatter={(value) => [`${value} bookings`]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Space Utilization by Floor */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_utilization_by_floor')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.charts.utilizationByFloor} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="floorLabel" 
                    width={80}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value)}%`, t('utilization_rate')]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                    {data.charts.utilizationByFloor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getUtilizationColor(entry.rate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Bookings */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-slate-600" />
                  {t('section_upcoming_bookings')}
                </h3>
                <a href="/bookings" className="text-sm text-[#b11e29] hover:underline">
                  {t('view_all')}
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_time')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_customer')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">Space</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-3 py-2">{t('col_status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.upcomingBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3 text-sm">
                          <div className="font-medium text-slate-900">{formatTime(booking.startTime)}</div>
                          <div className="text-slate-500 text-xs">{formatDate(booking.startTime)}</div>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-900">
                          {booking.customerName}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600">
                          {booking.spaceName}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {booking.status === 'confirmed' ? t('status_confirmed') : t('status_pending')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                {t('section_top_customers')}
              </h3>
              
              <div className="space-y-3">
                {data.topCustomers.map(customer => (
                  <div 
                    key={customer.customerId}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer"
                    onClick={() => window.location.href = `/customers/${customer.customerId}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      customer.rank === 1 ? 'bg-amber-100 text-amber-700' :
                      customer.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      customer.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.spaceType}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(customer.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expiring Contracts & Recent Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expiring Contracts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                {t('section_expiring_contracts')}
              </h3>
              
              {data.expiringContracts.length === 0 ? (
                <div className="flex items-center gap-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>{t('no_expiring_contracts')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.expiringContracts.map(contract => (
                    <div 
                      key={contract.id}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        contract.daysRemaining <= 7 
                          ? 'bg-rose-50 border-rose-200' 
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{contract.customerName}</p>
                        <p className="text-sm text-slate-600">{contract.spaceName}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${contract.daysRemaining <= 7 ? 'text-rose-600' : 'text-amber-600'}`}>
                          {contract.daysRemaining <= 7 ? '⚠️' : '⏰'} {t('days_remaining', { count: contract.daysRemaining })}
                        </p>
                        <button className="text-sm text-[#b11e29] hover:underline mt-1">
                          {t('contact')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-600" />
                {t('section_recent_inquiries')}
              </h3>
              
              {data.recentInquiries.length === 0 ? (
                <div className="flex items-center gap-3 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>{t('no_new_inquiries')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentInquiries.map(inquiry => (
                    <div 
                      key={inquiry.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{inquiry.customerName}</p>
                        <p className="text-sm text-slate-500">{inquiry.type}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        inquiry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        inquiry.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {inquiry.status === 'pending' ? t('status_waiting') :
                         inquiry.status === 'in_progress' ? t('status_in_progress') : t('status_done')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
