# F-27: Quản lý bookings

## Mục tiêu
Quản lý, chỉnh sửa, hủy các booking đã tạo.

## Mô tả
- Xem danh sách bookings với filter: ngày, trạng thái, khách hàng, không gian.
- Tìm kiếm theo booking code, tên khách hàng.
- Sửa booking (thay đổi thời gian, kéo dài nếu không trùng lịch).
- Hủy booking (ghi nhận lý do, soft delete).
- Xuất danh sách bookings ra Excel (tương lai).

## Acceptance Criteria
- [ ] List tất cả bookings với filter: date range, status, customer, space
- [ ] Search by booking code, customer name
- [ ] Edit booking: change time, extend duration (nếu không conflict)
- [ ] Cancel booking: nhập cancel reason, update status
- [ ] Export bookings to Excel (future)
