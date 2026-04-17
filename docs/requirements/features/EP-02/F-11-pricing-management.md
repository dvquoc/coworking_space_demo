# F-11 – Quản lý Giá thuê (Pricing Management)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-11 |
| Epic | EP-02 - Property Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép **Admin và Accountant** quản lý bảng giá cho tất cả loại không gian. Pricing có nhiều chiều: theo loại phòng, theo đơn vị thời gian (hour/day/week/month), theo mùa, theo khách hàng (individual/corporate), và có discount rules phức tạp.

**Business Rationale:**
- **Revenue optimization**: Giá linh hoạt giúp tối đa hóa doanh thu và công suất sử dụng
- **Competitive pricing**: Có thể điều chỉnh giá real-time theo thị trường
- **Customer segments**: Corporate có giá khác individual
- **Seasonal demand**: Giá cao hơn trong peak seasons
- **Discount strategy**: Long-term discounts khuyến khích commit lâu hơn

**Pricing Dimensions:**
1. **Space Type**: Meeting rooms (hourly), Workspaces (monthly)
2. **Time Unit**: Hour, Day, Week, Month
3. **Customer Type**: Individual, Corporate
4. **Season**: Peak, Normal, Low
5. **Discount Type**: Weekend, Long-term, Early bird, Bulk

**Business Rules:**
- Workspaces: Mainly priced by month (có week option)
- Meeting rooms: Mainly hourly (có day option)
- Long-term discount tiers: 3 months -5%, 6 months -10%, 12 months -15%
- Weekend rate: -20% cho meeting rooms
- Corporate: -15% flat discount (require contract)
- Price changes require Manager approval
- Cannot reduce price below cost (floor price)
- Effective date: New prices áp dụng cho bookings mới, không affect existing contracts

**Out of Scope:**
- Dynamic pricing theo real-time demand → Phase 2
- Auction pricing for premium slots → Phase 3
- Custom pricing per customer → Phase 2
- Cryptocurrency payments → Phase 3

## User Story

> Là **Accountant**, tôi muốn **thiết lập và điều chỉnh bảng giá linh hoạt** để **tối ưu doanh thu và cạnh tranh hiệu quả**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### View Pricing List

- [ ] **AC1**: Pricing page tại `/properties/pricing`
- [ ] **AC2**: Main table columns:
  - Space Type (Hot Desk, Meeting Room...)
  - Hourly Rate
  - Daily Rate
  - Weekly Rate
  - Monthly Rate
  - Discount (if any)
  - Effective Date
  - Status (Active/Scheduled/Expired)
  - Actions
- [ ] **AC3**: Filter options:
  - Space Type (dropdown: all 8 types)
  - Status (Active/Scheduled/Expired)
  - Customer Type (Individual/Corporate)
  - Season (Peak/Normal/Low)
- [ ] **AC4**: Sort by: Price (asc/desc), Effective Date
- [ ] **AC5**: Search by space name hoặc building
- [ ] **AC6**: Quick stats cards:
  - Average Monthly Price (all workspaces)
  - Average Hourly Price (all meeting rooms)
  - Active Pricing Rules (count)
  - Scheduled Price Changes (count)

### View Pricing Details

- [ ] **AC7**: Click vào row → Pricing detail modal:
  - Space Type + Name
  - Base Prices:
    - Hourly: 50,000 VND
    - Daily: 350,000 VND (7× hourly - 5% off)
    - Weekly: 2,000,000 VND
    - Monthly: 7,500,000 VND
  - Discounts section:
    - Weekend: -20% (hourly only)
    - Long-term: 3m (-5%), 6m (-10%), 12m (-15%)
    - Corporate: -15% flat
    - Early bird: -10% (book 30 days advance)
  - Effective Period: Start → End date
  - Floor Price: 5,000,000 VND (cannot go below)
  - Price History (last 6 months chart)
- [ ] **AC8**: "Apply Discount" calculator:
  - Base: 7,500,000 VND/month
  - Select: 6 months + Corporate
  - Calculated: 7,500,000 × 0.9 × 0.85 = 5,737,500 VND/month
- [ ] **AC9**: Show affected spaces (how many using this rule)

### Create Pricing Rule

