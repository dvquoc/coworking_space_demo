import { DollarSign, FileText, AlertCircle, TrendingUp, Download, Eye, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard } from '../../components/dashboard/KPICard'
import { useAccountingDashboard } from '../../hooks/useDashboard'
import { useAuthStore } from '../../stores/authStore'

const INVOICE_STATUS_COLORS: Record<string, string> = {
  paid: '#10b981',
  pending: '#f59e0b',
  overdue: '#ef4444',
  draft: '#94a3b8',
}

const AGING_COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444']

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

const formatFullCurrency = (value: number) => {
  return value.toLocaleString('vi-VN') + ' ₫'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getDaysInfo = (daysOverdue: number, t: (key: string, opts?: Record<string, unknown>) => string) => {
  if (daysOverdue > 0) return t('days_overdue', { count: daysOverdue })
  return t('not_yet_due')
}

export default function AccountingDashboard() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, error } = useAccountingDashboard()
  const user = useAuthStore(state => state.user)

  const getTodayString = () => {
    return new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <>
        <Header title={t('title_accounting')} subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
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
        <Header title={t('title_accounting')} subtitle={t('greeting', { name: user?.name || t('you'), date: getTodayString() })} />
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
        title={t('title_accounting')} 
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
                onClick={() => window.location.href = '/invoices/create'}
              >
                <FileText className="w-4 h-4" />
                {t('btn_create_invoice')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                onClick={() => window.location.href = '/payments/record'}
              >
                <DollarSign className="w-4 h-4" />
                {t('btn_record_payment')}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
                onClick={() => window.location.href = '/reports/financial'}
              >
                <Download className="w-4 h-4" />
                {t('btn_export_financial_report')}
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title={t('kpi_invoices_issued')}
              value={data.kpis.invoicesIssuedCount}
              icon={FileText}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              change={data.kpis.invoicesIssuedChange}
            />
            
            <KPICard
              title={t('kpi_receivable')}
              value={formatCurrency(data.kpis.totalReceivable)}
              icon={DollarSign}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
              tooltip={t('tooltip_receivable')}
            />
            
            <KPICard
              title={t('kpi_overdue_invoices')}
              value={data.kpis.overdueCount}
              icon={AlertCircle}
              iconBgColor={data.kpis.overdueCount > 0 ? 'bg-rose-100' : 'bg-slate-100'}
              iconColor={data.kpis.overdueCount > 0 ? 'text-rose-600' : 'text-slate-600'}
              badge={data.kpis.overdueCount > 0 ? { text: formatCurrency(data.kpis.overdueAmount), color: 'red' as const } : undefined}
              onClick={() => document.getElementById('overdue-invoices')?.scrollIntoView({ behavior: 'smooth' })}
            />
            
            <KPICard
              title={t('kpi_collection_rate')}
              value={`${data.kpis.collectionRate}%`}
              icon={TrendingUp}
              iconBgColor={data.kpis.collectionRate >= 80 ? 'bg-emerald-100' : 'bg-amber-100'}
              iconColor={data.kpis.collectionRate >= 80 ? 'text-emerald-600' : 'text-amber-600'}
              change={data.kpis.collectionRateChange}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AR Aging Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_ar_aging')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={data.charts.arAging} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => formatCurrency(Number(value))}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="label" 
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [formatFullCurrency(Number(value)), t('value_label')]}
                    labelFormatter={(label) => `${t('debt_age_label')} ${label}`}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {data.charts.arAging.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={AGING_COLORS[index % AGING_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              {/* Summary */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">{t('total_receivable_label')}</span>
                <span className="font-semibold text-slate-900">
                  {formatFullCurrency(data.charts.arAging.reduce((sum, item) => sum + item.amount, 0))}
                </span>
              </div>
            </div>

            {/* Invoice Status Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('section_invoice_status')}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.charts.invoiceStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="label"
                  >
                    {data.charts.invoiceStatusBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={INVOICE_STATUS_COLORS[entry.status] || '#94a3b8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [t('invoice_unit', { count: value }), '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend with counts */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {data.charts.invoiceStatusBreakdown.map(item => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: INVOICE_STATUS_COLORS[item.status] }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-medium text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overdue Invoices Table */}
          <div id="overdue-invoices" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                {t('kpi_overdue_invoices')}
              </h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <Download className="w-4 h-4" />
                  {t('btn_export')}
                </button>
              </div>
            </div>
            
            {data.overdueInvoices.length === 0 ? (
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle className="w-5 h-5" />
                <span>{t('no_overdue')}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_invoice_code')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_customer')}</th>
                      <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_amount')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_due_date')}</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_status')}</th>
                      <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.overdueInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {invoice.code}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {invoice.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium text-right">
                          {formatFullCurrency(invoice.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-slate-900">{formatDate(invoice.dueDate)}</div>
                          <div className="text-xs text-rose-600 font-medium">
                            {getDaysInfo(invoice.daysOverdue, t)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                            <Clock className="w-3 h-3" />
                            {t('status_overdue')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="px-3 py-1 text-xs bg-[#b11e29] text-white rounded-lg hover:bg-[#8f1821]">
                              {t('btn_remind')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                {t('section_recent_payments')}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_time')}</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_invoice_code')}</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_customer')}</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_amount')}</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">{t('col_payment_method')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(payment.paidAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {payment.invoiceCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {payment.customerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-600 font-medium text-right">
                        +{formatFullCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {payment.method === 'bank_transfer' ? t('method_bank_transfer') : payment.method === 'cash' ? t('method_cash') : t('method_card')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
