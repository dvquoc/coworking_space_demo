# EP-13 – Access Control & Visitor Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-13 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |
| Độ ưu tiên | Should have |

## Mô tả

Quản lý ra vào tòa nhà: check-in/check-out customers & visitors, access cards/QR codes, visitor logs, security notifications. Tích hợp với hệ thống kiểm soát ra vào (RFID/QR scanner).

## Features thuộc Epic này

### Phase 2 Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-101 | Access card management | Cấp/thu hồi access cards | Draft |
| F-102 | Visitor registration | Đăng ký khách vãng lai | Draft |
| F-103 | Check-in/Check-out | Scan QR/RFID at gate | Draft |
| F-104 | Access logs | Lịch sử ra vào | Draft |

## Data Models

### AccessCard
```typescript
interface AccessCard {
  id: string;
  cardNumber: string;           // "CARD-001" or RFID tag
  type: 'rfid' | 'qr_code';
  
  // Owner
  customerId: string;
  issuedDate: Date;
  expiryDate?: Date;
  
  // Status
  status: 'active' | 'suspended' | 'expired' | 'lost';
  
  // Access Rights
  buildingIds: string[];        // Allowed buildings
  allowedDays: string[];        // ["monday", "tuesday", ...] or "all"
  allowedTimeRange?: { start: string; end: string }; // "08:00" - "18:00"
}
```

### Visitor
```typescript
interface Visitor {
  id: string;
  
  // Visitor Info
  fullName: string;
  phone: string;
  company?: string;
  idNumber?: string;            // CMND/CCCD
  
  // Visit Details
  visitDate: Date;
  purpose: string;              // "Meeting with Customer ABC"
  hostCustomerId?: string;      // Customer being visited
  
  // Check-in/out
  checkInTime?: Date;
  checkOutTime?: Date;
  
  // Approval
  status: 'pending' | 'approved' | 'checked_in' | 'checked_out' | 'rejected';
  approvedBy?: string;
  
  createdAt: Date;
}
```

### AccessLog
```typescript
interface AccessLog {
  id: string;
  
  // Who
  userType: 'customer' | 'visitor' | 'staff';
  userId: string;               // customerId, visitorId, staffId
  accessCardId?: string;
  
  // What
  action: 'check_in' | 'check_out';
  buildingId: string;
  gateId?: string;              // "Gate 1", "Gate 2"
  
  // When/How
  timestamp: Date;
  method: 'rfid_card' | 'qr_code' | 'manual';  // Manual = reception check-in
  
  // Result
  status: 'granted' | 'denied';
  deniedReason?: string;        // "Card expired", "Access time restricted"
}
```

## User Stories

### US-101: Issue access card
> Là **Manager**, tôi muốn **cấp access card cho customer** để **cho phép ra vào tòa nhà**

**Acceptance Criteria**:
- [ ] Select customer
- [ ] Assign card number (RFID tag hoặc generate QR code)
- [ ] Set expiry date (default: contract end date)
- [ ] Set access rights: buildings, days, time range
- [ ] Card.status → active

### US-102: Register visitor
> Là **Lễ tân**, tôi muốn **đăng ký visitor** để **track khách vãng lai**

**Acceptance Criteria**:
- [ ] Form: name, phone, company, purpose, host customer
- [ ] Upload photo (optional)
- [ ] Status: pending hoặc approved (if receptionist has authority)
- [ ] Print visitor badge with QR code

### US-103: Check-in with QR code
> Là **Customer/Visitor**, tôi muốn **scan QR code tại cổng** để **check-in**

**Acceptance Criteria**:
- [ ] Scan QR code at gate scanner
- [ ] System validates: card active, access allowed (building, time)
- [ ] If valid → AccessLog created, action check_in, status granted
- [ ] If invalid → Denied, log reason
- [ ] Display: "Welcome, John Doe" / "Access Denied"

### US-104: View access logs
> Là **Manager/Security**, tôi muốn **xem access logs** để **monitor building security**

**Acceptance Criteria**:
- [ ] Filter: date range, building, user type
- [ ] Table: timestamp, user name, action (in/out), gate, status
- [ ] Export CSV

## Scenarios

### Scenario 1: Issue access card to customer
```
Given Customer "CUS-010" ký contract for Private Office
When Manager issues access card:
  - cardNumber: "RFID-005"
  - type: rfid
  - buildingIds: ["B1"]
  - allowedDays: all
  - expiryDate: 2026-12-31
Then AccessCard created, status active
And Customer can use RFID card to check-in từ now
```

### Scenario 2: Visitor check-in
```
Given Visitor "Nguyen Van B" registered for visit today
And Visitor approved, status approved
When Visitor scan QR badge at Gate 1, 09:30
Then System validates:
  - Visitor.status = approved ✓
  - Visit date = today ✓
And AccessLog created:
  - action: check_in
  - timestamp: 09:30
  - status: granted
And Visitor.status → checked_in
```

### Scenario 3: Denied access (card expired)
```
Given Customer has AccessCard "CARD-020", expiryDate = 2026-03-31
When Customer scan card at Gate 1, date 2026-04-10
Then System validates:
  - Card.status = expired ✗
And AccessLog created:
  - status: denied
  - deniedReason: "Card expired"
And Display: "Access Denied - Card Expired. Contact reception."
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer
- EP-05: Contract (card expiry = contract end)

## Out of Scope Phase 2
- Facial recognition check-in → Future
- Integration with turnstile gates (hardware) → Depends on building infrastructure
- Real-time security alerts (websockets) → Phase 3

## Technical Notes

### QR Code Generation
- Format: `{"type":"access_card","id":"CARD-123","userId":"CUS-010"}`
- Encrypted & signed to prevent tampering

### RFID Integration
- Hardware: RFID reader at gates → sends cardNumber to backend API
- API validates card, returns grant/deny

### Access Validation Logic
```typescript
function validateAccess(card: AccessCard, building: string, time: Date): boolean {
  if (card.status !== 'active') return false;
  if (!card.buildingIds.includes(building)) return false;
  if (card.expiryDate && time > card.expiryDate) return false;
  
  // Check allowed days
  const dayName = time.toLocaleDateString('en', { weekday: 'lowercase' });
  if (card.allowedDays !== 'all' && !card.allowedDays.includes(dayName)) return false;
  
  // Check time range
  if (card.allowedTimeRange) {
    const currentTime = time.toTimeString().slice(0, 5); // "09:30"
    if (currentTime < card.allowedTimeRange.start || currentTime > card.allowedTimeRange.end) {
      return false;
    }
  }
  
  return true;
}
```

## Ghi chú
- Phase 2 vì security & visitor tracking là growth feature, không critical cho MVP
- Tích hợp hardware (RFID gates) cần coordination với building management
