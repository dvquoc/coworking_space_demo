# EP-06 – Payment & Invoicing

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-06 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý hóa đơn thanh toán cho bookings và contracts. Tích hợp VNPay, MoMo, ZaloPay, Chuyển khoản, và Credit cho thanh toán online. Hỗ trợ thanh toán thủ công (cash/bank transfer). Theo dõi trạng thái paid/unpaid, công nợ.

**Phase 1 Extended**: Bổ sung **deposit payment flow** (thanh toán đặt cọc 30%, 50%, 100%) cho bookings, **partial payment tracking**, và **auto-generate deposit invoices**.

> **Lưu ý**: Hệ thống Credit Account (nạp tiền trước, bonus credits, lịch sử giao dịch) đã được tách sang **[EP-07 – Credit Account Management](EP-07-credit.md)**. EP-06 chỉ xử lý phần **nhận thanh toán bằng credits** khi customer chọn phương thức "Pay by Credit" lúc thanh toán invoice.

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-42 | Tạo hóa đơn (Invoice Generation) | Auto/manual generate invoices | Draft |
| F-42B | Tạo hóa đơn thủ công (Manual Invoice Creation) | Tạo hóa đơn mới từ giao diện admin | Draft |
| F-43 | Payment Gateway Integration | VNPay, MoMo, ZaloPay | Draft |
| F-44 | Manual payment recording | Ghi nhận cash/bank transfer | Draft |
| F-45 | Payment tracking | Theo dõi paid/unpaid/overdue | Draft |
| F-45B | Filter theo nguồn hóa đơn | Lọc danh sách theo nguồn: Đặt chỗ / Hợp đồng / Nạp credit | Draft |
| F-46 | Receipt generation | Tạo biên lai sau khi thanh toán | Draft |
| F-46B | Deposit payment flow | Thanh toán đặt cọc (30%, 50%, 100%) | Draft |
| F-46C | Partial payment tracking | Theo dõi thanh toán một phần (deposit + balance) | Draft |
| F-46D | Auto-generate deposit invoice | Tự động tạo invoice đặt cọc sau khi booking approved | Draft |
| F-46G | Pay by Credit | Nhận thanh toán invoice bằng credits (tích hợp với EP-07) | Draft |

> Features F-46E, F-46F, F-46H, F-46I (Credit Account, Top-up, Bonus, History) → xem **[EP-07 – Credit Account Management](EP-07-credit.md)**

### Phase 2 - Advanced Features
- F-47: Auto-reconciliation với payment gateways
- F-48: Payment reminders & overdue alerts
- F-49: Refund workflow
- F-50: Payment analytics & reports

## Data Models

### Invoice
```typescript
interface Invoice {
  id: string;
  invoiceCode: string;          // "INV-202604-001"
  
  // Link to source
  customerId: string;
  contractId?: string;          // Nếu invoice từ contract
  bookingId?: string;           // Nếu invoice từ booking
  
  // Invoice Details
  invoiceDate: Date;
  dueDate: Date;
  
  // NEW: Deposit tracking (F-46B, F-46C)
  invoiceType: 'deposit' | 'full' | 'balance';  // deposit = đặt cọc, full = toàn bộ, balance = phần còn lại
  relatedInvoiceId?: string;                    // Link deposit invoice to balance invoice
  depositPercent?: number;                      // Nếu là deposit invoice: 30, 50, 100
  dueDate: Date;
  
  // Line Items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  taxPercent: number;           // VAT 10%
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paidAmount: number;
  paidAt?: Date;
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string; // From payment gateway
  
  // Meta
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceItem {
  description: string;          // "Hot Desk - 3 hours"
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

enum PaymentMethod {
  VNPAY = 'vnpay',
  MOMO = 'momo',
  ZALOPAY = 'zalopay',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT = 'credit',          // NEW: Pay by prepaid credits
  OTHER = 'other'
}
```

### Payment Transaction
```typescript
interface PaymentTransaction {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;       // From payment gateway
  status: 'pending' | 'success' | 'failed';
  gatewayResponse: object;      // Raw response from VNPay/MoMo
  createdAt: Date;
}
```

### Credit Account (tham chiếu EP-07)

> Data models cho `CreditAccount`, `CreditTransaction`, `BonusCreditCampaign` đã được chuyển sang **[EP-07 – Credit Account Management](EP-07-credit.md)**.

EP-06 chỉ sử dụng `paymentMethod = 'credit'` trong `PaymentTransaction` như một trong các phương thức thanh toán.

## User Stories

### US-42: Generate invoice từ booking
> Là **Kế toán**, tôi muốn **auto-generate invoice khi booking confirmed** để **thu tiền**

**Acceptance Criteria**:
- [ ] Khi booking status → confirmed, auto-create invoice
- [ ] Invoice items = booking details (space, duration, price)
- [ ] Due date = booking start date
- [ ] Status = unpaid
- [ ] Send invoice email to customer
- [ ] **NEW**: Nếu booking.depositRequired = true, tạo deposit invoice (F-46D)

