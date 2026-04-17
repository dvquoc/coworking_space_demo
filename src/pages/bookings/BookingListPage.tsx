import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  Eye,
  Edit2,
  XCircle,
  Calendar,
  Clock,
  User,
  LayoutGrid,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBookingList } from '../../mocks/bookingMocks'
import type { BookingStatus, SpaceType } from '../../types/booking'

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Chờ thanh toán',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang sử dụng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const STATUS_CLASS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-600',
}

const SPACE_TYPE_LABEL: Record<SpaceType, string> = {
  hot_desk: 'Hot Desk',
  meeting_room: 'Meeting Room',
  training_room: 'Training Room',
  event_room: 'Event Room',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function BookingListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')
  const [spaceTypeFilter, setSpaceTypeFilter] = useState<SpaceType | ''>('')

  const filtered = useMemo(() => {
    return mockBookingList.filter(b => {
      const matchSearch =
        b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.spaceName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter ? b.status === statusFilter : true
      const matchType = spaceTypeFilter ? b.spaceType === spaceTypeFilter : true
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, spaceTypeFilter])

  // Stats
  const stats = useMemo(() => ({
    total: mockBookingList.length,
    pending: mockBookingList.filter(b => b.status === 'pending').length,
    confirmed: mockBookingList.filter(b => b.status === 'confirmed').length,
    cancelled: mockBookingList.filter(b => b.status === 'cancelled').length,
  }), [])

  return (
    <div className="flex flex-col h-full">
      <Header title="Quản lý Đặt chỗ" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng booking', value: stats.total, color: 'text-slate-700', bg: 'bg-white' },
            { label: 'Chờ thanh toán', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Đã xác nhận', value: stats.confirmed, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Đã hủy', value: stats.cancelled, color: 'text-red-500', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-slate-100 p-4 flex flex-col gap-1 shadow-sm`}>
              <span className="text-sm text-slate-500">{s.label}</span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
              placeholder="Tìm theo mã booking, tên khách, không gian..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as BookingStatus | '')}
          >
            <option value="">Tất cả trạng thái</option>
            {(Object.keys(STATUS_LABEL) as BookingStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b11e29]/30"
            value={spaceTypeFilter}
            onChange={e => setSpaceTypeFilter(e.target.value as SpaceType | '')}
          >
            <option value="">Tất cả loại không gian</option>
            {(Object.keys(SPACE_TYPE_LABEL) as SpaceType[]).map(t => (
              <option key={t} value={t}>{SPACE_TYPE_LABEL[t]}</option>
            ))}
          </select>
          <button
            onClick={() => navigate('/bookings/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[#b11e29] text-white rounded-lg text-sm font-medium hover:bg-[#8f1820] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo booking
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Mã booking</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Khách hàng</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Không gian</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Thời gian</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Trạng thái</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">Tổng tiền</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <LayoutGrid className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>Không có booking nào phù hợp</p>
                    </td>
                  </tr>
                )}
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{b.bookingCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#b11e29]/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[#b11e29]" />
                        </div>
                        <span className="font-medium text-slate-700">{b.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700 font-medium">{b.spaceName}</div>
                      <div className="text-xs text-slate-400">{SPACE_TYPE_LABEL[b.spaceType]}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateTime(b.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>đến {formatDateTime(b.endTime)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CLASS[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {b.finalPrice.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <button
                          onClick={() => navigate(`/bookings/${b.id}`)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/bookings/${b.id}/edit`)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                            title="Hủy"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingListPage
