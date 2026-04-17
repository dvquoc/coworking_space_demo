# EP-03 – Customer Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-03 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |
| Độ ưu tiên | Must have |

## Mô tả

Quản lý thông tin khách hàng đã/đang sử dụng dịch vụ Coworking Space của Cobi. Hỗ trợ **2 loại khách hàng**:

1. **Khách hàng cá nhân (Individual)**: Cá nhân thuê desk/space
2. **Khách hàng công ty (Company)**: Doanh nghiệp thuê Private Office/Dedicated Desk cho team

**Đối với khách hàng công ty**:
- Lưu thông tin công ty (company name, MST, industry, company size)
- Quản lý danh sách nhân viên công ty (CompanyEmployee) được quyền sử dụng space
- Track contract/booking theo công ty, nhưng nhân viên có thể check-in riêng

Bao gồm thông tin cá nhân/công ty, lịch sử sử dụng, và trạng thái khách hàng (active/inactive). Phân biệt với **Leads (EP-12)** - EP-03 chỉ quản lý customers đã convert (đã ký contract hoặc đã booking).

## Features thuộc Epic này

### Phase 1 - Basic Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-16 | Tạo hồ sơ khách hàng (Customer Profile) | CRUD thông tin khách hàng cá nhân/công ty | Draft |
| F-17 | Danh sách khách hàng (Customer List) | Xem, search, filter customers | Draft |
| F-18 | Chi tiết khách hàng (Customer Details) | View full profile + lịch sử bookings/contracts | Draft |
| F-19 | Phân loại khách hàng (Customer Segmentation) | Tag customers theo type: Individual, Startup, SME, Enterprise | Draft |
| F-19A | Quản lý nhân viên công ty | CRUD nhân viên công ty (cho company customers) | Draft |
| F-19B | Ví Credit (Credit Wallet) | Credit balance (không hết hạn) và Credit reward (có hạn sử dụng) | Draft |

### Phase 2 - Advanced Features
- F-20: Customer lifecycle tracking (new → active → churned)
- F-21: Customer 360 view (tổng hợp bookings, payments, feedback)
- F-22: Customer notes & communication log
- F-23: Bulk customer import từ Excel

## Data Models

### Customer
```typescript
interface Customer {
  id: string;
  customerCode: string;         // Auto-generated: "CUS-0001"
  
  // Customer Type (PRIMARY CLASSIFICATION)
  customerType: 'individual' | 'company';
  
  // ===== FOR INDIVIDUAL CUSTOMERS =====
  // Personal Info
  firstName?: string;           // For individuals
  lastName?: string;            // For individuals
  fullName: string;             // Display name (individuals: firstName + lastName)
  dateOfBirth?: Date;
  nationalId?: string;          // CCCD/CMND
  
  // ===== FOR COMPANY CUSTOMERS =====
  // Company Reference (if customerType = 'company')
  companyId?: string;           // FK to Company
  
  // Primary Contact Person (for company customers)
  contactPersonName?: string;   // Người liên hệ chính
  contactPersonTitle?: string;  // Chức vụ (e.g., "CEO", "Office Manager")
  
  // ===== COMMON FIELDS =====
  // Contact
  email: string;                // Primary email (unique)
  phone: string;
  alternativePhone?: string;
  address?: string;
  
  // Segmentation
  tags: string[];               // ["VIP", "Long-term", "Referral"]
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  
  // Credit Wallet (F-19B) - Đơn vị: Cobi (1 Cobi = 1.000 VND)
  creditBalance: number;        // Credit đã nạp (không hết hạn) - Cobi
  rewardBalance: number;        // Credit thưởng (có hạn sử dụng) - Cobi
  
  // Relationship
  referredBy?: string;          // Customer ID của người giới thiệu
  accountManager?: string;      // Staff ID (from EP-09)
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;            // Staff ID
}
```