- [ ] **AC10**: "Add Pricing Rule" button → form:
  - **Rule Name** (required) - VD: "Hot Desk Standard Q2 2024"
  - **Space Type** (required dropdown) - VD: Hot Desk
  - **Apply to** (required):
    - All spaces of this type
    - Specific building
    - Specific spaces (multi-select)
  - **Customer Type** (required): Individual / Corporate / Both
  - **Season** (optional): Peak / Normal / Low
  - **Base Prices** (at least 1 required):
    - Hourly Rate
    - Daily Rate
    - Weekly Rate
    - Monthly Rate
  - **Discounts** (optional, checkboxes + percentage):
    - Weekend Discount (%)
    - Long-term 3m/6m/12m (%)
    - Corporate Discount (%)
    - Early Bird (%)
    - Bulk Booking (%)
  - **Floor Price** (required) - minimum sellable price
  - **Effective Date** (required):
    - Start Date
    - End Date (optional, null = indefinite)
  - **Status** (default: draft)
  - **Approval** (require Manager approval before active)
- [ ] **AC11**: Price validation:
  - Monthly >= Weekly >= Daily >= Hourly (logic check)
  - Daily should be ~7× Hourly (warning if not)
  - Weekly should be ~5× Daily (warning)
  - Monthly should be ~4× Weekly (warning)
  - No price < Floor Price
- [ ] **AC12**: Discount validation:
  - Sum of all discounts <= 50% (max allowed)
  - Weekend discount only for hourly
  - Long-term discount only for monthly
- [ ] **AC13**: Conflict check:
  - If overlap với existing rule cho same space type + date range → Warning
  - Option: Override existing / Merge / Cancel
- [ ] **AC14**: POST `/api/properties/pricing` với status = draft
- [ ] **AC15**: Success → Pending Manager approval

### Edit Pricing Rule

- [ ] **AC16**: Edit button (chỉ rules chưa active hoặc scheduled)
- [ ] **AC17**: Cannot edit active rule → Must create new version
- [ ] **AC18**: Edit form pre-fill data
- [ ] **AC19**: Track version history:
  - v1: 7,500,000 VND (01/01-31/03)
  - v2: 8,000,000 VND (01/04-30/06) ← editing
- [ ] **AC20**: PUT `/api/properties/pricing/:id`

### Approve Pricing Rule

- [ ] **AC21**: Manager nhìn thấy "Pending Approval" tab
- [ ] **AC22**: Approval modal:
  - Rule details
  - Impacted spaces (count + list)
  - Impacted customers (existing contracts)
  - Revenue forecast (compare vs current)
  - Approve / Reject options
- [ ] **AC23**: On Approve:
  - Status: draft → active (if start date <= today)
  - Or draft → scheduled (if start date future)
  - Notification to Accountant
- [ ] **AC24**: On Reject:
  - Require reason
  - Status: draft → rejected
  - Accountant can revise and resubmit
- [ ] **AC25**: POST `/api/properties/pricing/:id/approve`

### Delete/Expire Pricing Rule

- [ ] **AC26**: Delete draft rules: Immediate deletion
- [ ] **AC27**: Cannot delete active rules with existing contracts
- [ ] **AC28**: Expire active rule:
  - Set End Date = today
  - Status: active → expired
  - Existing contracts unaffected
  - New bookings cannot use this price
- [ ] **AC29**: DELETE `/api/properties/pricing/:id` (soft delete)

### Apply Discount to Booking

- [ ] **AC30**: When customer books:
  - Select space → Fetch pricing rule
  - Select duration → Calculate applicable discounts
  - Display breakdown:
    - Base Price: 7,500,000 VND/month
    - Duration: 6 months
    - Long-term Discount (-10%): -750,000
    - Corporate Discount (-15%): -1,012,500
    - **Total: 5,737,500 VND/month**
  - Total 6 months: 34,425,000 VND
- [ ] **AC31**: Discount auto-applied, but Admin có thể override
- [ ] **AC32**: Custom discount (ad-hoc):
  - Admin can apply extra % off
  - Require Manager approval
  - Track reason for audit

### Pricing History & Analytics

- [ ] **AC33**: Price history chart:
  - X-axis: Time (monthly)
  - Y-axis: Average price
  - Lines: Different space types
  - Show trend: increasing/decreasing
- [ ] **AC34**: Revenue forecast by pricing:
  - If increase 10% → Expected revenue +X VND
  - If decrease 10% → Expected booking rate +Y%
