# F-83: Pricing Tiers & Overrides (Giá theo phạm vi và ngoại lệ)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | F-83 |
| Epic | EP-17 – Pricing & Promotions Management |
| Phase | Phase 1 |
| Độ ưu tiên | Should have |
| Trạng thái | Draft |

## Mục tiêu

Cho phép override giá cho từng tòa nhà, tầng, hoặc không gian cụ thể, vượt qua giá mặc định của SpaceType, để linh hoạt định giá theo vị trí địa lý và chất lượng không gian.

## Mô tả

- Mọi pricing rule ở F-81 và F-82 đều có thể override theo phạm vi hẹp hơn.
- **Priority chain** (ưu tiên từ cao đến thấp): `space` > `floor` > `building` > `spaceType`
- Khi tính giá: system chọn rule có priority cao nhất match với không gian được đặt.
- Admin/Kế toán có thể nhìn thấy all rules, lọc theo scope, và kiểm tra xem space cụ thể đang áp dụng rule nào.

## Scope màn hình

- Tab "Override rules" trong `/pricing/spaces`
- Công cụ "Check pricing": nhập space → xem rule nào đang được áp dụng
- Badge "Override" trong danh sách rule

## Acceptance Criteria

- [ ] Tạo pricing rule với scope: `spaceId`, hoặc `floorId`, hoặc `buildingId`, hoặc chỉ `spaceType`
- [ ] System engine: khi booking space X → tìm rule theo priority chain (space > floor > building > spaceType)
- [ ] Nếu không tìm thấy rule nào match → báo lỗi "Chưa cấu hình giá"
- [ ] Công cụ "Preview pricing": chọn space + đơn vị → hiển thị rule nào được áp dụng và giá cuối
- [ ] Danh sách rule có badge phân biệt scope: "Toàn hệ thống" / "Building" / "Floor" / "Space"
- [ ] Cảnh báo khi tạo rule trùng scope (duplicate rule cho cùng space + cùng thời gian)

## Scenarios

### Scenario: Override cho Building 2 Premium
```
Given Rule mặc định: Dedicated Desk → 7.000.000/tháng (spaceType)
When Tạo override rule: Dedicated Desk + Building 2 → 9.000.000/tháng
Then Booking Dedicated Desk – Building 1 → 7 triệu (spaceType rule)
And Booking Dedicated Desk – Building 2 → 9 triệu (building override)
```

### Scenario: Override cho space đặc biệt (phòng góc view đẹp)
```
Given Override: Space "A201" (Private Office, góc, view đẹp) → 20.000.000/tháng
And Rule building: Private Office – Building 2 → 15.000.000/tháng
When Booking space A201
Then Áp dụng rule của space A201: 20 triệu (space > building)
```

### Scenario: Kiểm tra giá đang áp dụng
```
Given Staff muốn biết giá của space "B301" là bao nhiêu
When Mở "Check pricing" → chọn space B301 → chọn đơn vị "tháng"
Then System hiển thị:
  - Rule được chọn: "Dedicated Desk – Building 2" (building override)
  - Giá: 9.000.000/tháng
  - Priority chain: spaceType=7M → building=9M → floor=N/A → space=N/A
  - Rule đang có hiệu lực: effective 01/04/2026, chưa có ngày kết thúc
```
