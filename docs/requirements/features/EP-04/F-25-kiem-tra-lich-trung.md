# F-25: Kiểm tra lịch trùng (Conflict Detection)

## Mục tiêu
Đảm bảo không gian không bị double-booking.

## Mô tả
- Khi tạo/sửa booking, hệ thống kiểm tra các booking đã tồn tại cho cùng không gian.
- Kiểm tra overlap: `(requestedStart < existingEnd) AND (requestedEnd > existingStart)`
- Nếu trùng: báo lỗi, không cho đặt.
- Nếu không trùng: tiếp tục quy trình.
- Gợi ý slot thay thế nếu có.

## Acceptance Criteria
- [ ] Khi tạo/sửa booking, query existing bookings cho space đó
- [ ] Nếu overlap → show error "Không gian đã được đặt từ [time] đến [time]"
- [ ] Suggest alternative time slots (nếu có)
