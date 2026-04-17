# F-19B – Ví Credit (Credit Wallet)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-19B |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Quản lý **ví Cobi** của khách hàng với 2 loại credit:

> **Đơn vị Cobi:** 1 Cobi = 1.000 VND (dễ nhớ, dễ tính toán)
> Ví dụ: 500 Cobi = 500.000 VND

1. **Credit Balance** (Số dư chính):
   - Cobi khách hàng nạp vào ví
   - **Không hết hạn**
   - Có thể hoàn lại khi khách hàng yêu cầu

2. **Reward Balance** (Số dư thưởng):
   - Cobi thưởng từ promotions, referral, loyalty...
   - **Có hạn sử dụng** (expiresAt)
   - **Không hoàn lại**
   - Hết hạn → mất

**Business Rationale:**
- **Prepaid model**: Khách hàng nạp trước, thanh toán nhanh hơn
- **Loyalty program**: Credit reward khuyến khích sử dụng dịch vụ
- **Cash flow**: Công ty nhận tiền trước, dịch vụ sau
- **Convenience**: Không cần thanh toán từng lần booking

**Payment Priority:**
Khi thanh toán, hệ thống **ưu tiên trừ reward trước** (FIFO theo expiresAt):
1. Trừ từ CreditReward sắp hết hạn nhất
2. Nếu reward không đủ → trừ tiếp từ creditBalance

## User Story

> Là **Kế toán/Manager**, tôi muốn **quản lý ví credit của khách hàng** để **họ có thể thanh toán dịch vụ nhanh chóng và được hưởng ưu đãi**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Xem Credit Dashboard (Customer Details → Tab Credit)

- [ ] **AC1**: Tab "Credit" trong Customer Details page
- [ ] **AC2**: Credit summary cards:
  - **Total Balance**: creditBalance + rewardBalance (tổng có thể sử dụng)
  - **Credit Balance**: Số dư chính (không hết hạn)
  - **Reward Balance**: Số dư thưởng (có hạn)
- [ ] **AC3**: Chart: Credit balance trend (30 ngày gần nhất)
- [ ] **AC4**: Warning badge nếu có reward sắp hết hạn (< 7 ngày)

### Nạp Credit (Top-up)

- [ ] **AC5**: Button "Nạp Cobi" → Modal form
- [ ] **AC6**: Form fields:
  - **Amount** (required): Số Cobi nạp
    - Min: 100 Cobi (= 100,000 VND)
    - Max: 50,000 Cobi (= 50,000,000 VND)
    - Format: Number input
  - **Payment Method** (required): 
    - Cash
    - Bank Transfer
    - Card (Credit/Debit)
    - VNPay/MoMo (future)
  - **Reference** (optional): Mã giao dịch ngân hàng
  - **Notes** (optional): Ghi chú
- [ ] **AC7**: Submit → POST `/api/customers/:id/credits/topup`
- [ ] **AC8**: Success:
  - `creditBalance` += amount
  - Create `CreditTransaction` với type = "topup"
  - Toast: "Nạp Cobi thành công"
  - Refresh credit summary
- [ ] **AC9**: Print receipt (optional)

### Tặng Credit Reward

- [ ] **AC10**: Button "Tặng Cobi Reward" → Modal form
- [ ] **AC11**: Form fields:
  - **Amount** (required): Số Cobi thưởng
  - **Source** (required):
    - Promotion (khuyến mãi)
    - Referral (giới thiệu khách mới)
    - Birthday (sinh nhật)
    - Loyalty (khách hàng thân thiết)
    - Compensation (đền bù)
  - **Expires At** (required): Ngày hết hạn
    - Default: 30 ngày từ hôm nay
    - Quick options: 7 days, 30 days, 60 days, 90 days
  - **Description** (required): Lý do tặng
- [ ] **AC12**: Validation:
  - Amount > 0
  - ExpiresAt > today
- [ ] **AC13**: Submit → POST `/api/customers/:id/credits/reward`
- [ ] **AC14**: Success:
  - `rewardBalance` += amount
  - Create `CreditReward` record với status = "active"
  - Create `CreditTransaction` với type = "reward"
  - Toast: "Tặng reward thành công"

### Xem Credit Rewards List

- [ ] **AC15**: Section "Credit Rewards" hiển thị danh sách rewards:
  - Amount / Remaining Amount
  - Source badge
  - Description
  - Issued date
  - Expires date
  - Status badge (active/used/expired)
  - Progress bar (remaining/total)
