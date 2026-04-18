# Cobi Coworking Space – Kế hoạch dự án, Báo giá & Lộ trình

> **Khách hàng**: Cobi  
> **Dự án**: Phần mềm quản lý Coworking Space  
> **Ngày lập**: 18/04/2026  
> **Phiên bản**: 1.0

---

## 1. Tổng quan dự án

Lập kế hoạch báo giá, tổ chức nhân sự, timeline và roadmap cho dự án phần mềm quản lý Coworking Space cho khách hàng Cobi. Frontend prototype đã hoàn thành ~95% (45 trang, mock data, i18n 3 ngôn ngữ). Cần xây dựng Backend API, tích hợp payment gateway, testing, deployment. Dự án chia 3 phase, tổng 9-10 tháng.

### 1.1 Phạm vi

- **17 Epics**, **98+ features**
- **6 vai trò** người dùng: Admin, Manager, Sale, Accountant, Maintenance, Investor
- **8 loại không gian**: Hot Desk, Dedicated Desk, Private Office, Open Space, Meeting Room, Conference Room, Training Room, Event Space
- **3 ngôn ngữ**: Tiếng Việt, English, Korean
- **Tích hợp thanh toán**: VNPay, MoMo, ZaloPay + Cash/Bank transfer + Credit system

### 1.2 AI-Assisted Development

Dự án áp dụng **AI-assisted development** (GitHub Copilot, Claude, v.v.) để tăng năng suất 30-40%:

- 🤖 **Code generation**: AI sinh code boilerplate, CRUD, API endpoints → giảm headcount developer
- 📝 **Specs & Docs**: AI hỗ trợ viết specs, acceptance criteria → BA part-time thay vì full-time
- 🧪 **Testing**: AI sinh test cases, edge cases → QA hiệu quả hơn
- 🌍 **i18n Translation**: AI dịch chính xác 3 ngôn ngữ → không cần translator riêng
- 📋 **Code review**: AI phát hiện bugs, security issues sớm → giảm rework

> **Kết quả**: Giảm ~20-25% headcount so với phương pháp truyền thống, tiết kiệm chi phí đáng kể mà vẫn đảm bảo chất lượng.

### 1.3 Trạng thái hiện tại (Frontend Prototype)

| Đã hoàn thành | Chưa có |
|----------------|---------|
| ✅ 45 trang UI hoàn chỉnh (mock data) | ❌ Backend API (0%) |
| ✅ 6 dashboard theo vai trò | ❌ Database schema (40+ entities) |
| ✅ i18n 3 ngôn ngữ (14 namespace) | ❌ Payment gateway tích hợp thật |
| ✅ React 19 + TypeScript + Vite 8 + Tailwind v4 | ❌ CI/CD, staging, production |
| ✅ TanStack Query + Zustand + React Hook Form | ❌ Real-time (WebSocket) |

---

## 2. Lộ trình 3 Phase

### Phase 1: Core Operations (5 tháng – 20 tuần) — BẮT BUỘC ⭐

> **Nền tảng**: 🖥️ **Phiên bản Web** (Responsive – Desktop & Mobile browser)

**Mục tiêu**: Vận hành cơ bản hàng ngày + khách hàng tự đặt chỗ online (Web app)

#### 2.1.1 Danh sách Epics

