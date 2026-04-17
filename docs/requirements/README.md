# Requirements – Coworking Space System

Thư mục này lưu trữ tất cả tài liệu yêu cầu nghiệp vụ (Business Requirements) của dự án **Cobi Coworking Space Management**.

## Tổng quan

- **Tổng số Epics**: 17 Epics
- **Phase 1 (Core)**: 10 Epics (+ EP-15 partial) - **4.5-5 tháng**
- **Phase 2 (Growth)**: 4 Epics - 3 tháng  
- **Phase 3 (Advanced)**: 3 Epics - 2 tháng
- **Tổng số NFRs**: 5 Non-Functional Requirements

## Cấu trúc

```
docs/requirements/
├── README.md                          # File này – index toàn bộ requirements
├── epics/                             # Yêu cầu cấp cao (Epic) - 16 files
│   ├── EP-01-auth.md
│   ├── EP-02-property.md
│   ├── ...
│   └── EP-16-feedback.md
├── features/                          # Yêu cầu cấp tính năng – mỗi epic 1 thư mục con
│   ├── EP-02/                         # Feature files cho EP-02 (future)
│   ├── ...
│   └── EP-16/
└── non-functional/                    # Yêu cầu phi chức năng - 5 files
    ├── NFR-01-performance.md
    ├── NFR-02-security.md
    ├── NFR-03-scalability.md
    ├── NFR-04-payment-integration.md
    └── NFR-05-i18n.md
```

## Epics Index

### Phase 1 – Core Operations (9 Epics)

| ID | Epic Title | Priority | Features | Status | File |
|----|------------|----------|----------|--------|------|
| EP-01 | Authentication & Authorization | Must have | 6 | ✅ Done | [EP-01-auth.md](epics/EP-01-auth.md) |
| EP-02 | Property Management | Must have | 5 | ✅ Done | [EP-02-property.md](epics/EP-02-property.md) |
| EP-03 | Customer Management | Must have | **5** | ✅ Done | [EP-03-customer.md](epics/EP-03-customer.md) |
| EP-04 | Booking & Reservation **Extended** | Must have | **9** | ✅ Done | [EP-04-booking.md](epics/EP-04-booking.md) |
| EP-05 | Contract Management | Must have | **6** | ✅ Done | [EP-05-contract.md](epics/EP-05-contract.md) |
| EP-06 | Payment & Invoicing **Extended** | Must have | **13** | ✅ Done | [EP-06-payment.md](epics/EP-06-payment.md) |
| EP-07 | Service Management | Must have | 4 | ✅ Done | [EP-07-service.md](epics/EP-07-service.md) |
| EP-08 | Inventory & Asset Management | Must have | 4 | ✅ Done | [EP-08-inventory.md](epics/EP-08-inventory.md) |
| EP-11 | Role-based Dashboards ⭐ | Must have | 6 | ✅ Done | [EP-11-dashboards.md](epics/EP-11-dashboards.md) | [F-81](features/EP-11/F-81-investor-dashboard.md) [F-82](features/EP-11/F-82-admin-dashboard.md) [F-83](features/EP-11/F-83-manager-dashboard.md) [F-84](features/EP-11/F-84-maintenance-dashboard.md) [F-85](features/EP-11/F-85-accounting-dashboard.md) [F-86](features/EP-11/F-86-sales-dashboard.md) |
| EP-15 | Customer Portal **Partial** | Must have | **3** (of 8) | ✅ Done | [EP-15-customer-portal.md](epics/EP-15-customer-portal.md) |

### Phase 2 – Growth Features (4 Epics)

| ID | Epic Title | Priority | Features | Status | File |
|----|------------|----------|----------|--------|------|
| EP-12 | Lead Management & CRM | Should have | 5 | ✅ Done | [EP-12-crm.md](epics/EP-12-crm.md) |
| EP-13 | Access Control & Visitor Management | Should have | 4 | ✅ Done | [EP-13-access-control.md](epics/EP-13-access-control.md) |
| EP-14 | Community & Events Management | Nice to have | 4 | ✅ Done | [EP-14-events.md](epics/EP-14-events.md) |
| EP-16 | Feedback & Quality Management | Should have | 4 | ✅ Done | [EP-16-feedback.md](epics/EP-16-feedback.md) |

### Phase 3 – Advanced Features (3 Epics)