- [ ] **AC16**: Filter by status: All, Active, Used, Expired
- [ ] **AC17**: Sort by: expiresAt (default), amount, issuedAt
- [ ] **AC18**: Highlight rewards sắp hết hạn (< 7 ngày) màu vàng

### Xem Transaction History

- [ ] **AC19**: Table "Lịch sử giao dịch" hiển thị:
  - Date/Time
  - Type badge: topup (green), reward (blue), spend (orange), refund (gray), expire (red)
  - Description
  - Amount (+/- với màu tương ứng)
  - Balance After
  - Created By
- [ ] **AC20**: Filter by:
  - Date range
  - Type (topup, reward, spend, refund, expire)
  - Credit type (credit, reward)
- [ ] **AC21**: Pagination (20 items/page)
- [ ] **AC22**: Export CSV/Excel

### Thanh toán bằng Credit

- [ ] **AC23**: Khi thanh toán booking/invoice:
  - Show option "Pay with Cobi" nếu tổng balance >= amount
  - Display: "Sử dụng X Cobi reward + Y Cobi credit"
- [ ] **AC24**: Payment logic (FIFO by expiresAt):
  1. Sort active CreditRewards by expiresAt ASC
  2. Trừ từ reward đầu tiên đến khi đủ hoặc hết
  3. Nếu chưa đủ → trừ từ creditBalance
- [ ] **AC25**: Update balances và create transaction
- [ ] **AC26**: Error nếu balance không đủ:
  - "Số dư không đủ. Cần X Cobi, hiện có Y Cobi"

### Hoàn Credit (Refund)

- [ ] **AC27**: Khi cancel booking đã paid bằng credit:
  - Hoàn vào `creditBalance` (không hoàn reward)
  - Create transaction type = "refund"
- [ ] **AC28**: Manual refund từ Admin (rare case)

### Credit Expiration (Auto)

- [ ] **AC29**: Scheduled job chạy daily 00:00:
  - Query CreditRewards với expiresAt <= today AND status = "active"
  - Update status → "expired"
  - Trừ `rewardBalance` -= remainingAmount
  - Create transaction type = "expire"
- [ ] **AC30**: Notification cho customer khi reward sắp hết hạn (3 ngày trước)

### Permissions

- [ ] **AC31**: View credit: Manager, Accountant, Admin
- [ ] **AC32**: Top-up credit: Accountant, Admin
- [ ] **AC33**: Give reward: Manager, Admin
- [ ] **AC34**: Manual refund: Admin only

## Scenarios (Given / When / Then)

### Scenario 1: Nạp credit
```gherkin
Given Customer "CUS-0001" có creditBalance = 500 Cobi
When Kế toán click "Nạp Cobi"
And Nhập amount = 1,000 Cobi
And Chọn method = "Bank Transfer"
And Nhập reference = "VCB-123456"
And Click "Xác nhận"
Then creditBalance → 1,500 Cobi
And Transaction created: type=topup, amount=+1,000
And Toast: "Nạp Cobi thành công"
```

### Scenario 2: Tặng reward
```gherkin
Given Customer "CUS-0001" có rewardBalance = 0
When Manager click "Tặng Cobi Reward"
And Nhập amount = 200 Cobi
And Chọn source = "referral"
And Chọn expiresAt = "31/05/2026"
And Nhập description = "Thưởng giới thiệu CUS-0002"
And Click "Lưu"
Then rewardBalance → 200 Cobi
And CreditReward created: amount=200, status=active
And Transaction: type=reward, amount=+200
```

### Scenario 3: Thanh toán ưu tiên reward
```gherkin
Given Customer có:
  - creditBalance = 500 Cobi
  - CreditReward A: 100 Cobi, expires 30/04
  - CreditReward B: 150 Cobi, expires 15/05
When Thanh toán booking 200 Cobi
Then System trừ:
  - Reward A: 100 Cobi → remaining 0, status=used
  - Reward B: 100 Cobi → remaining 50
And creditBalance không đổi (500)
And rewardBalance = 50 Cobi
And Transaction: type=spend, amount=-200
```

### Scenario 4: Reward hết hạn
```gherkin
Given CreditReward:
  - amount = 100 Cobi, remaining = 80 Cobi
  - expiresAt = 17/04/2026, status = active
When Scheduled job chạy lúc 00:00 ngày 18/04/2026
Then CreditReward.status → "expired"
And rewardBalance -= 80 Cobi
And Transaction: type=expire, amount=-80
And Customer nhận email notification
```

