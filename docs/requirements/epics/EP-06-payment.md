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

Quản lý hóa đơn thanh toán cho bookings và contracts. Tích hợp VNPay, MoMo, ZaloPay cho thanh toán online. Hỗ trợ thanh toán thủ công (cash/bank transfer). Theo dõi trạng thái paid/unpaid, công nợ.

**Phase 1 Extended**: Bổ sung **deposit payment flow** (thanh toán đặt cọc 30%, 50%, 100%) cho bookings, **partial payment tracking**, và **auto-generate deposit invoices**.

**Phase 1 Credit System**: Hệ thống **nạp tiền trước (prepaid credit)** cho Individual và Company customers. **1 credit = 1,000 VND**. Customers nạp credits vào tài khoản, dùng credits để thanh toán services (space rental, printing, parking, coffee...). Company accounts hỗ trợ **employee-level tracking** (biết nhân viên nào dùng bao nhiêu credits).

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-42 | Tạo hóa đơn (Invoice Generation) | Auto/manual generate invoices | Draft |
| F-43 | Payment Gateway Integration | VNPay, MoMo, ZaloPay | Draft |
| F-44 | Manual payment recording | Ghi nhận cash/bank transfer | Draft |
| F-45 | Payment tracking | Theo dõi paid/unpaid/overdue | Draft |
| F-46 | Receipt generation | Tạo biên lai sau khi thanh toán | Draft |
| F-46B | Deposit payment flow | Thanh toán đặt cọc (30%, 50%, 100%) | Draft |
| F-46C | Partial payment tracking | Theo dõi thanh toán một phần (deposit + balance) | Draft |
| F-46D | Auto-generate deposit invoice | Tự động tạo invoice đặt cọc sau khi booking approved | Draft |
| F-46E | Credit Account Management | Quản lý tài khoản credit cho Individual và Company | Draft |
| F-46F | Credit Top-up | Nạp tiền vào credit account (VNPay/MoMo/ZaloPay/Cash) | Draft |
| F-46G | Pay by Credit | Thanh toán services bằng credits | Draft |
| F-46H | Service Credit Pricing | Quy đổi giá services (VND → Credits) | Draft |
| F-46I | Credit Transaction History | Lịch sử nạp/dùng credits, employee tracking cho company | Draft |

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

### Credit Account (F-46E)
```typescript
interface CreditAccount {
  id: string;
  accountCode: string;          // "CA-CUS-0001", "CA-COM-0001"
  
  // Owner
  ownerType: 'individual' | 'company';
  customerId?: string;          // Nếu ownerType = individual
  companyId?: string;           // Nếu ownerType = company
  
  // Balance
  currentBalance: number;       // Credits hiện có
  totalTopUp: number;           // Tổng credits đã nạp (lifetime)
  totalSpent: number;           // Tổng credits đã dùng (lifetime)
  
  // Alerts
  lowBalanceThreshold?: number; // Ngưỡng cảnh báo (VD: 100 credits)
  
  // Status
  status: 'active' | 'suspended' | 'closed';
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}
```

### Credit Transaction (F-46I)
```typescript
interface CreditTransaction {
  id: string;
  creditAccountId: string;
  
  // Transaction Info
  type: 'top_up' | 'payment' | 'refund' | 'adjustment';
  amount: number;               // + cho top_up/refund, - cho payment
  balanceBefore: number;
  balanceAfter: number;
  
  // Employee Tracking (for company accounts)
  employeeId?: string;          // CompanyEmployee nào dùng credits (nếu type = payment)
  
  // Reference
  referenceType?: 'invoice' | 'booking' | 'service';
  referenceId?: string;         // ID của invoice/booking/service
  
  // Payment Gateway (nếu top_up online)
  paymentMethod?: PaymentMethod;
  paymentTransactionId?: string;
  
  // Meta
  description?: string;         // "Nạp 500 credits", "Thanh toán Hot Desk 3h"
  createdBy: string;            // User/Customer ID
  createdAt: Date;
}
```

### Service Credit Price (F-46H)
```typescript
interface ServiceCreditPrice {
  id: string;
  
  // Service Info
  serviceType: string;          // 'space_rental', 'printing', 'parking', 'locker', 'coffee', 'meeting_room'
  serviceName: string;          // "Hot Desk", "A4 Color Print", "Parking Slot"
  spaceId?: string;             // Nếu serviceType = space_rental
  
  // Pricing
  priceVND: number;             // Giá VND
  priceCredits: number;         // = priceVND / 1000
  unitType: 'hour' | 'day' | 'month' | 'item' | 'page';
  
  // Validity
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer Service Subscription (F-46E)
```typescript
interface CustomerServiceSubscription {
  id: string;
  customerId: string;
  
  // Services enabled
  servicesEnabled: string[];    // ['space_rental', 'printing', 'parking']
  
