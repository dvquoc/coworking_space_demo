# F-71 – Quản lý nhân sự (Staff Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-71 |
| Epic | EP-09 - Staff & Permission Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Admin** thêm, sửa, xóa và quản lý tài khoản nhân viên (staff). Mỗi staff có email, tên, điện thoại, role và danh sách buildings được phân công. Khi tạo mới, hệ thống gửi email mời với mật khẩu tạm thời.

**Business Rationale:**
- Quản lý tập trung tài khoản nhân viên
- Kiểm soát ai có quyền truy cập hệ thống
- Gán nhân viên vào building cụ thể để phân quyền theo vị trí

**Business Rules:**
- Email không trùng lặp
- Staff mới → gửi invitation email với temporary password
- Staff login lần đầu → bắt buộc đổi mật khẩu
- Không thể xóa staff đang có trạng thái `active` (phải deactivate trước)

## User Story

> Là **Admin**, tôi muốn **thêm staff account** để **cho phép nhân viên truy cập hệ thống**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Danh sách Staff

- [ ] **AC1**: Route `/staff` hiển thị danh sách nhân viên
- [ ] **AC2**: Columns: Tên, Email, SĐT, Role, Buildings, Trạng thái, Hành động
- [ ] **AC3**: Search theo tên, email
- [ ] **AC4**: Filter theo role, trạng thái (active/inactive)

### Thêm Staff

- [ ] **AC5**: Form: email (required), fullName (required), phone, role (dropdown), buildings (multi-select)
- [ ] **AC6**: Gửi invitation email với temporary password
- [ ] **AC7**: Staff đăng nhập lần đầu → must change password

### Sửa / Deactivate Staff

- [ ] **AC8**: Sửa thông tin: tên, phone, role, buildings
- [ ] **AC9**: Deactivate staff → trạng thái `inactive`, không thể login
- [ ] **AC10**: Reactivate staff → trạng thái `active`
