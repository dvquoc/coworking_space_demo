# F-127 – Quản lý hồ sơ (Profile Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-127 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Customer** xem và cập nhật thông tin cá nhân: contact info, đổi mật khẩu, notification preferences.

**Business Rationale:**
- Customer tự cập nhật thông tin liên lạc
- Giảm workload cho staff khi customer đổi SĐT/email
- Customer chủ động quản lý bảo mật tài khoản

**Business Rules:**
- Email không thể tự đổi (liên hệ staff)
- Đổi mật khẩu: nhập mật khẩu cũ + mật khẩu mới (min 8 ký tự)
- Tên, SĐT, địa chỉ: customer tự cập nhật
- Notification preferences: email, Zalo (bật/tắt)

## User Story

> Là **Customer**, tôi muốn **cập nhật profile** để **thông tin liên lạc luôn chính xác**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Xem Profile

- [ ] **AC1**: Route `/portal/profile` hiển thị thông tin customer
- [ ] **AC2**: Hiển thị: fullName, email (read-only), phone, address, company

### Cập nhật Profile

- [ ] **AC3**: Edit: fullName, phone, address, company
- [ ] **AC4**: Save → cập nhật thành công, hiển thị thông báo
- [ ] **AC5**: Validation: phone format, required fields

### Đổi mật khẩu

- [ ] **AC6**: Form: current password, new password, confirm new password
- [ ] **AC7**: Validate: current password đúng, new password ≥ 8 ký tự
- [ ] **AC8**: Đổi thành công → hiển thị thông báo, logout các session khác

### Notification Preferences

- [ ] **AC9**: Toggle: nhận email notifications (on/off)
- [ ] **AC10**: Toggle: nhận Zalo notifications (on/off)
