# F-134 – Báo cáo sự cố (Issue Reporting)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-134 |
| Epic | EP-16 - Feedback & Quality Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Customer** báo cáo sự cố (AC hỏng, phòng bẩn, internet chập chờn, tiếng ồn). Phân loại theo category và severity, staff theo dõi và xử lý.

**Business Rationale:**
- Kênh tiếp nhận sự cố nhanh, có tracking
- Phân loại severity để ưu tiên xử lý
- Thống kê sự cố thường gặp để phòng ngừa

**Business Rules:**
- Issue categories: cleanliness, facility_broken, noise, internet, other
- Severity: low, medium, high
- Status flow: pending → acknowledged → resolved
- Staff acknowledge sự cố → customer nhận notification
- Staff resolve → nhập resolution notes
- High severity issues → notify Manager ngay lập tức

## User Story

> Là **Customer**, tôi muốn **báo sự cố** để **được xử lý nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Báo cáo sự cố (Customer view)

- [ ] **AC1**: Form: category (dropdown), description (required), severity (dropdown)
- [ ] **AC2**: Upload ảnh minh họa (optional, max 3 ảnh)
- [ ] **AC3**: Chọn location: building, floor (optional)
- [ ] **AC4**: Submit → tạo Feedback record (type: issue_report), status `pending`
- [ ] **AC5**: Gửi confirmation: "Sự cố đã được ghi nhận, mã: [ID]"

### Quản lý sự cố (Staff/Manager view)

- [ ] **AC6**: Route `/issues` hiển thị danh sách sự cố
- [ ] **AC7**: Columns: ID, Customer, Category, Severity, Description, Location, Status, Ngày tạo
- [ ] **AC8**: Filter: category, severity, status, building
- [ ] **AC9**: Acknowledge issue → status `acknowledged`, notify customer
- [ ] **AC10**: Resolve issue → nhập resolution notes, status `resolved`, notify customer

### Cảnh báo

- [ ] **AC11**: High severity issues → push notification cho Manager
- [ ] **AC12**: Issues pending > 24 giờ → escalation alert
