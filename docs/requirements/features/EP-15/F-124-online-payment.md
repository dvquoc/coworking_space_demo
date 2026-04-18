# F-124 – Thanh toán trực tuyến (Online Payment)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-124 |
| Epic | EP-15 - Customer Self-Service Portal |
| Độ ưu tiên | Nice to have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Customer** thanh toán invoices online qua VNPay hoặc MoMo. Sau thanh toán, invoice tự động cập nhật status → paid.

**Business Rationale:**
- Thanh toán tiện lợi, không cần chuyển khoản thủ công
- Giảm thời gian xử lý payment cho staff
- Tự động reconcile: payment gateway callback → update invoice status

**Business Rules:**
- Payment gateways: VNPay, MoMo
- Chỉ thanh toán invoice có status pending/partial
- Click "Pay Now" → redirect tới payment gateway
- Payment thành công → callback → Invoice.status → paid
- Payment thất bại → hiển thị error, invoice giữ nguyên status
- Lưu transaction history: gateway, transactionId, amount, timestamp

## User Story

> Là **Customer**, tôi muốn **thanh toán online** để **tiện lợi và nhanh chóng**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Chọn thanh toán

- [ ] **AC1**: Từ invoice detail → bấm "Pay Now"
- [ ] **AC2**: Chọn payment method: VNPay hoặc MoMo
- [ ] **AC3**: Hiển thị tóm tắt: invoice number, amount, payment method

### Xử lý thanh toán

- [ ] **AC4**: Redirect tới payment gateway (VNPay/MoMo)
- [ ] **AC5**: Customer hoàn tất thanh toán trên gateway
- [ ] **AC6**: Callback từ gateway → hệ thống verify và cập nhật invoice

### Kết quả

- [ ] **AC7**: Thanh toán thành công → Invoice.status = paid, hiển thị "Payment successful"
- [ ] **AC8**: Thanh toán thất bại → hiển thị "Payment failed", invoice giữ nguyên
- [ ] **AC9**: Gửi payment receipt qua email
- [ ] **AC10**: Lưu transaction record: gateway, transactionId, amount, timestamp, status
