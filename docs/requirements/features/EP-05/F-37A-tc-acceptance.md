# F-37A – E-Contract / T&C Acceptance (Chấp nhận Điều khoản sử dụng)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-37A |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

**E-Contract** (còn gọi là "Điều khoản sử dụng" - T&C) áp dụng cho các dịch vụ **short-term** như Hot Desk (by hour/day), Meeting Room, Event Space. Customer phải **đọc và đồng ý T&C** trước khi hoàn tất booking.

**Business Rationale:**
- **Legal Protection**: T&C acceptance log là bằng chứng pháp lý
- **User Experience**: Không cần ký hợp đồng vật lý cho dịch vụ ngắn hạn
- **Compliance**: Lưu trữ IP, timestamp, version T&C để audit

**Vs. Formal Contract:**
| | Formal Contract | E-Contract (T&C) |
|---|---|---|
| Applies to | Membership, Dedicated Space | Hot Desk, Meeting Room, Event |
| Duration | Long-term (months/years) | Short-term (hours/days) |
| Signature | Physical/Digital signature | Checkbox "Tôi đồng ý" |
| Format | Full contract PDF | Summary T&C page |
| Storage | Contract record | AcceptanceLog record |

**T&C Acceptance Flow:**
1. Customer chọn dịch vụ (e.g., Hot Desk 4h)
2. Booking summary screen hiện T&C
3. Customer check "☑ Tôi đã đọc và đồng ý..."
4. System log: customerId, termsId, termsVersion, IP, timestamp
5. Booking confirmed

**Out of Scope:**
- Electronic signature (e-sign) → Phase 2
- Multiple T&C versions per booking → Phase 2
- T&C translation → Phase 2

## User Story

> Là **Customer**, tôi muốn **đọc và đồng ý điều khoản sử dụng nhanh chóng** để **hoàn tất booking dịch vụ ngắn hạn mà không cần ký hợp đồng**.

> Là **Admin**, tôi muốn **có bằng chứng customer đã đồng ý T&C** để **bảo vệ pháp lý khi có tranh chấp**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### T&C Display

- [ ] **AC1**: T&C hiển thị trong booking confirmation step:
  - Scrollable content area (max-height: 300px)
  - Clear section headings
  - Applied for space type: hot_desk, meeting_room, event_space

- [ ] **AC2**: T&C content loaded từ `TermsAndConditions` entity (F-37B):
  - Match by `applicableSpaceTypes` và `isActive = true`
  - Latest version theo `effectiveFrom <= today`

- [ ] **AC3**: T&C sections hiển thị đầy đủ:
  - Usage Rules (Quy định sử dụng)
  - Liability (Trách nhiệm)
  - Privacy Policy (Chính sách bảo mật)
  - Cancellation Policy (Chính sách hủy)

### Acceptance Checkbox

- [ ] **AC4**: Checkbox với label:
  ```
  ☐ Tôi đã đọc và đồng ý với Điều khoản sử dụng dịch vụ
  ```

- [ ] **AC5**: Checkbox must be checked before proceed:
  - "Confirm Booking" button disabled until checked
  - Tooltip: "Vui lòng đọc và đồng ý điều khoản"

- [ ] **AC6**: Link "Xem Điều khoản sử dụng" mở full T&C in modal/new tab

### Acceptance Logging

- [ ] **AC7**: Khi customer check và confirm:
  - Create `AcceptanceLog` record
  - Store all required audit fields

- [ ] **AC8**: AcceptanceLog fields:
  | Field | Value |
  |-------|-------|
  | `id` | Auto-generated UUID |
  | `customerId` | Current customer |
  | `termsId` | TermsAndConditions.id |
  | `termsVersion` | TermsAndConditions.version |
  | `acceptedAt` | Current ISO timestamp |
  | `ipAddress` | Request IP |
  | `userAgent` | Browser user agent |
  | `bookingId` | Linked booking (optional) |

- [ ] **AC9**: IP address collection:
  - Server-side: `X-Forwarded-For` header hoặc `req.ip`
  - Fallback: `request.connection.remoteAddress`

- [ ] **AC10**: User agent format: Browser + OS (e.g., "Chrome 120 / macOS 14.2")

### View Acceptance History

- [ ] **AC11**: Admin có thể xem acceptance logs của customer:
  - Path: Customer > Contract/Bookings tab > "T&C History"
  - List all acceptance records

