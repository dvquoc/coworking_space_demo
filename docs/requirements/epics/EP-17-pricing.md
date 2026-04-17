# EP-17 – Pricing & Promotions Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-17 |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý **toàn bộ hệ thống giá** của Coworking Space: bảng giá không gian (space pricing), giá dịch vụ cộng thêm (add-on services), và các chương trình khuyến mãi/giảm giá theo rule linh hoạt.

**Tách từ EP-02** (F-11 cũ): Pricing đủ phức tạp để có epic riêng vì liên quan đến nhiều loại giá, nhiều đơn vị tính, và engine khuyến mãi với nhiều quy tắc kết hợp.

**Tác động cross-epic**: Pricing data được dùng bởi EP-04 (Booking), EP-05 (Contract), EP-06 (Payment/Invoice), EP-07 (Service billing).

---

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-81 | Space Pricing Catalog | Bảng giá cho 8 loại space với đơn vị tính linh hoạt | Draft |
| F-82 | Add-on Service Pricing | Bảng giá dịch vụ cộng thêm: in ấn, tủ locker, WiFi, café... | Draft |
| F-83 | Pricing Tiers & Overrides | Giá riêng theo building, floor, hoặc space cụ thể | Draft |
| F-84 | Pricing History & Versioning | Lịch sử thay đổi giá, effective date, không ảnh hưởng bookings cũ | Draft |
| F-85 | Promotion Programs | Tạo và quản lý chương trình khuyến mãi theo thời gian | Draft |
| F-86 | Discount Rules Engine | Quy tắc giảm giá linh hoạt: %, cố định, combo, điều kiện áp dụng | Draft |
| F-87 | Voucher & Coupon Codes | Mã giảm giá, giới hạn số lần dùng, điều kiện, thời hạn | Draft |
| F-88 | Pricing Calculator | Công cụ tính giá preview trước khi tạo booking/contract | Draft |

### Phase 2 - Advanced Features (Not in scope Phase 1)
- F-89: Dynamic pricing theo demand/occupancy rate
- F-90: Bundle pricing (space + services combo)
- F-91: Loyalty tier pricing (VIP/Premium/Standard)
- F-92: A/B pricing experiments
- F-93: Pricing analytics & revenue optimization

---

## Data Models

### SpacePricingRule
```typescript
interface SpacePricingRule {
  id: string
  name: string                  // "Hot Desk - Standard", "Private Office - Premium"

  // Scope: áp dụng cho loại nào?
  spaceType?: SpaceType         // Áp dụng chung cho loại space
  spaceId?: string              // Override cho 1 space cụ thể (ưu tiên cao hơn)
  buildingId?: string           // Override cho 1 tòa nhà (ưu tiên cao hơn spaceType)
  floorId?: string              // Override cho 1 tầng cụ thể

  // Pricing (tất cả VND, null = không hỗ trợ đơn vị này)
  pricePerHour?: number         // Giá/giờ
  pricePerDay?: number          // Giá/ngày
  pricePerWeek?: number         // Giá/tuần
  pricePerMonth?: number        // Giá/tháng
  pricePerYear?: number         // Giá/năm (cho contract dài hạn)

  // Minimum booking
  minBookingHours?: number      // Đặt tối thiểu X giờ
  minBookingDays?: number       // Đặt tối thiểu X ngày

  // Discounts
  weekendDiscount?: number      // % discount Thứ 7 - Chủ nhật
  offPeakDiscount?: number      // % discount giờ thấp điểm (e.g. 22:00-08:00)
  longTermDiscount?: LongTermDiscount[]

  // Effective period
  effectiveFrom: string         // ISO date "2026-05-01"
  effectiveTo?: string          // null = không giới hạn

  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  notes?: string
}

interface LongTermDiscount {
  unit: 'month' | 'week'
  minQuantity: number           // Tối thiểu X tháng/tuần
  discountPercent: number       // % giảm giá
  // Ví dụ: { unit: 'month', minQuantity: 3, discountPercent: 5 }
}
```