### US-43: Thanh toán qua VNPay
> Là **Customer**, tôi muốn **thanh toán online qua VNPay** để **tiện lợi**

**Acceptance Criteria**:
- [ ] Kế toán gửi payment link qua email
- [ ] Customer click link → redirect VNPay
- [ ] Complete payment → callback to Cobi
- [ ] Verify signature → update invoice status paid
- [ ] Send receipt email

### US-44: Record manual payment
> Là **Kế toán**, tôi muốn **ghi nhận thanh toán cash** để **update invoice**

**Acceptance Criteria**:
- [ ] Select invoice → "Record Payment"
- [ ] Chọn payment method "Cash"
- [ ] Nhập amount, payment date, notes
- [ ] Update invoice status → paid
- [ ] Generate receipt PDF

### US-45: Track overdue invoices
> Là **Kế toán**, tôi muốn **xem invoices quá hạn** để **nhắc nhở customers**

**Acceptance Criteria**:
- [ ] Dashboard hiển thị overdue invoices (past due date, unpaid)
- [ ] Send reminder emails tự động (mỗi 3 ngày)
- [ ] Filter invoices by status
- [ ] Export overdue list to Excel

### US-46G: Thanh toán invoice bằng credits
> Là **Kế toán**, tôi muốn **chọn phương thức "Pay by Credit" khi ghi nhận thanh toán invoice** để **sử dụng số dư credit của customer**.

**Acceptance Criteria**:
- [ ] Trong modal Record Payment, chọn method "Credit"
- [ ] Hiển thị số dư credit hiện tại của customer (lấy từ EP-07)
- [ ] Kiểm tra balance đủ hay không trước khi xác nhận
- [ ] Nếu đủ: invoice status → paid, paymentMethod = credit; EP-07 trừ credits
- [ ] Nếu không đủ: hiển thị thông báo và gợi ý top-up

> ℹ️ Các user stories liên quan đến Credit Account (tạo account, nạp tiền, lịch sử giao dịch) xem tại **[EP-07 – Credit Account Management](EP-07-credit.md)**.

## Scenarios

### Scenario 1: Auto-generate invoice từ booking
```
Given Booking "BK-001" confirmed, price 150,000 VND
When System cronjob chạy
And Tạo invoice với items: "Hot Desk 3h - 150,000 VND"
And Set due date = booking start date
Then Invoice "INV-202604-001" created, status unpaid
And Email gửi customer với payment link
```

### Scenario 2: Payment qua MoMo success
```
Given Invoice "INV-001", amount 150,000 VND, status unpaid
When Customer click payment link → MoMo
And Complete payment → MoMo callback to system
And Verify signature success
Then Invoice status → paid, paidAt = now
And PaymentTransaction record created với MoMo transactionId
And Receipt email gửi customer
```

### Scenario 3: Manual cash payment
```
Given Invoice "INV-002", amount 8,000,000 VND, unpaid
When Kế toán click "Record Payment"
And Chọn method "Cash", amount 8,000,000
And Click "Save"
Then Invoice status → paid
And Receipt PDF generated
```

### Scenario 4: Thanh toán invoice bằng credits
```
Given Invoice "INV-003", amount 150,000 VND = 150 credits
And Customer "Jane" có balance = 300 credits (theo EP-07)
When Kế toán chọn Record Payment → method = Credit
And Hệ thống kiểm tra balance đủ (300 >= 150)
And Xác nhận thanh toán
Then Invoice status → paid, paymentMethod = credit
And EP-07 trừ 150 credits, balance còn 150
And Email biên lai gửi customer
```

> ℹ️ Các scenario về top-up, bonus credits, employee tracking xem tại **[EP-07](EP-07-credit.md)**.

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-04: Booking (invoices từ bookings)
- EP-05: Contract (invoices từ contracts)
- EP-07: Credit Account Management (khi customer chọn "Pay by Credit")
- NFR-04: Payment Integration reliability

**Được sử dụng bởi**:
- EP-11: Dashboards (revenue tracking)
- EP-16: Feedback (post-payment rating)

## Out of Scope Phase 1
- Auto-reconciliation daily
- Installment payments
- Refund workflow
- Multi-currency

## Technical Notes

### Payment Gateway Callbacks
- VNPay: IPN callback với HMAC signature
- MoMo: IPN với RSA signature
- ZaloPay: IPN với MAC signature
- Idempotency: Check transactionId đã process chưa

### Cronjobs
- **Overdue check**: Daily, update status unpaid → overdue nếu past due date
- **Reminder emails**: Gửi sau 1 ngày, 3 ngày, 7 ngày overdue

## Ghi chú
- Phase 1: Basic payment integration + manual recording
- Phase 2: Auto-reconciliation, refunds, advanced reports
