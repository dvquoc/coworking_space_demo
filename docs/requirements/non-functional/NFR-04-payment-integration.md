# NFR-04 – Payment Integration Reliability

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | NFR-04 |
| Loại | Non-Functional Requirement |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Độ ưu tiên | Must have (Phase 1) |

## Mô tả

Đảm bảo tích hợp payment gateways (VNPay, MoMo, ZaloPay) hoạt động ổn định, xử lý đúng các edge cases, và đồng bộ trạng thái thanh toán chính xác giữa hệ thống Cobi và payment providers.

## Payment Gateways

### Supported Payment Methods
**Phase 1**:
- **VNPay**: Thẻ ATM nội địa, QR code
- **MoMo**: E-wallet
- **ZaloPay**: E-wallet
- **Manual/Cash**: Ghi nhận thanh toán thủ công bởi kế toán

**Phase 2-3** (nếu cần):
- Credit cards quốc tế (Visa/Mastercard) qua VNPay
- Bank transfer confirmation
- Installment payments (trả góp)

## Yêu cầu kỹ thuật

### 1. Transaction Flow
```
Customer → Cobi Invoice → Payment Gateway → Callback → Update Invoice Status
```

**Steps**:
1. Kế toán/Manager tạo invoice trong hệ thống
2. Gửi payment link cho customer (email/SMS)
3. Customer click link → redirect đến VNPay/MoMo/ZaloPay
4. Customer hoàn tất thanh toán
5. Payment gateway gọi callback URL của Cobi
6. Cobi verify signature → update invoice status → send confirmation email

### 2. IPN (Instant Payment Notification) Handling
**Reliability Requirements**:
- **Idempotency**: Cùng 1 transaction ID chỉ xử lý 1 lần (prevent duplicate payments)
- **Retry logic**: Nếu callback failed, payment gateway sẽ retry → Cobi phải handle retries
- **Timeout**: Callback phải response trong 30 giây, nếu không gateway sẽ retry
- **Signature verification**: Validate tất cả callbacks từ payment gateways để prevent fraud

**Implementation**:
```
- Check transaction_id đã tồn tại chưa → nếu có, return success (idempotent)
- Verify signature (HMAC-SHA256 với secret key)
- Update invoice status: pending → paid
- Store payment gateway response (transaction_id, payment_time, amount)
- Return 200 OK immediately (không chờ email send)
- Async: Send confirmation email/SMS sau khi callback success
```

### 3. Error Handling

| Error Case | Handling |
|------------|----------|
| Payment failed | Invoice vẫn pending, customer có thể retry |
| Payment timeout | Invoice pending, send reminder sau 24h |
| Callback không đến | Cronjob query payment status từ gateway mỗi 15 phút |
| Amount mismatch | Log error, notify kế toán, don't auto-update invoice |
| Signature invalid | Reject callback, log security alert |
| Duplicate callback | Return success, không update lại |

### 4. Payment Status Sync
**Problem**: Callback có thể bị miss → invoice pending mãi mãi

**Solution**:
- **Active polling** (Phase 1):
  - Cronjob chạy mỗi 30 phút
  - Query tất cả invoices pending > 1 giờ
  - Gọi payment gateway API để check status
  - Update nếu payment đã success nhưng callback miss

- **Webhook + Polling** (Phase 2):
  - Primary: Webhook callback từ payment gateway
  - Fallback: Polling cronjob nếu webhook không đến sau 1 giờ

### 5. Reconciliation
**Daily reconciliation** (Phase 2):
- Kế toán export transaction report từ VNPay/MoMo portal
- Compare với invoices paid trong hệ thống Cobi
- Flag discrepancies (payments received nhưng chưa update trong Cobi)
- Manual review cho flagged transactions

### 6. Testing in Sandbox
**Phase 1 Development**:
- Sử dụng sandbox/test mode của VNPay, MoMo, ZaloPay
- Không charge thật tiền
- Test cards/accounts do payment gateways cung cấp

**Test Cases**:
- [x] Successful payment
- [x] Failed payment (insufficient funds)
- [x] Timeout (user close browser mid-payment)
- [x] Duplicate callback
- [x] Invalid signature callback (fraud attempt)
- [x] Amount mismatch
- [x] Network error on callback