### AddOnServicePricing
```typescript
interface AddOnServicePricing {
  id: string
  serviceCode: string           // Mã dịch vụ, unique
  name: string                  // "In A4 Trắng đen", "Tủ cá nhân tháng", "WiFi Premium"
  category: AddOnServiceCategory
  description?: string

  // Pricing
  unitPrice: number             // Giá per unit (VND)
  unit: string                  // Đơn vị tính (linh hoạt, free text)
  // Ví dụ:
  // - "trang" (cho in ấn)
  // - "tháng" (cho locker, WiFi)
  // - "ly" (cho café)
  // - "lần" (cho photocopy, scan)
  // - "ngày" (cho parking)
  // - "GB" (cho data SIM)

  // Pricing model
  billingType: 'per_use' | 'flat_rate' | 'subscription'
  // per_use: tính theo số lần/số lượng thực tế
  // flat_rate: giá cố định, không phụ thuộc usage
  // subscription: phí cố định hàng tháng (locker, WiFi premium)

  // Thresholds (cho per_use có tiers)
  pricingTiers?: PricingTier[]  // Giá theo bậc số lượng

  // Áp dụng cho
  availableInBuildings?: string[]  // null = tất cả buildings
  applicableSpaceTypes?: SpaceType[]  // null = tất cả space types

  isActive: boolean
  effectiveFrom: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
}

enum AddOnServiceCategory {
  PRINTING    = 'printing',     // Máy in, photocopy, scan, fax
  STORAGE     = 'storage',      // Tủ cá nhân, kho nhỏ
  CONNECTIVITY= 'connectivity', // WiFi Premium, cắm dây LAN, SIM data
  FOOD_DRINK  = 'food_drink',   // Cafe, trà, nước đóng chai, snack
  PARKING     = 'parking',      // Giữ xe máy, ô tô, xe đạp
  RECEPTION   = 'reception',    // Nhận bưu phẩm, fax, reception service
  MEETING     = 'meeting',      // Thiết bị phòng họp, projector thuê thêm
  OTHER       = 'other'
}

interface PricingTier {
  fromUnit: number              // Từ bao nhiêu unit
  toUnit?: number               // Đến bao nhiêu unit (null = unlimited)
  pricePerUnit: number          // Giá cho range này
  // Ví dụ in ấn:
  // 1-100 trang: 600 VND/trang
  // 101-500 trang: 500 VND/trang
  // 500+ trang: 400 VND/trang
}
```

### Ví dụ Add-on Services mặc định
```
| Service | Category | Unit | Giá | Billing |
|---------|----------|------|-----|---------|
| In A4 trắng đen | printing | trang | 500 VND | per_use |
| In A4 màu | printing | trang | 2.000 VND | per_use |
| Photocopy A4 | printing | trang | 500 VND | per_use |
| Scan tài liệu | printing | trang | 300 VND | per_use |
| Tủ cá nhân | storage | tháng | 200.000 VND | subscription |
| WiFi Premium 100Mbps | connectivity | tháng | 300.000 VND | subscription |
| Cà phê | food_drink | ly | 25.000 VND | per_use |
| Trà | food_drink | ly | 15.000 VND | per_use |
| Nước lọc đóng chai | food_drink | chai | 10.000 VND | per_use |
| Giữ xe máy | parking | ngày | 15.000 VND | per_use |
| Giữ xe máy | parking | tháng | 300.000 VND | subscription |
| Giữ ô tô | parking | ngày | 50.000 VND | per_use |
| Nhận bưu phẩm thay | reception | tháng | 200.000 VND | subscription |
| Thuê màn hình extra | meeting | ngày | 150.000 VND | per_use |
```

### PromotionProgram
```typescript
interface PromotionProgram {
  id: string
  code: string                  // Mã nội bộ: "PROMO-2026-Q2-01"
  name: string                  // "Khai trương Building 2 – Giảm 20%"
  description: string

  type: PromotionType
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'expired' | 'cancelled'

  // Thời gian áp dụng
  startDate: string
  endDate?: string              // null = không giới hạn thời gian

  // Điều kiện áp dụng (tất cả điều kiện phải đúng)
  conditions: PromotionCondition[]

  // Hành động giảm giá
  discountAction: DiscountAction

  // Giới hạn số lần dùng
  maxUsageTotal?: number        // Tổng số lần áp dụng (null = unlimited)
  maxUsagePerCustomer?: number  // Số lần 1 khách được dùng (null = unlimited)
  currentUsageCount: number     // Đếm hiện tại

  // Xếp chồng khuyến mãi
  stackable: boolean            // Có thể kết hợp với promotion khác không?
  priority: number              // Thứ tự ưu tiên (số càng nhỏ càng ưu tiên cao)

  // Phạm vi
  applicableChannels: ('admin' | 'customer_portal')[]
  requiresVoucherCode: boolean  // true = phải nhập code, false = auto-apply

  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}

enum PromotionType {
  PERCENT_OFF       = 'percent_off',     // Giảm % trên tổng bill
  FIXED_AMOUNT      = 'fixed_amount',    // Giảm số tiền cố định
  BUY_X_GET_Y       = 'buy_x_get_y',    // Thuê 3 tháng tặng 1 tháng
  FREE_SERVICE      = 'free_service',    // Tặng dịch vụ (ví dụ: free 100 trang in)
  UPGRADE           = 'upgrade',         // Nâng hạng miễn phí (hot desk → dedicated desk)
  FLAT_DAY_RATE     = 'flat_day_rate',   // Giá cố định cho ngày đặc biệt
}
```

### PromotionCondition
```typescript
interface PromotionCondition {
  field: ConditionField
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'between'
  value: string | number | string[] | number[]
}

enum ConditionField {
  // Không gian
  SPACE_TYPE       = 'space_type',       // Hot desk, Meeting room...
  BUILDING_ID      = 'building_id',      // Tòa nhà cụ thể
  FLOOR_ID         = 'floor_id',         // Tầng cụ thể
  SPACE_ID         = 'space_id',         // Space cụ thể

  // Thời gian đặt
  BOOKING_DAY      = 'booking_day',      // Mon-Sun (0-6)
  BOOKING_HOUR     = 'booking_hour',     // 0-23
  BOOKING_MONTH    = 'booking_month',    // 1-12

  // Thời lượng
  DURATION_HOURS   = 'duration_hours',   // Số giờ đặt
  DURATION_MONTHS  = 'duration_months',  // Số tháng hợp đồng

  // Giá trị đơn hàng
  ORDER_AMOUNT     = 'order_amount',     // Tổng tiền trước giảm giá (VND)

  // Khách hàng
  CUSTOMER_TYPE    = 'customer_type',    // individual | company
  CUSTOMER_TAG     = 'customer_tag',     // vip, new, referral...
  IS_FIRST_BOOKING = 'is_first_booking', // Booking đầu tiên
  CUSTOMER_ID      = 'customer_id',      // Khách cụ thể (targeted)
}
```

### DiscountAction
```typescript
interface DiscountAction {
  type: PromotionType
  value?: number                // % hoặc VND
  // Cho BUY_X_GET_Y:
  buyQuantity?: number          // Mua X
  getQuantity?: number          // Được/Tặng Y (free)
  getUnit?: 'month' | 'week' | 'day' | 'hour'
  // Cho FREE_SERVICE:
  freeServiceCode?: string      // mã dịch vụ được tặng
  freeServiceQuantity?: number  // Số lượng tặng
  // Cho UPGRADE:
  upgradeToSpaceType?: SpaceType
  // Giới hạn giá trị giảm tối đa
  maxDiscountAmount?: number    // Giảm tối đa X VND
  // Áp dụng cho phần nào của bill
  applyTo: 'subtotal' | 'space_fee' | 'service_fee' | 'deposit'
}
```

### VoucherCode
```typescript
interface VoucherCode {
  id: string
  code: string                  // "WELCOME2026", "VIP50OFF"
  promotionId: string           // FK to PromotionProgram

  // Giới hạn riêng của voucher này (override promotion limits)
  maxUsageTotal?: number
  maxUsagePerCustomer?: number
  currentUsageCount: number

  // Assigned voucher (targeted)
  assignedCustomerId?: string   // Chỉ khách này được dùng (null = public)
  assignedAt?: string

  isActive: boolean
  expiresAt?: string
  createdAt: string
  createdBy: string
}
```

---

## User Stories

### US-81: Cấu hình bảng giá space
> Là **Kế toán/Admin**, tôi muốn **thiết lập giá thuê cho từng loại space với các đơn vị thời gian khác nhau** để **hệ thống tính giá tự động và chính xác**

**Acceptance Criteria**:
- [ ] Tạo pricing rule cho từng SpaceType (Hot desk, Dedicated desk, Private office, Meeting room, Conference room, Training room, Event space, Open space)
- [ ] Mỗi rule có thể set: giá/giờ, giá/ngày, giá/tuần, giá/tháng, giá/năm (tùy chọn, không bắt buộc điền đủ)
- [ ] Set thời gian booking tối thiểu (min 2 giờ, min 1 ngày...)
- [ ] Override giá cho từng building hoặc space cụ thể (override > spaceType default)
- [ ] Set effective date → giá mới không ảnh hưởng bookings/contracts đã có
- [ ] View lịch sử thay đổi giá (audit trail)
- [ ] Chỉ Admin/Kế toán được phép thay đổi giá

### US-82: Quản lý giá dịch vụ cộng thêm
> Là **Kế toán**, tôi muốn **thiết lập giá cho tất cả dịch vụ add-on** để **tính phí chính xác theo usage thực tế**

**Acceptance Criteria**:
- [ ] Tạo service pricing entry với: tên, category, unit (tự nhập tự do), giá, billing type
- [ ] Hỗ trợ pricing tiers (in 1-100 trang: 600đ, 101-500: 500đ, 500+: 400đ)
- [ ] Set phạm vi áp dụng: tất cả building hoặc chỉ building cụ thể
- [ ] Batch update giá (cập nhật nhiều service cùng lúc)
- [ ] Export/import bảng giá dịch vụ (Excel)
- [ ] Preview tính phí mẫu trước khi lưu

### US-83: Tạo chương trình khuyến mãi
> Là **Manager**, tôi muốn **tạo chương trình khuyến mãi với quy tắc linh hoạt** để **thu hút khách và tăng doanh thu**

**Acceptance Criteria**:
- [ ] Tạo promotion với: tên, loại (%-off, fixed, buy-x-get-y, free-service, upgrade)
- [ ] Cấu hình điều kiện kết hợp (AND): loại space + loại khách + khung giờ + giá trị đơn hàng + thời lượng đặt
- [ ] Set thời gian hiệu lực (ngày bắt đầu – ngày kết thúc)
- [ ] Set giới hạn: tổng số lần dùng, số lần/khách hàng
- [ ] Chọn kênh áp dụng: admin-only hoặc customer portal
- [ ] Chọn auto-apply hoặc yêu cầu nhập voucher code
- [ ] Preview hiển thị giá trước và sau giảm
- [ ] Duyệt (approve) promotion trước khi kích hoạt

### US-84: Quản lý voucher/mã giảm giá
> Là **Manager**, tôi muốn **tạo và phân phối mã giảm giá** để **tặng cho khách VIP hoặc dùng trong chiến dịch marketing**

**Acceptance Criteria**:
- [ ] Tạo voucher code (tự định nghĩa hoặc auto-generate)
- [ ] Gắn voucher vào promotion program
- [ ] Tạo bulk vouchers (nhiều code 1 lúc)
- [ ] Assign voucher cho khách hàng cụ thể (targeted)
- [ ] Track: số lần đã dùng, ai đã dùng, khi nào
- [ ] Revoke (thu hồi) voucher nếu cần
- [ ] Expiry date cho voucher

### US-85: Xem và tính giá (Pricing Calculator)
> Là **Staff/Manager**, tôi muốn **tra cứu và tính giá ngay trên dashboard** để **báo giá nhanh cho khách**

**Acceptance Criteria**:
- [ ] Chọn space type / space cụ thể
- [ ] Chọn đơn vị thời gian và số lượng
- [ ] System hiển thị: giá gốc, các promotion auto-apply, giá sau giảm
- [ ] Nhập voucher code → áp dụng và hiển thị giảm giá
- [ ] Tính phí add-on services kèm theo
- [ ] Copy/export kết quả tính giá

---

## Scenarios

### Scenario 1: Tạo bảng giá Hot Desk
```
Given Kế toán đăng nhập, vào Pricing → Space Pricing
When Click "Add Pricing Rule"
And Chọn Space Type = "Hot Desk"
And Set: Giá/giờ = 50.000, Giá/ngày = 300.000, Giá/tháng = 5.000.000
And Set: Min booking = 2 giờ
And Set: Weekend discount = 10%
And Set: Long-term discount: 3 tháng = 5%, 6 tháng = 10%, 12 tháng = 20%
And Effective From = "01/05/2026"
And Click "Save"
Then Pricing rule được tạo với status "scheduled"
And Áp dụng từ 01/05/2026 cho tất cả Hot Desk bookings
And Bookings hiện tại không bị ảnh hưởng
```

### Scenario 2: Override giá riêng cho Building 2
```
Given Đã có pricing rule cho Private Office: 15.000.000/tháng
When Kế toán tạo rule mới: Private Office + Building 2 = 12.000.000/tháng
Then System nhận diện: Building 2 Private Office → dùng giá 12 triệu
And Khi booking:
  - Private Office trong Building 1 → 15 triệu/tháng
  - Private Office trong Building 2 → 12 triệu/tháng
```

### Scenario 3: Chương trình "Khai trương – Giảm 20%"
```
Given Manager tạo promotion mới
When Set:
  Type = "percent_off", value = 20%
  Conditions: building_id = "building-2" (mới khai trương)
  Start = 01/05/2026, End = 31/05/2026
  Max usage = 100 lần
  Auto-apply = true (không cần code)
Then Khi booking bất kỳ space trong Building 2 trong tháng 5:
  System hiển thị: "Khuyến mãi khai trương: -20%"
  Giá gốc: 5.000.000 → Sau giảm: 4.000.000
And Sau 100 lần → Promotion tự động dừng
```

### Scenario 4: Voucher VIP cho khách cụ thể
```
Given Manager muốn tặng voucher cho khách VIP "CUS-0006" (ABC Tech)
When Tạo Voucher "VIP-ABC-50"
  Gắn vào promotion "50% off month 1"
  Assign cho customer "CUS-0006"
  Expires: 30/06/2026
Then Khi CUS-0006 booking và nhập code "VIP-ABC-50"
  System xác thực: đúng customer, còn hạn, chưa dùng
  Apply: -50% cho tháng đầu tiên
And Nếu khách khác nhập code này → "Voucher không áp dụng cho tài khoản của bạn"
```

### Scenario 5: Buy 3 months, get 1 month free
```
Given Promotion: "Thuê 3 tháng tặng 1 tháng" cho Dedicated Desk
When Khách book Dedicated Desk 3 tháng (7.000.000/tháng = 21.000.000)
Then System tính:
  3 tháng × 7.000.000 = 21.000.000
  Tặng thêm 1 tháng FREE
  → Contract kéo dài 4 tháng với giá 21.000.000
  Hiển thị trên invoice: "Khuyến mãi: Tặng 1 tháng (trị giá 7.000.000)"
```

### Scenario 6: Pricing tiers cho dịch vụ in ấn
```
Given Service "In A4 trắng đen" có pricing tiers:
  Tier 1: 1-100 trang → 600 VND/trang
  Tier 2: 101-500 trang → 500 VND/trang
  Tier 3: 500+ trang → 400 VND/trang
When Khách in 350 trang trong tháng
Then System tính:
  100 trang × 600 = 60.000
  250 trang × 500 = 125.000
  Tổng = 185.000 VND (thay vì 350 × 600 = 210.000)
```

---

## Business Rules

### Pricing Priority (độ ưu tiên cascading)
```
1. Space-specific override (spaceId + effectiveDate) → cao nhất
2. Floor-specific override (floorId + effectiveDate)
3. Building-specific override (buildingId + spaceType + effectiveDate)
4. SpaceType default (spaceType + effectiveDate) → thấp nhất
```

### Discount Stacking Rules
- Mặc định: chỉ 1 promotion được áp dụng mỗi lần (promotion có priority cao nhất)
- Nếu promotion có `stackable: true` → có thể kết hợp với 1 promotion khác cũng `stackable: true`
- Voucher code luôn được áp dụng CỘNG với 1 auto-apply promotion
- Long-term discount (built into pricing rule) không tính là promotion → stack được với promotion

### Effective Date Rules
- Pricing changes: `effectiveFrom` → áp dụng cho bookings MỚI tạo sau ngày đó
- Bookings/Contracts đã ký: giữ giá cũ đến khi hết hạn
- Promotion: active trong `[startDate, endDate]` theo ngày tạo booking, không phải ngày ở

### Validation
- Không xóa pricing rule nếu đang là active rule cho space type nào đó
- Promotion: endDate >= startDate
- Discount value: 0 < percent_off <= 100, fixed_amount > 0
- Voucher code: unique trong hệ thống, không phân biệt hoa thường

---

## Phụ thuộc (Dependencies)

**Phụ thuộc vào**:
- EP-01: Authentication (cần login để manage pricing)
- EP-02: Property Management (space types, buildings, floors)
- EP-03: Customer Management (customer type, tags để làm conditions)

**Được sử dụng bởi**:
- EP-04: Booking & Reservation (tính giá khi tạo booking)
- EP-05: Contract Management (tính monthly fee khi tạo contract)
- EP-06: Payment & Invoicing (tính tổng invoice)
- EP-07: Service Management (pricing dịch vụ add-on)

---

## Technical Notes

### Pricing Calculation Flow
```
1. Lấy base price theo space → áp dụng Pricing Priority cascading
2. Tính duration discount (long-term: 3/6/12 tháng)
3. Tính time discount (weekend, off-peak)
4. Thu thập auto-apply promotions đủ điều kiện (sort by priority)
5. Áp dụng promotion cao nhất (+ stackable combo nếu có)
6. Áp dụng voucher code nếu có
7. Tính add-on services (pricing tiers)
8. Tổng hợp final price
```

### API Design
```
GET  /api/pricing/spaces                    # Danh sách pricing rules
POST /api/pricing/spaces                    # Tạo mới
PUT  /api/pricing/spaces/:id                # Cập nhật
GET  /api/pricing/services                  # Danh sách add-on service prices
POST /api/pricing/calculate                 # Tính giá preview
GET  /api/promotions                        # Danh sách promotions
POST /api/promotions                        # Tạo promotion
PUT  /api/promotions/:id/status             # Kích hoạt/pause/cancel
GET  /api/vouchers                          # Danh sách vouchers
POST /api/vouchers/validate                 # Validate voucher code
POST /api/vouchers/apply                    # Áp dụng voucher
```

---

## Ghi chú

- **Đơn vị tiền tệ**: Tất cả giá lưu dạng VND (số nguyên)
- **Đơn vị dịch vụ**: Free text (linh hoạt) – staff tự định nghĩa phù hợp với dịch vụ
- **Audit trail**: Mọi thay đổi giá phải được log lại (ai thay đổi, khi nào, giá cũ là bao nhiêu)
- **No delete policy**: Pricing rules không bị xóa, chỉ mark `isActive: false` hoặc set `effectiveTo`
- **Permissions**: Chỉ Admin và Kế toán được thay đổi pricing. Manager được tạo promotions nhưng cần Approval. Sales chỉ được xem.
