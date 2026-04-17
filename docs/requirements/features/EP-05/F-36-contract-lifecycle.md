# F-36 – Contract Lifecycle Management (Vòng đời hợp đồng)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-36 |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Must have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Quản lý **vòng đời hợp đồng** từ khi tạo (draft) đến khi kết thúc (expired/terminated). Hệ thống tự động **cập nhật trạng thái** và **gửi thông báo** khi hợp đồng sắp hết hạn.

**Contract Status Flow:**
```
                   ┌──────────────┐
                   │    DRAFT     │ ← Vừa tạo, chưa active
                   └──────────────┘
                          │
                          │ Activate
                          ▼
                   ┌──────────────┐
              ┌─── │    ACTIVE    │ ← Đang hiệu lực
              │    └──────────────┘
              │           │
              │           │ endDate - 30 days
              │           ▼
              │    ┌──────────────┐
              │    │EXPIRING_SOON │ ← Sắp hết hạn (tự động)
              │    └──────────────┘
              │           │
    Terminate │           │ ┌─────────────────────┐
              │           │ │                     │
              │           │ │ Auto-renew (F-37)   │
              │           │ │                     │
              │           │ ▼                     │
              │    ┌──────────────┐        ┌──────────────┐
              │    │   EXPIRED    │        │   RENEWED    │
              │    └──────────────┘        └──────────────┘
              │                                   │
              │                          Creates new contract
              ▼                                   │
       ┌──────────────┐                          ▼
       │  TERMINATED  │                   [New ACTIVE contract]
       └──────────────┘
```

**Status Definitions:**
| Status | Description | Trigger |
|--------|-------------|---------|
| `draft` | Mới tạo, đang soạn | Manual create |
| `active` | Đang hiệu lực | Manual activate |
| `expiring_soon` | Còn ≤30 ngày | Auto (cronjob) |
| `expired` | Đã hết hạn | Auto (cronjob) |
| `renewed` | Đã gia hạn | F-37 Auto-renewal |
| `terminated` | Chấm dứt sớm | Manual terminate |

**Business Rules:**
- Draft → Active: Yêu cầu all required fields filled
- Active → Expiring Soon: Khi còn ≤30 ngày đến endDate
- Expiring Soon → Expired: Khi endDate passed
- Expiring Soon → Renewed: Khi auto-renew hoặc manual renew
- Any status → Terminated: Manual với reason

**Cronjob Schedule:**
- Run daily at 00:30
- Check all active/expiring contracts
- Update status accordingly
- Send notifications

## User Story

> Là **Manager**, tôi muốn **theo dõi trạng thái hợp đồng tự động** để **không bỏ sót hợp đồng sắp hết hạn**.

> Là **Customer**, tôi muốn **được thông báo trước khi hợp đồng hết hạn** để **quyết định gia hạn kịp thời**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Status Transitions

- [ ] **AC1**: Draft → Active:
  - All required fields must be filled
  - Generated content exists
  - Start date can be today or future
  - Status change logged with timestamp

- [ ] **AC2**: Active → Expiring Soon:
  - Auto-triggered when `today >= endDate - 30 days`
  - Cronjob runs daily at 00:30 AM
  - Notification sent to Manager và Customer

- [ ] **AC3**: Expiring Soon → Expired:
  - Auto-triggered when `today > endDate`
  - If auto-renew enabled → go to Renewed instead
  - Notification sent to both parties

- [ ] **AC4**: Any → Terminated:
  - Manual action by Manager
  - Requires termination reason
  - Effective date (today or future)
  - Notification sent to Customer

### Status Dashboard

- [ ] **AC5**: Contract list hiển thị status với badges:
  | Status | Badge Color | Icon |
  |--------|-------------|------|
  | Draft | Gray | 📝 |
  | Active | Green | ✓ |
  | Expiring Soon | Orange | ⚠️ |
  | Expired | Red | ✕ |
  | Renewed | Blue | 🔄 |
  | Terminated | Dark Red | ⛔ |

- [ ] **AC6**: Dashboard widgets:
  - "Sắp hết hạn (30 ngày)": Count + list
  - "Hết hạn tháng này": Count + list
  - "Cần gia hạn": Count + action required

### Expiring Soon Notifications

- [ ] **AC7**: Notification timeline:
  | Days Before Expiry | Notification |
  |---|---|
  | 30 days | First reminder |
  | 14 days | Second reminder |
  | 7 days | Urgent reminder |
  | 3 days | Final reminder |
  | 0 days (expired) | Expired notice |

