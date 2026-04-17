# Coworking Space Management - Product Roadmap

## Tổng quan

Roadmap phát triển hệ thống quản lý Coworking Space cho **Cobi** (2 tòa nhà) trong **9-10 tháng**, chia làm 3 phases:

- **Phase 1** (4.5-5 tháng): Core Operations - Ra mắt đầy đủ nghiệp vụ vận hành + Customer self-service booking
- **Phase 2** (3 tháng): Growth & Marketing - Tăng trưởng và chất lượng
- **Phase 3** (2 tháng): Advanced Features - Tính năng nâng cao và tối ưu

**Timeline**: Tháng 5/2026 - mid Tháng 2/2027

---

## Phase 1 – Core Operations (4.5-5 tháng)
**Duration**: Tháng 5 - mid Tháng 9/2026 (18-20 tuần)  
**Goal**: Launch hệ thống với đầy đủ nghiệp vụ vận hành từ A-Z + Customer self-service booking

### Epics (9)

| ID | Epic | Priority | Features | Mô tả |
|----|------|----------|----------|--------|
| EP-01 | Authentication & Authorization | Must have | 6 | Login, roles (6 roles), JWT, password reset |
| EP-02 | Property Management | Must have | 5 | Buildings, floors, spaces (8 types), pricing |
| EP-03 | Customer Management **Extended** | Must have | 5 | Profiles, **company + employee management**, segmentation |
| EP-04 | Booking & Reservation **Extended** | Must have | 9 | Calendar, booking flow, **customer self-service, approval, deposit** |
| EP-05 | Contract Management **Extended** | Must have | 6 | Contracts, **template management**, T&C, e-contract acceptance |
| EP-06 | Payment & Invoicing **Extended** | Must have | 13 | VNPay/MoMo/ZaloPay, invoice generation, **deposit payments, credit system** |
| EP-07 | Service Management | Must have | 4 | Điện/nước/internet, usage tracking, billing |
| EP-08 | Inventory & Asset Management | Must have | 4 | Asset tracking, serial numbers, maintenance logs |
| EP-11 | Role-based Dashboards ⭐ | Must have | 6 | 6 dashboards cho 6 roles, KPIs, charts |
| EP-15 | Customer Portal **Partial** | Must have | 3 | Customer login, book online, view bookings (Phase 1 only) |
| EP-17 | Pricing & Promotions Management | Must have | 8 | Space pricing, add-on services pricing, khuyến mãi, voucher |

**Total Features**: 66 features  
**Note**: EP-03, EP-04, EP-05, EP-06 extended với customer self-service booking flow + template management + company employee management + **prepaid credit system**. EP-15 partial implementation (3/7 features) để support customer booking. EP-17 tách từ F-11 của EP-02, mở rộng thêm quản lý giá dịch vụ và chương trình khuyến mãi.

### Deliverables
- [x] Login system với 6 roles
- [x] CRUD đầy đủ: Properties, Customers, Bookings, Contracts
- [ ] **Contract & T&C template management** (placeholders system, version control)
- [x] Payment integration (VNPay, MoMo, ZaloPay)
- [x] Automated invoicing
- [x] Service billing (điện, nước, internet)
- [x] Asset tracking với serial numbers
- [x] 6 dashboards (Investor, Admin, Manager, Maintenance, Accounting, Sales)
- [ ] **Customer self-service booking portal** (login, book space, view bookings)
- [ ] Booking approval workflow (instant vs request-to-book)
- [ ] Deposit payment integration (30%, 50%, 100% configurable)
- [ ] **Prepaid credit system** (1 credit = 1,000 VND, individual + company accounts)
- [ ] **Service credit pricing** (Hot desk, Meeting room, Printing, Parking, Coffee...)
- [ ] **Employee-level credit tracking** (company accounts track which employee uses credits)