### CreditTransaction (Lịch sử giao dịch credit)
```typescript
interface CreditTransaction {
  id: string;
  customerId: string;           // FK to Customer
  
  // Transaction Info
  type: 'topup' | 'reward' | 'spend' | 'refund' | 'expire';
  creditType: 'credit' | 'reward';  // credit = không hết hạn, reward = có hạn
  amount: number;               // + = nạp/thưởng, - = tiêu/hết hạn
  balanceAfter: number;         // Số dư sau giao dịch
  
  // For reward credits
  expiresAt?: Date;             // Ngày hết hạn (chỉ cho reward)
  
  // Reference
  referenceType?: 'booking' | 'contract' | 'topup' | 'promotion' | 'referral';
  referenceId?: string;         // ID của booking/contract/topup...
  
  // Metadata
  description: string;          // "Nạp credit", "Thanh toán booking #BK-0001"
  createdAt: Date;
  createdBy: string;            // Staff ID hoặc "system"
}
```

### CreditReward (Credit thưởng có hạn sử dụng)
```typescript
interface CreditReward {
  id: string;
  customerId: string;           // FK to Customer
  
  // Reward Info
  amount: number;               // Số credit thưởng
  remainingAmount: number;      // Số còn lại (sau khi tiêu dần)
  
  // Validity
  issuedAt: Date;               // Ngày phát hành
  expiresAt: Date;              // Ngày hết hạn
  
  // Source
  source: 'promotion' | 'referral' | 'birthday' | 'loyalty' | 'compensation';
  sourceId?: string;            // ID của promotion/referral...
  description: string;          // "Thưởng giới thiệu khách hàng mới"
  
  // Status
  status: 'active' | 'used' | 'expired';
  
  createdAt: Date;
  createdBy: string;
}
```

### Company (for Company Customers)
```typescript
interface Company {
  id: string;
  companyCode: string;          // "COM-0001"
  
  // Company Info
  companyName: string;          // "ABC Technology Co., Ltd"
  legalName?: string;           // Tên pháp lý (nếu khác)
  taxCode: string;              // Mã số thuế (MST)
  
  // Business Info
  industry?: string;            // "IT", "Marketing", "Finance", "Education"
  companySize: 'startup' | 'sme' | 'enterprise';  // 1-10, 11-50, 51-200, 200+
  foundedYear?: number;
  
  // Address
  registeredAddress: string;    // Địa chỉ đăng ký kinh doanh
  officeAddress?: string;       // Địa chỉ văn phòng hiện tại
  
  // Contact
  companyEmail?: string;
  companyPhone?: string;
  website?: string;
  
  // Status
  status: 'active' | 'inactive';
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### CompanyEmployee (Nhân viên công ty)
```typescript
interface CompanyEmployee {
  id: string;
  employeeCode: string;         // "EMP-ABC-001"
  
  // Link to Company
  companyId: string;            // FK to Company
  customerId: string;           // FK to Customer (company customer)
  
  // Employee Info
  fullName: string;
  email: string;                // Corporate email
  phone?: string;
  employeeId?: string;          // Mã nhân viên của công ty
  title?: string;               // Chức vụ: "Developer", "Designer", "Manager"
  department?: string;          // "Engineering", "Marketing", "Sales"
  
  // Access Rights
  canBookSpaces: boolean;       // Nhân viên này có quyền tự book không?
  canAccessPortal: boolean;     // Nhân viên có quyền login vào customer portal?
  
  // Access Card (EP-13)
  accessCardId?: string;        // FK to AccessCard
  
  // Status
  status: 'active' | 'inactive'; // inactive khi nhân viên nghị việc
  startDate?: Date;             // Ngày bắt đầu làm
  endDate?: Date;               // Ngày kết thúc (nếu nghị)
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;            // Staff ID
}
```

### CustomerContact (Future - Phase 2)
```typescript
interface CustomerContact {
  id: string;
  customerId: string;
  contactType: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}