- [ ] **AC12**: Acceptance log display:
  | Column | Example |
  |--------|---------|
  | T&C Name | Điều khoản Hot Desk v2.1 |
  | Accepted At | 17/04/2026 14:30 |
  | IP Address | 192.168.1.100 |
  | Booking | BK-20260417-001 |

- [ ] **AC13**: Click log entry → modal với full details:
  - T&C content at time of acceptance
  - Full user agent string
  - Booking details if linked

### Re-acceptance Required

- [ ] **AC14**: Khi T&C được update (new version):
  - Customer phải accept lại trong next booking
  - Old acceptance logs vẫn valid cho old bookings

- [ ] **AC15**: Check acceptance logic:
  ```
  if (customer.lastAcceptedVersion < currentTerms.version) {
    showAcceptanceDialog = true
  }
  ```

### Admin Override

- [ ] **AC16**: Admin tạo booking thay customer (walk-in):
  - Option: "Customer đã đồng ý T&C tại quầy"
  - Log với `acceptedVia: 'in_person'`
  - Admin ID stored in log

### PDF Export

- [ ] **AC17**: Export acceptance log as PDF:
  - T&C content
  - Customer info
  - Acceptance timestamp, IP
  - Digital stamp "Accepted via [channel]"

## Dữ liệu / Fields

### AcceptanceLog Entity

```typescript
interface AcceptanceLog {
  id: string
  customerId: string
  termsId: string
  termsVersion: string
  termsTitle: string              // Snapshot of title
  termsContent: string            // Snapshot of content at acceptance time
  acceptedAt: string              // ISO timestamp
  ipAddress: string
  userAgent: string
  acceptedVia: 'online' | 'in_person'
  acceptedBy?: string             // Admin ID if in_person
  bookingId?: string              // Linked booking
  metadata?: {
    browserName?: string
    browserVersion?: string
    osName?: string
    osVersion?: string
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  }
}
```

### AcceptanceLog List Item

```typescript
interface AcceptanceLogListItem {
  id: string
  termsTitle: string
  termsVersion: string
  acceptedAt: string
  ipAddress: string
  acceptedVia: 'online' | 'in_person'
  bookingCode?: string
}
```

### Customer T&C Status

```typescript
interface CustomerTCStatus {
  customerId: string
  lastAcceptedTermsId?: string
  lastAcceptedVersion?: string
  lastAcceptedAt?: string
  needsReacceptance: boolean
  currentTermsVersion: string
}
```

## UI/UX Guidelines

### Booking Confirmation - T&C Section

