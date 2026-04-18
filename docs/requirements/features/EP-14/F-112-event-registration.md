# F-112 – Đăng ký tham gia sự kiện (Event Registration)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-112 |
| Epic | EP-14 - Community & Events Management |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Customers** đăng ký tham gia sự kiện đã published. Hệ thống kiểm tra capacity, gửi confirmation email, và quản lý danh sách attendees.

**Business Rationale:**
- Customers chủ động đăng ký events quan tâm
- Quản lý số lượng người tham gia
- Gửi thông báo và reminder tự động

**Business Rules:**
- Chỉ đăng ký event có status `published`
- Kiểm tra capacity: nếu đạt maxAttendees → hiển thị "Full"
- Kiểm tra registrationDeadline: quá hạn → không cho đăng ký
- Mỗi customer chỉ đăng ký 1 lần/event
- Customer có thể hủy đăng ký (status → cancelled) → nhả slot capacity
- Gửi confirmation email khi đăng ký thành công
- Gửi reminder email 1 ngày trước event

## User Story

> Là **Customer**, tôi muốn **đăng ký tham gia event** để **networking và học hỏi**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Đăng ký

- [ ] **AC1**: Customer xem danh sách events (public) đang mở đăng ký
- [ ] **AC2**: Bấm "Register" → kiểm tra capacity
- [ ] **AC3**: Capacity chưa đầy → đăng ký thành công, status `registered`
- [ ] **AC4**: Capacity đầy → hiển thị "Event is full"
- [ ] **AC5**: Quá registrationDeadline → hiển thị "Registration closed"
- [ ] **AC6**: Gửi confirmation email cho customer

### Quản lý Attendees (Manager view)

- [ ] **AC7**: Xem danh sách attendees cho mỗi event
- [ ] **AC8**: Columns: Customer Name, Email, Registration Date, Status
- [ ] **AC9**: Export danh sách attendees (CSV)

### Hủy đăng ký

- [ ] **AC10**: Customer bấm "Cancel Registration" → status `cancelled`
- [ ] **AC11**: Slot capacity được nhả ra cho người khác đăng ký
