# NHÂN SỰ DỰ ÁN (MANPOWER)
# Phần mềm Quản lý Coworking Space — Cobi

> **Dự án**: Hệ thống quản lý vận hành Coworking Space  
> **Khách hàng**: Cobi  
> **Ngày lập**: 18/04/2026  
> **Phiên bản**: 1.0

---

## 1. Tổng quan nhân sự

| Phase | Thời gian | Số người | Nền tảng |
|-------|-----------|----------|----------|
| **Phase 1** — Vận hành cốt lõi | 5 tháng | **6 người** | 🖥️ Web App |
| **Phase 2** — Mở rộng & Mobile | 3 tháng | **4 người** | 📱 Mobile + Web |
| **Phase 3** — Nâng cao & Hoàn thiện | 2 tháng | **2.5 người** | 🖥️ Web App |

---

## 2. Phase 1: Vận hành cốt lõi (6 người — 5 tháng)

### Đội ngũ

| # | Vai trò | SL | Thời gian | Nhiệm vụ chính |
|---|---------|-----|-----------|----------------|
| 1 | **Project Manager** | 1 | Full-time 5 tháng | Quản lý dự án, giao tiếp Cobi, tracking tiến độ, Scrum Master |
| 2 | **Business Analyst** | 0.5 | Part-time 5 tháng | Chi tiết hóa yêu cầu, viết specs, hỗ trợ UAT |
| 3 | **Backend Developer (Senior)** | 1 | Full-time 5 tháng | Thiết kế DB (40+ entities), API architecture, tích hợp payment gateway |
| 4 | **Backend Developer (Mid)** | 1 | Full-time 5 tháng | Phát triển API, business logic, unit tests |
| 5 | **Frontend Developer (Senior)** | 1 | Full-time 5 tháng | Hoàn thiện UI, tích hợp API thật (prototype đã 95% sẵn sàng) |
| 6 | **QA/Tester** | 1 | Full-time 5 tháng | Test plan, manual + automation testing, regression |
| 7 | **DevOps** | 0.5 | Part-time 5 tháng | CI/CD, Docker, monitoring, infrastructure |

### Biểu đồ nhân sự Phase 1

```
Vai trò              T1    T2    T3    T4    T5
──────────────────   ────  ────  ────  ────  ────
Project Manager      ████  ████  ████  ████  ████  (100%)
Business Analyst     ██──  ██──  ────  ────  ██──  (50%, tập trung đầu + UAT)
Backend Sr. Dev      ████  ████  ████  ████  ████  (100%)
Backend Mid Dev      ████  ████  ████  ████  ████  (100%)
Frontend Sr. Dev     ████  ████  ████  ████  ████  (100%)
QA/Tester            ──██  ████  ████  ████  ████  (90%, bắt đầu từ T1.5)
DevOps               ████  ██──  ──██  ──██  ────  (50%, tập trung đầu)
```

### Phân công theo Sprint

| Sprint | Tuần | Backend Sr. | Backend Mid | Frontend Sr. | QA |
|--------|------|-------------|-------------|--------------|-----|
| S0 Kickoff | 1-2 | DB Design, API conventions | Setup project, seed data | FE setup API layer | Test plan |
| S1-2 Foundation | 3-6 | Auth API, RBAC | Property API (CRUD) | Tích hợp Auth + Property | Test Auth flows |
| S3-4 Customer | 7-10 | Customer API (3 types) | Pricing engine | Tích hợp KH + Bảng giá | Test Customer + Pricing |
| S5-7 Booking | 11-16 | Booking + Contract API | Payment integration | Tích hợp Booking + HĐ + TT | Test E2E flows |
| S8-9 Support | 17-18 | Dashboard APIs | Credit + Inventory | Dashboard + Portal | Regression testing |
| S10 UAT | 19-20 | Bug fix, performance | Bug fix, migration | Bug fix, polish | UAT coordination |

---

## 3. Phase 2: Mở rộng & Mobile (4 người — 3 tháng)

### Đội ngũ

| # | Vai trò | SL | Thời gian | Nhiệm vụ chính |
|---|---------|-----|-----------|----------------|
| 1 | **Project Manager** | 1 | Full-time 3 tháng | Quản lý dự án, tiếp tục giao tiếp Cobi |
| 2 | **Backend Developer (Fullstack)** | 1 | Full-time 3 tháng | API cho mobile + web modules mới (CRM, Events) |
| 3 | **Mobile Developer** | 1 | Full-time 3 tháng | React Native / Flutter — app khách thuê iOS & Android |
| 4 | **QA/Tester** | 1 | Full-time 3 tháng | Test web + mobile app, regression |

### Biểu đồ nhân sự Phase 2

```
Vai trò              T6    T7    T8
──────────────────   ────  ────  ────
Project Manager      ████  ████  ████  (100%)
Backend Fullstack    ████  ████  ████  (100%)
Mobile Developer     ████  ████  ████  (100%)
QA/Tester            ████  ████  ████  (100%)
```

> 📱 **Mobile App chỉ dành cho khách thuê**. Admin/nhân viên sử dụng Web App.

### Phân công

