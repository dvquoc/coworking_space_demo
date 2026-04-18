# F-73 – Ma trận phân quyền (Permission Matrix)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-73 |
| Epic | EP-09 - Staff & Permission Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Hiển thị ma trận phân quyền chi tiết: mỗi role có quyền CRUD (Create, Read, Update, Delete) trên từng module (customers, bookings, invoices, contracts, inventory, staff...).

**Business Rationale:**
- Admin cần xem tổng quan quyền của từng role
- Đảm bảo không có quyền thiếu hoặc thừa

**Business Rules:**
- Ma trận: rows = modules, columns = actions (C/R/U/D)
- Permissions áp dụng real-time khi staff truy cập
- Route không có quyền → redirect tới Forbidden page

## User Story

> Là **Admin**, tôi muốn **xem permission matrix** để **biết mỗi role có quyền gì**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Trang Permission Matrix hiển thị bảng: Module × Actions (C/R/U/D)
- [ ] **AC2**: Filter theo role để xem permissions của role đó
- [ ] **AC3**: Modules: Customers, Bookings, Invoices, Contracts, Inventory, Staff, Reports, Settings
- [ ] **AC4**: Checkbox C/R/U/D cho mỗi module-role
- [ ] **AC5**: Route guard kiểm tra permission trước khi cho truy cập
- [ ] **AC6**: Nếu không có quyền → hiển thị trang Forbidden (403)