| Epic | Features | Độ phức tạp | Mô tả |
|------|----------|-------------|-------|
| EP-01 Auth | 6 | ⭐ | JWT, 6 roles, password reset + OTP |
| EP-02 Property | 5 | ⭐ | Buildings, floors, 8 space types |
| EP-03 Customer | 5 | ⭐⭐ | 3 loại KH (cá nhân, công ty, TV công ty) + credit wallet |
| EP-04 Booking | 9+ | ⭐⭐⭐ | Calendar, conflict detection, instant/request-to-book, deposit |
| EP-05 Contract | 6+ | ⭐⭐⭐ | Template + placeholder, e-contract, terms acceptance |
| EP-06 Payment | 13 | ⭐⭐⭐ | VNPay/MoMo/ZaloPay, deposit flow, partial payment |
| EP-07 Credit | 4 | ⭐⭐ | Prepaid 1 credit = 1,000 VNĐ, bonus campaigns |
| EP-08 Inventory | 4 | ⭐ | Asset tracking, serial numbers, maintenance log |
| EP-11 Dashboard | 6 | ⭐⭐ | 6 role-based dashboards với KPI + charts |
| EP-15 Portal (partial) | 3 | ⭐⭐ | Customer login, self-booking, view bookings |
| EP-17 Pricing | 8+ | ⭐⭐⭐ | Pricing rules, add-on services, promotions, vouchers |
| **Tổng** | **~69** | | |

**Critical Path**: EP-01 → EP-02 → EP-04 → EP-05 → EP-06 → EP-11

#### 2.1.2 Timeline Phase 1

| Sprint | Tuần | Epics | Nội dung chính |
|--------|------|-------|---------------|
| **S0** Kickoff & Setup | 1-2 | — | DB schema design (40+ entities), Backend project setup, CI/CD, staging environment, API conventions |
| **S1-2** Foundation | 3-6 | EP-01, EP-02 | Auth API (JWT, refresh token, RBAC), Property API (Building/Floor/Space CRUD), Frontend tích hợp API thật |
| **S3-4** Customer & Pricing | 7-10 | EP-03, EP-17 | Customer API (3 types, credit wallet), Pricing engine (rules, add-ons, promotions, vouchers) |
| **S5-7** Core Business | 11-16 | EP-04, EP-05, EP-06 | Booking API (conflict, instant/request), Contract API (templates, e-sign), Invoice & Payment API (auto-generate, deposit, VNPay/MoMo/ZaloPay) |
| **S8-9** Supporting | 17-18 | EP-07, EP-08, EP-11, EP-15 | Credit system, Inventory/Asset, 6 Dashboard APIs, Customer portal |
| **S10** UAT & Go-live | 19-20 | — | UAT, bug fix, performance tuning, data migration, production deployment, training |

#### 2.1.3 Nhân sự Phase 1 (6 người) — AI-optimized

| Vai trò | SL | Nhiệm vụ chính |
|---------|-----|----------------|
| Project Manager | 1 | Quản lý dự án, giao tiếp Cobi, tracking tiến độ |
| Business Analyst (part-time) | 0.5 | Chi tiết specs (AI hỗ trợ), UAT support |
| Backend Developer (Senior) | 1 | Thiết kế DB, API architecture, payment gateway integration |
| Backend Developer (Mid) | 1 | API development, business logic (AI-assisted) |
| Frontend Developer (Senior) | 1 | Hoàn thiện UI, tích hợp API thật (AI accelerated – FE đã 95%) |
| QA/Tester | 1 | Test plan, manual + automation testing (AI sinh test cases) |
| DevOps (Part-time) | 0.5 | CI/CD, Docker, monitoring setup |

> 💡 So với truyền thống (7.5 người): Bỏ FE Mid Dev (FE 95% done, Sr + AI đủ), BA giảm part-time (AI hỗ trợ specs).

#### 2.1.4 Definition of Done – Phase 1

- ✅ Admin tạo buildings/floors/spaces với pricing
- ✅ Manager thêm khách hàng, tạo booking/contract
- ✅ Khách hàng tự đặt chỗ online, thanh toán deposit, nhận xác nhận
- ✅ Manager duyệt/từ chối request-to-book (nếu cấu hình)
- ✅ Accountant tạo hóa đơn, ghi nhận thanh toán (bao gồm deposit)
- ✅ Maintenance ghi nhận bảo trì tài sản
- ✅ Cả 6 dashboards hoạt động với dữ liệu thật
- ✅ E2E flow: booking → contract → payment hoạt động hoàn chỉnh

---