  // Credit settings
  creditPaymentEnabled: boolean;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold?: number;  // Tự động nạp khi balance < threshold
  autoTopUpAmount?: number;     // Số credits nạp mỗi lần
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}
```

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

### US-46E: Tạo credit account cho customer
> Là **Manager**, tôi muốn **tạo credit account cho customer** để **họ có thể nạp tiền trước**

**Acceptance Criteria**:
- [ ] Khi tạo customer mới, tự động tạo CreditAccount với balance = 0
- [ ] Account code format: "CA-CUS-XXXX" (individual), "CA-COM-XXXX" (company)
- [ ] Hiển thị current balance trên customer profile
- [ ] Set low balance threshold (VD: 100 credits)

### US-46F: Customer nạp credits
> Là **Customer**, tôi muốn **nạp credits vào tài khoản** để **thanh toán services sau này**

**Acceptance Criteria**:
- [ ] Customer chọn "Top-up Credits" trên portal
- [ ] Nhập số VND muốn nạp (minimum 100,000 VND = 100 credits)
- [ ] Chọn payment method: VNPay/MoMo/ZaloPay
- [ ] Sau khi thanh toán success → credits cộng vào balance
- [ ] Tạo CreditTransaction type = top_up
- [ ] Gửi email xác nhận top-up

### US-46G: Thanh toán bằng credits
> Là **Customer**, tôi muốn **thanh toán booking bằng credits** để **tiện lợi**

**Acceptance Criteria**:
- [ ] Khi booking, hiển thị option "Pay by Credit" nếu balance đủ
- [ ] Check balance >= booking price (in credits)
- [ ] Trừ credits từ balance
- [ ] Tạo CreditTransaction type = payment, lưu employeeId nếu là company employee
- [ ] Invoice được mark paid, paymentMethod = CREDIT
- [ ] Gửi receipt email

### US-46H: Quản lý service credit pricing
> Là **Manager**, tôi muốn **set giá credits cho services** để **customers biết conversion rate**

**Acceptance Criteria**:
- [ ] CRUD danh sách ServiceCreditPrice
- [ ] Auto-calculate priceCredits = priceVND / 1000
- [ ] Hiển thị giá VND và Credits song song (VD: "50,000 VND = 50 credits")
- [ ] Version control: effective date, expiry date
- [ ] Apply giá mới cho bookings sau effective date

### US-46I: Xem credit transaction history
> Là **Customer/Manager**, tôi muốn **xem lịch sử nạp/dùng credits** để **theo dõi chi tiêu**

**Acceptance Criteria**:
- [ ] Hiển thị danh sách CreditTransactions (top_up, payment, refund, adjustment)
- [ ] Filter theo type, date range
- [ ] Company account: hiển thị employeeId trong payment transactions
- [ ] Export to Excel
- [ ] Hiển thị balanceBefore, balanceAfter mỗi transaction

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
Then Invoice status  → paid
And Receipt PDF generated
```

### Scenario 4: Customer nạp credits qua VNPay
```
Given Customer "John" có CreditAccount với balance = 50 credits
When John click "Top-up Credits" trên portal
And Nhập amount 200,000 VND → 200 credits
And Chọn VNPay → redirect
And Complete payment success → VNPay callback
Then CreditAccount balance = 250 credits
And CreditTransaction created: type = top_up, amount = +200, balanceAfter = 250
And Email confirmation: "Bạn đã nạp thành công 200 credits"
```

### Scenario 5: Individual customer thanh toán booking bằng credits
```
Given Customer "Jane" có 300 credits
And Hot Desk 3h = 150,000 VND = 150 credits
When Jane book Hot Desk 3h
And Chọn "Pay by Credit"
And Confirm booking
Then CreditAccount balance = 150 credits (300 - 150)
And CreditTransaction: type = payment, amount = -150, referenceType = booking
And Invoice created, status = paid, paymentMethod = CREDIT
And Booking confirmed
```

### Scenario 6: Company employee dùng company credits
```
Given Company "ABC Corp" có 1000 credits
And Employee "Tom" (employeeId = "EMP-001") có canBookSpaces = true
When Tom book Meeting Room 2h = 500,000 VND = 500 credits
And Chọn "Pay by Company Credit"
And Confirm
Then Company CreditAccount balance = 500 credits
And CreditTransaction: type = payment, amount = -500, employeeId = "EMP-001"
And Manager có thể xem report: "Tom đã dùng 500 credits"
```

### Scenario 7: Insufficient balance
```
Given Customer "Alice" có 50 credits
And Private Office 1 day = 200 credits
When Alice book Private Office
And Chọn "Pay by Credit"
Then System hiển thị error: "Insufficient balance. You have 50 credits, need 200."
And Suggest: "Top-up 150 credits to continue"
And Option to switch payment method (VNPay/MoMo)
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-04: Booking (invoices từ bookings)
- EP-05: Contract (invoices từ contracts)
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
