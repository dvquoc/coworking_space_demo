# F-72 – Gán quyền theo role (Role Assignment)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-72 |
| Epic | EP-09 - Staff & Permission Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Admin** gán role cho staff. Hệ thống có 6 roles cố định: Investor, Admin, Manager, Kế toán, Sale, Bảo trì. Mỗi role có tập permissions mặc định.

**Business Rationale:**
- Kiểm soát quyền truy cập theo vai trò
- Đảm bảo nhân viên chỉ truy cập module liên quan

**Business Rules:**
- 6 roles: Investor, Admin, Manager, Accountant, Sale, Maintenance
- Mỗi role có permissions mặc định (CRUD per module)
- Admin có thể thay đổi role của staff bất kỳ lúc nào
- Thay đổi role → permissions cập nhật ngay lập tức

## User Story

> Là **Admin**, tôi muốn **gán role cho staff** để **kiểm soát quyền truy cập từng module**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Dropdown chọn role khi tạo/sửa staff
- [ ] **AC2**: Roles: Investor, Admin, Manager, Kế toán, Sale, Bảo trì
- [ ] **AC3**: Mỗi role có permissions mặc định (xem permission matrix)
- [ ] **AC4**: Thay đổi role → quyền truy cập cập nhật ngay
- [ ] **AC5**: Hiển thị role badge trên danh sách staff