### Phase 2: Growth & Marketing (3 tháng – 12 tuần) — NÊN CÓ

> **Nền tảng**: 📱 **Phiên bản Mobile App** (React Native / Flutter – iOS & Android)

**Mục tiêu**: Quản lý lead, kiểm soát ra vào, sự kiện cộng đồng, phản hồi + **Ứng dụng di động cho khách thuê**

#### 2.2.1 Danh sách Epics

| Epic | Features | Độ phức tạp | Mô tả |
|------|----------|-------------|-------|
| EP-12 CRM | 5 | ⭐⭐ | Lead capture, Kanban pipeline, conversion tracking |
| EP-13 Access Control | 4 | ⭐ | QR/RFID access cards, visitor management, check-in |
| EP-14 Events | 4 | ⭐ | Event creation, registration, attendance tracking |
| EP-16 Feedback | 4 | ⭐ | NPS surveys, ratings, issue reporting |
| **Mobile App** | 6+ | ⭐⭐⭐ | App khách thuê (booking, payment, QR check-in, xem hợp đồng/hóa đơn, push notification) |
| **Tổng** | **25+** | | |

#### 2.2.2 Nhân sự Phase 2 (4 người) — AI-optimized

| Vai trò | Số lượng | Ghi chú |
|---------|----------|--------|
| Project Manager | 1 | PM + AI thay BA |
| Backend Developer (Fullstack) | 1 | API mobile + web features CRM/Events (AI-assisted) |
| Mobile Developer | 1 | React Native / Flutter – app khách thuê |
| QA/Tester | 1 | Test web + mobile app (AI sinh test cases) |

> 💡 So với truyền thống (5.5 người): Bỏ BA (PM + AI covers), Backend fullstack (AI hỗ trợ cả web features CRM/Events).

---

### Phase 3: Advanced & Polish (2 tháng – 8 tuần) — CÓ THÌ TỐT

**Mục tiêu**: Quản lý nhân sự, báo cáo nâng cao, customer portal đầy đủ, đa ngôn ngữ

#### 2.3.1 Danh sách Epics

| Epic | Features | Độ phức tạp | Mô tả |
|------|----------|-------------|-------|
| EP-09 Staff Mgmt | 4 | ⭐ | Staff CRUD, permissions, activity logs |
| EP-10 Reporting | 7 | ⭐⭐⭐ | Revenue, occupancy, customer CLV, PDF/Excel export |
| EP-15 Portal (full) | 4 | ⭐⭐ | View invoices, pay online, support tickets, profile |
| NFR-05 i18n Polish | — | ⭐ | Hoàn thiện Vietnamese + English + Korean |
| **Tổng** | **15** | | |

#### 2.3.2 Nhân sự Phase 3 (2.5 người) — AI-optimized

| Vai trò | Số lượng | Ghi chú |
|---------|----------|--------|
| Backend Developer | 1 | |
| Frontend Developer | 1 | |
| QA/Tester (part-time) | 0.5 | AI-assisted testing |

> 💡 So với truyền thống (4 người): Bỏ i18n Translator (AI dịch 3 ngôn ngữ), QA part-time.

---

## 3. Báo giá

### 3.1 Mức lương tham khảo (VNĐ/tháng, gross) — AI-optimized

| Vai trò | Mức lương | Ghi chú |
|---------|-----------|---------|
| Project Manager | 35 – 45M | Full-time Phase 1-2 |
| Business Analyst | 25 – 35M | Part-time Phase 1 only (AI hỗ trợ specs) |
| Backend Sr. Developer | 40 – 55M | Full-time Phase 1 |
| Backend Mid Developer | 25 – 35M | Phase 1 + Phase 2 (fullstack + AI) + Phase 3 |
| Frontend Sr. Developer | 35 – 50M | Full-time Phase 1 (AI accelerated) |
| Mobile Developer | 30 – 45M | Full-time Phase 2 – app khách thuê |
| QA/Tester | 18 – 25M | Full-time Phase 1-2, part-time Phase 3 |
| DevOps (part-time) | 15 – 20M | Part-time Phase 1 |

