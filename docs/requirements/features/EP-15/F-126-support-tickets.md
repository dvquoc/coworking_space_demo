# F-126 – Yêu cầu hỗ trợ (Support Tickets)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-126 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Customer** gửi yêu cầu hỗ trợ (support ticket) qua portal. Phân loại vấn đề, theo dõi trạng thái xử lý, và nhận phản hồi từ staff.

**Business Rationale:**
- Kênh tiếp nhận yêu cầu chính thức, có tracking
- Customer theo dõi được trạng thái xử lý
- Staff quản lý tập trung các yêu cầu, không bị miss

**Business Rules:**
- Ticket number tự động: TICKET-001, TICKET-002, ...
- Categories: technical, billing, facility, other
- Priority: low, medium, high (customer chọn)
- Status flow: open → in_progress → resolved → closed
- Staff assign ticket cho mình hoặc member khác
- Gửi email notification khi status thay đổi

## User Story

> Là **Customer**, tôi muốn **gửi support request** để **báo issues và nhận hỗ trợ**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Tạo Ticket (Customer view)

- [ ] **AC1**: Route `/portal/support` hiển thị danh sách tickets của customer
- [ ] **AC2**: Bấm "New Ticket" → form: category (dropdown), subject (required), description (required), priority (dropdown)
- [ ] **AC3**: Upload attachments: photos, documents (max 5 files, 10MB/file)
- [ ] **AC4**: Submit → ticket created, status `open`, gửi confirmation email

### Theo dõi Ticket (Customer view)

- [ ] **AC5**: Danh sách tickets: ticket number, subject, category, priority, status, created date
- [ ] **AC6**: Click ticket → xem chi tiết + resolution notes (nếu có)
- [ ] **AC7**: Email notification khi status thay đổi

### Quản lý Ticket (Staff/Admin view)

- [ ] **AC8**: Route `/support-tickets` hiển thị tất cả tickets
- [ ] **AC9**: Filter: status, category, priority, assigned to
- [ ] **AC10**: Assign ticket cho staff member
- [ ] **AC11**: Update status: open → in_progress → resolved → closed
- [ ] **AC12**: Thêm resolution notes khi resolve
