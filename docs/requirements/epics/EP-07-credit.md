# EP-07 – Credit Account Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-07 |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Should have |

## Mô tả

Hệ thống **quản lý tài khoản credit (prepaid)** dành cho Individual và Company customers. **1 credit = 1,000 VND**. Customers nạp credits vào tài khoản và dùng credits để thanh toán các services trong hệ thống (space rental, printing, parking, coffee...).

Hỗ trợ:
- **Nạp tiền (Top-up)**: qua VNPay, MoMo, ZaloPay, hoặc Cash tại quầy.
- **Credit khuyến mãi (Bonus Credits)**: Admin cấp phát credits thưởng cho campaigns, loyalty, sự cố, v.v.
- **Thanh toán bằng credits** tại thời điểm booking/sử dụng dịch vụ.
- **Theo dõi lịch sử giao dịch** chi tiết, bao gồm employee-level tracking cho Company accounts.

## Features thuộc Epic này

### Phase 1 - Core Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-71 | Credit Top-up | Nạp credits qua VNPay / MoMo / ZaloPay / Cash | Draft |
| F-72 | Bonus Credits | Admin cấp credits khuyến mãi (campaign, referral, compensation) | Draft |
| F-73 | Pay by Credit | Thanh toán booking / services bằng credits | Draft |
| F-74 | Credit Transaction History | Lịch sử giao dịch chi tiết, employee tracking cho company | Draft |

### Phase 2 - Advanced Features

| ID | Tên | Mô tả ngắn |
|----|-----|------------|
| F-76 | Auto Top-up | Tự động nạp credits khi balance dưới ngưỡng |
| F-77 | Credit Expiry | Credits có hạn sử dụng (VD: bonus credits het han sau 90 ngày) |
| F-78 | Credit Report | Báo cáo tổng hợp nạp/dùng credits theo tháng |
| F-79 | Employee Credit Quota | Hạn mức credits mỗi nhân viên công ty / tháng |

## Data Models

### CreditAccount

```typescript
interface CreditAccount {
  id: string;
  accountCode: string;          // "CA-CUS-0001" (individual), "CA-COM-0001" (company)

  // Owner
  ownerType: 'individual' | 'company';
  customerId?: string;          // nếu ownerType = individual
  companyId?: string;           // nếu ownerType = company
  customerName: string;         // Tên hiển thị

  // Balance
  currentBalance: number;       // Credits hiện có
  totalTopUp: number;           // Tổng credits đã nạp (lifetime, không tính bonus)
  totalBonus: number;           // Tổng credits khuyến mãi đã nhận (lifetime)
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

### CreditTransaction

```typescript
type CreditTransactionType = 'top_up' | 'bonus' | 'payment' | 'refund' | 'adjustment' | 'expiry';

interface CreditTransaction {
  id: string;
  creditAccountId: string;
  customerName: string;

  // Transaction Info
  type: CreditTransactionType;
  amount: number;               // Dương (+) cho top_up/bonus/refund, âm (-) cho payment/expiry
  balanceBefore: number;
  balanceAfter: number;

  // Bonus metadata (khi type = bonus)
  bonusReason?: string;         // "Referral reward", "Loyalty Q1", "System compensation"
  bonusCampaignId?: string;     // Liên kết campaign

  // Employee Tracking (for company accounts, khi type = payment)
  employeeId?: string;
  employeeName?: string;

  // Reference
  referenceType?: 'invoice' | 'booking' | 'service' | 'campaign';
  referenceCode?: string;       // Mã invoice/booking/campaign tham chiếu

  // Payment Gateway (khi type = top_up online)
  paymentMethod?: 'vnpay' | 'momo' | 'zalopay' | 'cash' | 'system';
  paymentTransactionId?: string;

  // Meta
  description?: string;         // "Nạp 500 credits", "Thưởng referral tháng 4"
  createdBy: string;            // Staff ID hoặc "system"
  createdAt: Date;
}
```

### BonusCreditCampaign (F-72)

```typescript
interface BonusCreditCampaign {
  id: string;
  campaignCode: string;         // "CAMP-202504-001"
  name: string;                 // "Birthday Bonus April 2025"
  description?: string;

  // Target
  targetType: 'all' | 'individual' | 'company' | 'specific';
  targetCustomerIds?: string[]; // Nếu targetType = specific

  // Bonus Amount
  bonusCredits: number;         // Số credits phát cho mỗi account

  // Validity
  startDate: Date;
  endDate?: Date;               // Nếu credits có expiry
  creditExpiryDays?: number;    // Số ngày credits hết hạn kể từ ngày nhận

  // Status
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  totalIssued: number;          // Tổng credits đã phát

