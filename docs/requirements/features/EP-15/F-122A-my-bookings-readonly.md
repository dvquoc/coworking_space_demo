# F-122A – Xem booking (My Bookings – Read-only)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-122A |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 (Moved from Phase 3) |

## Mô tả nghiệp vụ

Cho phép **Customer** xem danh sách bookings của mình (upcoming và past) trên portal. Chế độ read-only – chỉ xem, không thể cancel hay modify.

**Business Rationale:**
- Customer tự tra cứu lịch sử booking
- Giảm số cuộc gọi/email hỏi staff về booking
- Phase 1 chỉ cần read-only, full management ở Phase 3 (F-122)

**Business Rules:**
- Chỉ hiển thị bookings của customer đang login
- Phân loại: Upcoming (sắp tới) và Past (đã qua)
- Không có chức năng cancel/modify (Phase 1)
- Hiển thị chi tiết: space, date/time, status

## User Story

> Là **Customer**, tôi muốn **xem bookings của tôi** để **biết lịch sử và lịch sắp tới**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Bookings

- [ ] **AC1**: Route `/portal/my-bookings` hiển thị bookings của customer
- [ ] **AC2**: Tab: Upcoming | Past
- [ ] **AC3**: Columns: Space Name, Building, Date, Time, Duration, Status
- [ ] **AC4**: Sort: Upcoming → gần nhất trước, Past → mới nhất trước

### Chi tiết Booking

- [ ] **AC5**: Click booking → xem chi tiết: space info, date/time, status, total amount
- [ ] **AC6**: Không có nút Cancel hay Modify (read-only)
