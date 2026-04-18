# F-133 – Dashboard phản hồi (Feedback Dashboard)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-133 |
| Epic | EP-16 - Feedback & Quality Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Dashboard tổng hợp và trực quan hóa feedback: NPS score, average ratings, trends theo thời gian. Giúp **Manager** nắm bắt nhanh chất lượng dịch vụ.

**Business Rationale:**
- Một nơi nhìn tổng quan tất cả feedback metrics
- Phát hiện trends: chất lượng đang tăng hay giảm
- NPS score là chỉ số quan trọng để đo customer loyalty

**Business Rules:**
- NPS Score = %Promoters (9-10) – %Detractors (0-6)
- NPS range: -100 → +100
- Average ratings tính từ tất cả ratings trong period
- Trend charts: monthly data points

## User Story

> Là **Manager**, tôi muốn **xem feedback dashboard** để **nắm bắt chất lượng dịch vụ tổng quan**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### KPI Cards

- [ ] **AC1**: NPS Score hiện tại (number + gauge chart)
- [ ] **AC2**: Average Overall Rating (number + stars)
- [ ] **AC3**: Total Responses (tổng feedback trong period)
- [ ] **AC4**: Response Rate (% customers đã trả lời survey)

### Charts

- [ ] **AC5**: NPS Trend: line chart theo tháng (6-12 tháng gần nhất)
- [ ] **AC6**: Rating Breakdown: bar chart so sánh cleanliness, facilities, staff averages
- [ ] **AC7**: NPS Distribution: promoters (9-10) / passives (7-8) / detractors (0-6)

### Filter

- [ ] **AC8**: Filter theo date range
- [ ] **AC9**: Filter theo building (nếu multi-building)

### Recent Feedback

- [ ] **AC10**: Bảng 10 feedback gần nhất: Customer, Date, Overall Rating, Comment (truncated)