### 3.2 Chi phí nhân sự (AI-optimized)

| Phase | Thời gian | Headcount | Nền tảng | Chi phí (VNĐ) | So với truyền thống |
|-------|-----------|-----------|-----------|---------------|---------------------|
| Phase 1 | 5 tháng | 6 người | 🖥️ Web | 870M – 1.20 tỷ | ~~7.5 người~~ · ~~1.05–1.45 tỷ~~ |
| Phase 2 | 3 tháng | 4 người | 📱 Mobile (khách thuê) + Web | 330 – 450M | ~~5.5 người~~ · ~~420–600M~~ |
| Phase 3 | 2 tháng | 2.5 người | 🖥️ Web | 110 – 160M | ~~4 người~~ · ~~200–280M~~ |
| **Tổng nhân sự** | **10 tháng** | | | **1.31 – 1.81 tỷ** | **Tiết kiệm ~360–520M** |

### 3.3 Chi phí khác

| Hạng mục | Chi phí/tháng | Tổng 10 tháng |
|----------|---------------|---------------|
| Cloud hosting (staging + prod) | 5 – 10M | 50 – 100M |
| Payment gateway fees (dev sandbox) | 2 – 5M | 20 – 50M |
| Domain, SSL, email service | 500K | 5M |
| Tool licenses (Jira, Figma...) | 2 – 4M | 20 – 40M |
| **AI tools** (Copilot Business, Claude) | **2 – 4M** | **20 – 40M** |
| Contingency (12%) | — | 160 – 225M |
| **Tổng chi phí khác** | | **275 – 460M** |

### 3.4 TỔNG BÁO GIÁ DỰ ÁN

| Hạng mục | Min (VNĐ) | Max (VNĐ) |
|----------|-----------|----------|
| Nhân sự | 1,310,000,000 | 1,810,000,000 |
| Chi phí khác | 275,000,000 | 460,000,000 |
| **TỔNG CỘNG** | **~1.59 tỷ** | **~2.27 tỷ** |
| *Tương đương USD* | *~$64,000* | *~$91,000* |
| **So với truyền thống** | ~~2.05 tỷ~~ | ~~2.91 tỷ~~ |
| **Tiết kiệm nhờ AI** | **~460M (22%)** | **~640M (22%)** |

> **Ghi chú**: Báo giá đã tối ưu nhờ AI-assisted development. Range (min–max) tùy thuộc mức lương thị trường và kinh nghiệm nhân sự.

---

## 4. Bảo hành & Bảo trì

| Hạng mục | Chi phí |
|----------|---------|
| Bảo hành 6 tháng sau go-live mỗi phase (fix bugs miễn phí) | Included |
| Maintenance hàng tháng (sau bảo hành) | 15 – 25M/tháng |
| Hosting & infrastructure | 5 – 10M/tháng |

---

## 5. Deliverables (Bàn giao)

### Phase 1
1. Source code đầy đủ (Frontend + Backend)
2. Database schema + migration scripts
3. API documentation (Swagger/OpenAPI)
4. User manual cho 6 vai trò
5. Deployment guide
6. 2 buổi training cho nhân viên Cobi

### Phase 2 & 3
1. Updated source code (Web + Mobile)
2. **Mobile App khách thuê** (iOS + Android) – bản build trên App Store & Google Play
3. Updated documentation
4. Release notes
5. Training cho tính năng mới

---

## 6. Tech Stack

### 6.1 Frontend (đã hoàn thành prototype)

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 + React Compiler |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| State | Zustand + TanStack Query v5 |
| Forms | React Hook Form |
| Charts | Recharts v3 |
| Icons | Lucide React |
| i18n | react-i18next |

### 6.2 Backend (đề xuất)

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| Framework | NestJS (TypeScript) | Cùng stack với Frontend, type-safe |
| Database | PostgreSQL | Relational, JSON support, reliable |
| ORM | Prisma | Type-safe, auto migration |
| Cache | Redis | Session, rate limiting, cache |
| Queue | Bull (Redis-based) | Email, invoice generation, cronjobs |
| Storage | AWS S3 / MinIO | File uploads, contracts PDF |
| Email | SendGrid / SES | OTP, notifications, invoices |
| Payment | VNPay + MoMo + ZaloPay SDK | Theo yêu cầu |
| Deployment | Docker + AWS / VPS | Scalable |
| CI/CD | GitHub Actions | Tích hợp repo |
| Monitoring | Sentry + Grafana | Error tracking + metrics |

### 6.3 Mobile App (Phase 2)

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| Framework | React Native / Flutter | Cross-platform iOS + Android |
| Navigation | React Navigation / Go Router | Native-feel routing |
| State | Zustand / Riverpod | Nhất quán với web (nếu React Native) |
| Push Notification | Firebase Cloud Messaging | Thông báo booking, payment |
| QR Scanner | react-native-camera / mobile_scanner | Check-in |
| Biometric | react-native-biometrics / local_auth | Đăng nhập vân tay / Face ID |
| App Distribution | App Store + Google Play | Production release |

> **Lưu ý**: Mobile App chỉ dành cho **khách thuê** (tenant). Admin/nhân viên quản lý qua Web App.

---

## 7. Quản lý rủi ro

| Rủi ro | Xác suất | Tác động | Biện pháp giảm thiểu |
|--------|----------|----------|---------------------|
| Yêu cầu thay đổi giữa chừng | Cao | Trung bình | Change request process, buffer 15% contingency |
| Tích hợp payment gateway phức tạp | Trung bình | Cao | Sandbox testing sớm từ Sprint 3, dedicated Sprint 5-7 |
| Thiếu nhân sự giữa dự án | Trung bình | Cao | Cross-training, documentation đầy đủ |
| Performance với data lớn | Thấp | Trung bình | Load testing Sprint 9, indexing strategy |
| Khách hàng UAT chậm | Cao | Trung bình | Fix UAT calendar từ Sprint 0, weekly demo |

---

## 8. Quy trình làm việc

- **Sprint**: 2 tuần/sprint
- **Demo**: Cuối mỗi sprint (thứ 6)
- **Standup**: Daily 15 phút (online)
- **Sprint Review**: Demo cho Cobi mỗi 2 tuần
- **Sprint Retrospective**: Nội bộ team sau mỗi sprint
- **Change Request**: Có quy trình CR riêng, đánh giá impact trước khi commit
- **Definition of Done**: Code review ✅ + Unit test ✅ + QA pass ✅ + No critical bugs ✅

---

## 9. Sơ đồ phụ thuộc Epics

```
                    EP-01 (Auth)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      EP-02         EP-03            EP-09
    (Property)    (Customer)       (Staff)
        │                │
        ├─► EP-04 ◄──────┘         EP-11
        │  (Booking)      ◄──┐  (Dashboards)
        │      │             │       ▲
        ├─► EP-05 ──────────►├── EP-06
        │  (Contract)        │  (Payment)
        │                    │
        ├─► EP-07 ───────────┘
        │  (Credit)    ▲
        │              │
        ├─► EP-17      ├── EP-10
        │  (Pricing)   │  (Reports)
        │              │
        └─► EP-08      EP-12 ─► EP-11
           (Assets)    (CRM)

                 EP-13, EP-14, EP-15, EP-16
                      (Phase 2-3)
```

---

## 10. Liên hệ

| Vai trò | Bên |
|---------|-----|
| Product Owner | Cobi |
| Project Manager | Đội phát triển |
| Technical Lead | Backend Sr. Developer |

---

*Tài liệu này được tạo dựa trên phân tích toàn bộ 17 epics, 98+ features, 5 NFRs và trạng thái frontend prototype hiện tại.*
