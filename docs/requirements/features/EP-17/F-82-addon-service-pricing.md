# F-82: Add-on Service Pricing (Bảng giá dịch vụ cộng thêm)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-82 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Must have |
| Trạng thái | Draft |

## Mục tiêu

Cho phép Kế toán/Admin thiết lập bảng giá cho tất cả dịch vụ cộng thêm (add-on services) với đơn vị tính linh hoạt và hỗ trợ pricing theo bậc (tiered pricing).

## Mô tả

- Quản lý danh sách dịch vụ add-on: in ấn, lưu trữ, internet, ăn uống, giữ xe, lễ tân, ...
- Đơn vị tính tự do (free text): "trang", "tháng", "ly", "lần", "ngày", "kWh", "m³"...
- Hỗ trợ 3 kiểu tính giá:
  - `per_use` – tính theo số lượng thực tế (in ấn, café...)
  - `flat_rate` – phí cố định không phụ thuộc usage (locker...)
  - `subscription` – phí tháng cố định (WiFi premium, locker...)
- Pricing tiers: giá giảm dần theo số lượng (in 1-100 trang: 600đ, 101-500: 500đ, 500+: 400đ)
- Set phạm vi áp dụng: tất cả buildings hoặc chỉ buildings cụ thể

## Scope màn hình

- `/pricing/services` – Danh mục dịch vụ với giá
- Modal tạo/chỉnh sửa service pricing
- Bảng pricing tiers (thêm/xóa tiers)

## Acceptance Criteria

- [ ] Tạo service pricing entry với: tên, category, unit (text tự do), giá, billing type
- [ ] Hỗ trợ pricing tiers: thêm/bớt tiers tùy ý với from-to range và price/unit
- [ ] Set phạm vi áp dụng: `availableInBuildings` (null = tất cả)
- [ ] Effective date (tương tự F-81)
- [ ] Batch update giá: chọn nhiều services → cập nhật % hoặc cố định cùng lúc
- [ ] Export/import bảng giá (CSV/Excel)
- [ ] Preview tính phí: nhập số lượng → hiển thị tổng tiền theo tier

## Ví dụ dịch vụ mặc định

| Dịch vụ | Category | Unit | Giá | Billing type |
|---------|----------|------|-----|--------------|
| In A4 trắng đen | printing | trang | 500 đ | per_use |
| In A4 màu | printing | trang | 2.000 đ | per_use |
| Photocopy A4 | printing | trang | 500 đ | per_use |
| Scan tài liệu | printing | trang | 300 đ | per_use |
| Tủ cá nhân (Locker) | storage | tháng | 200.000 đ | subscription |
| WiFi Premium 100Mbps | connectivity | tháng | 300.000 đ | subscription |
| Cà phê | food_drink | ly | 25.000 đ | per_use |
| Trà | food_drink | ly | 15.000 đ | per_use |
| Nước lọc đóng chai | food_drink | chai | 10.000 đ | per_use |
| Giữ xe máy (ngày) | parking | ngày | 15.000 đ | per_use |
| Giữ xe máy (tháng) | parking | tháng | 300.000 đ | subscription |
| Giữ ô tô (ngày) | parking | ngày | 50.000 đ | per_use |
| Nhận bưu phẩm thay | reception | tháng | 200.000 đ | subscription |

## Data Model

```typescript
interface AddOnServicePricing {
  id: string
  serviceCode: string               // "SVC-001"
  name: string
  category: AddOnServiceCategory
  description?: string
  unitPrice: number                 // Giá base (VND)
  unit: string                      // Free text
  billingType: 'per_use' | 'flat_rate' | 'subscription'
  pricingTiers?: PricingTier[]      // null = giá cố định, không phân bậc
  availableInBuildings?: string[]   // null = tất cả
  isActive: boolean
  effectiveFrom: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
}

interface PricingTier {
  fromUnit: number
  toUnit?: number                   // null = unlimited
  pricePerUnit: number
}
```

## Scenarios

### Scenario: Pricing tiers cho in ấn
```
Given Service "In A4 trắng đen" được set pricing tiers:
  Tier 1: 1–100 trang → 600 VND/trang
  Tier 2: 101–500 trang → 500 VND/trang
  Tier 3: 500+ trang → 400 VND/trang
When Khách in 350 trang trong tháng
Then System tính:
  100 × 600 = 60.000
  250 × 500 = 125.000
  Tổng = 185.000 VND (tiết kiệm 25.000 so với flat rate)
```

### Scenario: Batch update giá
```
Given Kế toán muốn tăng giá tất cả dịch vụ printing thêm 10%
When Chọn tất cả services có category = printing
And Click "Batch update" → Tăng 10%
Then Tất cả services printing có giá mới = giá cũ × 1.1
And Effective từ ngày kế toán chọn
```
