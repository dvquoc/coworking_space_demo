# F-131 – Khảo sát feedback (Feedback Surveys)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-131 |
| Epic | EP-16 - Feedback & Quality Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép **Manager** tạo và gửi surveys (NPS, satisfaction) tới customers. Thu thập phản hồi để đo lường customer loyalty và satisfaction.

**Business Rationale:**
- Đo lường NPS (Net Promoter Score) để biết mức độ hài lòng
- Thu thập feedback có hệ thống, không phụ thuộc hỏi miệng
- Dữ liệu để cải thiện dịch vụ

**Business Rules:**
- Survey types: NPS (0-10 score), Satisfaction (1-5 stars + questions)
- Target audience: all customers, active customers, hoặc specific segment
- Survey có thời gian bắt đầu/kết thúc
- Status flow: draft → active → completed
- Mỗi customer chỉ trả lời 1 lần/survey
- Gửi survey qua email và/hoặc Zalo

## User Story

> Là **Manager**, tôi muốn **gửi NPS survey** để **measure customer loyalty**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Tạo Survey

- [ ] **AC1**: Route `/surveys` hiển thị danh sách surveys
- [ ] **AC2**: Bấm "Create Survey" → form: title, type (NPS/Satisfaction), target audience
- [ ] **AC3**: Thêm questions: rating (1-5), text (free text), multiple choice
- [ ] **AC4**: Set startDate, endDate
- [ ] **AC5**: Status mặc định: `draft`

### Gửi Survey

- [ ] **AC6**: Publish survey → status `active`
- [ ] **AC7**: Gửi notification tới target customers (email/Zalo)
- [ ] **AC8**: Customer nhận link → mở survey → trả lời

### Thu thập Responses

- [ ] **AC9**: Customer submit response → lưu vào hệ thống
- [ ] **AC10**: Mỗi customer chỉ submit 1 lần (duplicate check)
- [ ] **AC11**: Hiển thị response count / total target trên survey list
