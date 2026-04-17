# F-91 – Lead Capture

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-91 |
| Epic | EP-12 – Lead Management & Marketing (CRM) |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Cho phép Sales team tạo lead mới thủ công qua form trong dashboard, đồng thời hỗ trợ capture lead từ form trên website (webhook / API). Lead được tạo với stage mặc định là `inquiry`, sau đó tự động assign cho sales rep.

**Business Rules:**
- Mỗi lead có mã tự sinh: `LEAD-NNN` (sequential, zero-padded)
- Email lead không bắt buộc phải unique (cùng người có thể gửi nhiều inquiry)
- Nếu email trùng với customer hiện có → hiển thị cảnh báo nhưng vẫn cho tạo
- Source phải chọn từ danh sách có sẵn
- Khi tạo thành công → stage tự động là `inquiry`, status là `active`
- Phải chọn ít nhất một loại không gian quan tâm

## User Story

> Là **Sale**, tôi muốn **tạo lead mới từ form** để **theo dõi khách hàng tiềm năng trong pipeline**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Route `/crm/leads` hiển thị danh sách leads với nút "Thêm Lead"
- [ ] **AC2**: Click "Thêm Lead" → mở modal form
- [ ] **AC3**: Form gồm: Họ tên*, Email*, SĐT*, Công ty, Nguồn*, Quan tâm đến* (multi-select), Ngân sách, Ngày dự kiến, Ghi chú
- [ ] **AC4**: Validate required fields trước khi submit
- [ ] **AC5**: Submit → Lead được tạo, hiển thị trong danh sách, modal đóng
- [ ] **AC6**: Lead mới có `leadCode` = `LEAD-{N}`, `stage` = `inquiry`, `status` = `active`

## Dữ liệu / Fields

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|-------|----------|---------|
| fullName | Text | Có | Họ tên đầy đủ |
| email | Email | Có | |
| phone | Text | Có | |
| company | Text | Không | Nếu là doanh nghiệp |
| source | Enum | Có | website/referral/facebook_ad/google_ad/walk_in/other |
| interestedIn | Enum[] | Có | hot_desk/dedicated_desk/private_office/meeting_room/event_space |
| budget | Number | Không | VNĐ/tháng |
| expectedMoveInDate | Date | Không | |
| notes | Text | Không | |

## Scenarios

**Scenario 1: Tạo lead thành công**
```
Given Sales đang ở trang /crm/leads
When Click "Thêm Lead" → điền đầy đủ thông tin hợp lệ → Submit
Then Lead được tạo với leadCode LEAD-NNN
And Modal đóng, lead hiển thị đầu danh sách
And Stage = inquiry, Status = active
```

**Scenario 2: Validate lỗi thiếu trường**
```
Given Modal form đang mở
When Submit mà chưa điền Email
Then Hiển thị thông báo "Vui lòng nhập email"
And Form không đóng
```
