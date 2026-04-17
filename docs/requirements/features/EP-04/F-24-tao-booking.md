# F-24: Tạo booking

## Mục tiêu
Cho phép quản lý/staff tạo booking cho khách hàng một cách nhanh chóng, không cần duyệt.

## Mô tả
- Nhập thông tin khách hàng (chọn từ danh sách hoặc thêm mới).
- Chọn tòa nhà, tầng, không gian.
- Chọn ngày, giờ bắt đầu/kết thúc.
- Hệ thống tự động tính duration, giá, áp dụng ưu đãi nếu có.
- Chọn dịch vụ sử dụng thêm (nếu có).
- Kiểm tra lịch trùng (conflict detection):
  - Nếu trùng: báo lỗi, không cho đặt.
  - Nếu không trùng: tiếp tục.

## Acceptance Criteria
- [ ] Chọn khách hàng (mới hoặc đã lưu)
- [ ] Chọn building → floor → space
- [ ] Chọn ngày + time slot (start time, end time)
- [ ] Hệ thống tự tính duration và price
- [ ] Check conflict: Nếu space đã booked trong time slot → show error
- [ ] Chọn dịch vụ sử dụng thêm (nếu có)
- [ ] Áp dụng ưu đãi/giảm giá (nếu có)
- [ ] Nhập notes (optional)
- [ ] Click "Tạo booking" → chuyển sang bước thanh toán