```

## User Stories

### US-16: Tạo hồ sơ khách hàng mới
> Là **Sale/Manager**, tôi muốn **tạo hồ sơ khách hàng khi họ đăng ký** để **lưu trữ thông tin và theo dõi**

**Acceptance Criteria**:
- [ ] Chọn customer type: **Individual** or **Company**
- [ ] **If Individual**:
  - Nhập: firstName, lastName, email, phone, CCCD/CMND, address
  - Auto-generate fullName từ firstName + lastName
- [ ] **If Company**:
  - Nhập: companyName, taxCode (MST), industry, companySize
  - Nhập: registeredAddress, companyEmail, companyPhone
  - Nhập contact person: contactPersonName, contactPersonTitle
  - Auto-create Company record → link customerId to companyId
- [ ] Auto-generate customer code (CUS-0001, CUS-0002, ...)
- [ ] Validate email unique (không trùng với customer khác)
- [ ] Set default status = "active"
- [ ] Lưu thông tin created by (staff đang login)

### US-17: Xem danh sách khách hàng
> Là **Manager**, tôi muốn **xem tất cả khách hàng** để **quản lý và theo dõi**

**Acceptance Criteria**:
- [ ] Table hiển thị: Customer Code, Name, Email, Phone, Type, Status, Created Date
- [ ] Pagination (20 customers/page)
- [ ] Search by name, email, phone, company name
- [ ] Filter by status (active/inactive), type (individual/corporate)
- [ ] Sort by created date, name
- [ ] Click row → navigate to customer details

### US-18: Xem chi tiết khách hàng
> Là **Manager/Kế toán**, tôi muốn **xem thông tin đầy đủ của khách hàng** để **hiểu rõ lịch sử sử dụng**

**Acceptance Criteria**:
- [ ] Hiển thị full customer info
- [ ] Tab "Bookings": List tất cả bookings của customer (past + upcoming)
- [ ] Tab "Contracts": List contracts đang active/expired
- [ ] Tab "Invoices": Payment history
- [ ] Tab "Feedback": Reviews/ratings customer đã submit (EP-16)
- [ ] Edit button → chỉ Manager/Admin

### US-19: Phân loại khách hàng
> Là **Manager**, tôi muốn **tag khách hàng** để **phân biệt VIP, long-term, referral**

**Acceptance Criteria**:
- [ ] Add tags to customer: ["VIP", "Long-term", "Referral", "High-value"]
- [ ] Filter customers by tags
- [ ] Remove tags
- [ ] Tag suggestions (autocomplete từ existing tags)

### US-19A: Quản lý nhân viên công ty
> Là **Manager**, tôi muốn **quản lý danh sách nhân viên của company customer** để **track ai được sử dụng space**

**Acceptance Criteria**:
- [ ] Vào Customer Details (company customer) → Tab "Employees"
- [ ] **Add Employee**:
  - Nhập: fullName, email (corporate), phone, employeeId, title, department
  - Set permissions: canBookSpaces, canAccessPortal
  - Auto-generate employeeCode: "EMP-{companyCode}-001"
  - Set status = "active", startDate = today
- [ ] **List Employees**: Table hiển thị name, email, title, department, status
- [ ] **Edit Employee**: Update info, change permissions
- [ ] **Deactivate Employee**: Set status = "inactive", endDate = today (khi nghỉ việc)
- [ ] **Không cho phép delete** employee nếu có access card active (EP-13)
- [ ] Search/Filter employees by status, department

### US-19B: Employee access management
> Là **Manager**, tôi muốn **cấp quyền cho nhân viên công ty** để **họ có thể tự book hoặc check-in**

**Acceptance Criteria**:
- [ ] Toggle `canBookSpaces`: Cho phép employee tự book spaces qua customer portal
- [ ] Toggle `canAccessPortal`: Cho phép employee login vào customer portal
- [ ] Nếu `canAccessPortal = true` → employee nhận email invite với link set password
- [ ] Employee login bằng corporate email → xem bookings của company
- [ ] Employee chỉ thấy data của company mình (data isolation)

### US-19C: Quản lý ví Credit
> Là **Kế toán/Manager**, tôi muốn **quản lý ví credit của khách hàng** để **họ có thể thanh toán dịch vụ nhanh chóng**

**Acceptance Criteria**:
- [ ] Xem số dư credit hiện tại (creditBalance + rewardBalance)
- [ ] **Nạp credit (Top-up)**:
  - Nhập số tiền nạp (VND)
  - Chọn phương thức: Cash, Bank Transfer, Card
  - Credit được cộng ngay vào `creditBalance`
  - Ghi lại transaction với type = "topup"
- [ ] **Tặng credit reward**:
  - Nhập số credit thưởng
  - Chọn source: promotion, referral, birthday, loyalty, compensation
  - Nhập ngày hết hạn (bắt buộc)
  - Credit được cộng vào `rewardBalance`
  - Tạo CreditReward record
- [ ] **Xem lịch sử giao dịch**: List tất cả CreditTransaction
- [ ] **Xem credit reward sắp hết hạn**: Filter rewards có expiresAt trong 7 ngày tới

### US-19D: Thanh toán bằng Credit
> Là **Khách hàng**, tôi muốn **thanh toán booking/dịch vụ bằng credit** để **nhanh chóng và tiện lợi**

**Acceptance Criteria**:
- [ ] Khi thanh toán, ưu tiên trừ `rewardBalance` trước (FIFO theo expiresAt)
- [ ] Nếu rewardBalance không đủ → trừ tiếp từ `creditBalance`
- [ ] Không cho thanh toán nếu tổng (creditBalance + rewardBalance) < amount
- [ ] Ghi lại transaction với type = "spend"
- [ ] Update remainingAmount của CreditReward đã sử dụng

## Scenarios (Given / When / Then)

### Scenario 1: Tạo khách hàng cá nhân
```
Given Sale đăng nhập
When Vào Customers → "Add Customer"
And Chọn type "Individual"
And Nhập firstName "Nguyen Van", lastName "A"
And Nhập email "a@example.com", phone "0901234567"
And Nhập CCCD "001234567890", address "123 Nguyen Trai, Q1, HCM"
And Click "Save"
Then Customer được tạo với:
  - customerCode = "CUS-0001"
  - customerType = "individual"
  - fullName = "Nguyen Van A"
  - status = "active"
