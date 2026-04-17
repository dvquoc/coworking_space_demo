import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Users, BarChart3, Layers, Wrench,
  Download, Calendar, ChevronDown, RefreshCw, Building2,
} from 'lucide-react'
import Header from '../components/layout/Header'
import {
  useRevenueReport,
  useOccupancyReport,
  useCustomerReport,
  useServiceReport,
  useAssetReport,
} from '../hooks/useReports'
import type { ReportFilter, DatePreset } from '../types/report'

// ─── Constants ────────────────────────────────────────────────

const COLORS = ['#b11e29', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const PRESET_DATES: Array<{ id: DatePreset; dateFrom: string; dateTo: string }> = [
  { id: 'this_month',     dateFrom: '2026-04-01', dateTo: '2026-04-30' },
  { id: 'this_quarter',   dateFrom: '2026-01-01', dateTo: '2026-03-31' },
  { id: 'this_year',      dateFrom: '2026-01-01', dateTo: '2026-12-31' },
  { id: 'last_6_months',  dateFrom: '2025-11-01', dateTo: '2026-04-30' },
  { id: 'last_12_months', dateFrom: '2025-05-01', dateTo: '2026-04-30' },
]

const HOUR_LABELS = Array.from({ length: 15 }, (_, i) => `${i + 7}h`)

type Tab = 'revenue' | 'occupancy' | 'customers' | 'services' | 'assets'

// ─── Helpers ──────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return n.toLocaleString('vi-VN')
}

function fmtVND(n: number) {
  return n.toLocaleString('vi-VN') + 'đ'
}

function fmtDate(s: string) {
  return new Date(s + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Change({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-600'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  )
}

function KPI({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-700 mb-3">{children}</h3>
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>{children}</div>
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse space-y-3">
      <div className="h-4 bg-slate-100 rounded w-32" />
      <div className="h-40 bg-slate-100 rounded" />
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-sm">
      {message}
    </div>
  )
}

const INVOICE_STATUS_CLS: Record<string, string> = {
  paid:      'bg-green-50 text-green-700 border-green-200',
  unpaid:    'bg-amber-50 text-amber-700 border-amber-200',
  overdue:   'bg-red-50 text-red-700 border-red-200',
  partial:   'bg-orange-50 text-orange-700 border-orange-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
}

const ASSET_STATUS_CLS: Record<string, string> = {
  active:      'bg-green-50 text-green-700 border-green-200',
  available:   'bg-sky-50 text-sky-700 border-sky-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  broken:      'bg-red-50 text-red-700 border-red-200',
  retired:     'bg-slate-100 text-slate-500 border-slate-200',
}

// ─── Revenue Tab ──────────────────────────────────────────────

function RevenueTab({ filter }: { filter: Partial<ReportFilter> }) {
  const { t } = useTranslation('reports')
  const { data, isLoading, error } = useRevenueReport(filter)
  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
  if (error || !data) return <ErrorBanner message={t('error_revenue')} />

  const { summary, byPeriod, byMethod, bySpaceType, byBuilding, recentInvoices } = data

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label={t('kpi_total_revenue')} value={fmt(summary.totalRevenue) + 'đ'} sub={<Change value={summary.revenueChange} />} />
        <KPI label={t('kpi_paid')} value={fmt(summary.paidAmount) + 'đ'} />
        <KPI label={t('kpi_unpaid')} value={fmt(summary.unpaidAmount) + 'đ'} />
        <KPI label={t('kpi_overdue')} value={fmt(summary.overdueAmount) + 'đ'} />
        <KPI label={t('kpi_invoices')} value={summary.totalInvoices.toString()} />
        <KPI label={t('kpi_avg_invoice')} value={fmt(Math.round(summary.totalRevenue / summary.totalInvoices)) + 'đ'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <SectionTitle>{t('section_revenue_period')}</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byPeriod} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={n => fmt(n)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => fmtVND(v as number)} />
              <Bar dataKey="revenue" name={t('series_revenue')} fill="#b11e29" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>{t('section_by_payment_method')}</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byMethod} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={70} innerRadius={36}>
                {byMethod.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtVND(v as number)} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionTitle>{t('section_by_space_type')}</SectionTitle>
          <div className="space-y-2.5">
            {bySpaceType.map((row, i) => (
              <div key={row.type}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{row.label}</span>
                  <span className="font-medium">{fmt(row.amount)}đ · {row.percent}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${row.percent}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>{t('section_by_building_rev')}</SectionTitle>
          <div className="space-y-4">
            {byBuilding.map((b, i) => (
              <div key={b.buildingId} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{b.buildingName}</span>
                  </div>
                  <Change value={b.change} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${b.percent}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-28 text-right">{fmt(b.revenue)}đ</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{t('section_recent_invoices')}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_invoice_code')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_customer')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_date')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_amount')}</th>
                <th className="text-center py-2 text-xs font-medium text-slate-500">{t('col_status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => {
                const cls = INVOICE_STATUS_CLS[inv.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'
                const label = t(`status_${inv.status}`, { defaultValue: inv.status })
                return (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-mono text-xs text-slate-600">{inv.invoiceCode}</td>
                    <td className="py-2.5 pr-4 text-slate-700">{inv.customerName}</td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs">{fmtDate(inv.date)}</td>
                    <td className="py-2.5 pr-4 text-right font-medium text-slate-800">{fmt(inv.amount)}đ</td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${cls}`}>{label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Occupancy Tab ────────────────────────────────────────────

function OccupancyTab({ filter }: { filter: Partial<ReportFilter> }) {
  const { t } = useTranslation('reports')
  const { data, isLoading, error } = useOccupancyReport(filter)
  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
  if (error || !data) return <ErrorBanner message={t('error_occupancy')} />

  const { summary, byPeriod, heatmap, bySpaceType, byBuilding, spaceRows } = data

  const DAY_LABELS = [t('day_mon'), t('day_tue'), t('day_wed'), t('day_thu'), t('day_fri'), t('day_sat'), t('day_sun')]

  const heatGrid = Array.from({ length: 7 }, () => Array(15).fill(0))
  heatmap.forEach(cell => { heatGrid[cell.dayOfWeek][cell.hour - 7] = cell.value })

  const heatColor = (v: number) => {
    if (v >= 80) return '#b11e29'
    if (v >= 60) return '#f97316'
    if (v >= 40) return '#fbbf24'
    if (v >= 20) return '#86efac'
    return '#f1f5f9'
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label={t('kpi_avg_occupancy')} value={`${summary.avgOccupancyRate.toFixed(1)}%`} sub={<Change value={summary.rateChange} suffix="pp" />} />
        <KPI label={t('kpi_occupied_spaces')} value={`${summary.avgOccupiedSpaces}/${summary.totalSpaces}`} />
        <KPI label={t('kpi_peak_rate')} value={`${summary.peakRate.toFixed(1)}%`} sub={<span>{fmtDate(summary.peakDate)}</span>} />
        <KPI label={t('kpi_off_peak_rate')} value={`${summary.offPeakRate.toFixed(1)}%`} sub={<span>{fmtDate(summary.offPeakDate)}</span>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <SectionTitle>{t('section_occupancy_period')}</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={byPeriod} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tickFormatter={n => `${n}%`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${(v as number).toFixed(1)}%`} />
              <Line type="monotone" dataKey="occupancyRate" name={t('series_occupancy')} stroke="#b11e29" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>{t('section_by_building_occ')}</SectionTitle>
          <div className="space-y-4 mb-5">
            {byBuilding.map((b, i) => (
              <div key={b.buildingId}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">{b.buildingName}</span>
                  <span className="font-semibold" style={{ color: COLORS[i % COLORS.length] }}>{b.occupancyRate.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.occupancyRate}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
          <SectionTitle>{t('section_by_type_occ')}</SectionTitle>
          <div className="space-y-2.5">
            {bySpaceType.map((st, i) => (
              <div key={st.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">{st.label}</span>
                  <span className="font-medium text-slate-800">{st.occupancyRate.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${st.occupancyRate}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{t('section_heatmap')}</SectionTitle>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex">
              <div className="w-8 shrink-0" />
              {HOUR_LABELS.map(h => (
                <div key={h} className="w-9 text-center text-xs text-slate-400">{h}</div>
              ))}
            </div>
            {DAY_LABELS.map((day, di) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-8 text-xs text-slate-500 font-medium shrink-0">{day}</div>
                {heatGrid[di].map((v: number, hi: number) => (
                  <div
                    key={hi}
                    title={`${day} ${hi + 7}h: ${v.toFixed(0)}%`}
                    className="w-9 h-7 rounded mx-px"
                    style={{ backgroundColor: heatColor(v) }}
                  />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-slate-400">{t('heatmap_low')}</span>
              {[0, 25, 45, 65, 85].map(v => (
                <div key={v} className="w-6 h-3 rounded" style={{ backgroundColor: heatColor(v) }} />
              ))}
              <span className="text-xs text-slate-400">{t('heatmap_high')}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>{t('section_space_detail')}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_space_name')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_building')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_type')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_occupancy')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_hours_booked')}</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500">{t('col_revenue')}</th>
              </tr>
            </thead>
            <tbody>
              {spaceRows.map(row => (
                <tr key={row.spaceId} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{row.spaceName}</td>
                  <td className="py-2.5 pr-4 text-slate-500 text-xs">{row.buildingName}</td>
                  <td className="py-2.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{row.typeLabel}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className={`font-semibold ${row.occupancyRate >= 80 ? 'text-emerald-600' : row.occupancyRate >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {row.occupancyRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-600 text-xs">{row.totalHoursBooked.toLocaleString()}h</td>
                  <td className="py-2.5 text-right font-medium text-slate-800">{fmt(row.revenue)}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Customers Tab ────────────────────────────────────────────

function CustomersTab({ filter }: { filter: Partial<ReportFilter> }) {
  const { t } = useTranslation('reports')
  const { data, isLoading, error } = useCustomerReport(filter)
  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
  if (error || !data) return <ErrorBanner message={t('error_customers')} />

  const { summary, acquisitionTrend, byType, clvDistribution, topCustomers } = data

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label={t('kpi_total_customers')} value={summary.totalCustomers.toString()} />
        <KPI label={t('kpi_new_customers')} value={`+${summary.newCustomers}`} sub={<Change value={summary.newCustomersChange} />} />
        <KPI label={t('kpi_retention_rate')} value={`${summary.retentionRate.toFixed(1)}%`} sub={<Change value={summary.retentionRateChange} suffix="pp" />} />
        <KPI label={t('kpi_avg_clv')} value={fmt(summary.avgClv) + 'đ'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <SectionTitle>{t('section_acquisition_trend')}</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={acquisitionTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="newCustomers" name={t('series_new_customers')} fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churnedCustomers" name={t('series_churned')} fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>{t('section_by_customer_type')}</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={byType} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={55} innerRadius={28}>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v as number} ${t('tooltip_customer_unit')}`} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {byType.map(row => (
              <div key={row.type} className="flex justify-between text-xs">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-medium text-slate-800">{fmt(row.revenue)}đ ({row.percent}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{t('section_clv_distribution')}</SectionTitle>
        <div className="flex items-end gap-4 h-32">
          {clvDistribution.map((bucket, i) => {
            const max = Math.max(...clvDistribution.map(b => b.count))
            return (
              <div key={bucket.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-700">{bucket.count}</span>
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${(bucket.count / max) * 80}px`, backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-slate-500 text-center">{bucket.label}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle>{t('section_top_customers')}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_rank')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_customer')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_type')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_total_spend')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_bookings')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_contracts')}</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500">{t('col_member_since')}</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, idx) => (
                <tr key={c.customerId} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4 text-slate-400 text-xs font-medium">{idx + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{c.name}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${c.type === 'enterprise' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {c.type === 'enterprise' ? t('badge_enterprise') : t('badge_individual')}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-slate-800">{fmt(c.totalSpend)}đ</td>
                  <td className="py-2.5 pr-4 text-right text-slate-600">{c.bookingCount}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-600">{c.contractCount}</td>
                  <td className="py-2.5 text-slate-500 text-xs">{fmtDate(c.memberSince)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Services Tab ─────────────────────────────────────────────

function ServicesTab({ filter }: { filter: Partial<ReportFilter> }) {
  const { t } = useTranslation('reports')
  const { data, isLoading, error } = useServiceReport(filter)
  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
  if (error || !data) return <ErrorBanner message={t('error_services')} />

  const { summary, services, trendTop3 } = data
  const maxUsage = Math.max(...services.map(s => s.usageCount))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <KPI label={t('kpi_service_revenue')} value={fmt(summary.totalServiceRevenue) + 'đ'} />
        <KPI label={t('kpi_usage_count')} value={summary.totalUsageCount.toLocaleString()} />
        <KPI label={t('kpi_active_services')} value={summary.activeServiceCount.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionTitle>{t('section_service_revenue')}</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={services} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tickFormatter={n => fmt(n)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="serviceName" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v) => fmtVND(v as number)} />
              <Bar dataKey="revenue" name={t('series_revenue')} radius={[0, 4, 4, 0]}>
                {services.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>{t('section_service_usage')}</SectionTitle>
          <div className="space-y-3">
            {services.map((s, i) => (
              <div key={s.serviceId}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700">{s.serviceName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{s.usageCount} {t('usage_times')}</span>
                    <Change value={s.change} />
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(s.usageCount / maxUsage) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>{t('section_service_trend')}</SectionTitle>
        {trendTop3.length > 0 && (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={trendTop3.map(p => ({
                label: p.label,
                ...Object.fromEntries(p.services.map(sv => [sv.name, sv.count])),
              }))}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {trendTop3[0].services.map((sv, i) => (
                <Line key={sv.name} type="monotone" dataKey={sv.name} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}

// ─── Assets Tab ───────────────────────────────────────────────

function AssetsTab({ filter }: { filter: Partial<{ buildingId: string; category: string; dateFrom: string; dateTo: string }> }) {
  const { t } = useTranslation('reports')
  const { data, isLoading, error } = useAssetReport(filter)
  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
  if (error || !data) return <ErrorBanner message={t('error_assets')} />

  const { summary, byCategory, statusDistribution, maintenanceCostByPeriod, attentionAssets, depreciation } = data

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label={t('kpi_total_assets')} value={summary.totalAssets.toString()} />
        <KPI label={t('kpi_active_assets')} value={summary.activeAssets.toString()} />
        <KPI label={t('kpi_maintenance_assets')} value={summary.maintenanceAssets.toString()} />
        <KPI label={t('kpi_broken_assets')} value={summary.brokenAssets.toString()} />
        <KPI label={t('kpi_maintenance_cost')} value={fmt(summary.totalMaintenanceCost) + 'đ'} sub={<Change value={summary.maintenanceCostChange} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <SectionTitle>{t('section_by_category')}</SectionTitle>
          <div className="space-y-3">
            {byCategory.map((cat, i) => (
              <div key={cat.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="text-slate-500">{cat.count} {t('cat_count_suffix')} · {fmt(cat.maintenanceCost)}đ {t('cat_maintenance_suffix')}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(cat.count / summary.totalAssets) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>{t('section_status_distribution')}</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusDistribution.filter(s => s.count > 0)}
                dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={60} innerRadius={30}
              >
                {statusDistribution.filter(s => s.count > 0).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v as number} ${t('assets_count_suffix')}`} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>{t('section_maintenance_cost_trend')}</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={maintenanceCostByPeriod} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={n => fmt(n)} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => fmtVND(v as number)} />
              <Bar dataKey="cost" name={t('series_maintenance_cost')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {attentionAssets.length > 0 && (
        <Card>
          <SectionTitle>{t('section_attention_assets')}</SectionTitle>
          <div className="space-y-2">
            {attentionAssets.map(a => {
              const cls = ASSET_STATUS_CLS[a.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'
              const label = t(`asset_status_${a.status}`, { defaultValue: a.status })
              return (
                <div key={a.assetId} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                  <span className={`px-2 py-0.5 rounded-full text-xs border shrink-0 ${cls}`}>{label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.assetCode} · {a.buildingName}{a.spaceName ? ` · ${a.spaceName}` : ''}</p>
                  </div>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg shrink-0">{a.actionNeeded}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle>{t('section_depreciation')}</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_asset')}</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500">{t('col_purchase_date')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_purchase_cost')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_age_years')}</th>
                <th className="text-right py-2 pr-4 text-xs font-medium text-slate-500">{t('col_current_value')}</th>
                <th className="text-right py-2 text-xs font-medium text-slate-500">{t('col_depreciation_pct')}</th>
              </tr>
            </thead>
            <tbody>
              {depreciation.map(row => (
                <tr key={row.assetId} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 pr-4">
                    <p className="font-medium text-slate-800 text-xs">{row.name}</p>
                    <p className="text-slate-400 text-xs font-mono">{row.assetCode}</p>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-500 text-xs">{fmtDate(row.purchaseDate)}</td>
                  <td className="py-2.5 pr-4 text-right text-slate-700 text-xs">{fmt(row.purchaseCost)}đ</td>
                  <td className="py-2.5 pr-4 text-right text-slate-600 text-xs">{row.ageYears.toFixed(1)}</td>
                  <td className="py-2.5 pr-4 text-right font-medium text-slate-800 text-xs">{fmt(row.currentValue)}đ</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs font-semibold ${row.depreciationPercent >= 80 ? 'text-red-600' : row.depreciationPercent >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {row.depreciationPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function ReportsPage() {
  const { t } = useTranslation('reports')
  const [activeTab, setActiveTab] = useState<Tab>('revenue')
  const [preset, setPreset] = useState<DatePreset>('this_quarter')
  const [showPresetMenu, setShowPresetMenu] = useState(false)

  const PRESETS = PRESET_DATES.map(p => ({ ...p, label: t(`preset_${p.id}`) }))
  const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'revenue',   label: t('tab_revenue'),   icon: <TrendingUp size={15} /> },
    { id: 'occupancy', label: t('tab_occupancy'),  icon: <BarChart3 size={15} /> },
    { id: 'customers', label: t('tab_customers'),  icon: <Users size={15} /> },
    { id: 'services',  label: t('tab_services'),   icon: <Layers size={15} /> },
    { id: 'assets',    label: t('tab_assets'),     icon: <Wrench size={15} /> },
  ]

  const selectedPreset = PRESETS.find(p => p.id === preset) ?? PRESETS[1]

  const filter: Partial<ReportFilter> = {
    dateFrom: selectedPreset.dateFrom,
    dateTo: selectedPreset.dateTo,
    granularity: 'month',
  }

  return (
    <>
      <Header
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Filter bar */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
            <Calendar size={15} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500">{t('preset_period')}</span>
            <div className="relative">
              <button
                onClick={() => setShowPresetMenu(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {selectedPreset.label}
                <ChevronDown size={13} />
              </button>
              {showPresetMenu && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 min-w-44 py-1">
                  {PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setPreset(p.id); setShowPresetMenu(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${p.id === preset ? 'text-[#b11e29] font-medium' : 'text-slate-700'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {fmtDate(selectedPreset.dateFrom)} – {fmtDate(selectedPreset.dateTo)}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => window.print()}
              >
                <Download size={13} />
                {t('export_pdf')}
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#b11e29] text-white rounded-lg text-xs hover:bg-[#9a1923] transition-colors"
                onClick={() => setPreset(p => p)}
              >
                <RefreshCw size={13} />
                {t('refresh')}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#b11e29] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'revenue'   && <RevenueTab   filter={filter} />}
          {activeTab === 'occupancy' && <OccupancyTab filter={filter} />}
          {activeTab === 'customers' && <CustomersTab filter={filter} />}
          {activeTab === 'services'  && <ServicesTab  filter={filter} />}
          {activeTab === 'assets'    && (
            <AssetsTab filter={{ dateFrom: filter.dateFrom, dateTo: filter.dateTo }} />
          )}
        </div>
      </main>
    </>
  )
}
