# Requirements Analysis – Coworking Space Management System

## 1. Executive Summary

### 1.1 Project Overview
Hệ thống **Admin Dashboard SPA** quản lý toàn diện coworking space cho đối tác **Cobi** (2 tòa nhà hoặc sau này có thể mở rộng). Hỗ trợ 6 user roles, 16 Epics, triển khai trong **9-10 tháng** qua 3 phases.

### 1.2 Business Objectives
1. **Digitize operations**: Thay thế quy trình manual bằng hệ thống tự động
2. **Increase efficiency**: Giảm 50% thời gian xử lý booking, invoicing
3. **Improve visibility**: Real-time dashboards cho stakeholders
4. **Enhance customer experience**: Self-service, online payments, community events
5. **Data-driven decisions**: Analytics, reports, forecasting

### 1.3 Key Stakeholders
- **Nhà đầu tư (Investor)**: Xem ROI, revenue, occupancy rate
- **Admin**: Quản lý users, system, security
- **Manager**: Vận hành hàng ngày (bookings, customers, spaces)
- **Bảo trì (Maintenance)**: Quản lý tài sản, maintenance
- **Kế toán (Accounting)**: Invoicing, payments, AR
- **Sale**: Lead pipeline, conversions, marketing

---

## 2. Scope Analysis

### 2.1 In Scope

**Phase 1 (Must Have):**
- Authentication & role-based access (6 roles)
- Internationalization (Vietnamese, English, Korean)
- Property management (buildings, floors, 8 space types)
- Customer management (profiles, segmentation)
- Booking & reservation (calendar, conflict detection, **customer self-service, approval workflow, instant vs request-to-book**)
- Contract management (lifecycle, auto-renewal)
- Payment integration (Chuyển khoản + **VNPay/MoMo/ZaloPay for deposit payments**)
- Service billing (điện, nước, internet)
- Asset tracking (serial numbers, maintenance logs)
- 6 role-based dashboards với KPIs, charts
- **Customer portal (partial): Login, book space online, view bookings**

**Phase 2 (Should Have):**
- Lead management & CRM (pipeline, campaigns)
- Access control (QR codes, RFID cards, visitor logs)
- Community events (workshops, registrations)
- Feedback & quality management (NPS, ratings, issue reports)

**Phase 3 (Nice to Have):**
- Staff management (permission matrix, activity logs)
- Advanced reporting (revenue, occupancy, CLV)
- Customer self-service portal **(full version)**: View & pay invoices, book advanced features, submit support tickets, manage profile


### 2.2 Out of Scope
- Mobile app (iOS/Android) - Future
- Multi-tenant architecture - Current design is single-tenant for Cobi only
- AI-powered features (pricing optimization, chatbot) - Future
- Blockchain/Web3 - Not applicable
- IoT sensor integration (auto meter reading) - Hardware dependency

---

## 3. User Roles & Permissions

### 3.1 Roles Matrix

| Role | Access Level | Modules | Typical Tasks |
|------|--------------|---------|---------------|
| **Nhà đầu tư** | Read-only (high-level) | Dashboards, Reports | View revenue, ROI, occupancy |
| **Admin** | Full system access | All modules | User management, settings, audit logs |
| **Manager** | Full operations | Properties, Customers, Bookings, Contracts, Events | Daily operations, customer service |
| **Bảo trì** | Assets, Maintenance | Assets, Spaces, Issues | Maintenance logging, asset tracking |
| **Kế toán** | Finance | Invoices, Payments, Reports | Billing, AR, reconciliation |
| **Sale** | CRM, Customers | Leads, Customers, Contracts | Lead nurturing, conversions |

### 3.2 Access Control
- **Authentication**: JWT-based, password policies (min 8 chars, uppercase, number)
- **Authorization**: Role-based access control (RBAC)
- **Session**: 24h expiry, refresh tokens
- **Multi-factor**: Phase 3 (optional)

---

## 4. Functional Requirements

### 4.1 Quy trình nghiệp vụ chính (Core Business Flows)

#### Flow 1: Quy trình Đặt chỗ đến Thanh toán (Staff-assisted Booking)
```
Khách hàng liên hệ tư vấn
→ Sale tạo Lead trong CRM (EP-12)
→ Manager tạo Booking từ Lead
→ Hệ thống kiểm tra tính khả dụng (không trùng lịch)
→ Booking được xác nhận
→ Tự động tạo Contract (nếu ≥1 tháng) hoặc T&C acceptance (nếu <1 tháng)
→ Tự động sinh Invoice (full hoặc deposit tùy cấu hình)
→ Khách hàng thanh toán (VNPay/MoMo/ZaloPay/Cash/Bank Transfer/Credit)
→ Hệ thống xác nhận thanh toán thành công
→ Gán không gian cho khách hàng
→ Gửi email xác nhận + access card (EP-13)
```