### MVP Definition of Done
- ✅ Admin có thể tạo buildings, floors, spaces với pricing
- ✅ Manager có thể add customers, create bookings, contracts
- ✅ **Customer có thể self-book spaces online, pay deposit, view bookings**
- ✅ **Manager có thể approve/reject booking requests (request-to-book mode)**
- ✅ Kế toán có thể generate invoices, record payments (bao gồm deposit invoices)
- ✅ Bảo trì có thể log maintenance, track assets
- ✅ Sales có thể view pipeline (chưa có CRM, sẽ track manually)
- ✅ Nhà đầu tư có thể xem revenue, occupancy rate dashboards
- ✅ System hoạt động end-to-end: từ booking → contract → payment (cả customer và staff)

---

## Phase 2 – Growth & Marketing (3 tháng)
**Duration**: Tháng 9 - Tháng 11/2026  
**Goal**: Tăng trưởng customers, cải thiện chất lượng dịch vụ

### Epics (4)

| ID | Epic | Priority | Features | Mô tả |
|----|------|----------|----------|--------|
| EP-12 | Lead Management & CRM | Should have | 5 | Lead pipeline, campaigns, conversions |
| EP-13 | Access Control & Visitor Mgmt | Should have | 4 | Access cards, visitor logs, QR/RFID check-in |
| EP-14 | Community & Events Management | Nice to have | 4 | Workshops, networking events, registrations |
| EP-16 | Feedback & Quality Management | Should have | 4 | NPS surveys, ratings, issue reports |

**Total Features**: 17 features

### Deliverables
- [ ] Lead capture từ website, CRM pipeline
- [ ] Email campaigns cho lead nurturing
- [ ] Access control system (QR codes, RFID cards)
- [ ] Visitor management
- [ ] Community events (workshops, networking)
- [ ] NPS surveys và feedback collection
- [ ] Issue reporting & resolution tracking

### Key Metrics
- **Lead Conversion Rate**: Target 20%
- **NPS Score**: Target >50
- **Event Attendance**: 80% of registered attendees

---

## Phase 3 – Advanced Features (2 tháng)
**Duration**: Tháng 12/2026 - Tháng 1/2027  
**Goal**: Tính năng nâng cao, self-service, i18n

### Epics (4 + 1 NFR)

| ID | Epic | Priority | Features | Mô tả |
|----|------|----------|----------|--------|
| EP-09 | Staff & Permission Management | Should have | 4 | Staff accounts, permission matrix, activity logs |
| EP-10 | Reporting & Analytics | Should have | 4 | Revenue reports, occupancy analytics, export PDF/Excel |
| EP-15 | Customer Self-Service Portal **(Full)** | Nice to have | 7 | **Phase 1 (login, book, view)** + Phase 3 (pay, support, profile) |
| NFR-05 | Internationalization (i18n) | Nice to have | - | Vietnamese, English, Korean |

**Total Features**: 15 features  
**Note**: EP-15 Phase 1 features (F-121, F-125, F-122A) đã implemented trong Phase 1. Phase 3 adds remaining 4 features.

### Deliverables
- [ ] Staff management với permission matrix
- [ ] Activity logs cho audit
- [ ] Advanced reports (revenue, occupancy, CLV)
- [ ] Customer self-service portal **(Phase 3 enhancements)**
  - View & pay invoices online
  - Book meeting rooms (advanced features)
  - Submit support tickets
  - Manage profile & preferences
- [ ] Multi-language support (Vietnamese, English, Korean)

### Key Metrics
- **Self-service Adoption**: 40% of customers use portal
- **Report Export**: 20+ monthly exports
- **Multi-language**: 10% of customers use English/Korean

---

## Dependencies Map

