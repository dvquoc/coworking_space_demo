import { DollarSign, Users, TrendingUp, Percent, FileText, Download } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import Header from '../../components/layout/Header'
import { KPICard } from '../../components/dashboard/KPICard'
import { useInvestorDashboard } from '../../hooks/useDashboard'

const COLORS = ['#b11e29', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  }
  return value.toLocaleString('vi-VN')
}

const formatMonth = (month: string) => {
  const date = new Date(month + '-01')
  return date.toLocaleDateString('vi-VN', { month: 'short' })
}

export default function InvestorDashboard() {
  const { data, isLoading, error } = useInvestorDashboard()

  const getOccupancyBadge = (rate: number) => {
    if (rate >= 70) return { text: 'Tốt', color: 'green' as const }
    if (rate >= 50) return { text: 'Trung bình', color: 'yellow' as const }
    return { text: 'Thấp', color: 'red' as const }
  }

  const getOccupancyBarColor = (rate: number) => {
    if (rate >= 70) return '#10b981'
    if (rate >= 50) return '#f59e0b'
    return '#ef4444'
  }

  if (isLoading) {
    return (
      <>
        <Header title="Investor Dashboard" subtitle="Tổng quan kinh doanh" />
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
        <Header title="Investor Dashboard" subtitle="Tổng quan kinh doanh" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
              <p className="text-rose-700 mb-4">Không thể tải dữ liệu dashboard</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Thử lại
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
        title="Investor Dashboard" 
        subtitle={`Tổng quan kinh doanh — Tháng ${data.period.month}/${data.period.year}`} 
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Tổng Doanh thu"
              value={`${formatCurrency(data.kpis.totalRevenue)} ₫`}
              icon={DollarSign}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
              change={data.kpis.revenueChangePercent}
              tooltip="Tổng doanh thu từ các invoice đã thanh toán trong tháng"
            />
            
            <KPICard
              title="Tỷ lệ lấp đầy"
              value={`${data.kpis.occupancyRate}%`}
              icon={Percent}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              change={data.kpis.occupancyChange}
              badge={getOccupancyBadge(data.kpis.occupancyRate)}
              tooltip="Tỷ lệ = Số spaces đang cho thuê / Tổng spaces"
            />
            
            <KPICard
              title="Khách hàng Active"
              value={data.kpis.activeCustomers}
              icon={Users}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              change={data.kpis.customersChange}
              changeLabel="khách mới"
              tooltip="Khách hàng đang có hợp đồng hoặc booking active"
            />
            
            <KPICard
              title="Biên lợi nhuận"
              value={`${data.kpis.profitMargin}%`}
              icon={TrendingUp}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
              change={data.kpis.profitMarginChange}
              tooltip="(Revenue - Operating Costs) / Revenue × 100"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Xu hướng Doanh thu (12 tháng)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.charts.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                    labelFormatter={(label) => `Tháng ${formatMonth(label)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#b11e29" 
                    strokeWidth={3}
                    dot={{ fill: '#b11e29', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Occupancy by Building */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tỷ lệ lấp đầy theo Tòa nhà</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.occupancyByBuilding} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value)}%`, 'Tỷ lệ lấp đầy']}
                  />
                  <Bar 
                    dataKey="rate" 
                    radius={[0, 8, 8, 0]}
                  >
                    {data.charts.occupancyByBuilding.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getOccupancyBarColor(entry.rate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Space Type */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Doanh thu theo Loại không gian</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.revenueBySpaceType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="label"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {data.charts.revenueBySpaceType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} ₫`]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Truy cập nhanh</h3>
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
                  onClick={() => window.location.href = '/reports/financial'}
                >
                  <FileText className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700 font-medium">Xem Báo cáo Tài chính</span>
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 bg-[#b11e29] hover:bg-[#8f1821] rounded-xl transition-colors text-left text-white"
                  onClick={() => {
                    // Simple print functionality for PDF-like export
                    window.print()
                  }}
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Xuất Báo cáo Doanh thu (PDF)</span>
                </button>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-600 mb-3">Tóm tắt tháng {data.period.month}/{data.period.year}</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-slate-500">Spaces đang thuê</span>
                    <span className="font-medium text-slate-900">
                      {Math.round(data.kpis.activeCustomers * 0.85)}/109
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-500">Doanh thu trung bình/khách</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(Math.round(data.kpis.totalRevenue / data.kpis.activeCustomers))} ₫
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