#### Flow 2: Quy trình Thuê Private Office (Staff-Assisted)
```
**Bước 1: Tiếp nhận và tư vấn khách hàng**
Khách hàng liên hệ: Điện thoại/Email/Walk-in
→ "Tôi muốn thuê Private Office cho công ty, khoảng 10-15 người, 6 tháng"
→ Sale/Manager tư vấn:
   • Giới thiệu Private Offices khả dụng (diện tích, vị trí, giá)
   • Giải thích: BẮT BUỘC ký contract chính thức
   • Deposit: 40% (hoặc 30-50% tùy chính sách)/ Tới xem trải nghiệm và ký hợp đồng sau
   • Payment schedule: Deposit trước + Balance khi nhận bàn giao
   • Thời hạn thuê: Minimum 3 tháng, thường 6-12 tháng
→ Khách hàng lựa chọn: "Private Office 15m² - Floor 3 - 8,000,000 VND/tháng"
→ Lưu khách và lead tại EP-12-crm

**Bước 2: Manager tạo Booking trên hệ thống**
→ Manager login hệ thống → Module Bookings → "Create New Booking"
→ Điền thông tin:
   • Customer: 
     - Nếu đã có: Search và select customer
     - Nếu chưa có: Click "Create New Customer" → Điền info → Save
     - Customer type: Individual hoặc Company (nếu Company → nhập tax code)
   • Space: Select "Private Office 15m² - Floor 3"
   • Duration: 
     - Start date: 01/05/2026
     - End date: 31/10/2026 (6 tháng)
   • Pricing:
     - Monthly fee: 8,000,000 VND
     - Total: 48,000,000 VND (6 × 8tr)
     - Deposit percent: 40%
     - Deposit amount: 19,200,000 VND
→ Click "Create Booking"

**Bước 3: Hệ thống xử lý tự động**
→ Kiểm tra availability:
   • Space available từ 01/05 đến 31/10?
   • Không conflict với bookings khác?
→ Nếu available:
   • Booking status → CONFIRMED (staff-assisted không cần approval)
   • Tự động tạo Contract (status: DRAFT):
     - contractCode: "CT-202604-001"
     - templateId: "Private Office Contract Template"
     - Placeholder auto-fill:
       {{customerName}}: "Công ty ABC" hoặc "Nguyễn Văn A"
       {{privateOfficeName}}: "Private Office 15m² - Floor 3"
       {{monthlyFee}}: "8,000,000 VND"
       {{contractDuration}}: "6 tháng"
       {{depositAmount}}: "19,200,000 VND"
       {{startDate}}: "01/05/2026"
       {{endDate}}: "31/10/2026"
       {{totalAmount}}: "48,000,000 VND"
   • Tự động tạo Deposit Invoice:
     - invoiceCode: "INV-202604-001"
     - invoiceType: "deposit"
     - amount: 19,200,000 VND
     - dueDate: 25/04/2026 (trước khi ký contract)
     - status: UNPAID
→ Hiển thị success message: "Booking created successfully!"

**Bước 4: In Invoice và thu deposit**
→ Manager click "Print Invoice" → In invoice deposit cho khách hàng
→ Khách hàng thanh toán deposit ngay tại văn phòng:
   • Cash: Manager nhận tiền mặt
   • Bank Transfer: Khách chuyển khoản, Manager check banking app
   • VNPay/MoMo: Manager tạo QR code, khách quét thanh toán
   • Credit: Nếu khách có credit account (19,200 credits)
→ Sau khi nhận tiền, Manager ghi nhận:
   • Click invoice → "Record Payment"
   • Payment method: Cash/Bank Transfer/VNPay/MoMo/Credit
   • Amount: 19,200,000 VND
   • Payment date: Today
   • Click "Save"
→ Invoice status → PAID
→ System tự động gửi email xác nhận đã nhận deposit

**Bước 5: Lên lịch ký hợp đồng**
→ Manager hẹn khách hàng: "Anh/chị đến ký hợp đồng ngày 28/04 nhé"
→ Manager tạo reminder trong system (hoặc Google Calendar)

**Bước 6: Ký hợp đồng (Contract Signing)**
→ Ngày 28/04/2026: Khách hàng đến văn phòng Cobi
→ Manager in Contract (2 bản):
   • Kiểm tra thông tin đầy đủ, chính xác
   • Review các điều khoản với khách hàng:
     - Quyền và trách nhiệm bên A (Cobi)
     - Quyền và trách nhiệm bên B (Customer)
     - Quy định sử dụng (giờ giấc, vệ sinh, tiếng ồn...)
     - Dịch vụ đi kèm (điện, nước, internet, wifi...)
     - Điều kiện chấm dứt hợp đồng sớm
     - Điều khoản gia hạn
→ Khách hàng đọc và đồng ý:
   • Ký tên vào 2 bản (physical signature)
   • HOẶC E-signature (nếu dùng e-contract):
     - Customer login portal → Sign contract online
     - AcceptanceLog created:
       * acceptedAt: 28/04/2026 10:30 AM
       * acceptedByIp: "118.70.xxx.xxx"
       * userAgent: "Chrome 120..."
     - Contract lưu acceptanceLogId (legal evidence)
→ Manager ký tên đại diện Cobi (2 bản)
→ Mỗi bên giữ 1 bản
→ Manager scan contract → Upload vào system
→ Contract status → ACTIVE
→ System gửi email: "Hợp đồng đã được ký thành công"

**Bước 7: Thanh toán số dư (Balance Payment)**
→ Hệ thống tự động tạo Balance Invoice:
   • invoiceCode: "INV-202604-002"
   • invoiceType: "balance"
   • relatedInvoiceId: "INV-202604-001" (link to deposit invoice)
   • amount: 28,800,000 VND (48tr - 19.2tr)
   • dueDate: 30/04/2026 (trước ngày nhận phòng)
   • status: UNPAID
→ Manager gửi invoice qua email cho khách hàng
→ Khách hàng thanh toán (có thể trả trước hoặc đúng hạn):
   • Online: VNPay/MoMo/ZaloPay → Callback tự động
   • Bank Transfer: Chuyển khoản → Manager check → Record payment
   • Credit: 28,800 credits (nếu có)
   • Cash: Nộp tiền tại văn phòng → Manager record payment
→ Invoice status → PAID
→ System gửi receipt email

**Bước 8: Bàn giao Private Office**
→ Ngày 01/05/2026 (Contract start date)
→ Manager hẹn khách hàng: "9:00 AM - Bàn giao phòng"
→ Manager và khách hàng cùng check phòng:
   • Kiểm tra tình trạng:
     - Tường, sàn, trần: Sạch sẽ, không hư hỏng
     - Bàn ghế: Đầy đủ theo số lượng (10 bàn, 15 ghế)
     - Điều hòa, đèn, ổ cắm: Hoạt động tốt
     - Cửa sổ, rèm: Nguyên vẹn
   • Chụp ảnh hiện trạng (lưu vào system)
   • Khách hàng ký biên bản bàn giao
→ Manager bàn giao chìa khóa/access card:
   • Nếu Individual customer:
     - Issue 1 access card cho customer
     - cardNumber: "AC-001234"
     - validFrom: 01/05/2026
     - validUntil: 31/10/2026
     - status: ACTIVE
   • Nếu Company customer:
     - Issue multiple access cards cho employees
     - Manager → EP-03: Add CompanyEmployees
     - Mỗi employee 1 card (VD: 15 cards)
     - Link cards với employeeIds
→ Hướng dẫn sử dụng:
   • Cách dùng access card (tap vào reader)
   • Wifi password
   • Quy định chung (giờ giấc, an ninh...)
   • Contact emergency: Số hotline Cobi
→ Space status → OCCUPIED
→ Contract status vẫn ACTIVE
→ System gửi email: "Chúc mừng! Bạn đã nhận Private Office. Chúc làm việc hiệu quả!"

**Bước 9: Trong thời gian thuê (6 tháng)**
→ Cuối mỗi tháng: Service billing tự động
   • Điện: ServiceUsage tracking (kWh) → Invoice
   • Nước: ServiceUsage tracking (m³) → Invoice
   • Internet: Fixed fee (đã bao gồm trong monthly fee)
   • In ấn: Nếu dùng máy in chung → Tính theo trang
   • Parking: Nếu thuê thêm → Tính theo slot/tháng
→ Customer thanh toán service invoices (7 ngày/invoice)
→ Nếu có issues (máy lạnh hỏng, bàn ghế hỏng...):
   • Customer báo cáo qua portal hoặc gọi hotline
   • System tạo MaintenanceLog → EP-04: Flow 4
   • Bảo trì khắc phục trong 24-48h

**Bước 10: Trước khi hết hạn (45 ngày)**
→ System tự động:
   • Gửi notification cho Manager: "Contract sắp hết hạn"
   • Gửi email cho Customer: "Hợp đồng của bạn sẽ hết hạn 31/10. Bạn có muốn gia hạn?"
→ Manager gọi điện cho Customer tư vấn:
   • "Anh/chị có muốn gia hạn thêm 6 tháng nữa không?"
   • Nếu gia hạn:
     - Thương lượng giá mới (có thể tăng/giảm)
     - Tạo Contract mới hoặc Addendum (phụ lục gia hạn)
     - Repeat Flow từ đầu (có thể skip deposit nếu khách quen)
   • Nếu không gia hạn:
     - Xác nhận ngày check-out: 31/10/2026
     - Nhắc nhở: Clear hết invoices trước khi trả phòng

**Bước 11: Check-out và trả phòng**
→ Ngày 31/10/2026 (Contract end date)
→ Khách hàng dọn đồ, dọn dẹp phòng
→ Manager và khách hàng check-out cùng nhau:
   • Kiểm tra tình trạng phòng:
     - So sánh với ảnh bàn giao ban đầu
     - Có hư hỏng bất thường? → Tính phí sửa chữa (trừ vào deposit nếu có)
     - Phòng sạch sẽ? → OK
   • Thu hồi chìa khóa/access cards (tất cả cards nếu company)
   • Access cards status → EXPIRED
   • System tự động deactivate cards (không còn quẹt được)
→ Manager kiểm tra invoices:
   • Còn invoice nào chưa thanh toán?
   • Nếu có: Customer thanh toán hết trước khi rời đi
   • Nếu đã clear: OK
→ Manager tính toán cuối cùng:
   • Deposit: 19,200,000 VND
   • Trừ đi (nếu có): Chi phí sửa chữa hư hỏng
   • Còn lại (nếu có): Hoàn trả cho customer
   • VD: Không hư hỏng → Hoàn 19,200,000 VND
→ Hoàn tiền deposit:
   • Chuyển khoản về tài khoản khách hàng
   • Hoặc hoàn credit (nếu customer muốn)
   • PaymentTransaction type: "refund"
→ Khách hàng ký biên bản trả phòng
→ Space status → AVAILABLE (có thể cho thuê lại)
→ Contract status → COMPLETED
→ System gửi email: "Cảm ơn bạn đã sử dụng dịch vụ Cobi. Hẹn gặp lại!"

**Bước 12: Post check-out**
→ Manager làm sạch và chuẩn bị phòng cho khách tiếp theo:
   • Vệ sinh tổng thể
   • Kiểm tra tài sản, bổ sung nếu thiếu
   • Sửa chữa nếu có hư hỏng
   • Space status → AVAILABLE khi ready
→ Customer data được lưu trong hệ thống:
   • Nếu customer muốn thuê lại sau: Đã có profile
   • Manager có thể gửi marketing emails về offers mới
```

