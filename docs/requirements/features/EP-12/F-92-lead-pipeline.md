# F-92 – Lead Pipeline (Kanban Board)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-92 |
| Epic | EP-12 – Lead Management & Marketing (CRM) |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |

## Mô tả nghiệp vụ

Hiển thị pipeline bán hàng dạng Kanban board theo từng giai đoạn (stage). Sales có thể kéo-thả lead giữa các cột để cập nhật giai đoạn. Click vào lead card để xem chi tiết.

**Business Rules:**
- 8 stages theo thứ tự: Inquiry → Contacted → Tour Scheduled → Tour Completed → Proposal Sent → Negotiation → Closed Won → Closed Lost
- Chỉ có thể di chuyển lead theo chiều tiến (forward) và lùi 1 bước
- Closed Won / Closed Lost là stage kết thúc – không thể move sang stage khác
- Filter "My Leads" chỉ hiển thị leads assignedTo = current user

## User Story

> Là **Sale**, tôi muốn **xem pipeline dạng Kanban** để **nắm bắt nhanh tiến độ của từng lead**.

## Tiêu chí chấp nhận (Acceptance Criteria)

- [ ] **AC1**: Route `/crm/leads/kanban` hiển thị Kanban board
- [ ] **AC2**: 8 cột tương ứng 8 stages, hiển thị số lượng lead trong mỗi cột
- [ ] **AC3**: Lead card hiển thị: tên, email, source badge, người phụ trách
- [ ] **AC4**: Drag-drop card giữa các cột → cập nhật stage
- [ ] **AC5**: Click card → navigate đến `/crm/leads/:id`
- [ ] **AC6**: Filter toggle "Tất cả / Lead của tôi"
- [ ] **AC7**: Nút chuyển sang List View (→ `/crm/leads`)

## Scenarios

**Scenario 1: Di chuyển lead sang giai đoạn tiếp theo**
```
Given Lead LEAD-042 đang ở cột "Inquiry"
When Drag card sang cột "Contacted"
Then Lead.stage = contacted
And Card di chuyển sang cột Contacted
And Cập nhật số lượng cả 2 cột
```

**Scenario 2: Xem chi tiết lead từ Kanban**
```
Given Kanban board đang hiển thị
When Click vào lead card
Then Navigate đến /crm/leads/:id
```