- [ ] **AC35**: Competitor comparison (manual input):
  - Our price vs Competitor A/B
  - Price positioning: Premium / Mid / Budget
- [ ] **AC36**: Price sensitivity analysis:
  - Price change % vs Booking rate change %
  - Optimal price point suggestion

### Bulk Pricing Update

- [ ] **AC37**: Bulk update form:
  - Select multiple space types
  - Apply % increase/decrease
  - Set effective date
  - Preview changes before submit
- [ ] **AC38**: Example: Increase all meeting room prices by 8% from May 1
- [ ] **AC39**: POST `/api/properties/pricing/bulk-update`
- [ ] **AC40**: Require Manager approval for bulk changes

### Seasonal Pricing Templates

- [ ] **AC41**: Seasonal templates:
  - **Peak Season** (May-Aug): +20% base
  - **Normal Season** (Sep-Dec, Feb-Apr): 0%
  - **Low Season** (Jan, Tet): -15%
- [ ] **AC42**: Apply template:
  - Select template → Auto-fill prices
  - Can customize after
  - Save as new rule
- [ ] **AC43**: Template library:
  - System templates (3 default)
  - Custom templates (saved by user)
  - Share templates across buildings

### Corporate Pricing Contracts

- [ ] **AC44**: Corporate customer table:
  - Company Name
  - Contract Type (Monthly Retainer / Per Booking)
  - Discount Tier (10% / 15% / 20%)
  - Contracted Spaces (count)
  - Contract Period
  - Total Value (VND/year)
- [ ] **AC45**: Create corporate contract:
  - Company info
  - Discount % (negotiate)
  - Minimum commitment (spaces × months)
  - Prepayment option (+5% extra discount)
  - Auto-renewal (Y/N)
- [ ] **AC46**: Corporate customers see special prices khi login
- [ ] **AC47**: Track corporate contract utilization:
  - Contracted: 10 spaces
  - Used: 8 spaces
  - Unused: 2 spaces → Risk of cancellation

## Scenarios (Given / When / Then)

### Scenario 1: Create Hot Desk Pricing
```gherkin
Given Accountant on Pricing page
When Click "Add Pricing Rule"
And Input:
  - Name: "Hot Desk Standard Q2 2024"
  - Space Type: Hot Desk
  - Apply to: All buildings
  - Customer: Individual
  - Monthly Rate: 3,500,000 VND
  - Long-term Discount: 6m -10%, 12m -15%
  - Floor Price: 2,500,000 VND
  - Effective: 01/04/2024 - 30/06/2024
And Click "Submit for Approval"
Then Pricing rule created với status = draft
And Manager receives approval request
And Accountant sees "Pending Approval" badge
```

### Scenario 2: Approve Pricing Rule
```gherkin
Given Manager has pending pricing approval
When Manager opens approval modal
And Reviews:
  - 15 hot desks affected
  - Revenue increase: +8% (2.5M VND/month)
  - No existing customers impacted
And Click "Approve"
Then Status: draft → scheduled (start date = 01/04)
When Date = 01/04/2024
Then Cron job updates status: scheduled → active
And New bookings use this price
```

### Scenario 3: Apply Long-term Discount
```gherkin
Given Customer booking Private Office
And Monthly Rate: 10,000,000 VND
When Select Duration: 12 months
Then System calculates:
  - Base: 10,000,000 × 12 = 120,000,000 VND
  - Long-term Discount (12m -15%): -18,000,000 VND
  - **Total: 102,000,000 VND** (8,500,000/month effective)
And Display: "Save 18M VND with 12-month contract!"
```

### Scenario 4: Corporate Discount Stacking
```gherkin
Given Corporate customer (ABC Corp, 15% discount)
And Booking Conference Room for 6 months
And Base: 5,000,000 VND/month
When Calculate:
  - Long-term 6m: -10%
  - Corporate: -15%
  - Combined: 5,000,000 × 0.9 × 0.85 = 3,825,000 VND/month
Then Total 6 months: 22,950,000 VND
And Contract requires prepayment
```