#### Flow 3: Quy trình Đặt chỗ tự phục vụ (Customer Self-Service Booking)
```
Khách hàng truy cập Customer Portal (EP-15)
→ Đăng nhập/Đăng ký tài khoản
→ Duyệt danh sách spaces khả dụng (lọc theo loại, giá, thời gian)
→ Chọn space và thời gian thuê
→ Hệ thống kiểm tra availability real-time
→ Hiển thị thông tin giá, deposit requirement, Terms & Conditions
→ Khách hàng xác nhận booking và đồng ý T&C
→ Chọn phương thức thanh toán:
   • Nếu deposit required: Thanh toán đặt cọc (VNPay/MoMo/ZaloPay/Credit)
   • Nếu full prepayment: Thanh toán toàn bộ
→ Thanh toán thành công
→ Nếu Instant Confirmation mode:
   • Booking status → CONFIRMED ngay lập tức
   • Gửi email xác nhận + booking details
→ Nếu Request-to-Book mode:
   • Booking status → AWAITING_APPROVAL
   • Manager nhận notification để duyệt
   • Manager approve/reject trong 24h
   • Nếu approved: Booking → CONFIRMED, gửi email xác nhận
   • Nếu rejected: Hoàn tiền deposit, gửi email thông báo lý do
→ Khách hàng check-in tại ngày hẹn
→ Space được gán và kích hoạt access card
```

#### Flow 4: Quy trình Tính cước Dịch vụ hàng tháng (Monthly Service Billing)
```
Cuối tháng (ngày 30 hoặc 31)
→ Cronjob tự động chạy tổng hợp usage data:
   • Điện: kWh từ ServiceUsage (EP-07)
   • Nước: m³ từ ServiceUsage
   • Internet: GB data/bandwidth
   • In ấn: số trang A4/A3, màu/đen trắng
   • Parking: số ngày/tháng sử dụng
→ Hệ thống tính toán chi phí theo đơn giá:
   • Điện: kWh × giá/kWh
   • Nước: m³ × giá/m³
   • Các dịch vụ khác tương tự
→ Tạo Invoice cho từng Customer với line items chi tiết
→ Invoice status: UNPAID, due date = 7 ngày sau
→ Gửi email thông báo hóa đơn cho Customer
→ Kế toán theo dõi thanh toán trên dashboard
→ Customer thanh toán (online hoặc manual)
→ Kế toán xác nhận và đánh dấu Invoice → PAID
→ Hệ thống gửi receipt/biên lai cho Customer
```

#### Flow 5: Quy trình Nạp và Sử dụng Credits (Prepaid Credit System)
```
**Nạp Credits (Top-up):**
Khách hàng muốn nạp tiền trước
→ Truy cập Customer Portal → "Nạp Credits"
→ Nhập số tiền VND muốn nạp (minimum 100,000 VND = 100 credits)
→ Hệ thống tính credits = VND / 1,000
→ Chọn phương thức: VNPay/MoMo/ZaloPay//Chuyển khoản
→ Nếu online: Redirect đến payment gateway → Thanh toán
→ Gateway callback IPN, verify signature
→ Thanh toán thành công:
   • CreditAccount.currentBalance += số credits nạp
   • Tạo CreditTransaction (type: top_up, amount: +credits)
   • Gửi email xác nhận: "Bạn đã nạp thành công X credits"

**Thanh toán bằng Credits:**
Khách hàng book space hoặc dùng service
→ Chọn "Thanh toán bằng Credits"
→ Hệ thống kiểm tra:
   • ServiceCreditPrice: Lấy giá service theo credits
   • CreditAccount.currentBalance >= giá service?
→ Nếu đủ balance:
   • Trừ credits: currentBalance -= price
   • Tạo CreditTransaction:
     - type: payment
     - amount: -price
     - employeeId: (nếu là company employee)
     - referenceType: booking/service
     - referenceId: booking.id/service.id
   • Invoice → PAID, paymentMethod = CREDIT
   • Booking confirmed hoặc Service activated
   • Gửi email receipt
→ Nếu không đủ balance:
   • Hiển thị error: "Số dư không đủ. Bạn có X credits, cần Y credits"
   • Gợi ý: "Nạp thêm Z credits để tiếp tục"
   • Option: Chuyển phương thức thanh toán khác (VNPay/MoMo/Chuyển khoản...)

**Tracking cho Company (Employee-level):**
Nhân viên công ty (CompanyEmployee) sử dụng credits
→ CreditTransaction ghi nhận employeeId
→ Manager xem báo cáo:
   • Nhân viên A đã dùng 500 credits (Meeting Room 2h)
   • Nhân viên B đã dùng 100 credits (In ấn 100 trang)
   • Tổng company đã dùng 600 credits trong tháng
→ Theo dõi chi tiêu theo từng nhân viên
``` 
#### Flow 6: Quy trình Bảo trì Tài sản (Asset Maintenance)
```
Tài sản bị hỏng (máy lạnh, bàn ghế, máy in...)
→ Khách hàng hoặc Staff báo cáo sự cố:
   • Qua portal (EP-16: Issue Reporting)
   • Qua điện thoại/email → Staff nhập vào hệ thống
→ Hệ thống tạo MaintenanceLog (EP-08):
   • Ghi nhận asset bị hỏng (assetId, serial number)
   • Mô tả vấn đề, mức độ ưu tiên
   • Status: REPORTED
→ Manager assign cho Bảo trì (maintenance staff)
→ Bảo trì nhận notification
→ Status → IN_PROGRESS
→ Bảo trì kiểm tra và sửa chữa
→ Log các bước sửa chữa, thay thế parts (nếu có)
→ Hoàn thành sửa chữa
→ Status → RESOLVED
→ Asset status → ACTIVE (quay lại hoạt động)
→ Thông báo cho Customer và Manager
→ Ghi nhận chi phí sửa chữa (nếu có) vào system
```

