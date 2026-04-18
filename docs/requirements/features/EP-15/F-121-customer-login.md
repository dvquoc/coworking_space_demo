# F-121 – Đăng nhập Customer Portal (Customer Login)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-121 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 (Moved from Phase 3) |

## Mô tả nghiệp vụ

Cho phép **Customer** đăng nhập vào portal riêng (tách biệt với staff login). Sau khi login, customer thấy dashboard tổng quan: upcoming bookings, unpaid invoices.

**Business Rationale:**
- Customers tự quản lý tài khoản, giảm tải cho staff
- Portal riêng biệt với admin dashboard
- Bước đầu để enable self-service features

**Business Rules:**
- Customer login bằng email/password (separate authentication system)
- Customer account được tạo bởi staff (không tự đăng ký)
- Sau login → redirect tới Customer Dashboard
- Session timeout: 30 phút inactive

## User Story

> Là **Customer**, tôi muốn **login to portal** để **manage my account và bookings**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Login

- [ ] **AC1**: Trang login riêng cho customer portal (URL khác admin)
- [ ] **AC2**: Form: email (required), password (required)
- [ ] **AC3**: Login thành công → redirect tới Customer Dashboard
- [ ] **AC4**: Login thất bại → hiển thị error message
- [ ] **AC5**: Forgot password → gửi reset link qua email

### Customer Dashboard

- [ ] **AC6**: Hiển thị upcoming bookings (next 7 ngày)
- [ ] **AC7**: Hiển thị unpaid invoices count + total amount
- [ ] **AC8**: Quick links: My Bookings, My Invoices, Book Space, Profile