| Sprint | Backend Fullstack | Mobile Developer | QA |
|--------|-------------------|------------------|-----|
| S11-12 | Mobile API endpoints | App skeleton, Auth, Booking UI | Test mobile flows |
| S13-14 | CRM + Access Control API | Payment, QR check-in, Push | Test CRM + mobile |
| S15-16 | Events + Feedback API | Polish, submit stores | UAT mobile + web |

---

## 4. Phase 3: Nâng cao & Hoàn thiện (2.5 người — 2 tháng)

### Đội ngũ

| # | Vai trò | SL | Thời gian | Nhiệm vụ chính |
|---|---------|-----|-----------|----------------|
| 1 | **Backend Developer** | 1 | Full-time 2 tháng | Báo cáo nâng cao, Staff API, Portal API |
| 2 | **Frontend Developer** | 1 | Full-time 2 tháng | Reports UI, Staff UI, Portal, i18n polish |
| 3 | **QA/Tester** | 0.5 | Part-time 2 tháng | Regression, final UAT |

### Biểu đồ nhân sự Phase 3

```
Vai trò              T9    T10
──────────────────   ────  ────
Backend Developer    ████  ████  (100%)
Frontend Developer   ████  ████  (100%)
QA/Tester            ██──  ████  (Part-time → Full-time UAT)
```

---

## 5. Tổng hợp nhân sự toàn dự án

### 5.1 Headcount theo Phase

```
Người
  7 ┤
  6 ┤  ██████████████████████████
  5 ┤  ██████████████████████████
  4 ┤  ██████████████████████████  ████████████████
  3 ┤  ██████████████████████████  ████████████████
  2 ┤  ██████████████████████████  ████████████████  ████████████
  1 ┤  ██████████████████████████  ████████████████  ████████████
  0 ┼──────────────────────────────────────────────────────────────
     T1   T2   T3   T4   T5    T6   T7   T8    T9   T10
     ├────── Phase 1 ──────┤   ├── Phase 2 ──┤  ├─ Phase 3─┤
     │      6 người        │   │   4 người   │  │2.5 người │
```

### 5.2 Tổng man-months

| Vai trò | Phase 1 | Phase 2 | Phase 3 | **Tổng (man-months)** |
|---------|---------|---------|---------|----------------------|
| Project Manager | 5 | 3 | — | **8** |
| Business Analyst | 2.5 | — | — | **2.5** |
| Backend Sr. Developer | 5 | — | — | **5** |
| Backend Mid/Fullstack | 5 | 3 | 2 | **10** |
| Frontend Sr. Developer | 5 | — | 2 | **7** |
| Mobile Developer | — | 3 | — | **3** |
| QA/Tester | 5 | 3 | 1 | **9** |
| DevOps | 2.5 | — | — | **2.5** |
| **TỔNG** | **30** | **12** | **5** | **47 man-months** |

---

## 6. Kỹ năng yêu cầu

| Vai trò | Kỹ năng chính | Kinh nghiệm |
|---------|---------------|-------------|
| **Project Manager** | Agile/Scrum, stakeholder management, IT project delivery | 3+ năm PM |
| **Business Analyst** | Requirement analysis, wireframe, acceptance criteria | 2+ năm BA |
| **Backend Sr. Developer** | NestJS, PostgreSQL, Redis, Payment gateway (VNPay, MoMo) | 4+ năm Backend |
| **Backend Mid Developer** | NestJS/Node.js, TypeORM/Prisma, REST API | 2+ năm Backend |
| **Frontend Sr. Developer** | React 19, TypeScript, TanStack Query, Tailwind CSS | 3+ năm Frontend |
| **Mobile Developer** | React Native hoặc Flutter, mobile payment, push notification | 2+ năm Mobile |
| **QA/Tester** | Manual + automation testing, API testing, mobile testing | 2+ năm QA |
| **DevOps** | Docker, CI/CD (GitHub Actions), AWS/VPS, monitoring | 2+ năm DevOps |

---

## 7. Điểm mạnh đội ngũ

| Lợi thế | Chi tiết |
|---------|---------|
| 🎯 **Prototype sẵn sàng** | Frontend 95% hoàn thành → Frontend Sr. tập trung tích hợp API thay vì xây từ đầu |
| 🔧 **Fullstack capability** | Backend Mid linh hoạt hỗ trợ cả frontend khi cần |
| 📱 **Mobile chuyên biệt** | Mobile Dev chuyên React Native/Flutter, không chia sẻ thời gian cho web |
| 🧪 **QA từ sớm** | QA tham gia từ Sprint 1, viết test plan song song phát triển |
| 📋 **Demo thường xuyên** | PM tổ chức demo 2 tuần/lần, Cobi luôn nắm tiến độ |

---

## 8. Cam kết chất lượng

- **Code Review**: Mọi code đều được review bởi Senior trước khi merge
- **Automation Testing**: Viết unit test + integration test cho API
- **QA Testing**: Manual test + regression test mỗi sprint
- **UAT**: Cobi kiểm thử nghiệm thu trước mỗi đợt go-live
- **Bảo hành**: 6 tháng sửa lỗi miễn phí sau go-live mỗi Phase
