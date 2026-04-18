# F-114 – Lịch sự kiện (Event Calendar)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-114 |
| Epic | EP-14 - Community & Events Management |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Hiển thị **lịch sự kiện** dạng calendar view để Manager và Customers dễ dàng xem tổng quan events trong tháng. Hỗ trợ filter theo event type và chuyển đổi giữa các chế độ xem.

**Business Rationale:**
- Tổng quan tất cả events trong tháng/tuần
- Tránh xung đột lịch (2 events cùng thời gian, cùng location)
- Customers dễ dàng tìm events quan tâm

**Business Rules:**
- Calendar hiển thị events có status: published, ongoing, completed
- Không hiển thị events status `draft` cho customers (chỉ Manager thấy)
- Color-coding theo event type
- Click event → xem details hoặc đăng ký

## User Story

> Là **Manager/Customer**, tôi muốn **xem lịch sự kiện** để **biết events sắp tới**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Calendar View

- [ ] **AC1**: Route `/events/calendar` hiển thị calendar view
- [ ] **AC2**: Chế độ xem: Month / Week
- [ ] **AC3**: Events hiển thị trên calendar với color theo type (workshop = xanh, networking = cam, seminar = tím, social = hồng)
- [ ] **AC4**: Click event trên calendar → popup chi tiết event

### Filter

- [ ] **AC5**: Filter theo event type (multi-select)
- [ ] **AC6**: Filter theo status (published, ongoing, completed)

### Navigation

- [ ] **AC7**: Nút Previous / Next để chuyển tháng/tuần
- [ ] **AC8**: Nút "Today" để quay về hiện tại
- [ ] **AC9**: Click event detail → navigate tới event detail page
