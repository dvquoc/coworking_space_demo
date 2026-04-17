import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Tag,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Pencil,
  Ban,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { mockBookings } from '../../mocks/bookingMocks'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ thanh toán',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <AlertCircle className="w-4 h-4" />,
  confirmed: <Loader2 className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
}

const SPACE_TYPE_LABEL: Record<string, string> = {
  hot_desk: 'Hot Desk',
  meeting_room: 'Meeting Room',
  training_room: 'Training Room',
  event_room: 'Event Room',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  cash: 'Tiền mặt',
}

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ'
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <div className="text-sm font-medium text-slate-700">{value}</div>
      </div>
    </div>
  )
}

export function BookingDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const booking = mockBookings.find(b => b.id === id) ?? mockBookings[0]

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'
  const canEdit = booking.status === 'pending'

  const durationMinutes = Math.round(
    (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 60000
  )
  const durationText = `${Math.floor(durationMinutes / 60)}h${durationMinutes % 60 > 0 ? ` ${durationMinutes % 60}m` : ''}`

  return (
    <div className="flex flex-col h-full">
      <Header title="Chi tiết Booking" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Back + actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/bookings')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Danh sách booking
            </button>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  <Pencil className="w-4 h-4" /> Chỉnh sửa
                </button>
              )}
              {canCancel && (
                <button className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-[#b11e29] rounded-lg text-sm font-medium hover:bg-red-50">
                  <Ban className="w-4 h-4" /> Hủy booking
                </button>
              )}
            </div>
          </div>

          {/* Header card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">Mã booking</p>
                <p className="text-lg font-bold text-slate-800">#{booking.id}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_CLASS[booking.status]}`}>
                {STATUS_ICON[booking.status]}
                {STATUS_LABEL[booking.status]}
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Tạo lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>

          {/* Khách hàng */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Khách hàng</h3>
            <InfoRow icon={<User className="w-4 h-4" />} label="Tên khách hàng" value={booking.customerId} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Số điện thoại" value="0901234567" />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value="khachhang@email.com" />
          </div>

          {/* Không gian & thời gian */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Không gian & Thời gian</h3>
            <InfoRow icon={<Building2 className="w-4 h-4" />} label="Không gian" value={booking.spaceName} />
            <InfoRow icon={<Tag className="w-4 h-4" />} label="Loại không gian" value={SPACE_TYPE_LABEL[booking.spaceType]} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Vị trí" value="Tầng 3 – Tòa nhà A" />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Ngày sử dụng"
              value={new Date(booking.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
            />
            <InfoRow
              icon={<Clock className="w-4 h-4" />}
              label="Khung giờ"
              value={`${booking.startTime.slice(11, 16)} – ${booking.endTime.slice(11, 16)} (${durationText})`}
            />
          </div>

          {/* Thanh toán */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Thanh toán</h3>
            <InfoRow
              icon={<CreditCard className="w-4 h-4" />}
              label="Phương thức"
              value={booking.paymentMethod ? (PAYMENT_METHOD_LABEL[booking.paymentMethod] ?? booking.paymentMethod) : '—'}
            />

            <div className="mt-3 space-y-2 text-sm bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between text-slate-500">
                <span>Giá không gian</span>
                <span>{formatPrice(booking.totalPrice * 0.9)}</span>
              </div>
              {(booking.discountPercent ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({booking.discountPercent}%)</span>
                  <span>-{formatPrice(booking.totalPrice * (booking.discountPercent ?? 0) / 100)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                <span className="text-slate-700">Tổng cộng</span>
                <span className="text-[#b11e29]">{formatPrice(booking.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {booking.notes && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Ghi chú</h3>
              <InfoRow icon={<FileText className="w-4 h-4" />} label="" value={booking.notes} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetailPage
