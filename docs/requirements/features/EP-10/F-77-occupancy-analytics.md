# F-77 – Occupancy Analytics

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-77 |
| Epic | EP-10 - Reporting & Analytics |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 3 - Advanced Features |

## Mô tả nghiệp vụ

Cho phép **Manager và Admin** phân tích tỷ lệ lấp đầy (occupancy rate) theo thời gian, loại không gian và tòa nhà. Xác định giờ cao điểm và so sánh hiệu suất giữa các khu vực để tối ưu pricing và phân bổ không gian.

**Business Rules:**
- Occupancy Rate = (Số giờ không gian được đặt) / (Tổng số giờ hoạt động trong kỳ) × 100%
- Giờ hoạt động: 7:00 – 22:00 mỗi ngày (15 giờ/ngày)
- Chỉ tính bookings có status = confirmed hoặc completed
- Không tính bookings bị cancelled

## User Story

> Là **Manager**, tôi muốn **xem tỷ lệ lấp đầy và xu hướng** để **tối ưu pricing và phân bổ không gian hiệu quả**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Bộ lọc

- [ ] **AC1**: Filter date range với presets: Tháng này, Quý này, 6 tháng, 12 tháng, Custom
- [ ] **AC2**: Filter theo tòa nhà (dropdown, default = Tất cả)
- [ ] **AC3**: Filter theo loại không gian
- [ ] **AC4**: Granularity: Theo ngày / Theo tuần / Theo tháng

### Summary Cards

- [ ] **AC5**: 4 summary cards:
  - **Avg Occupancy Rate**: % trung bình trong kỳ + so kỳ trước
  - **Số không gian TB được thuê**: tổng spaces bị book / ngày trung bình
  - **Peak Rate**: tỷ lệ cao nhất trong kỳ (kèm ngày)
  - **Off-peak Rate**: tỷ lệ thấp nhất trong kỳ (kèm ngày)

### Charts

- [ ] **AC6**: **Occupancy Trend** (line chart): % theo kỳ đã chọn
- [ ] **AC7**: **Heatmap giờ cao điểm**: grid 7 ngày × 24 giờ, màu đậm = busy, màu nhạt = trống — aggregated cho cả kỳ filter
- [ ] **AC8**: **Occupancy by Space Type** (bar chart ngang): so sánh % giữa các loại không gian
- [ ] **AC9**: **Occupancy by Building** (bar chart): so sánh % giữa các tòa nhà

### Bảng chi tiết

- [ ] **AC10**: Bảng "Không gian theo hiệu suất": Space | Building | Type | Occupancy % | Tổng giờ đặt | Doanh thu tương ứng — sort được
- [ ] **AC11**: Highlight top 3 không gian hiệu suất cao nhất và thấp nhất

### Export

- [ ] **AC12**: Export PDF, Excel (F-82)

## Màn hình & Layout

```
Filter: [6 tháng qua ▼] [Tất cả tòa nhà ▼] [Tất cả loại ▼] [Theo tháng ▼]  [Export ▼]

┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Avg Occupancy  │ │ Spaces TB/ngày │ │ Peak Rate      │ │ Off-peak Rate  │
│ 78%  +3.2pp    │ │ 85 / 109       │ │ 94% (15/03)    │ │ 52% (01/01)    │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘

[Occupancy Trend - Line Chart]

[Heatmap 7×24]                      [By Space Type - Bar]

[By Building - Bar]

[Bảng: Không gian theo hiệu suất]
```

## Phụ thuộc

- EP-04: Booking data (confirmed/completed bookings, time slots)
- EP-02: Property data (buildings, spaces, spaceType)
