# F-88: Pricing Calculator (Công cụ tính giá preview)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-88 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Must have |
| Trạng thái | Draft |

## Mục tiêu

Cung cấp công cụ tính giá nhanh trên dashboard, cho phép Staff/Manager tra cứu và preview giá trước khi báo khách mà không cần tạo booking thật.

## Mô tả

- Chọn space (hoặc space type) + đơn vị thời gian + số lượng.
- System hiển thị: giá gốc, các promotion auto-apply, giá sau giảm.
- Nhập voucher code để preview thêm discount.
- Thêm dịch vụ add-on vào tính giá.
- Copy hoặc export kết quả tính giá (để gửi báo giá sơ bộ).

## Scope màn hình

- `/pricing/calculator` – Trang Pricing Calculator
- Widget nhỏ trong trang tạo booking (F-24) và tạo contract (EP-05)

## Acceptance Criteria

- [ ] Chọn: space type hoặc space cụ thể
- [ ] Chọn đơn vị: giờ / ngày / tuần / tháng / năm
- [ ] Nhập số lượng (số giờ, số ngày, số tháng...)
- [ ] Chọn ngày bắt đầu → system apply promotions đúng thời điểm
- [ ] Hiển thị giá gốc theo rule đang active (F-81/F-83)
- [ ] Hiển thị promotions auto-apply đang match → với số tiền giảm tương ứng
- [ ] Trường nhập voucher code → validate và hiển thị thêm discount
- [ ] Thêm dịch vụ add-on (chọn service + số lượng) → cộng vào tổng
- [ ] Breakdown rõ ràng: Space fee | Service fees | Discounts | Total
- [ ] Nút "Copy báo giá" → copy text ngắn gọn ra clipboard
- [ ] Nút "Tạo booking từ giá này" → chuyển sang form tạo booking với dữ liệu đã điền sẵn

## UI Layout

```
┌─────────────── Pricing Calculator ───────────────┐
│                                                    │
│  Không gian:  [Hot Desk ▼]  [Building 1 ▼]        │
│  Đơn vị:      [Tháng ▼]    Số lượng: [3]          │
│  Ngày bắt đầu: [01/05/2026]                        │
│                                                    │
│  ──────────────────────────────────────────────   │
│  Giá space:         5.000.000 × 3 = 15.000.000    │
│                                                    │
│  Dịch vụ thêm:                          [+ Thêm]  │
│  └ WiFi Premium (tháng × 3):              900.000  │
│                                                    │
│  Tổng trước giảm:                      15.900.000  │
│                                                    │
│  Khuyến mãi tự động:                              │
│  └ 3 tháng giảm 5%:                    -750.000   │
│                                                    │
│  Mã giảm giá: [____________] [Áp dụng]            │
│                                                    │
│  ══════════════════════════════════════════════   │
│  TỔNG CỘNG:                            15.150.000  │
│                                                    │
│         [Copy báo giá]  [Tạo booking từ giá này]  │
└────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario: Tính giá nhanh và copy báo giá
```
Given Staff nhận cuộc gọi từ khách hỏi giá Hot Desk 3 tháng
When Vào Pricing Calculator
And Chọn: Hot Desk, tháng × 3, ngày 01/05/2026
Then Hiển thị:
  Giá gốc: 5.000.000 × 3 = 15.000.000
  Promotion auto: 3 tháng giảm 5% = -750.000
  TỔNG: 14.250.000
When Click "Copy báo giá"
Then Clipboard: "Hot Desk – 3 tháng (từ 01/05/2026): 14.250.000 VND (đã bao gồm giảm giá 5% dài hạn)"
```

### Scenario: Khách nhập voucher để kiểm tra
```
Given Khách nhắn tin hỏi voucher "VIP-ABC-50" được giảm bao nhiêu
When Staff nhập voucher vào Calculator, chọn Dedicated Desk 1 tháng = 7.000.000
Then Hiển thị:
  Giá gốc: 7.000.000
  Voucher VIP-ABC-50 (50% off tháng đầu): -3.500.000
  TỔNG: 3.500.000
```

### Scenario: Chuyển sang tạo booking
```
Given Staff đã tính giá Hot Desk 2 tháng trong Calculator
When Click "Tạo booking từ giá này"
Then Chuyển sang /bookings/new với các field đã điền sẵn:
  Space type = Hot Desk
  Duration = 2 tháng
  Start date = ngày đã chọn
  Applied promotions = đã pre-filled
```
