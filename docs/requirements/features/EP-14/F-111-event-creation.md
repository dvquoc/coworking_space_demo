# F-111 – Tạo sự kiện (Event Creation)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-111 |
| Epic | EP-14 - Community & Events Management |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Manager** tạo và quản lý sự kiện cộng đồng: workshops, networking events, seminars, social events. Thiết lập thông tin sự kiện, capacity, lịch trình, và chế độ đăng ký (public/private).

**Business Rationale:**
- Tăng engagement giữa các customers trong coworking space
- Xây dựng community, tạo giá trị gia tăng
- Thu hút customers mới thông qua events mở

**Business Rules:**
- Chỉ Manager/Admin mới tạo được event
- Event types: workshop, networking, seminar, social, other
- Event status flow: draft → published → ongoing → completed
- Event cancelled → notify tất cả registered attendees
- Registration deadline phải trước startDate
- Public event: tất cả customers có thể đăng ký; Private: chỉ invited customers

## User Story

> Là **Manager**, tôi muốn **tạo event** để **organize community activities cho customers**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Events

- [ ] **AC1**: Route `/events` hiển thị danh sách sự kiện
- [ ] **AC2**: Columns: Title, Type, Date/Time, Location, Capacity (current/max), Status, Hành động
- [ ] **AC3**: Filter theo type, status
- [ ] **AC4**: Search theo title

### Tạo Event

- [ ] **AC5**: Form: title (required), description, type (dropdown), startDate, endDate, location
- [ ] **AC6**: Set maxAttendees (capacity)
- [ ] **AC7**: Set registrationDeadline (optional)
- [ ] **AC8**: Chọn isPublic: Public (all customers) hoặc Private (invite-only)
- [ ] **AC9**: Status mặc định: `draft`

### Quản lý Event

- [ ] **AC10**: Publish event → status `published`, customers có thể đăng ký
- [ ] **AC11**: Edit event (chỉ khi status = draft hoặc published)
- [ ] **AC12**: Cancel event → status `cancelled`, notify registered attendees
- [ ] **AC13**: Mark completed → status `completed` (sau khi event kết thúc)