### 4.2 Data Models Summary

**Tổng số entities**: 40+

**Core entities:**
- Building, Floor, Space, **SpaceBookingConfig** (4)
- **Customer, Company, CompanyEmployee**, Booking, **ContractTemplate**, Contract, **TermsAndConditions**, **AcceptanceLog** (8)
- Invoice, PaymentTransaction, **CreditAccount, CreditTransaction, ServiceCreditPrice, CustomerServiceSubscription** (6)
- Service, ServiceUsage (2)
- Asset, MaintenanceLog (2)
- Lead, LeadActivity, Campaign (3)
- Event, EventRegistration (2)
- Feedback, Survey, SupportTicket (3)
- AccessCard, Visitor, AccessLog (3)

**Relationships:**
- 1 Building → N Floors → N Spaces
- **1 Space → 1 SpaceBookingConfig (booking mode, deposit settings)**
- **1 Company → 1 Customer (primary contact)**
- **1 Company → N CompanyEmployees**
- **1 CompanyEmployee → 1 AccessCard (EP-13)**
- **1 ContractTemplate → N Contracts (templates used by contracts)**
- 1 Customer → N Bookings → N Contracts
- **1 Customer → N AcceptanceLogs (tracking T&C agreements)**
- **1 Booking → 0-1 AcceptanceLog (for short-term bookings)**
- **1 Contract → 0-1 AcceptanceLog (for e-contracts)**
- 1 Contract → N Invoices
- 1 Invoice → N PaymentTransactions
- **1 Booking → 0-1 Deposit Invoice (invoiceType='deposit')**
- **1 Customer/Company → 1 CreditAccount → N CreditTransactions**
- **1 Space → N ServiceCreditPrices (per service type)**
- **1 Customer → 0-1 CustomerServiceSubscription (enabled services)**
- 1 Space → N Assets

### 4.3 Business Rules

**Booking:**
- Không double-booking cùng space/time
- Minimum booking: 1 hour (hourly spaces), 1 day (daily)
- **Booking modes**: 
  - **Instant confirmation**: Auto-approve (Hot Desks, Dedicated Desks)
  - **Request-to-book**: Requires Manager approval (Meeting Rooms, Conference Rooms)
- **Deposit requirements**:
  - 0%: Hot Desks (no deposit)
  - 30-50%: Dedicated/Private Offices
  - 100%: Meeting/Conference Rooms (full prepayment)
- **Approval workflow**: Manager approves/rejects within 24h, rejection triggers full refund
- **Hybrid model**: Both customer self-booking AND staff-assisted booking supported
- **Cancellation**: Free nếu >24h trước, 50% fee nếu <24h

**Contract & Terms:**
- **Template-based system**: Contracts và T&C generate từ templates với placeholders ({{customerName}}, {{monthlyFee}}...)
- **Long-term rentals (≥1 month)**: BẮT BUỘC formal contract từ ContractTemplate
  - Dedicated Desk ≥1 tháng → Contract required
  - Private Office bất kỳ thời gian → Contract required
  - Company customers → Contract required
- **Short-term bookings (<1 month)**: Terms & Conditions template + AcceptanceLog
  - Hot Desk giờ/ngày → T&C checkbox + AcceptanceLog
  - Meeting Room giờ → T&C checkbox + AcceptanceLog
- **Template Management**: 
  - CRUD templates với version control
  - Placeholder system: Auto-fill data vào {{placeholders}}
  - Active/inactive templates
  - Contract lưu templateId + templateVersion (audit trail)
- **E-Contract support**: Log timestamp, IP address, user agent (legal evidence)
- **Contract content**: Bên thuê/cho thuê, dịch vụ, giá, quy định sử dụng, trách nhiệm, chấm dứt
- **Legal basis**: Bộ luật Dân sự 2015 - thỏa thuận điện tử hợp lệ nếu có log đầy đủ

**Pricing:**
- Base price per space type
- Peak hour surcharge: +30% (8am-6pm weekdays)
- Weekend discount: -10%
- Loyal customer discount: -5% (>6 months)

**Contract:**
- Auto-renewal: Gửi notification 30 days trước expiry
- Grace period: 7 days sau expiry mới deactivate space

**Payment:**
- Invoice due date: 7 days sau issue date
- Overdue: Interest 0.5%/day (max 10%)
- Payment methods: VNPay, MoMo, ZaloPay, Cash, Bank Transfer, **Credit (prepaid)**

**Credit System:**
- **Conversion rate**: 1 credit = 1,000 VND (fixed)
- **Account types**: Individual (1 customer, 1 account) vs Company (1 company account, N employees dùng chung)
- **Top-up**: Minimum 100,000 VND = 100 credits, qua VNPay/MoMo/ZaloPay/Cash
- **Payment**: Check balance đủ trước khi payment, trừ credits khỏi balance
- **Employee tracking**: Company accounts ghi nhận employeeId trong CreditTransaction (biết ai dùng bao nhiêu)
- **Service pricing**: Mỗi service có ServiceCreditPrice (VND + Credits), auto-calculate priceCredits = priceVND / 1000
- **Low balance alert**: Cảnh báo khi balance < threshold (VD: 100 credits)
- **Transaction types**: top_up (nạp), payment (thanh toán), refund (hoàn), adjustment (chỉnh sửa)

**Customer Management:****
- **Customer types**: Individual (cá nhân) vs Company (công ty)
- **Individual customer**: 1 person, 1 account, booking/payment theo cá nhân
- **Company customer**: 
  - 1 Company → 1 Customer (primary contact) → N CompanyEmployees
  - Contract & invoice theo company
  - Mỗi employee có access card riêng
  - Employee permissions: canBookSpaces, canAccessPortal
- **Email uniqueness**: 1 email = 1 customer/employee (không duplicate)
- **Company tax code (MST)**: Unique per company
- **Deactivate employee**: Revoke portal access, deactivate access card

**Access Control:**
- Access card expiry = Contract end date
- Visitor max stay: 8 hours, must check-out

---

## 5. Non-Functional Requirements

### 5.1 Performance (NFR-01)
- **Page Load**: <2s (3G connection)
- **API Response**: <500ms (95th percentile)
- **Concurrent Users**: 
  - Phase 1: 20 users
  - Phase 2: 50 users
  - Phase 3: 100 users
- **Database**: Indexed on key fields, query optimization

### 5.2 Security (NFR-02)
- **Authentication**: JWT, bcrypt password hashing (10 rounds)
- **HTTPS**: Enforced, no HTTP
- **Input Validation**: XSS/SQL injection prevention
- **Audit Logs**: All CRUD actions logged
- **Payment Security**: PCI-DSS compliance, tokenization
- **CORS**: Whitelist origins only

### 5.3 Scalability (NFR-03)
- **Vertical Scaling**: Phase 1-2 (single server)
- **Horizontal Scaling**: Ready for Phase 3 (load balancer + multiple instances)
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions, frequent queries
- **CDN**: Static assets (images, CSS, JS)

### 5.4 Payment Integration (NFR-04)
- **Gateways**: VNPay, MoMo, ZaloPay
- **IPN Callbacks**: Signature verification, idempotency checks
- **Retry Logic**: 3 attempts with exponential backoff
- **Reconciliation**: Daily auto-reconciliation, manual review for discrepancies
- **Refunds**: Support refund flow (admin approval)

### 5.5 Internationalization (NFR-05)
- **Languages**: Vietnamese (default), English, Korean
- **Library**: react-i18next
- **Locale**: Date/number formatting per locale
- **Translation Keys**: ~500-800 strings
- **Fallback**: Vietnamese if translation missing

### 5.6 Availability
- **Uptime**: 99% target (Phase 1), 99.5% (Phase 3)
- **Backup**: Daily database backups, 30-day retention
- **Disaster Recovery**: RTO 4 hours, RPO 1 hour

### 5.7 Usability
- **Responsive**: Desktop (1920x1080), Tablet (768px), Mobile (375px)
- **Accessibility**: WCAG 2.1 Level A (Phase 1), Level AA (Phase 3)
- **Browser Support**: Chrome 100+, Firefox 95+, Safari 15+, Edge 100+

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| **Routing** | React Router DOM v7 |
| **State Management** | Zustand (client), TanStack Query v5 (server) |
| **Charts** | Recharts v3 |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express (assumed) |
| **Database** | PostgreSQL (assumed) |
| **Payments** | VNPay, MoMo, ZaloPay SDKs |
| **i18n** | react-i18next |

### 6.2 Architecture Pattern
- **SPA**: Single Page Application (client-side rendering)
- **API**: RESTful API (JSON)
- **Database**: Single-tenant, filter by `building_id`
- **Auth**: JWT tokens (access + refresh)

### 6.3 Folder Structure
```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (routes)
├── hooks/           # TanStack Query hooks
├── services/        # API service functions
├── stores/          # Zustand stores
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
└── i18n/            # Translation files (Phase 3)
```

### 6.4 Database Design Principles
- **Normalization**: 3NF to avoid redundancy
- **Indexes**: On foreign keys, frequently queried fields
- **Optimistic Locking**: `version` field for booking conflicts
- **Soft Delete**: `deletedAt` timestamp instead of hard delete
- **Audit Trails**: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

---

## 7. Integration Requirements

### 7.1 Payment Gateways
- **VNPay**: IPN callback `/api/payment/vnpay/ipn`, signature: HMAC SHA512
- **MoMo**: IPN callback `/api/payment/momo/ipn`, signature: HMAC SHA256
- **ZaloPay**: IPN callback `/api/payment/zalopay/ipn`, signature: HMAC SHA256

### 7.2 External Systems
- **Email Service**: SendGrid or AWS SES for transactional emails
- **SMS Service**: Twilio or Esms.vn for OTP, notifications (Phase 2)
- **Calendar**: Google Calendar API (optional sync, Phase 3)

### 7.3 Hardware Integration (Phase 2)
- **RFID Readers**: At building gates, POST to `/api/access/check-in`
- **QR Scanners**: Mobile app or dedicated scanner

---

## 8. Testing Strategy

### 8.1 Test Levels
- **Unit Tests**: Jest, React Testing Library (target: 70% coverage)
- **Integration Tests**: API endpoint tests (Postman/Newman)
- **E2E Tests**: Playwright (critical flows: booking, payment)
- **UAT**: Stakeholder testing before each phase launch

### 8.2 Test Cases Priority
**High Priority (Must Test):**
- Authentication flow
- Booking conflict detection
- Payment gateway integration
- Invoice generation
- Role-based access control

**Medium Priority:**
- Dashboard KPIs accuracy
- Search & filters
- Service billing calculation

**Low Priority:**
- UI styling
- Non-critical reports

---

## 9. Deployment Strategy

### 9.1 Environments
- **Development**: Local dev servers
- **Staging**: Pre-production testing environment
- **Production**: Live environment for Cobi

### 9.2 CI/CD Pipeline
- **Build**: Vite build on Git push
- **Test**: Run unit + integration tests
- **Deploy**: Auto-deploy to staging, manual to production
- **Rollback**: Git tag + revert on critical issues

### 9.3 Monitoring
- **Application Monitoring**: Error tracking (Sentry)
- **Performance Monitoring**: Page load times, API response times
- **Log Aggregation**: Centralized logs (CloudWatch or ELK)
- **Uptime Monitoring**: Pingdom or UptimeRobot

---

## 10. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Payment gateway downtime | Medium | High | Implement retry logic, fallback to manual payment |
| Booking conflicts (race condition) | Low | High | Optimistic locking with version field |
| Scope creep in Phase 1 | High | High | Strict "basic features only", defer to Phase 2/3 |
| Building infrastructure delay (RFID) | Medium | Medium | Implement QR code fallback |
| Data breach | Low | Critical | Implement NFR-02 security measures, regular audits |
| Database bottleneck | Low | Medium | Database indexing, query optimization, caching |

---

## 11. Assumptions & Constraints

### 11.1 Assumptions
- Cobi has 2 buildings, max 5 buildings in future
- Max 200 customers per building (400 total)
- Max 100 concurrent active contracts
- Staff has basic computer literacy
- Internet connectivity available at all times

### 11.2 Constraints
- **Budget**: Fixed budget for 9-10 months development
- **Team**: Small team (2-4 developers)
- **Timeline**: 9-10 months total (Phase 1: 4.5-5 months, Phase 2: 3 months, Phase 3: 2 months)
- **Technology**: Must use React 19, TypeScript (per stakeholder requirement)
- **Payment Gateways**: Limited to Vietnamese gateways (VNPay, MoMo, ZaloPay)

---

## 12. Success Metrics

### 12.1 Technical Metrics
- **Code Quality**: 
  - 70%+ test coverage
  - <5% critical bugs in production
  - Code review approval rate >95%

- **Performance**:
  - Page load <2s (95th percentile)
  - API response <500ms (95th percentile)
  - 99% uptime

### 12.2 Business Metrics
- **Efficiency**:
  - 50% reduction in booking processing time
  - 70% reduction in invoice generation time
  - 30% reduction in customer inquiries (via dashboards)

- **Adoption**:
  - 100% staff adoption within 2 weeks of Phase 1 launch
  - **30% customer adoption of self-service booking portal (Phase 1)**
  - 40% customer adoption of full self-service portal (Phase 3)

- **Customer Satisfaction**:
  - NPS score >50 (Phase 2)
  - <5% customer complaint rate

---

## 13. Documentation Deliverables

### 13.1 Technical Documentation
- [x] Project Structure (`.github/structure.instructions.md`)
- [x] Routing & Auth (`.github/routing.instructions.md`)
- [x] Design System (`.github/design.instructions.md`)
- [x] Requirements Instructions (`.github/requirements.instructions.md`)
- [x] Flow Documentation (`.github/flows.instructions.md`)
- [ ] API Specification (OpenAPI/Swagger) - To be created
- [ ] Database Schema Documentation - To be created

### 13.2 Functional Documentation
- [x] 16 Epic Files (`docs/requirements/epics/EP-*.md`)
- [x] 5 NFR Files (`docs/requirements/non-functional/NFR-*.md`)
- [x] Roadmap (`docs/ROADMAP.md`)
- [x] Requirements Analysis (this file)
- [ ] Feature files (to be created per Epic breakdown)
- [ ] Flow documentation (`docs/flows/*.md` - extending from `01-auth-flow.md`)

### 13.3 User Documentation (Phase 3)
- [ ] User Manual (per role)
- [ ] Video tutorials
- [ ] FAQ

---

## 14. Change Management

### 14.1 Requirement Change Process
1. Stakeholder submits change request
2. BA analyzes impact (scope, timeline, cost)
3. Approval by project sponsor
4. Update Epic/Feature documents
5. Communicate to dev team

### 14.2 Priority Changes
- **Critical**: Security fixes, payment gateway issues → Immediate
- **High**: Major bugs, core features → Within 1 sprint
- **Medium**: Enhancements, minor bugs → Next sprint
- **Low**: Nice-to-haves → Backlog

---

## 15. Next Steps

### 15.1 Immediate Actions
1. ✅ Finalize Requirements Documentation (Epics, NFRs, Roadmap)
2. [ ] Create Database Schema (ERD)
3. [ ] Design API Endpoints (REST API spec)
4. [ ] UI/UX Wireframes (6 dashboards)
5. [ ] Setup Development Environment

### 15.2 Phase 1 Kickoff Checklist
- [ ] Dev team onboarded
- [ ] Git repository setup
- [ ] CI/CD pipeline configured
- [ ] Database provisioned
- [ ] Sprint planning completed
- [ ] First sprint started (2-week sprints)

---

**Document Version**: 1.0  
**Last Updated**: 16/04/2026  
**Document Owner**: BA Team  
**Approved By**: [To be filled]