### Scenario 5: Bulk Price Increase
```gherkin
Given Manager wants to increase all meeting room prices
When Use "Bulk Update" tool
And Select:
  - Space Types: Meeting Room, Conference Room, Training Room
  - Increase: 8%
  - Effective: 01/05/2024
And Preview shows:
  - Meeting Room: 50k → 54k VND/hour
  - Conference Room: 100k → 108k VND/hour
  - Training Room: 150k → 162k VND/hour
  - Affected spaces: 28
And Click "Apply"
Then 28 pricing rules created
And Status = scheduled
And Existing bookings not affected
```

### Scenario 6: Seasonal Template
```gherkin
Given Tet coming (Low Season - January)
When Accountant select "Low Season Template"
Then Auto-fill:
  - Hot Desk: 3,500,000 → 2,975,000 VND (-15%)
  - Private Office: 10,000,000 → 8,500,000 VND (-15%)
  - Meeting Room: 50,000 → 42,500 VND (-15%)
And Accountant can adjust individual prices
And Submit for approval
```

## API Contracts

### GET /api/properties/pricing
**Query Params:**
- `spaceType`: hot_desk, meeting_room...
- `status`: active, scheduled, expired
- `customerType`: individual, corporate

**Response 200:**
```json
[
  {
    "id": "pr-1",
    "name": "Hot Desk Standard Q2 2024",
    "spaceType": "hot_desk",
    "customerType": "individual",
    "prices": {
      "hourly": null,
      "daily": null,
      "weekly": 800000,
      "monthly": 3500000
    },
    "discounts": {
      "weekend": 0,
      "longTerm": {
        "3m": 5,
        "6m": 10,
        "12m": 15
      },
      "corporate": 0,
      "earlyBird": 0
    },
    "floorPrice": 2500000,
    "effectiveStart": "2024-04-01",
    "effectiveEnd": "2024-06-30",
    "status": "scheduled",
    "approvedBy": null,
    "createdAt": "2024-03-15T10:00:00Z"
  }
]
```

### GET /api/properties/pricing/:id
**Response 200:** (same as above + history)
```json
{
  "id": "pr-1",
  "...": "...",
  "history": [
    {
      "version": 1,
      "monthly": 3200000,
      "effectiveStart": "2024-01-01",
      "effectiveEnd": "2024-03-31"
    }
  ],
  "affectedSpaces": 15
}
```

### POST /api/properties/pricing
**Request Body:**
```json
{
  "name": "Hot Desk Standard Q2 2024",
  "spaceType": "hot_desk",
  "applyTo": {
    "type": "all",
    "buildingIds": [],
    "spaceIds": []
  },
  "customerType": "individual",
  "season": "normal",
  "prices": {
    "monthly": 3500000,
    "weekly": 800000
  },
  "discounts": {
    "longTerm": {
      "3m": 5,
      "6m": 10,
      "12m": 15
    }
  },
  "floorPrice": 2500000,
  "effectiveStart": "2024-04-01",
  "effectiveEnd": "2024-06-30"
}
```

**Response 201:** (created pricing object, status = draft)

### POST /api/properties/pricing/:id/approve
**Request Body:**
```json
{
  "decision": "approve",
  "notes": "Approved for Q2 seasonal adjustment"
}
```

**Response 200:**
```json
{
  "id": "pr-1",
  "status": "scheduled",
  "approvedBy": "usr-manager-1",
  "approvedAt": "2024-03-20T14:30:00Z"
}
```

### POST /api/properties/pricing/calculate
**Request Body:**
```json
{
  "spaceId": "spc-101",
  "customerType": "corporate",
  "duration": {
    "months": 6
  },
  "startDate": "2024-05-01"
}
```

**Response 200:**
```json
{
  "basePrice": 10000000,
  "discounts": [
    {
      "type": "longTerm6m",
      "amount": -1000000,
      "percent": -10
    },
    {
      "type": "corporate",
      "amount": -1350000,
      "percent": -15
    }
  ],
  "finalPrice": 7650000,
  "perMonth": 7650000,
  "totalAmount": 45900000
}
```

### POST /api/properties/pricing/bulk-update
**Request Body:**
```json
{
  "spaceTypes": ["meeting_room", "conference_room"],
  "adjustment": {
    "type": "percentage",
    "value": 8
  },
  "effectiveDate": "2024-05-01",
  "reason": "Annual price adjustment"
}
```

**Response 200:**
```json
{
  "affected": 28,
  "preview": [
    {
      "spaceType": "meeting_room",
      "current": 50000,
      "new": 54000
    }
  ]
}
```