### Scenario 5: Không đủ credit
```gherkin
Given Customer có totalBalance = 100 Cobi
When Cố thanh toán booking 150 Cobi với credit
Then Error: "Số dư không đủ. Cần 150 Cobi, hiện có 100 Cobi"
And Suggest: "Vui lòng nạp thêm Cobi hoặc chọn phương thức khác"
```

## API Contracts

### POST /api/customers/:id/credits/topup
**Request:**
```json
{
  "amount": 1000,
  "paymentMethod": "bank_transfer",
  "reference": "VCB-123456",
  "notes": "Nạp qua chuyển khoản"
}
```

**Response 200:**
```json
{
  "success": true,
  "transaction": {
    "id": "txn-001",
    "type": "topup",
    "amount": 1000,
    "balanceAfter": 1500
  },
  "newBalance": {
    "creditBalance": 1500,
    "rewardBalance": 200,
    "totalBalance": 1700
  }
}
```

### POST /api/customers/:id/credits/reward
**Request:**
```json
{
  "amount": 200,
  "source": "referral",
  "expiresAt": "2026-05-31",
  "description": "Thưởng giới thiệu CUS-0002"
}
```

### GET /api/customers/:id/credits
**Response:**
```json
{
  "creditBalance": 1500,
  "rewardBalance": 200,
  "totalBalance": 1700,
  "rewards": [
    {
      "id": "rwd-001",
      "amount": 200,
      "remainingAmount": 200,
      "source": "referral",
      "expiresAt": "2026-05-31",
      "status": "active"
    }
  ],
  "expiringWithin7Days": 0
}
```

### GET /api/customers/:id/credits/transactions
**Query:** `?page=1&pageSize=20&type=topup&dateFrom=2026-04-01`

**Response:**
```json
{
  "items": [
    {
      "id": "txn-001",
      "type": "topup",
      "creditType": "credit",
      "amount": 1000,
      "balanceAfter": 1500,
      "description": "Nạp Cobi",
      "createdAt": "2026-04-17T10:00:00Z",
      "createdBy": "staff-001"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 50,
    "totalPages": 3
  }
}
```

### POST /api/customers/:id/credits/spend
**Request:**
```json
{
  "amount": 200,
  "referenceType": "booking",
  "referenceId": "BK-0001",
  "description": "Thanh toán booking #BK-0001"
}
```

## Dependencies

**Blocked by:**
- F-16 (Customer Profile) - Customer phải tồn tại

**Blocks:**
- EP-04 (Booking) - Thanh toán booking bằng credit
- EP-06 (Payment) - Credit là payment method

## Technical Notes

### Frontend Implementation
- **Tab:** CustomerDetails → CreditTab component
- **Components:**
  - CreditSummaryCards
  - TopupModal
  - RewardModal
  - RewardsList
  - TransactionHistory
- **Hooks:** useCustomerCredits, useTopupCredit, useGiveReward

### Backend Implementation
- **Models:** CreditTransaction, CreditReward
- **Services:** CreditService (topup, reward, spend, refund, expire)
- **Jobs:** CreditExpirationJob (daily at 00:00)
- **Events:** CreditRewardExpiring (send notification 3 days before)

### Data Integrity
- creditBalance và rewardBalance phải sync với transactions
- Scheduled re-calculation nếu bị desync
- Audit log cho mọi thay đổi credit

### Performance
- Index trên customer_id, type, created_at
- Pagination cho transaction history
- Cache credit balances (invalidate on transaction)

## UI Mockup Notes

### Credit Tab Layout (Đơn vị: Cobi - 1 Cobi = 1.000 VND)
```
┌─────────────────────────────────────────────────────────────┐
│  Ví Cobi                           [Nạp Cobi] [Tặng Reward] │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │ Tổng số dư   │ │ Credit       │ │ Reward       │         │
│  │  1,700 Cobi  │ │ 1,500 Cobi   │ │  200 Cobi    │         │
│  │              │ │ Không hết hạn│ │ ⚠️ 1 sắp h.hạn│         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  Credit Rewards                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🎁 200 Cobi │ Referral │ Còn 200 Cobi │ HSD: 31/05/26  │ │
│  │ ████████████ 100%           [Active]                   │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Lịch sử giao dịch                   [Lọc] [Xuất Excel]     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 17/04 10:00 │ Nạp Cobi  │ +1,000 Cobi │ 1,500 Cobi   │   │
│  │ 16/04 15:30 │ Tặng reward│ +200 Cobi  │ 200 Cobi     │   │
│  │ 15/04 09:00 │ Thanh toán │ -150 Cobi  │ 350 Cobi     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