| ID | Epic Title | Priority | Features | Status | File |
|----|------------|----------|----------|--------|------|
| EP-09 | Staff & Permission Management | Should have | 4 | ✅ Done | [EP-09-staff.md](epics/EP-09-staff.md) |
| EP-10 | Reporting & Analytics | Should have | 4 | ✅ Done | [EP-10-reporting.md](epics/EP-10-reporting.md) |
| EP-15 | Customer Portal **Full** | Nice to have | **5** (of 8) | ✅ Done | [EP-15-customer-portal.md](epics/EP-15-customer-portal.md) |

## Non-Functional Requirements (NFRs)

| ID | Title | Priority | Status | File |
|----|-------|----------|--------|------|
| NFR-01 | Performance | Must have | ✅ Done | [NFR-01-performance.md](non-functional/NFR-01-performance.md) |
| NFR-02 | Security | Must have | ✅ Done | [NFR-02-security.md](non-functional/NFR-02-security.md) |
| NFR-03 | Scalability | Must have | ✅ Done | [NFR-03-scalability.md](non-functional/NFR-03-scalability.md) |
| NFR-04 | Payment Integration | Must have | ✅ Done | [NFR-04-payment-integration.md](non-functional/NFR-04-payment-integration.md) |
| NFR-05 | Internationalization (i18n) | Nice to have | ✅ Done | [NFR-05-i18n.md](non-functional/NFR-05-i18n.md) |

## Quy ước đặt tên file

| Loại | Tiền tố | Đường dẫn ví dụ |
|------|---------|----------------|
| Epic | `EP-[NN]-[tên].md` | `epics/EP-01-auth.md` |
| Feature / User Story | `F-[NN]-[tên].md` | `features/EP-02/F-01-login.md` |
| Yêu cầu phi chức năng | `NFR-[NN]-[tên].md` | `non-functional/NFR-01-performance.md` |

## Cấu trúc một file requirement

```markdown
# [Tiêu đề yêu cầu]

## Thông tin chung
| Trường | Giá trị |
|--------|---------|
| ID | F-XX |
| Epic | EP-XX |
| Độ ưu tiên | Must / Should / Could |
| Người tạo | [Tên BA] |
| Ngày tạo | DD/MM/YYYY |
| Trạng thái | Draft / Review / Approved / Done |

## Mô tả nghiệp vụ
Mô tả ngắn gọn mục đích và bối cảnh của yêu cầu.

## User Story
> Là [vai trò], tôi muốn [hành động] để [mục đích].

## Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] AC1: ...
- [ ] AC2: ...

## Phụ thuộc (Dependencies)
- Phụ thuộc vào: F-XX, EP-XX (nếu có)
- Được sử dụng bởi: F-XX (nếu có)

## Out of Scope
Những gì **không** thuộc feature này (để tránh scope creep):
- ...

## Màn hình / Luồng liên quan
Dẫn link tới flow doc hoặc mô tả UI nếu có.

## Ghi chú
Các lưu ý, ràng buộc kỹ thuật hoặc nghiệp vụ cần lưu ý.
```

## Liên kết tài liệu liên quan

- **[ROADMAP.md](../ROADMAP.md)**: Roadmap 9 tháng, 3 phases, dependencies
- **[REQUIREMENTS_ANALYSIS.md](../REQUIREMENTS_ANALYSIS.md)**: Phân tích tổng thể, kiến trúc, rủi ro
- **[PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)**: Cấu trúc thư mục dự án
- **[Flows](../flows/)**: Tài liệu các luồng nghiệp vụ

## Definition of Done (DoD)

Một User Story được coi là **Done** khi đáp ứng **tất cả** tiêu chí sau:

### Nghiệp vụ
- [ ] Tất cả Acceptance Criteria đã được implement và pass
- [ ] BA / PO đã review và xác nhận đúng yêu cầu

### Kỹ thuật
- [ ] Code đã được review (PR approved)
- [ ] Không có TypeScript errors (`npm run lint` pass)
- [ ] Không có lỗi runtime trên môi trường dev

### Kiểm thử
- [ ] Happy path đã được test thủ công
- [ ] Edge cases trong phần Ghi chú đã được kiểm tra

### Tài liệu
- [ ] Trạng thái Story trong `docs/requirements/README.md` cập nhật thành `Done`
- [ ] Nếu có thay đổi flow: cập nhật file tương ứng trong `docs/flows/`