## Dependencies

**Blocked by:**
- F-09 (Workspaces) - pricing áp dụng cho workspaces
- F-10 (Meeting Rooms) - pricing áp dụng cho meeting rooms

**Blocks:**
- F-16 (Booking) - booking cần pricing để calculate cost
- F-18 (Invoicing) - invoice dựa trên pricing rules

**Related:**
- F-12 (Customer Management) - corporate customers có special pricing

## Technical Notes

### Frontend
- **Components:** PricingTable, DiscountCalculator, PriceHistory, ApprovalWorkflow
- **Validation:** Price logic check (monthly >= weekly etc.)
- **Calculations:** Real-time discount calculation khi form thay đổi

### Backend
- **Model:** PricingRule (main), PricingHistory (audit), CorporateContract
- **Price Calculation Service:**
  - Input: spaceId, customerType, duration, startDate
  - Output: finalPrice với breakdown
  - Cache pricing rules (Redis, TTL 5 mins)
- **Approval Workflow:**
  - draft → pending → approved/rejected
  - Manager role required for approval
  - Email notification on status change
- **Scheduler:**
  - Cron job daily: Activate scheduled rules (scheduled → active)
  - Cron job daily: Expire ended rules (active → expired)

### Database Schema
```prisma
model PricingRule {
  id              String   @id @default(cuid())
  name            String
  spaceType       SpaceType
  customerType    CustomerType
  season          Season?
  
  hourlyRate      Decimal?
  dailyRate       Decimal?
  weeklyRate      Decimal?
  monthlyRate     Decimal?
  
  discountWeekend     Int     @default(0)
  discountLongTerm3m  Int     @default(0)
  discountLongTerm6m  Int     @default(0)
  discountLongTerm12m Int     @default(0)
  discountCorporate   Int     @default(0)
  discountEarlyBird   Int     @default(0)
  
  floorPrice      Decimal
  
  effectiveStart  DateTime
  effectiveEnd    DateTime?
  
  status          PricingStatus
  approvedBy      String?
  approvedAt      DateTime?
  
  createdBy       String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  spaces          Space[]
  history         PricingHistory[]
}

model PricingHistory {
  id            String   @id @default(cuid())
  pricingRuleId String
  pricingRule   PricingRule @relation(fields: [pricingRuleId], references: [id])
  
  version       Int
  changes       Json
  changedBy     String
  changedAt     DateTime @default(now())
}

model CorporateContract {
  id              String   @id @default(cuid())
  customerId      String
  companyName     String
  discountPercent Int      // 10, 15, 20
  
  contractStart   DateTime
  contractEnd     DateTime
  
  minimumSpaces   Int
  minimumMonths   Int
  
  status          ContractStatus
  totalValue      Decimal
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PricingStatus {
  draft
  scheduled
  active
  expired
  rejected
}

enum CustomerType {
  individual
  corporate
}

enum Season {
  peak
  normal
  low
}
```

### Performance
- Cache active pricing rules (Redis)
- Index on (spaceType, customerType, status, effectiveStart, effectiveEnd)
- Pre-calculate common discount scenarios

## Testing Checklist

### Unit Tests
- [ ] Price validation logic (monthly >= weekly etc.)
- [ ] Discount calculation (multiple discounts stack)
- [ ] Floor price validation
- [ ] Date range overlap detection

### Integration Tests
- [ ] Create pricing rule → Manager approve → Auto-activate
- [ ] Bulk pricing update for 50 spaces
- [ ] Calculate final price với stacked discounts
- [ ] Corporate contract pricing

### E2E Tests
- [ ] Accountant creates pricing, Manager approves
- [ ] Customer books với long-term discount applied
- [ ] Seasonal pricing template application
- [ ] Bulk price increase (8 types, 100 spaces)
- [ ] Price history audit trail

## Done Definition

- [ ] All pricing CRUD operations working
- [ ] Manager approval workflow complete
- [ ] Discount calculation engine accurate
- [ ] Corporate pricing contracts functional
- [ ] Bulk update tool working
- [ ] Seasonal templates library (3 default)
- [ ] Price history tracking
- [ ] Unit tests >= 80%
- [ ] E2E tests pass
- [ ] Performance: Price calculation < 200ms, Bulk update < 5s for 100 spaces