## Performance & Reliability Targets

### Uptime
- **Payment gateways**: 99.9% uptime (do providers đảm bảo)
- **Cobi callback endpoint**: 99.5% uptime (nếu down, polling sẽ catchup)

### Response Time
- **Redirect to payment gateway**: < 1 giây
- **Callback processing**: < 5 giây (để gateway không timeout)
- **Polling job**: Chạy < 30 giây cho 100 invoices

### Transaction Volume
- **Phase 1**: ~50-100 transactions/tháng (vài invoices/ngày)
- **Phase 2**: ~500 transactions/tháng
- **Phase 3**: ~2,000 transactions/tháng

### Success Rate
- **Target**: 95% successful payments (5% failures do user cancel/insufficient funds)
- **Callback delivery**: 99% (1% miss → polling sẽ catch)

## Acceptance Criteria

### Phase 1 (MVP)
- [ ] Tích hợp VNPay, MoMo, ZaloPay với test mode
- [ ] IPN callback handling với signature verification
- [ ] Idempotency check (duplicate callbacks không duplicate payments)
- [ ] Manual payment option cho cash/bank transfer
- [ ] Basic error handling (payment failed → invoice pending)

### Phase 2
- [ ] Active polling cronjob để sync payment status
- [ ] Transaction logs đầy đủ (all API calls to/from payment gateways)
- [ ] Daily reconciliation workflow cho kế toán
- [ ] Retry logic cho failed callbacks
- [ ] Switch sang production mode (live payments)

### Phase 3
- [ ] Webhook + fallback polling
- [ ] Auto-refund workflow (nếu customer request)
- [ ] Payment analytics (success rate, popular payment methods)
- [ ] Support installment payments

## Security Requirements
- **API Keys**: Store trong environment variables, không commit vào code
- **HTTPS Only**: Callback URL phải HTTPS
- **IP Whitelist**: Chỉ accept callbacks từ IP của VNPay/MoMo/ZaloPay
- **Rate Limiting**: Max 100 callback requests/phút (prevent DDoS)
- **Audit Log**: Log tất cả payment transactions (who, when, amount, status)

## Testing Criteria

### Functional Tests
- [ ] Create invoice → payment link generated → redirect đến VNPay
- [ ] Complete payment → callback received → invoice status updated
- [ ] Cancel payment mid-way → invoice vẫn pending
- [ ] Duplicate callback → chỉ update 1 lần
- [ ] Invalid signature callback → rejected

### Edge Case Tests
- [ ] Callback arrives sau khi invoice đã manual marked as paid → no conflict
- [ ] Network error on callback → polling cronjob catch và update
- [ ] Amount paid khác amount invoice → log error, notify kế toán
- [ ] Concurrent callbacks (2 callbacks cùng lúc) → both handled correctly

### Load Tests
- [ ] 10 payments đồng thời → tất cả processed correctly
- [ ] 1,000 pending invoices → polling job hoàn thành < 2 phút

## Dependencies
- EP-06: Payment & Invoicing (core payment logic)
- NFR-02: Security (signature verification, API key management)

## Integration Docs
- [VNPay Integration Guide](https://sandbox.vnpayment.vn/apis/docs/)
- [MoMo Integration Guide](https://developers.momo.vn/)
- [ZaloPay Integration Guide](https://docs.zalopay.vn/)

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment gateway downtime | High | Support manual payment option |
| Callback không đến | Medium | Polling cronjob fallback |
| Signature key leaked | Critical | Rotate keys immediately, audit logs |
| Amount manipulation | Critical | Verify amount on callback, check signature |
| Slow callback processing | Medium | Async email send, response 200 OK fast |

## Monitoring & Alerts
- **Alert khi**: Callback error rate > 5%
- **Alert khi**: Pending invoices > 1 ngày không update
- **Alert khi**: Amount mismatch detected
- **Dashboard**: Payment success rate, popular payment methods

## Ghi chú
- Test thoroughly trong sandbox trước khi lên production
- Keep test mode accessible cho demo/training
- Document troubleshooting guide cho kế toán (khi payment stuck)