- [ ] **AC8**: Notification content (to Customer):
  ```
  Subject: [Cobi] Hợp đồng {{contractCode}} sắp hết hạn
  
  Kính gửi Quý Khách {{customerName}},
  
  Hợp đồng {{contractCode}} của Quý Khách sẽ hết hạn vào ngày {{endDate}}.
  
  Vui lòng liên hệ với chúng tôi để gia hạn hợp đồng.
  
  Thông tin hợp đồng:
  - Mã HĐ: {{contractCode}}
  - Dịch vụ: {{packageName}}
  - Ngày hết hạn: {{endDate}}
  
  Trân trọng,
  Đội ngũ Cobi
  ```

- [ ] **AC9**: Notification content (to Manager):
  ```
  Subject: [Contract] {{contractCode}} expiring in {{daysLeft}} days
  
  Contract {{contractCode}} will expire on {{endDate}}.
  
  Customer: {{customerName}} ({{customerPhone}})
  Package: {{packageName}}
  Monthly fee: {{monthlyFee}}
  
  Action required: Contact customer for renewal
  ```

- [ ] **AC10**: Notification channels:
  - In-app notification (bell icon)
  - Email (if enabled)
  - Future: SMS, Push notification

### Timeline / History Log

- [ ] **AC11**: Contract có timeline tab hiển thị:
  - All status changes với timestamp
  - Who made the change
  - Notes/reason if applicable

- [ ] **AC12**: Timeline entries:
  | Event | Example |
  |-------|---------|
  | Created | Contract created by Admin Hương |
  | Activated | Contract activated by Admin Hương |
  | Status Changed | Status changed to "Expiring Soon" (auto) |
  | Renewed | Contract renewed for 6 months |
  | Terminated | Contract terminated by Admin (Reason: ...) |

- [ ] **AC13**: Export timeline as PDF for audit

### Contract Extension (Manual)

- [ ] **AC14**: Extend contract from Expiring Soon status:
  - Button "Gia hạn" on contract detail
  - Modal nhập: New duration (months), New monthly fee (optional)
  - Option: Create new contract vs. extend current

- [ ] **AC15**: Extend current contract:
  - Update endDate = oldEndDate + new duration
  - Status reset to Active
  - Log: "Extended for X months"

- [ ] **AC16**: Create new contract (renewal):
  - New contract with startDate = old endDate + 1
  - Old contract status = Renewed
  - Link: oldContract.renewedToId = newContract.id
  - Link: newContract.renewedFromId = oldContract.id

### Terminate Contract

- [ ] **AC17**: Terminate contract flow:
  - Button "Chấm dứt HĐ" (Manager only)
  - Modal nhập:
    - Termination date (default: today)
    - Reason (required): Dropdown + text
    - Early termination fee (if applicable)

- [ ] **AC18**: Termination reasons (dropdown):
  - Khách hàng yêu cầu chấm dứt
  - Vi phạm điều khoản hợp đồng
  - Không thanh toán đúng hạn
  - Mutual agreement (thỏa thuận hai bên)
  - Khác (specify in notes)

- [ ] **AC19**: Post-termination:
  - Contract status = Terminated
  - Customer notified
  - Related services/access deactivated
  - Calculate final settlement (deposit return, outstanding fees)

### Bulk Status Update

- [ ] **AC20**: Admin có thể bulk update contracts:
  - Select multiple contracts
  - Actions: Activate, Terminate
  - Confirmation modal với count

## Dữ liệu / Fields

### Contract Status History

```typescript
interface ContractStatusHistory {
  id: string
  contractId: string
  fromStatus: ContractStatus | null
  toStatus: ContractStatus
  changedAt: string
  changedBy: string | 'system'   // User ID or 'system' for auto
  reason?: string
  notes?: string
}
```

### Termination Record

```typescript
interface ContractTermination {
  contractId: string
  terminationDate: string
  reason: TerminationReason
  reasonNotes?: string
  terminatedBy: string           // Admin user ID
  earlyTerminationFee?: number
  depositStatus: 'returned' | 'withheld' | 'partial'
  depositReturnAmount?: number
  finalSettlement?: {
    outstandingFees: number
    depositReturn: number
    earlyTerminationFee: number
    totalDue: number             // Positive = customer owes, Negative = refund
  }
}

type TerminationReason = 
  | 'customer_request'
  | 'contract_violation'
  | 'payment_default'
  | 'mutual_agreement'
  | 'other'
```

### Contract Extension

```typescript
interface ContractExtension {
  contractId: string
  extensionType: 'extend' | 'renew'
  previousEndDate: string
  newEndDate: string
  additionalMonths: number
  newMonthlyFee?: number         // null = keep same fee
  extendedBy: string             // Admin user ID
  extendedAt: string
  newContractId?: string         // If renewal creates new contract
}
```

