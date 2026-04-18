# F-122 – Quản lý booking (My Bookings – Full Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-122 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Mở rộng F-122A, cho phép **Customer** xem, cancel bookings trên portal. Upgrade từ read-only sang full management.

**Business Rationale:**
- Customer tự quản lý bookings, không cần gọi staff
- Cho phép cancel booking theo policy (trước X giờ)
- Tăng customer autonomy

**Business Rules:**
- Kế thừa tất cả từ F-122A
- Cancel booking: chỉ cho phép cancel trước startDate ≥ 24 giờ
- Cancel sau 24 giờ → tính phí cancellation (theo policy)
- Cancel → gửi confirmation email
- Không cho phép modify booking (phải cancel rồi book lại)

## User Story

> Là **Customer**, tôi muốn **cancel booking** để **thay đổi kế hoạch khi cần**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Kế thừa F-122A

- [ ] **AC1**: Tất cả AC từ F-122A vẫn áp dụng

### Cancel Booking

- [ ] **AC2**: Nút "Cancel Booking" cho bookings upcoming có status `confirmed`
- [ ] **AC3**: Kiểm tra: startDate – now ≥ 24 giờ → cho phép cancel miễn phí
- [ ] **AC4**: startDate – now < 24 giờ → hiển thị cảnh báo phí cancellation
- [ ] **AC5**: Xác nhận cancel → status chuyển `cancelled`
- [ ] **AC6**: Gửi cancellation confirmation email