  // Meta
  createdBy: string;
  createdAt: Date;
}
```

## User Stories

### US-71: Nạp credits (Top-up)
> Là **Customer / Lễ tân**, tôi muốn **nạp credits vào tài khoản** để **dùng thanh toán services**.

**Acceptance Criteria**:
- [ ] Nhập số VND muốn nạp (tối thiểu 100,000 VND = 100 credits)
- [ ] Chuyển đổi tự động: VND → credits (÷ 1,000)
- [ ] Chọn phương thức: VNPay / MoMo / ZaloPay / Cash
- [ ] Sau khi thanh toán thành công, cộng credits vào balance
- [ ] Tạo CreditTransaction type = `top_up`
- [ ] Gửi email xác nhận top-up

### US-72: Cấp credits khuyến mãi (Bonus)
> Là **Manager**, tôi muốn **phát credits khuyến mãi cho customers** để **tăng loyalty và khuyến khích sử dụng**.

**Acceptance Criteria**:
- [ ] Tạo BonusCreditCampaign với target (all / nhóm / danh sách cụ thể)
- [ ] Chọn số credits bonus và thời hạn sử dụng (tùy chọn)
- [ ] Preview danh sách accounts sẽ nhận trước khi phát
- [ ] Phát credits → Tạo CreditTransaction type = `bonus` cho từng account
- [ ] Gửi thông báo email đến customers
- [ ] Xem lịch sử các campaign đã chạy

### US-73: Thanh toán bằng credits
> Là **Customer**, tôi muốn **thanh toán booking bằng credits** để **không cần dùng thẻ mỗi lần**.

**Acceptance Criteria**:
- [ ] Khi booking, hiển thị option "Pay by Credit" nếu balance đủ
- [ ] Hiển thị số credits cần dùng và balance sau khi trừ
- [ ] Nếu balance không đủ: hiển thị lỗi, gợi ý top-up
- [ ] Xác nhận → trừ credits, tạo CreditTransaction type = `payment`
- [ ] Với company account: ghi nhận employeeId của người thực hiện
- [ ] Invoice được đánh dấu paid, paymentMethod = `credit`

### US-74: Xem lịch sử giao dịch credit
> Là **Customer / Manager**, tôi muốn **xem lịch sử nạp/dùng credits** để **kiểm soát chi tiêu**.

**Acceptance Criteria**:
- [ ] Danh sách transactions với: ngày, loại, số credits, balanceBefore, balanceAfter
- [ ] Lọc theo type (top_up / bonus / payment / refund / expiry), date range, account
- [ ] Company account: cột "Nhân viên" hiển thị employeeName cho payment transactions
- [ ] Phân trang, sắp xếp theo ngày mới nhất
- [ ] Export lịch sử ra Excel

## Scenarios

### Scenario 1: Top-up credits qua VNPay
```
Given Customer "Nguyễn Văn A" có balance = 50 credits
When Lễ tân mở form Top-up, nhập 200,000 VND → 200 credits
And Chọn VNPay → redirect payment
And Payment thành công → callback
Then CreditAccount balance = 250 credits
And CreditTransaction: type=top_up, amount=+200, balanceAfter=250
And Email xác nhận gửi cho customer
```

### Scenario 2: Phát bonus credits cho campaign sinh nhật
```
Given Manager tạo campaign "Birthday April 2026", bonus = 50 credits
And Target = customers có sinh nhật trong tháng 4
When Manager click "Phát credits"
Then 5 CreditAccounts được cộng thêm 50 credits
And 5 CreditTransactions type=bonus được tạo
And Email thông báo gửi đến 5 customers
```

### Scenario 3: Company employee dùng company credits
```
Given "ABC Corp" có balance = 1,000 credits
And Employee "Trần Thị B" (EMP-002) book Meeting Room 2h = 400 credits
When Chọn "Pay by Company Credit" và xác nhận
Then Company balance = 600 credits
And CreditTransaction: type=payment, amount=-400, employeeId=EMP-002, employeeName="Trần Thị B"
And Manager xem report: "EMP-002 đã dùng 400 credits"
```

### Scenario 4: Insufficient balance
```
Given Customer "Lê Văn C" có 30 credits
And Private Office 1 ngày = 300 credits
When Chọn "Pay by Credit"
Then Hiển thị: "Số dư không đủ. Bạn có 30 credits, cần 300."
And Gợi ý: "Nạp thêm 270 credits để tiếp tục"
And Option chuyển sang phương thức khác (VNPay/MoMo)
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer (credit account gắn với customer)
- EP-06: Payment (thanh toán bằng credits → tạo invoice trong EP-06)
- EP-09: Staff (ghi nhận nhân viên nạp tiền tại quầy)

**Được sử dụng bởi**:
- EP-04: Booking (chọn "Pay by Credit" khi đặt chỗ)
- EP-11: Dashboards (tổng credits hệ thống, top-up tháng này)
- EP-16: Feedback (bonus credits sau khi để lại review)

## Out of Scope Phase 1
- Auto top-up theo ngưỡng (F-76)
- Credit expiry tự động (F-77)
- Employee quota hàng tháng (F-79)
- Tích điểm loyalty phức tạp (tích lũy theo spending)

## Ghi chú kỹ thuật
- **1 credit = 1,000 VND** (cố định, không thay đổi theo tỷ giá)
- Tối thiểu top-up: 100,000 VND = 100 credits
- `balanceBefore` và `balanceAfter` lưu trong mỗi transaction để audit trail
- Company account: mọi payment transaction phải có `employeeId` (bắt buộc nếu ownerType = company)
- Bonus credits có thể có `creditExpiryDays` riêng; khi hết hạn tạo transaction type = `expiry`