```
EP-01 (Auth) ──┬─→ EP-02 (Property)
               ├─→ EP-03 (Customer)
               ├─→ EP-09 (Staff)
               └─→ EP-11 (Dashboards)

EP-02 (Property) ──┬─→ EP-04 (Booking)
                   ├─→ EP-07 (Service)
                   ├─→ EP-08 (Asset)
                   └─→ EP-14 (Events)

EP-03 (Customer) ──┬─→ EP-04 (Booking)
                   ├─→ EP-05 (Contract)
                   ├─→ EP-12 (CRM/Leads)
                   ├─→ EP-13 (Access Control)
                   ├─→ EP-15 (Customer Portal)
                   └─→ EP-16 (Feedback)

EP-04 (Booking) ──→ EP-05 (Contract) ──→ EP-06 (Payment)

EP-06 (Payment) ──→ EP-11 (Dashboards)

EP-07 (Service) ──→ EP-06 (Payment)

EP-08 (Asset) ──→ EP-16 (Feedback - issue reports link to assets)

EP-12 (CRM) ──→ EP-11 (Sales Dashboard - funnel chart)

All Epics ──→ EP-10 (Reporting)
All Epics ──→ EP-11 (Dashboards)
```

---

## Technical Milestones

### Milestone 1: Foundation (Month 1)
- [x] Project setup (Vite, React, TypeScript, Tailwind v4)
- [x] Authentication system (JWT, roles)
- [x] Database schema design
- [x] API structure (REST endpoints)

### Milestone 2: Core CRUD (Month 2)
- [ ] Property, Customer, Booking CRUD
- [ ] Basic dashboards (Manager, Admin)

### Milestone 3: Financial System (Month 3)
- [ ] Contract management
- [ ] Payment integration (VNPay, MoMo, ZaloPay)
- [ ] Invoice generation
- [ ] Service billing

### Milestone 4: Operations Complete (Month 4-5)
- [ ] Asset management
- [ ] All 6 dashboards completed
- [ ] **Customer self-service booking portal (login, book, view)**
- [ ] **Booking approval workflow**
- [ ] **Deposit payment integration**
- [ ] Phase 1 UAT & Bug fixes
- [ ] **Phase 1 Launch** 🚀

### Milestone 5: Growth Features (Month 5-7)
- [ ] CRM system
- [ ] Access control
- [ ] Community events
- [ ] Feedback system
- [ ] **Phase 2 Launch** 🚀

### Milestone 6: Advanced & Polish (Month 8-9)
- [ ] Staff management
- [ ] Advanced reporting
- [ ] Customer portal
- [ ] i18n (3 languages)
- [ ] **Phase 3 Launch** 🚀

---

## Resource Allocation

### Phase 1 (4.5-5 months)
- **Team**: 1 BA, 2 Frontend Devs, 1 Backend Dev, 1 QA
- **Focus**: Core features + customer self-service booking, stable foundation
- **Note**: +1 frontend week cho customer portal UI

### Phase 2 (3 months)
- **Team**: 1 BA, 1 Frontend Dev, 1 Backend Dev, 1 QA, 1 Marketing (for CRM)
- **Focus**: Growth features, integrations

### Phase 3 (2 months)
- **Team**: 1 Frontend Dev, 1 Backend Dev, 1 QA, 1 i18n specialist
- **Focus**: Advanced features, polish, i18n

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment gateway integration delay | High | Start integration early in Month 3 |
| Scope creep in Phase 1 | High | Strict "basic features only" rule |
| Building infrastructure not ready for RFID | Medium | Plan manual check-in fallback |
| i18n delays Phase 3 | Low | Use i18n from start (even with VN only) |

---

## Success Criteria

### Phase 1
- ✅ All 9 Epics completed
- ✅ 100% basic features implemented
- ✅ <10 critical bugs in UAT
- ✅ System handles 20 concurrent users
- ✅ <2s page load time

### Phase 2
- ✅ Lead conversion rate >15%
- ✅ NPS score >45
- ✅ Access control system operational in both buildings

### Phase 3
- ✅ 30% customers using self-service portal
- ✅ Multi-language support complete
- ✅ All reports exportable to PDF/Excel

---

## Post-Launch (Month 10+)

Future enhancements (not in current roadmap):
- Mobile app (iOS/Android)
- AI-powered pricing optimization
- IoT integration (smart sensors, auto meter reading)
- Blockchain-based contract signatures
- Multi-tenant architecture (expand beyond Cobi)

---

**Last Updated**: 16/04/2026  
**Document Owner**: BA Team