And Hiển thị trong customer list
```

### Scenario 2: Tạo khách hàng công ty
```
Given Manager vào Customers → "Add Customer"
When Chọn type "Company"
And Nhập company info:
  - companyName: "ABC Technology Co., Ltd"
  - taxCode: "0123456789"
  - industry: "IT"
  - companySize: "sme" (11-50 employees)
  - registeredAddress: "456 Le Lai, Q1, HCM"
  - companyEmail: "contact@abc.com"
  - companyPhone: "0287654321"
And Nhập contact person:
  - contactPersonName: "Tran Thi B"
  - contactPersonTitle: "Office Manager"
And Primary customer contact:
  - email: "b@abc.com"
  - phone: "0909876543"
And Click "Save"
Then System creates:
  1. Company record với companyCode = "COM-0001"
  2. Customer record với customerCode = "CUS-0001"
     - customerType = "company"
     - companyId = COM-0001
     - fullName = "ABC Technology Co., Ltd"
     - contactPersonName = "Tran Thi B"
And Display in customer list với type badge "COMPANY"
```

### Scenario 3: Thêm nhân viên cho company customer
```
Given Company customer "CUS-0001" (ABC Technology) đang active
When Manager vào Customer Details → Tab "Employees" → "Add Employee"
And Nhập employee info:
  - fullName: "Le Van C"
  - email: "c.le@abc.com" (corporate email)
  - phone: "0912345678"
  - employeeId: "ABC-EMP-101"
  - title: "Software Developer"
  - department: "Engineering"
And Set permissions:
  - canBookSpaces: true
  - canAccessPortal: true
And Click "Save"
Then CompanyEmployee created với:
  - employeeCode = "EMP-COM-0001-001"
  - companyId = COM-0001
  - customerId = CUS-0001
  - status = "active"
  - startDate = today
And System send email invite đến "c.le@abc.com" để set password
And Employee hiển thị trong company employee list
```

### Scenario 4: Employee login vào customer portal
```
Given Employee "Le Van C" (EMP-COM-0001-001) đã set password
And canAccessPortal = true
When Employee truy cập customer portal → Login
And Nhập email "c.le@abc.com", password
Then Login success → redirect to employee dashboard
And Employee thấy:
  - Company bookings (all bookings của ABC Technology)
  - Company contracts
  - Company invoices
And Nếu canBookSpaces = true → Có button "Book Space"
And Employee chỉ thấy data của company ABC (data isolation)
```

### Scenario 5: Deactivate employee khi nghỉ việc
```
Given Employee "Le Van C" (EMP-COM-0001-001) đang active
When Manager vào Customer Details → Tab "Employees" → Select "Le Van C"
And Click "Deactivate"
And Nhập reason: "Employee resigned"
Then Employee status → "inactive", endDate = today
And canAccessPortal → false (không login được nữa)
And Access card (nếu có) → deactivated (EP-13)
And Employee không thấy trong active employee list (chỉ còn trong history)
```

### Scenario 6: Search customer
```
Given Customer list có 100 customers
When Manager gõ "Nguyen" vào search box
Then Hiển thị tất cả customers có tên chứa "Nguyen"
```

### Scenario 4: Suspend customer
```
Given Customer "CUS-0050" đang "active"
When Admin click "Actions" → "Suspend Customer"
And Nhập reason "Payment overdue"
Then Status → "suspended"
And Customer không thể book mới (EP-04 sẽ check status)
```

### Scenario 5: View customer bookings history
```
Given Customer "CUS-0010" đã có 15 bookings (10 past, 5 upcoming)
When Manager vào Customer Details → Tab "Bookings"
Then Hiển thị 15 bookings sorted by date
And Phân biệt past (gray) vs upcoming (green)
And Click booking → navigate to booking details
```

### Scenario 7: Nạp credit cho khách hàng
```
Given Customer "CUS-0001" có creditBalance = 500 Cobi
When Kế toán vào Customer Details → Tab "Credit"
And Click "Nạp Cobi"
And Nhập amount = 1,000 Cobi (= 1,000,000 VND)
And Chọn method = "Bank Transfer"
And Click "Confirm"
Then creditBalance → 1,500 Cobi
And CreditTransaction được tạo với type = "topup"
And Toast: "Nạp Cobi thành công"
```

### Scenario 8: Tặng credit reward
```
Given Customer "CUS-0001" có rewardBalance = 0 Cobi
When Manager vào Customer Details → Tab "Credit"
And Click "Tặng Cobi Reward"
And Nhập amount = 200 Cobi (= 200,000 VND)
And Chọn source = "referral"
And Chọn expiresAt = "31/05/2026"
And Nhập description = "Thưởng giới thiệu khách hàng CUS-0002"
And Click "Save"
Then rewardBalance → 200 Cobi
And CreditReward được tạo với status = "active"
And CreditTransaction được tạo với type = "reward"
```

### Scenario 9: Thanh toán booking bằng credit
```
Given Customer "CUS-0001" có:
  - creditBalance = 500 Cobi
  - rewardBalance = 200 Cobi (hết hạn 31/05/2026)
And Booking amount = 300 Cobi (= 300,000 VND)
When Customer click "Pay with Cobi"
Then System trừ 200 Cobi từ rewardBalance trước
And Trừ tiếp 100 Cobi từ creditBalance
Then rewardBalance → 0, creditBalance → 400 Cobi
And CreditReward.remainingAmount → 0, status → "used"
And CreditTransaction với type = "spend"
And Booking status → "paid"
```

### Scenario 10: Credit reward hết hạn
```
Given CreditReward của customer CUS-0001:
  - amount = 100 Cobi, remainingAmount = 80 Cobi
  - expiresAt = "17/04/2026" (hôm nay)
When System chạy scheduled job lúc 00:00
Then CreditReward.status → "expired"
And rewardBalance giảm 80 Cobi
And CreditTransaction được tạo với type = "expire"
And Customer nhận notification "80 Cobi reward đã hết hạn"
```

## Phụ thuộc (Dependencies)

**Phụ thuộc vào**:
- EP-01: Authentication (cần login)

**Được sử dụng bởi**:
- EP-04: Booking & Reservation (bookings link to customers)
- EP-05: Contract Management (contracts link to customers)
- EP-06: Payment & Invoicing (invoices link to customers)
- EP-13: Access Control (check-in link to customers)
- EP-15: Customer Portal (customers login to portal)
- EP-16: Feedback (customers submit feedback)

## Out of Scope (Phase 1)

**Không làm trong Phase 1**:
- Communication log (call/email history)
- Customer lifecycle analytics
- Customer segmentation reports
- Bulk import customers từ Excel
- Customer merge (duplicate detection & merge)
- Customer referral program tracking
- Integration với CRM bên ngoài (Salesforce, HubSpot)

## Technical Notes

### Database Indexes
```sql
-- Customer indexes
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_type_status ON customers(customer_type, status);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_customers_created ON customers(created_at);

-- Company indexes
CREATE UNIQUE INDEX idx_companies_tax_code ON companies(tax_code);
CREATE INDEX idx_companies_code ON companies(company_code);
CREATE INDEX idx_companies_status ON companies(status);

-- CompanyEmployee indexes
CREATE INDEX idx_employees_company ON company_employees(company_id);
CREATE INDEX idx_employees_customer ON company_employees(customer_id);
CREATE UNIQUE INDEX idx_employees_email ON company_employees(email);
CREATE INDEX idx_employees_status ON company_employees(status);
CREATE INDEX idx_employees_code ON company_employees(employee_code);

-- Credit indexes
CREATE INDEX idx_credit_txns_customer ON credit_transactions(customer_id);
CREATE INDEX idx_credit_txns_type ON credit_transactions(type);
CREATE INDEX idx_credit_txns_created ON credit_transactions(created_at);
CREATE INDEX idx_credit_rewards_customer ON credit_rewards(customer_id);
CREATE INDEX idx_credit_rewards_status ON credit_rewards(status);
CREATE INDEX idx_credit_rewards_expires ON credit_rewards(expires_at);
```

### Validation Rules
- Email: required, unique, valid format
- Phone: required, Vietnamese format (09xx, 08xx, 07xx)
- Full name: required, max 100 chars
- Customer code: auto-generated, format "CUS-XXXX" (4 digits)
- **For Company**: taxCode required, unique (1 MST = 1 company)
- **For CompanyEmployee**: Corporate email must contain company domain

### Business Rules

**Customer Type:**
- Individual customer: Chỉ 1 người, book spaces cho bản thân
- Company customer: Có Company record riêng, có thể thêm nhiều employees

**Company Customer Management:**
- 1 Company → 1 Customer (primary contact)
- 1 Company → N CompanyEmployees
- Company customer không thể chuyển thành Individual (data integrity)
- Delete company customer → must delete/deactivate all employees first

**Company Employee:**
- Employee chỉ thuộc 1 Company
- Employee email phải là corporate email (recommended: same domain)
- Deactivate employee → set endDate, revoke portal access, deactivate access card
- Cannot delete employee nếu có:
  - Active access card (EP-13)
  - Bookings đã check-in (EP-04)
  - Pending invoices (EP-06)

**General Rules:**
- Cannot delete customer nếu có active contracts
- Cannot delete customer nếu có unpaid invoices
- Email unique across customers (1 email = 1 customer)
- Khi suspend customer → notify về reason
- **Company customer suspended** → All employees cũng bị suspend (không access được)

**Credit Wallet Rules:**
- **Đơn vị Cobi**: 1 Cobi = 1.000 VND (dễ nhớ, dễ tính)
- `creditBalance`: Credit đã nạp, **không hết hạn**, có thể hoàn lại
- `rewardBalance`: Tổng credit thưởng còn lại, **có hạn sử dụng**, không hoàn lại
- Khi thanh toán: **Ưu tiên trừ reward trước** (FIFO theo expiresAt)
- Credit rewards có expiresAt bắt buộc (thường 30/60/90 ngày)
- Scheduled job chạy hàng ngày để expire rewards hết hạn
- Company customer: Credit wallet thuộc về company, không phải employee
- Cannot delete customer nếu creditBalance > 0 (phải hoàn lại trước)
- Minimum topup amount: 100 Cobi (= 100,000 VND)
- Maximum single topup: 50,000 Cobi (= 50,000,000 VND)

## Integration Points

### With Other Epics
- **EP-04**: Customer có thể có nhiều bookings
  - Individual customer: Booking cho bản thân
  - Company customer: Booking cho company, có thể assign employee check-in
- **EP-05**: Customer có thể có nhiều contracts
  - Company customer: Contract thường dài hạn (Private Office, Dedicated Desk)
- **EP-06**: Customer có nhiều invoices
  - Company customer: Invoice theo company, payment từ company account
- **EP-12**: Lead convert thành Customer (link leadId → customerId)
- **EP-13**: Access Control
  - Individual customer: 1 access card
  - Company customer: Mỗi employee có 1 access card riêng
  - CompanyEmployee → AccessCard (1-1 relationship)
- **EP-15**: Customer Portal
  - Individual customer: Login bằng email cá nhân
  - Company employees: Login bằng corporate email, thấy company data

## Ghi chú

**Customer Type Classification:**
- **Individual Customer**: Cá nhân thuê space (Hot Desk, Dedicated Desk theo giờ/ngày)
  - 1 person, 1 account, 1 access card
  - Email cá nhân (Gmail, Yahoo, etc.)
  - Booking & payment theo cá nhân

- **Company Customer**: Doanh nghiệp thuê space cho team
  - 1 company, 1 primary contact (Customer record)
  - N employees (CompanyEmployee records)
  - Mỗi employee có access card riêng
  - Corporate email domain (e.g., @abc.com)
  - Contract & invoice theo company
  - Employees có thể tự book (nếu có permission) hoặc Manager book cho họ

**Company Employee Management:**
- Employee không phải Customer độc lập, mà thuộc về Company
- Employee data: Name, email, title, department, permissions
- Permissions:
  - `canBookSpaces`: Cho phép employee tự book qua portal
  - `canAccessPortal`: Cho phép login vào customer portal
- Deactivate employee khi nghỉ việc → revoke access, deactivate card
- Employee access card link to CompanyEmployee (EP-13)

**Relationships:**
```
Individual Customer (1) → Bookings (N)
Individual Customer (1) → Contracts (N)
Individual Customer (1) → AccessCard (1)

Company (1) → Customer (1) [primary contact]
Company (1) → CompanyEmployees (N)
CompanyEmployee (1) → AccessCard (1)
Customer (company) (1) → Contracts (N) [company-level]
Customer (company) (1) → Invoices (N) [company-level]
```

**Customer vs Lead**: Customer đã convert (đã book/contract). Lead chưa convert (còn trong tư vấn).

**Customer Code**: Unique identifier dùng cho invoice, reports (thay vì dùng ID internal)

**Phase 1 Implementation:**
- CRUD Individual & Company customers
- CRUD Company info (name, taxCode, industry, size)
- CRUD CompanyEmployees với permissions
- Employee portal access (basic login)
- View history (bookings, contracts, invoices)

**Phase 2 Enhancements:**
- Employee self-service booking flow
- Employee notification system
- Bulk employee import từ Excel
- Company hierarchy (parent company → subsidiaries)
- Advanced company analytics (usage by department, employee activity tracking)
