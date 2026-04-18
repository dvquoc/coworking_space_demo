# F-125 – Đặt phòng trực tuyến (Book Space Online)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-125 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 (Moved from Phase 3) |

## Mô tả nghiệp vụ

Cho phép **Customer** tự đặt meeting room / hot desk trên portal mà không cần gọi staff. Hiển thị calendar view phòng trống, chọn date/time, submit booking.

**Business Rationale:**
- Customer tự book 24/7, không phụ thuộc giờ làm việc staff
- Giảm tải khối lượng công việc booking cho staff
- Tăng tỷ lệ sử dụng spaces

**Business Rules:**
- Customer chỉ book spaces thuộc building trong contract
- Booking flow: chọn space → chọn date/time → submit
- Booking status: pending (cần staff confirm) hoặc auto-confirmed (tùy config)
- Không book trùng thời gian (conflict check)
- Gửi confirmation email sau khi booking được confirm

## User Story

> Là **Customer**, tôi muốn **tự book meeting room** để **không cần gọi staff**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Tìm phòng trống

- [ ] **AC1**: Calendar view: hiển thị available spaces theo date
- [ ] **AC2**: Filter: building, space type (meeting room, hot desk), capacity
- [ ] **AC3**: Hiển thị rõ các slot available vs occupied

### Đặt phòng

- [ ] **AC4**: Chọn space → chọn date, start time, end time (hoặc duration)
- [ ] **AC5**: Conflict check: nếu trùng → hiển thị "This slot is already booked"
- [ ] **AC6**: Submit booking → status pending hoặc auto-confirmed
- [ ] **AC7**: Hiển thị booking summary: space, date/time, duration, estimated cost

### Xác nhận

- [ ] **AC8**: Gửi confirmation email cho customer
- [ ] **AC9**: Booking hiển thị trong "My Bookings" (F-122A)