```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 BOOKING CONFIRMATION                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Dịch vụ: Hot Desk - 4 giờ                                       │
│ Ngày: 17/04/2026                                                │
│ Giờ: 09:00 - 13:00                                              │
│ Chi phí: 120,000 VND                                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ 📜 ĐIỀU KHOẢN SỬ DỤNG                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 1. QUY ĐỊNH SỬ DỤNG                                         │ │
│ │ - Khách hàng phải tuân thủ nội quy tòa nhà                  │ │
│ │ - Giữ gìn vệ sinh chung                                     │ │
│ │ - Không gây ồn ào ảnh hưởng người khác                      │ │
│ │                                                             │ │
│ │ 2. TRÁCH NHIỆM                                              │ │
│ │ - KH chịu trách nhiệm về tài sản cá nhân                    │ │
│ │ - Bồi thường nếu làm hư hại tài sản                         │ │
│ │                                                             │ │
│ │ 3. CHÍNH SÁCH HỦY                                           │ │
│ │ - Hủy trước 24h: hoàn 100%                                  │ │
│ │ - Hủy trong 24h: không hoàn                                 │ │
│ │                                            ▼ Xem thêm       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ☑️ Tôi đã đọc và đồng ý với [Điều khoản sử dụng dịch vụ]        │
│                                                                 │
│                                     [Hủy] [✓ Xác nhận Booking]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Full T&C Modal

```
┌─────────────────────────────────────────────────────────────────┐
│ ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ HOT DESK         [×]                 │
│ Phiên bản: 2.1 | Có hiệu lực từ: 01/04/2026                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [Full content with proper formatting...]                        │
│                                                                 │
│ 1. QUY ĐỊNH SỬ DỤNG                                             │
│ 1.1. Khách hàng ("KH") sử dụng dịch vụ Hot Desk...             │
│ 1.2. ...                                                        │
│                                                                 │
│ 2. TRÁCH NHIỆM CÁC BÊN                                          │
│ 2.1. Trách nhiệm của KH...                                      │
│ 2.2. Trách nhiệm của Cobi...                                    │
│                                                                 │
│ 3. CHÍNH SÁCH BẢO MẬT                                           │
│ ...                                                             │
│                                                                 │
│ 4. CHÍNH SÁCH HỦY VÀ HOÀN TIỀN                                  │
│ ...                                                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                              [Đã đọc - Đóng]    │
└─────────────────────────────────────────────────────────────────┘
```

### Admin - Customer T&C History

```
┌─────────────────────────────────────────────────────────────────┐
│ Customer: Nguyễn Văn An (CUS-0001)                              │
│ Tab: [Profile] [Contracts] [Bookings] [T&C History]             │
├─────────────────────────────────────────────────────────────────┤
│ LỊCH SỬ CHẤP NHẬN ĐIỀU KHOẢN                                    │
├─────────────────────────────────────────────────────────────────┤
│ │ T&C Name                    │ Version │ Accepted    │ Method   │
│ ├─────────────────────────────┼─────────┼─────────────┼──────────┤
│ │ Điều khoản Hot Desk         │ v2.1    │ 17/04/2026  │ Online   │
│ │ Điều khoản Meeting Room     │ v1.3    │ 15/04/2026  │ Online   │
│ │ Điều khoản Hot Desk         │ v2.0    │ 01/03/2026  │ In-person│
│ │ Điều khoản Event Space      │ v1.0    │ 15/02/2026  │ Online   │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Search by T&C name          📅 Filter by date                │
│ Total: 4 records                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Admin - Walk-in Booking T&C

```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 TẠO BOOKING (Walk-in)                                        │
├─────────────────────────────────────────────────────────────────┤
│ ...                                                             │
│                                                                 │
│ 📜 ĐIỀU KHOẢN SỬ DỤNG                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Booking tại quầy (Walk-in)                               │ │
│ │                                                             │ │
│ │ ☑️ Khách hàng đã được thông báo và đồng ý                    │ │
│ │    Điều khoản sử dụng tại quầy lễ tân                       │ │
│ │                                                             │ │
│ │ Ghi chú: ____________________________________               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Logged by: Admin Hương (admin@cobi.vn)                          │
│                                             [Tạo Booking]       │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Customer accepts T&C online
```
Given Customer "Nguyễn Văn An" đang book Hot Desk
And Current Hot Desk T&C is version 2.1
When Customer reviews booking summary
Then T&C content displayed in scrollable area
And Checkbox "Tôi đã đọc và đồng ý..." unchecked
And "Xác nhận Booking" button disabled
When Customer checks the checkbox
Then Button becomes enabled
When Customer clicks "Xác nhận Booking"
Then AcceptanceLog created:
  - customerId: CUS-0001
  - termsId: TC-HOT-DESK
  - termsVersion: 2.1
  - acceptedAt: 2026-04-17T14:30:00Z
  - ipAddress: 192.168.1.100
  - userAgent: Chrome 120 / macOS 14.2
  - acceptedVia: online
  - bookingId: BK-20260417-001
And Booking confirmed
```

### Scenario 2: T&C updated, re-acceptance required
```
Given Customer "Nguyễn Văn An" accepted Hot Desk T&C v2.0 on 01/03/2026
And Hot Desk T&C updated to v2.1 on 01/04/2026
When Customer books Hot Desk on 17/04/2026
Then System checks: lastAcceptedVersion (2.0) < currentVersion (2.1)
And T&C shown with banner: "Điều khoản đã được cập nhật"
And Customer must re-accept before booking
```

### Scenario 3: Admin walk-in booking
```
Given Receptionist creating walk-in booking cho customer
And Customer physically present at counter
When Admin selects "Booking tại quầy"
Then Checkbox changes to: "☑️ KH đã được thông báo và đồng ý tại quầy"
When Admin checks and confirms
Then AcceptanceLog created:
  - acceptedVia: in_person
  - acceptedBy: ADMIN-001
  - ipAddress: [office IP]
  - note: "Walk-in customer, verbal acceptance"
