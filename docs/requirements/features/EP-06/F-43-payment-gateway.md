# F-43 – Tích hợp cổng thanh toán (Payment Gateway Integration)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-43 |
| Epic | EP-06 - Payment & Invoicing |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Tích hợp các cổng thanh toán online: **VNPay, MoMo, ZaloPay** để customer có thể thanh toán invoice qua payment link. Kế toán gửi link thanh toán qua email, customer click và hoàn tất trên gateway.

**Business Rationale:**
- Thanh toán online tiện lợi, giảm thu tiền mặt
- Tự động cập nhật trạng thái invoice khi thanh toán thành công
- Giảm tải cho kế toán

**Business Rules:**
- Mỗi thanh toán tạo 1 `PaymentTransaction` record
- Callback (IPN) phải verify signature trước khi cập nhật trạng thái
- Idempotency: check `transactionId` đã xử lý chưa trước khi cập nhật
- Nếu payment success → invoice status → `paid` (hoặc `partial` nếu thanh toán một phần)

## User Story

> Là **Customer**, tôi muốn **thanh toán online qua VNPay/MoMo/ZaloPay** để **tiện lợi và nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Gửi Payment Link

- [ ] **AC1**: Kế toán chọn invoice → gửi payment link qua email cho customer
- [ ] **AC2**: Email chứa link thanh toán với thông tin: invoice code, số tiền, hạn thanh toán

### Thanh toán VNPay

- [ ] **AC3**: Customer click link → redirect tới VNPay
- [ ] **AC4**: Hoàn tất thanh toán → VNPay callback (IPN) tới hệ thống
- [ ] **AC5**: Verify HMAC signature → cập nhật invoice `paymentStatus = 'paid'`
- [ ] **AC6**: Tạo `PaymentTransaction` với `transactionId` từ VNPay

### Thanh toán MoMo

- [ ] **AC7**: Customer click link → redirect tới MoMo
- [ ] **AC8**: MoMo callback (IPN) với RSA signature
- [ ] **AC9**: Verify signature → cập nhật invoice

### Thanh toán ZaloPay

- [ ] **AC10**: Customer click link → redirect tới ZaloPay
- [ ] **AC11**: ZaloPay callback (IPN) với MAC signature
- [ ] **AC12**: Verify signature → cập nhật invoice

### Post-Payment

- [ ] **AC13**: Gửi receipt email cho customer
- [ ] **AC14**: Cập nhật `paidAt`, `paidAmount`, `paymentMethod` trên invoice
