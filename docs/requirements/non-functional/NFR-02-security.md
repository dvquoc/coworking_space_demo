# NFR-02 – Security & Data Privacy

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | NFR-02 |
| Loại | Non-Functional Requirement |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Độ ưu tiên | Must have |

## Mô tả

Đảm bảo hệ thống bảo mật dữ liệu khách hàng, phân quyền đúng theo vai trò (6 roles), và tuân thủ các chuẩn bảo mật cho ứng dụng quản lý Coworking Space.

## Yêu cầu bảo mật

### 1. Authentication & Authorization
- **Multi-role Access Control**: 6 vai trò với quyền hạn khác nhau
  - Nhà đầu tư: Chỉ xem báo cáo tổng quan, không sửa dữ liệu
  - Admin: Full quyền hệ thống
  - Manager: Quản lý vận hành hàng ngày
  - Bảo trì: Chỉ xem/sửa thiết bị và maintenance tasks
  - Kế toán: Quản lý tài chính, không thấy dữ liệu vận hành
  - Sale: Quản lý leads và customers, không thấy tài chính nội bộ

- **Role-based Route Protection**: Mỗi route chỉ accessible bởi roles được phép
- **Password Policy**: 
  - Minimum 8 ký tự
  - Phải có chữ hoa, chữ thường, số
  - Password strength indicator khi đặt mật khẩu

- **Session Management**:
  - JWT tokens với expiry time (access token: 1 giờ, refresh token: 7 ngày)
  - Auto logout khi token hết hạn
  - Secure token storage (httpOnly cookies hoặc secure localStorage)

### 2. Data Privacy
- **Personal Data Protection**:
  - Encrypt dữ liệu nhạy cảm (password, payment info) trong database
  - Mask sensitive data trong logs (không log passwords, credit cards)
  - GDPR-compliant: User có quyền xem/export/xóa dữ liệu cá nhân

- **Data Isolation**:
  - 2 tòa nhà Cobi dùng chung database nhưng filter theo `building_id`
  - Đảm bảo không leak dữ liệu giữa các customers

- **Audit Trail**:
  - Log tất cả actions quan trọng (login, payment, contract changes)
  - Track who/when/what changed cho compliance

### 3. API Security
- **HTTPS Only**: All communications qua SSL/TLS
- **CORS Policy**: Chỉ cho phép requests từ whitelist domains
- **Rate Limiting**: Prevent brute force attacks (max 5 failed logins/10 phút)
- **Input Validation**: Sanitize inputs để prevent SQL injection, XSS
- **API Authentication**: JWT bearer tokens cho tất cả API calls

### 4. Payment Security
- **PCI-DSS Compliance** (cho VNPay/MoMo/ZaloPay integration):
  - Không lưu credit card numbers trong database
  - Tokenization: Chỉ lưu payment tokens từ payment gateways
  - Encrypt payment transaction logs

- **Transaction Verification**:
  - Verify payment callbacks từ VNPay/MoMo (signature validation)
  - Prevent replay attacks với transaction IDs

### 5. Frontend Security
- **XSS Prevention**: Sanitize user inputs, escape output
- **CSRF Protection**: CSRF tokens cho tất cả POST/PUT/DELETE requests
- **Content Security Policy (CSP)**: Restrict script sources
- **Secure Cookies**: Set httpOnly, secure, sameSite flags

## Acceptance Criteria

### Phase 1 (MVP)
- [ ] JWT authentication với role-based access control cho 6 roles
- [ ] Password encryption (bcrypt)
- [ ] HTTPS deployment
- [ ] Input validation cho all forms
- [ ] Basic audit logging (login, logout, payment actions)

### Phase 2
- [ ] Rate limiting on login endpoint
- [ ] Payment transaction encryption
- [ ] VNPay/MoMo signature validation
- [ ] CSRF protection
- [ ] Comprehensive audit trail (all CRUD operations)

### Phase 3
- [ ] GDPR compliance features (data export, right to be forgotten)
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Automated security scanning (OWASP checks)
- [ ] Penetration testing

## Testing Criteria

### Security Tests
- [ ] Role-based access: Manager không thấy được financial reports của Kế toán
- [ ] Password policy: Reject weak passwords
- [ ] Session expiry: Token hết hạn sau 1 giờ
- [ ] XSS test: Submit `<script>alert('xss')</script>` vào forms → should be escaped
- [ ] SQL injection test: Input `' OR '1'='1` → should be sanitized
- [ ] Payment verification: Invalid signature from payment gateway → reject transaction

### Compliance Checks
- [ ] All passwords encrypted in database (không lưu plaintext)
- [ ] All API endpoints require authentication (except login/forgot-password)
- [ ] Audit logs capture user ID, action, timestamp
- [ ] HTTPS enforced (HTTP requests redirect to HTTPS)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Password leaks | High | Bcrypt encryption + không log passwords |
| Unauthorized access | High | JWT expiry + role-based guards |
| Payment fraud | Critical | Signature validation + transaction logging |
| Data breach | Critical | Encrypt sensitive data + regular security audits |
| XSS/CSRF attacks | Medium | Input sanitization + CSRF tokens |

## Dependencies
- EP-01: Authentication (foundation cho security)
- EP-06: Payment & Invoicing (payment security)
- EP-09: Staff & Permission (role management)

## Out of Scope
- **Phase 1-3 không làm**:
  - Multi-factor authentication (MFA) - để future enhancement
  - Biometric authentication
  - Advanced threat detection / intrusion detection systems
  - SOC2/ISO27001 certification (có thể cần nếu scale lớn)

## Ghi chú
- Security là ongoing effort - cần regular updates khi có new vulnerabilities
- Recommend quarterly security audits sau khi launch
- Consider bug bounty program nếu public-facing
