# F-28: Theo dõi trạng thái booking

## Mục tiêu
Theo dõi trạng thái booking trong toàn bộ vòng đời.

## Mô tả
- Các trạng thái: pending (chờ thanh toán), confirmed (đã thanh toán), in_progress (đang sử dụng), completed (đã hoàn thành), cancelled (đã hủy).
- Tự động chuyển trạng thái khi check-in/check-out hoặc hết thời gian.
- Hiển thị badge màu theo trạng thái.

## Acceptance Criteria
- [ ] Booking list hiển thị status với color badge
- [ ] Filter by status
- [ ] Confirmed → In Progress: Auto-change khi check-in (EP-13)
- [ ] In Progress → Completed: Auto-change khi endTime passed
- [ ] Cancelled bookings không xóa khỏi database (soft delete)