```

### Scenario 4: View acceptance history
```
Given Admin viewing customer "Nguyễn Văn An" profile
When Navigate to "T&C History" tab
Then List all acceptance logs (4 records)
When Click on "Điều khoản Hot Desk v2.1"
Then Modal shows:
  - Full T&C content at time of acceptance
  - Accepted at: 17/04/2026 14:30
  - IP: 192.168.1.100
  - User Agent: Chrome 120 / macOS 14.2
  - Device: Desktop
  - Linked Booking: BK-20260417-001
```

### Scenario 5: Export acceptance as PDF
```
Given Admin viewing acceptance log for legal purpose
When Click "Export PDF"
Then PDF generated with:
  - Header: "BIÊN BẢN CHẤP NHẬN ĐIỀU KHOẢN"
  - Customer info: Name, ID, Phone
  - T&C content (full)
  - Acceptance details: Date, Time, IP, Browser
  - Stamp: "Accepted Online via Cobi Platform"
  - Footer: "Auto-generated document - Do not alter"
```

## Phụ thuộc

**Phụ thuộc vào:**
- F-37B: T&C Templates (source content)
- EP-03: Customer Management (customer identity)
- Booking Module: Link acceptance to booking

**Được sử dụng bởi:**
- Booking flows (Hot Desk, Meeting Room, Event)
- Legal/Compliance reports

## Technical Notes

### Accept T&C API

```typescript
interface AcceptTermsRequest {
  termsId: string
  bookingId?: string
  acceptedVia: 'online' | 'in_person'
  note?: string
}

interface AcceptTermsResponse {
  acceptanceLogId: string
  acceptedAt: string
  message: string
}

// POST /api/terms/accept
async function acceptTerms(
  req: AcceptTermsRequest,
  context: { customerId: string; ip: string; userAgent: string }
): Promise<AcceptTermsResponse> {
  const terms = await getActiveTerms(req.termsId);
  
  const log: AcceptanceLog = {
    id: generateId(),
    customerId: context.customerId,
    termsId: terms.id,
    termsVersion: terms.version,
    termsTitle: terms.title,
    termsContent: terms.fullContent, // Snapshot
    acceptedAt: new Date().toISOString(),
    ipAddress: context.ip,
    userAgent: context.userAgent,
    acceptedVia: req.acceptedVia,
    bookingId: req.bookingId,
    metadata: parseUserAgent(context.userAgent),
  };
  
  await saveAcceptanceLog(log);
  
  return {
    acceptanceLogId: log.id,
    acceptedAt: log.acceptedAt,
    message: 'Terms accepted successfully',
  };
}
```

### Check Re-acceptance

```typescript
interface CheckAcceptanceResult {
  needsAcceptance: boolean
  currentTerms: {
    id: string
    version: string
    title: string
  }
  lastAccepted?: {
    version: string
    acceptedAt: string
  }
}

async function checkTermsAcceptance(
  customerId: string,
  spaceType: string
): Promise<CheckAcceptanceResult> {
  // Get current active terms for space type
  const currentTerms = await getActiveTermsForSpaceType(spaceType);
  
  // Get customer's last acceptance for this terms
  const lastLog = await getLastAcceptanceLog(customerId, currentTerms.id);
  
  if (!lastLog) {
    return {
      needsAcceptance: true,
      currentTerms,
    };
  }
  
  // Compare versions
  const needsAcceptance = compareVersions(
    lastLog.termsVersion,
    currentTerms.version
  ) < 0;
  
  return {
    needsAcceptance,
    currentTerms,
    lastAccepted: {
      version: lastLog.termsVersion,
      acceptedAt: lastLog.acceptedAt,
    },
  };
}
```

### User Agent Parser

```typescript
interface ParsedUserAgent {
  browserName: string
  browserVersion: string
  osName: string
  osVersion: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
}

function parseUserAgent(ua: string): ParsedUserAgent {
  // Use ua-parser-js or similar library
  // Return structured info about browser and OS
}

function formatUserAgent(parsed: ParsedUserAgent): string {
  return `${parsed.browserName} ${parsed.browserVersion} / ${parsed.osName} ${parsed.osVersion}`;
}
```

### IP Address Collection

```typescript
function getClientIP(req: Request): string {
  // Check X-Forwarded-For header (behind proxy/load balancer)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check X-Real-IP header
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection remote address
  return req.connection?.remoteAddress || 'unknown';
}
```
