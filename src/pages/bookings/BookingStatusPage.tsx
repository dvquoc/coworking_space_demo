import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBookingList } from '../../mocks/bookingMocks'

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

const STATUS_CONFIG: Record<BookingStatus, { label: string; icon: React.ReactNode; cardClass: string; badgeClass: string; dotClass: string }> = {
  pending: {
    label: 'Chờ thanh toán',
    icon: <AlertCircle className="w-5 h-5" />,
    cardClass: 'bg-amber-50 border-amber-200',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-400',
  },
  confirmed: {
    label: 'Đã xác nhận',
    icon: <Loader2 className="w-5 h-5" />,
    cardClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  completed: {
    label: 'Hoàn thành',
    icon: <CheckCircle2 className="w-5 h-5" />,
    cardClass: 'bg-green-50 border-green-200',
    badgeClass: 'bg-green-50 text-green-700 border-green-200',
    dotClass: 'bg-green-500',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: <XCircle className="w-5 h-5" />,
    cardClass: 'bg-slate-50 border-slate-200',
    badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
    dotClass: 'bg-slate-300',
  },
}

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ'
}

export function BookingStatusPage() {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    const revenues = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    for (const b of mockBookingList) {
      counts[b.status as BookingStatus]++
      revenues[b.status as BookingStatus] += b.finalPrice
    }
    return { counts, revenues }
  }, [])

  const totalRevenue = mockBookingList.filter(b => b.status === 'completed').reduce((s, b) => s + b.finalPrice, 0)
  const completedRate = mockBookingList.length > 0
    ? Math.round((stats.counts.completed / mockBookingList.length) * 100)
    : 0
  const cancelledRate = mockBookingList.length > 0
    ? Math.round((stats.counts.cancelled / mockBookingList.length) * 100)
    : 0

  const bookingsByStatus = useMemo(() => {
    const map: Record<string, typeof mockBookingList> = {}
    for (const s of STATUSES) map[s] = []
    for (const b of mockBookingList) {
      map[b.status]?.push(b)
    }
    return map
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Header title="Theo Dõi Trạng Thái" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUSES.map(status => {
              const cfg = STATUS_CONFIG[status]
              return (
                <div key={status} className={`rounded-xl border p-4 ${cfg.cardClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                  <span className={status === 'completed' ? 'text-green-600' : status === 'cancelled' ? 'text-slate-400' : status === 'pending' ? 'text-amber-500' : 'text-blue-600'}>
                      {cfg.icon}
                    </span>
                    <span className="text-sm font-medium text-slate-600">{cfg.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{stats.counts[status]}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatPrice(stats.revenues[status])}
                  </p>
                </div>
              )
            })}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-1">Doanh thu thực thu</p>
              <p className="text-2xl font-bold text-[#b11e29]">{formatPrice(totalRevenue)}</p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Từ các booking hoàn thành
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-1">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{completedRate}%</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {stats.counts.completed}/{mockBookingList.length} booking
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 mb-1">Tỷ lệ hủy</p>
              <p className="text-2xl font-bold text-slate-500">{cancelledRate}%</p>
              <div className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                <TrendingDown className="w-3.5 h-3.5" /> {stats.counts.cancelled} booking bị hủy
              </div>
            </div>
          </div>

          {/* Booking tables by status */}
          {STATUSES.filter(s => bookingsByStatus[s].length > 0).map(status => {
            const cfg = STATUS_CONFIG[status]
            const list = bookingsByStatus[status]
            return (
              <div key={status} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className={`flex items-center gap-2 px-5 py-3 border-b ${cfg.cardClass}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass}`} />
                  <h3 className="font-semibold text-sm text-slate-700">{cfg.label}</h3>
                  <span className={`ml-auto inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badgeClass}`}>
                    {list.length} booking
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {list.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/bookings/${b.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-700 truncate">{b.spaceName}</p>
                        <p className="text-xs text-slate-400">{b.customerName} · {b.startTime.slice(0, 10)} · {b.startTime.slice(11, 16)}–{b.endTime.slice(11, 16)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-700">{formatPrice(b.finalPrice)}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/bookings/${b.id}`) }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BookingStatusPage