### Notification Config

```typescript
interface ExpiryNotificationConfig {
  daysBeforeExpiry: number[]     // [30, 14, 7, 3, 0]
  notifyCustomer: boolean
  notifyManager: boolean
  channels: ('in_app' | 'email' | 'sms')[]
  emailTemplate: string
}
```

## UI/UX Guidelines

### Contract List - Status Badges

```
┌─────────────────────────────────────────────────────────────────┐
│ CONTRACT LIST                                      [+ New]      │
│ Tab: [All] [Active] [Expiring] [Expired] [Terminated]           │
├─────────────────────────────────────────────────────────────────┤
│ │ Code          │ Customer      │ Status       │ End Date      │
│ ├───────────────┼───────────────┼──────────────┼───────────────┤
│ │ CTR-001       │ Nguyễn Văn An │ 🟢 Active    │ 30/09/2026    │
│ │ CTR-002       │ Trần Văn B    │ 🟠 Expiring  │ 15/05/2026    │
│ │ CTR-003       │ Công ty ABC   │ 🔴 Expired   │ 10/04/2026    │
│ │ CTR-004       │ Lê Văn C      │ 🔵 Renewed   │ 01/04/2026    │
│ │ CTR-005       │ Phạm Văn D    │ ⬛ Terminated│ 20/03/2026    │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard - Expiring Contracts Widget

```
┌───────────────────────────────────────┐
│ ⚠️ SẮP HẾT HẠN (30 NGÀY)          [↗]│
│ ─────────────────────────────────────│
│ 5 hợp đồng cần chú ý                 │
│                                       │
│ • CTR-002 - Trần Văn B (còn 28 ngày) │
│ • CTR-007 - Công ty XYZ (còn 21 ngày)│
│ • CTR-012 - Nguyễn Thị C (còn 15 ngày│
│                                       │
│                        [Xem tất cả →] │
└───────────────────────────────────────┘
```

### Contract Timeline Tab

```
┌─────────────────────────────────────────────────────────────────┐
│ Contract: CTR-20260417-001                                      │
│ Tab: [Info] [Content] [Payments] [Timeline]                     │
├─────────────────────────────────────────────────────────────────┤
│ TIMELINE                                                        │
│                                                                 │
│ ●───────────────────────────────────────────────────────────────│
│   │                                                             │
│   ├─ 17/04/2026 10:30 - Created                                │
│   │  By: Admin Hương                                            │
│   │  Note: Contract created from template TPL-001               │
│   │                                                             │
│   ├─ 17/04/2026 14:00 - Activated                              │
│   │  By: Admin Hương                                            │
│   │  Status: Draft → Active                                     │
│   │                                                             │
│   ├─ 01/10/2026 00:30 - Status Changed (auto)                  │
│   │  By: System                                                 │
│   │  Status: Active → Expiring Soon                             │
│   │  Reason: 30 days before expiry                              │
│   │                                                             │
│   ▼ (Present)                                                   │
│                                                                 │
│                                               [Export PDF]      │
└─────────────────────────────────────────────────────────────────┘
```

### Terminate Contract Modal

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ CHẤM DỨT HỢP ĐỒNG                                [×]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Hợp đồng: CTR-20260417-001                                      │
│ Khách hàng: Nguyễn Văn An                                       │
│ Ngày hết hạn gốc: 31/10/2026                                    │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Ngày chấm dứt:      [17/04/2026     📅]                         │
│                                                                 │
│ Lý do chấm dứt:     [Khách hàng yêu cầu         ▼]              │
│                                                                 │
│ Ghi chú:                                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ KH chuyển địa điểm làm việc, yêu cầu chấm dứt sớm          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ 💰 QUYẾT TOÁN                                                   │
│                                                                 │
│ Tiền cọc:                          5,000,000 VND                │
│ Phí chấm dứt sớm (1 tháng):       -8,000,000 VND                │
│ Phí còn nợ:                                 0 VND                │
│ ──────────────────────────────────────────────────              │
│ Tổng (KH phải trả):                3,000,000 VND                │
│                                                                 │
│                                                                 │
│ ⚠️ Hành động này không thể hoàn tác                             │
│                                                                 │
│                              [Hủy] [🛑 Xác nhận chấm dứt]       │
└─────────────────────────────────────────────────────────────────┘
```

### Extend/Renew Contract Modal

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔄 GIA HẠN HỢP ĐỒNG                                 [×]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Hợp đồng: CTR-20260417-001                                      │
│ Ngày hết hạn hiện tại: 31/10/2026                               │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Hình thức gia hạn:                                              │
│ ○ Extend: Kéo dài hợp đồng hiện tại                             │
│ ● Renew: Tạo hợp đồng mới                                       │
│                                                                 │
│ Thời hạn thêm:      [6 tháng              ▼]                    │
│                                                                 │
│ Ngày kết thúc mới:  01/05/2027                                  │
│                                                                 │
│ Phí hàng tháng:     [8,000,000] VND  ☑️ Giữ nguyên              │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ 📋 PREVIEW                                                      │
│                                                                 │
│ • Hợp đồng cũ (CTR-001): Status → Renewed                       │
│ • Hợp đồng mới (CTR-002): 01/11/2026 → 01/05/2027              │
│ • Liên kết: CTR-001 renewedTo CTR-002                           │
│                                                                 │
│                                                                 │
│                                  [Hủy] [✓ Xác nhận gia hạn]     │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Auto status change to Expiring Soon
```
Given Contract "CTR-001" status = "active"
And endDate = "2026-10-31"
And Today = "2026-10-01" (30 days before expiry)
When Cronjob runs at 00:30 AM
Then Contract status updated to "expiring_soon"
And StatusHistory record created:
  - fromStatus: active
  - toStatus: expiring_soon
  - changedBy: system
  - reason: "30 days before expiry"
And Notification sent to:
  - Customer (email + in-app)
  - Manager (email + in-app)
```

### Scenario 2: Manual contract termination
```
Given Contract "CTR-001" status = "active"
And Deposit = 5,000,000 VND
And Monthly fee = 8,000,000 VND
When Manager clicks "Chấm dứt HĐ"
And Fills:
  - Termination date: Today
  - Reason: "Khách hàng yêu cầu"
  - Note: "KH chuyển địa điểm"
And System calculates:
  - Early termination fee: 1 month = 8,000,000
  - Final: 8,000,000 - 5,000,000 = KH owes 3,000,000
And Manager confirms
Then Contract status = "terminated"
And Termination record created
And Customer notified
And Related services deactivated
```

### Scenario 3: Extend current contract
```
Given Contract "CTR-001" status = "expiring_soon"
And endDate = "2026-10-31"
When Manager clicks "Gia hạn"
And Selects "Extend current contract"
And Duration = 6 months
And Keep same monthly fee
Then endDate updated to "2027-04-30"
And Status reset to "active"
And Extension record created
And Timeline entry: "Extended for 6 months"
And Customer notified
```

### Scenario 4: Renew with new contract
```
Given Contract "CTR-001" (old) status = "expiring_soon"
And endDate = "2026-10-31"
When Manager clicks "Gia hạn"
And Selects "Create new contract"
And Duration = 12 months
And New monthly fee = 9,000,000
Then New contract "CTR-002" created:
  - startDate: 2026-11-01
  - endDate: 2027-10-31
  - monthlyFee: 9,000,000
  - status: active
  - renewedFromId: CTR-001
And Old contract "CTR-001":
  - status: renewed
  - renewedToId: CTR-002
And Both customers and managers notified
```

### Scenario 5: Notification timeline
```
Given Contract "CTR-001" endDate = "2026-05-15"
Then Notifications sent:
  - 2026-04-15 (30 days): First reminder email
  - 2026-05-01 (14 days): Second reminder
  - 2026-05-08 (7 days): Urgent reminder
  - 2026-05-12 (3 days): Final reminder
  - 2026-05-15 (0 days): Expired notice (if not renewed)
```

## Phụ thuộc

**Phụ thuộc vào:**
- F-34: Contract CRUD (contracts to manage)
- Notification System: Send alerts
- Cronjob/Scheduler: Auto status updates

**Được sử dụng bởi:**
- F-37: Auto-renewal (trigger condition)
- Dashboard: Status widgets
- Reports: Contract status reports

## Technical Notes

### Cronjob Implementation

```typescript
// Run daily at 00:30 AM
async function contractStatusCronjob(): Promise<void> {
  const today = startOfDay(new Date());
  
  // 1. Check active contracts for expiring_soon
  const activeContracts = await getContractsByStatus('active');
  for (const contract of activeContracts) {
    const daysUntilExpiry = differenceInDays(
      parseISO(contract.endDate),
      today
    );
    
    if (daysUntilExpiry <= 30) {
      await updateContractStatus(contract.id, 'expiring_soon', {
        changedBy: 'system',
        reason: '30 days before expiry',
      });
      await sendExpiryNotification(contract, daysUntilExpiry);
    }
  }
  
  // 2. Check expiring_soon contracts for expired
  const expiringContracts = await getContractsByStatus('expiring_soon');
  for (const contract of expiringContracts) {
    const endDate = parseISO(contract.endDate);
    
    if (isAfter(today, endDate)) {
      if (contract.autoRenewEnabled) {
        // Handle auto-renewal (F-37)
        await handleAutoRenewal(contract);
      } else {
        await updateContractStatus(contract.id, 'expired', {
          changedBy: 'system',
          reason: 'Contract end date passed',
        });
        await sendExpiredNotification(contract);
      }
    }
  }
  
  // 3. Send reminder notifications
  await sendScheduledReminders(today);
}
```

### Status Transition Validator

```typescript
const validTransitions: Record<ContractStatus, ContractStatus[]> = {
  'draft': ['active', 'terminated'],
  'active': ['expiring_soon', 'terminated'],
  'expiring_soon': ['expired', 'renewed', 'active', 'terminated'],
  'expired': [], // Final state
  'renewed': [], // Final state
  'terminated': [], // Final state
};

function canTransition(from: ContractStatus, to: ContractStatus): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}

async function updateContractStatus(
  contractId: string,
  newStatus: ContractStatus,
  context: { changedBy: string; reason?: string; notes?: string }
): Promise<void> {
  const contract = await getContract(contractId);
  
  if (!canTransition(contract.status, newStatus)) {
    throw new Error(
      `Invalid transition: ${contract.status} → ${newStatus}`
    );
  }
  
  await db.transaction(async (tx) => {
    // Update contract
    await tx.update(contracts)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(contracts.id, contractId));
    
    // Create history record
    await tx.insert(contractStatusHistory).values({
      id: generateId(),
      contractId,
      fromStatus: contract.status,
      toStatus: newStatus,
      changedAt: new Date().toISOString(),
      ...context,
    });
  });
}
```

### Notification Service

```typescript
interface ExpiryNotification {
  contractId: string
  daysRemaining: number
  recipients: {
    customer: { email: string; userId: string }
    managers: { email: string; userId: string }[]
  }
  template: 'first_reminder' | 'second_reminder' | 'urgent' | 'final' | 'expired'
}

async function sendExpiryNotification(
  contract: Contract,
  daysRemaining: number
): Promise<void> {
  const template = getNotificationTemplate(daysRemaining);
  const customer = await getCustomer(contract.customerId);
  const managers = await getBuildingManagers(contract.buildingId);
  
  // In-app notification
  await createNotification({
    userId: customer.userId,
    type: 'contract_expiry',
    title: `Hợp đồng ${contract.code} sắp hết hạn`,
    message: `Còn ${daysRemaining} ngày đến ngày hết hạn`,
    data: { contractId: contract.id },
  });
  
  // Email notification
  await sendEmail({
    to: customer.email,
    template: `contract_expiry_${template}`,
    data: {
      customerName: customer.fullName,
      contractCode: contract.code,
      endDate: formatDate(contract.endDate),
      daysRemaining,
      packageName: contract.packageName,
    },
  });
  
  // Notify managers
  for (const manager of managers) {
    await createNotification({
      userId: manager.userId,
      type: 'contract_expiry_manager',
      ...
    });
  }
}
```

### Settlement Calculator

```typescript
interface Settlement {
  depositPaid: number
  outstandingFees: number
  earlyTerminationFee: number
  depositReturn: number
  totalDue: number              // Positive = customer owes
  breakdown: SettlementLine[]
}

interface SettlementLine {
  description: string
  amount: number
  type: 'credit' | 'debit'
}

function calculateTerminationSettlement(
  contract: Contract,
  terminationDate: Date
): Settlement {
  const remainingMonths = differenceInMonths(
    parseISO(contract.endDate),
    terminationDate
  );
  
  // Early termination fee = 1 month of rent
  const earlyTerminationFee = remainingMonths > 0 
    ? contract.monthlyFee 
    : 0;
  
  // Calculate outstanding fees
  const outstandingFees = calculateOutstandingFees(contract);
  
  // Deposit return
  const depositReturn = contract.depositAmount - earlyTerminationFee - outstandingFees;
  
  return {
    depositPaid: contract.depositAmount,
    outstandingFees,
    earlyTerminationFee,
    depositReturn: Math.max(0, depositReturn),
    totalDue: Math.max(0, -depositReturn), // If negative, customer owes
    breakdown: [
      { description: 'Tiền cọc', amount: contract.depositAmount, type: 'credit' },
      { description: 'Phí chấm dứt sớm', amount: -earlyTerminationFee, type: 'debit' },
      { description: 'Phí còn nợ', amount: -outstandingFees, type: 'debit' },
    ],
  };
}
```
