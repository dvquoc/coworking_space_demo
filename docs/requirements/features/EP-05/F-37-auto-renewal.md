# F-37 – Auto-renewal Notification (Thông báo gia hạn tự động)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-37 |
| Epic | EP-05 - Contract Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

**Auto-renewal** cho phép hợp đồng tự động gia hạn khi hết hạn, với điều kiện:
1. Customer đã bật setting "Auto-renew"
2. Không có outstanding fees
3. Customer không từ chối renewal trước deadline

**Auto-renewal Flow:**
```
30 days before expiry
       │
       ▼
┌──────────────────────────────────┐
│ NOTIFICATION: "Sắp gia hạn"      │
│ - Thông báo renewal details      │
│ - Opt-out link nếu không muốn    │
└──────────────────────────────────┘
       │
       │ Customer có 23 ngày để opt-out
       ▼
┌──────────────────────────────────┐
│ 7 DAYS BEFORE: Final reminder    │
│ - "HĐ sẽ auto-renew in 7 days"   │
│ - Last chance to opt-out         │
└──────────────────────────────────┘
       │
       │ No opt-out?
       ▼
┌──────────────────────────────────┐     ┌──────────────────────────────┐
│ EXPIRY DATE: Auto-renew triggers │ ──▶ │ NEW CONTRACT CREATED         │
│ - Create new contract            │     │ - Same terms (or new pricing)│
│ - Old contract → Renewed         │     │ - Duration: same as original │
└──────────────────────────────────┘     └──────────────────────────────┘
```

**Business Rules:**
- Auto-renewal là OPT-IN: Customer phải bật trong contract creation
- Có thể bật/tắt bất cứ lúc nào trước 7 ngày
- Không auto-renew nếu có unpaid invoices
- Pricing có thể thay đổi (thông báo trong notification)
- New contract tự động generated với same template

**Renewal Types:**
| Type | Description |
|------|-------------|
| Auto-renewal | Tự động khi hết hạn |
| Manual renewal | Manager tạo thủ công |
| Customer-initiated | Customer request qua portal |

## User Story

> Là **Customer**, tôi muốn **hợp đồng tự động gia hạn** để **không bị gián đoạn dịch vụ**.

> Là **Customer**, tôi muốn **được thông báo trước khi auto-renew** để **có thể từ chối nếu cần**.

> Là **Manager**, tôi muốn **biết những contract nào sẽ auto-renew** để **chuẩn bị invoice và resources**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Auto-renewal Setting

- [ ] **AC1**: Trong create/edit contract:
  ```
  ☐ Bật gia hạn tự động
  Hợp đồng sẽ tự động gia hạn với cùng thời hạn khi hết hạn.
  ```

- [ ] **AC2**: Auto-renewal settings:
  | Field | Description |
  |-------|-------------|
  | `autoRenewEnabled` | true/false |
  | `renewalDuration` | Same as original (default) or custom |
  | `renewalPricing` | 'same' / 'current_rate' / 'custom' |
  | `notifyDaysBefore` | Default: 30 days |

- [ ] **AC3**: Customer có thể bật/tắt auto-renewal:
  - Via Customer Portal (if available)
  - Via Manager (Admin dashboard)
  - Deadline: 7 days trước expiry date

- [ ] **AC4**: Manager có thể force-disable auto-renewal:
  - For contracts with payment issues
  - Log reason required

### Auto-renewal Notification

- [ ] **AC5**: Notification schedule:
  | Days Before | Type | Content |
  |-------------|------|---------|
  | 30 | First notice | Renewal details, opt-out link |
  | 14 | Reminder | Same + "còn 14 ngày" |
  | 7 | Final notice | "Sẽ tự động gia hạn trong 7 ngày" |
  | 0 | Confirmation | "Đã gia hạn thành công" |

- [ ] **AC6**: First notification content:
  ```
  Subject: [Cobi] Thông báo gia hạn hợp đồng {{contractCode}}
  
  Kính gửi {{customerName}},
  
  Hợp đồng {{contractCode}} của bạn sẽ hết hạn vào {{endDate}}.
  
  Theo cài đặt gia hạn tự động, hợp đồng sẽ được gia hạn:
  - Thời hạn mới: {{renewalDuration}} tháng
  - Phí hàng tháng: {{monthlyFee}} VND
  - Ngày bắt đầu mới: {{newStartDate}}
  - Ngày kết thúc mới: {{newEndDate}}
  
  Nếu bạn KHÔNG muốn gia hạn, vui lòng:
  - Nhấn vào link: [Hủy gia hạn tự động]
  - Hoặc liên hệ hotline: 1900-xxxx
  - Deadline: {{optOutDeadline}} (trước 7 ngày)
  
  Trân trọng,
  Đội ngũ Cobi
  ```

- [ ] **AC7**: Opt-out link:
  - One-click disable auto-renewal
  - Confirmation page: "Đã hủy gia hạn tự động"
  - Follow-up: "Liên hệ với chúng tôi nếu muốn gia hạn thủ công"

### Pricing Update Notification

- [ ] **AC8**: Nếu pricing thay đổi (renewalPricing = 'current_rate'):
  - Notification highlight price change
  - Show: Old fee vs. New fee
  - Give customer chance to opt-out if disagree

- [ ] **AC9**: Pricing change example:
  ```
  ⚠️ LƯU Ý: Giá dịch vụ đã được cập nhật
  
  - Phí cũ: 8,000,000 VND/tháng
  - Phí mới: 8,500,000 VND/tháng (+6.25%)
  
  Nếu không đồng ý với mức giá mới, vui lòng hủy gia hạn tự động
  trước ngày {{optOutDeadline}}.
  ```

### Auto-renewal Execution

- [ ] **AC10**: Pre-check before auto-renewal:
  1. `autoRenewEnabled = true`
  2. No unpaid invoices > 30 days
  3. Customer hasn't opted out
  4. Contract không bị terminated

- [ ] **AC11**: If pre-checks fail:
  - Log failure reason
  - Notify Manager
  - Contract expires normally (status = expired)

- [ ] **AC12**: Auto-renewal execution:
  - Create new contract with:
    - Same customer, space, building
    - Same template (latest version)
    - New dates: startDate = oldEndDate + 1
    - Pricing: as per renewalPricing setting
    - Status: active
  - Update old contract:
    - Status: renewed
    - renewedToId: new contract ID

- [ ] **AC13**: Post-renewal:
  - Confirmation notification to Customer
  - Confirmation notification to Manager
  - Generate first invoice for new contract

### Opt-out Handling

- [ ] **AC14**: Opt-out via link:
  - Link format: `/contracts/{id}/cancel-auto-renewal?token={secure_token}`
  - Token valid for 30 days
  - One-click action

- [ ] **AC15**: Opt-out confirmation page:
  ```
  ✅ Đã hủy gia hạn tự động
  
  Hợp đồng {{contractCode}} sẽ KHÔNG tự động gia hạn.
  
  Ngày hết hạn: {{endDate}}
  
  Nếu bạn đổi ý và muốn tiếp tục sử dụng dịch vụ,
  vui lòng liên hệ với chúng tôi trước ngày {{endDate}}.
  ```

- [ ] **AC16**: Opt-out logging:
  - Log: contractId, optOutAt, optOutVia (link/manager/call)
  - Notify Manager that customer opted out

### Manager Dashboard

- [ ] **AC17**: Widget "Auto-renewal Queue":
  - Contracts set to auto-renew in next 30 days
  - Columns: Contract, Customer, Expiry, New Fee, Status

- [ ] **AC18**: Auto-renewal status badges:
  | Status | Badge |
  |--------|-------|
  | Pending | 🟡 Chờ gia hạn |
  | Opted-out | ⚪ Đã hủy |
  | Blocked | 🔴 Bị chặn (unpaid) |
  | Completed | 🟢 Đã gia hạn |

- [ ] **AC19**: Manager actions:
  - View renewal details
  - Override: Force opt-out (with reason)
  - Adjust: Change pricing for renewal
  - Execute: Manual trigger early

### Reports

- [ ] **AC20**: Auto-renewal report:
  - Monthly: Contracts auto-renewed
  - Revenue from auto-renewals
  - Opt-out rate
  - Failed renewals và reasons

## Dữ liệu / Fields

### Auto-renewal Settings (in Contract)

```typescript
interface AutoRenewalSettings {
  enabled: boolean
  renewalDuration: number          // months, default = original duration
  renewalPricing: 'same' | 'current_rate' | 'custom'
  customMonthlyFee?: number        // if pricing = 'custom'
  notifyDaysBefore: number         // default: 30
  optedOutAt?: string              // ISO timestamp if opted out
  optedOutBy?: string              // 'customer' | userId
  optedOutReason?: string
}
```

### Renewal Execution Log

```typescript
interface RenewalLog {
  id: string
  oldContractId: string
  newContractId?: string           // null if failed
  scheduledAt: string              // When renewal was supposed to happen
  executedAt?: string              // When it actually happened
  status: 'pending' | 'completed' | 'failed' | 'opted_out'
  failureReason?: string
  pricingApplied: {
    type: 'same' | 'current_rate' | 'custom'
    oldFee: number
    newFee: number
    percentChange: number
  }
  notificationsSent: {
    template: string
    sentAt: string
    channel: 'email' | 'in_app' | 'sms'
  }[]
}
```

### Opt-out Token

```typescript
interface OptOutToken {
  token: string                    // Secure random string
  contractId: string
  customerId: string
  createdAt: string
  expiresAt: string                // 30 days from creation
  usedAt?: string
}
```

## UI/UX Guidelines

### Contract Form - Auto-renewal Toggle

```
┌─────────────────────────────────────────────────────────────────┐
│ GIA HẠN TỰ ĐỘNG                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [🔘 ON ] Bật gia hạn tự động                                    │
│                                                                 │
│ ℹ️ Hợp đồng sẽ tự động gia hạn khi hết hạn. Khách hàng sẽ       │
│    được thông báo 30 ngày trước và có thể hủy bất cứ lúc nào.  │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Thời hạn gia hạn:      [Giữ nguyên (6 tháng)          ▼]  │   │
│ │                                                           │   │
│ │ Giá khi gia hạn:       ○ Giữ nguyên (8,000,000 VND)       │   │
│ │                        ● Theo bảng giá hiện tại           │   │
│ │                        ○ Tùy chỉnh: [___________] VND     │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard - Auto-renewal Queue Widget

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔄 AUTO-RENEWAL QUEUE (30 days)                            [↗]  │
├─────────────────────────────────────────────────────────────────┤
│ │ Contract    │ Customer      │ Expiry      │ Status          │ │
│ ├─────────────┼───────────────┼─────────────┼─────────────────┤ │
│ │ CTR-001     │ Nguyễn Văn An │ 15/05/2026  │ 🟡 Sắp gia hạn  │ │
│ │ CTR-005     │ Công ty XYZ   │ 20/05/2026  │ ⚪ Đã hủy       │ │
│ │ CTR-008     │ Trần Văn B    │ 25/05/2026  │ 🔴 Blocked      │ │
│ │ CTR-012     │ Lê Văn C      │ 01/06/2026  │ 🟡 Sắp gia hạn  │ │
├─────────────────────────────────────────────────────────────────┤
│ 📊 Tổng: 4 | Pending: 2 | Opted-out: 1 | Blocked: 1            │
│                                                    [Xem tất cả]│
└─────────────────────────────────────────────────────────────────┘
```

### Blocked Contract Alert

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ CONTRACT BLOCKED FROM AUTO-RENEWAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Hợp đồng: CTR-008                                               │
│ Khách hàng: Trần Văn B                                          │
│                                                                 │
│ Lý do bị chặn:                                                  │
│ 🔴 Hóa đơn chưa thanh toán > 30 ngày                           │
│                                                                 │
│ Chi tiết hóa đơn:                                               │
│ • INV-2026-001: 8,000,000 VND (quá hạn 45 ngày)                │
│                                                                 │
│ Hành động:                                                      │
│ [📧 Gửi nhắc thanh toán] [📞 Gọi KH] [Force Opt-out]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Customer - Opt-out Page

```
┌─────────────────────────────────────────────────────────────────┐
│                          [Cobi Logo]                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    HỦY GIA HẠN TỰ ĐỘNG                          │
│                                                                 │
│    Hợp đồng: CTR-20260417-001                                   │
│    Ngày hết hạn: 31/10/2026                                     │
│                                                                 │
│    ────────────────────────────────────────────────────         │
│                                                                 │
│    Bạn có chắc chắn muốn hủy gia hạn tự động?                  │
│                                                                 │
│    ⚠️ Lưu ý:                                                    │
│    • Hợp đồng sẽ kết thúc vào ngày 31/10/2026                   │
│    • Bạn có thể liên hệ để gia hạn thủ công                     │
│    • Quyền truy cập sẽ bị vô hiệu sau ngày hết hạn              │
│                                                                 │
│    Lý do hủy (tùy chọn):                                        │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │ ○ Không còn nhu cầu sử dụng                             │  │
│    │ ○ Chuyển sang nhà cung cấp khác                         │  │
│    │ ○ Không đồng ý với mức giá mới                          │  │
│    │ ○ Khác: ________________________________                │  │
│    └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│              [Quay lại]         [🛑 Xác nhận hủy]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Opt-out Confirmation Page

```
┌─────────────────────────────────────────────────────────────────┐
│                          [Cobi Logo]                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                   ✅ ĐÃ HỦY GIA HẠN TỰ ĐỘNG                     │
│                                                                 │
│    Hợp đồng {{CTR-20260417-001}} sẽ KHÔNG tự động gia hạn.     │
│                                                                 │
│    ────────────────────────────────────────────────────         │
│                                                                 │
│    📅 Ngày hết hạn: 31/10/2026                                  │
│                                                                 │
│    Sau ngày này, quyền truy cập dịch vụ của bạn sẽ              │
│    bị tạm ngưng cho đến khi ký hợp đồng mới.                   │
│                                                                 │
│    ────────────────────────────────────────────────────         │
│                                                                 │
│    Nếu bạn đổi ý và muốn tiếp tục sử dụng dịch vụ:             │
│                                                                 │
│    📞 Hotline: 1900-xxxx                                        │
│    📧 Email: support@cobi.vn                                    │
│                                                                 │
│                        [Về trang chủ]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Scenarios

### Scenario 1: Successful auto-renewal
```
Given Contract "CTR-001" với:
  - autoRenewEnabled = true
  - endDate = 31/10/2026
  - duration = 6 months
  - monthlyFee = 8,000,000
And No outstanding invoices
And Today = 01/10/2026 (30 days before)
When Cronjob runs
Then First notification sent to Customer:
  - "HĐ sẽ tự động gia hạn 6 tháng"
  - "Phí: 8,000,000/tháng"
  - Opt-out link included
And At 31/10/2026:
  - New contract "CTR-002" created
  - CTR-002: startDate = 01/11/2026, endDate = 30/04/2027
  - CTR-001: status = renewed, renewedToId = CTR-002
  - Confirmation email sent
```

### Scenario 2: Customer opts out
```
Given Contract "CTR-001" set to auto-renew
And Customer receives 30-day notification
When Customer clicks opt-out link
Then Opt-out page shown
And Customer selects reason "Không còn nhu cầu"
And Clicks "Xác nhận hủy"
Then Contract updated:
  - autoRenewEnabled = false
  - optedOutAt = now
  - optedOutBy = customer
  - optedOutReason = "Không còn nhu cầu"
And Confirmation page shown
And Manager notified: "KH đã hủy auto-renewal cho CTR-001"
And At expiry date: Contract expires normally (status = expired)
```

### Scenario 3: Blocked due to unpaid invoice
```
Given Contract "CTR-001" set to auto-renew
And Customer has unpaid invoice INV-001 (45 days overdue)
When Cronjob checks at 30 days before expiry
Then Auto-renewal blocked
And Manager notification: "Auto-renewal blocked for CTR-001"
And Customer notification:
  - "Auto-renewal không thể thực hiện"
  - "Lý do: Có hóa đơn chưa thanh toán"
  - "Vui lòng thanh toán để tiếp tục dịch vụ"
And At expiry: Contract expires (status = expired)
```

### Scenario 4: Price increase notification
```
Given Contract "CTR-001":
  - autoRenewEnabled = true
  - renewalPricing = 'current_rate'
  - currentMonthlyFee = 8,000,000
And New pricing effective: 8,500,000 (current_rate)
When 30-day notification sent
Then Email includes:
  - "⚠️ Giá dịch vụ đã được cập nhật"
  - "Phí cũ: 8,000,000 → Phí mới: 8,500,000 (+6.25%)"
  - "Opt-out nếu không đồng ý"
And If customer doesn't opt-out:
  - New contract created with 8,500,000/month
```

### Scenario 5: Manager force opt-out
```
Given Customer không response notifications
And Manager quyết định không auto-renew cho CTR-001
When Manager clicks "Force Opt-out" trên dashboard
And Enters reason: "KH không phản hồi, chờ xác nhận"
Then Contract updated:
  - autoRenewEnabled = false
  - optedOutAt = now
  - optedOutBy = [Manager ID]
  - optedOutReason = "KH không phản hồi..."
And Log: "Auto-renewal disabled by Manager [name]"
And Customer notified: "Gia hạn tự động đã bị hủy bởi quản lý"
```

## Phụ thuộc

**Phụ thuộc vào:**
- F-34: Contract CRUD (create new contract)
- F-35: Contract Templates (generate new contract)
- F-36: Contract Lifecycle (status management)
- Payment/Invoice Module: Check unpaid invoices
- Notification System: Send alerts

**Được sử dụng bởi:**
- F-36: Contract Lifecycle (renewal flow)
- Reports: Renewal analytics

## Technical Notes

### Auto-renewal Cronjob

```typescript
// Run daily at 00:30 AM
async function autoRenewalCronjob(): Promise<void> {
  const today = startOfDay(new Date());
  
  // 1. Send scheduled notifications
  await sendRenewalNotifications(today);
  
  // 2. Execute renewals for contracts expiring today
  const expiringToday = await getContractsExpiringOn(today);
  
  for (const contract of expiringToday) {
    if (contract.autoRenewalSettings?.enabled) {
      await executeAutoRenewal(contract);
    }
  }
}

async function executeAutoRenewal(contract: Contract): Promise<void> {
  const checks = await preRenewalChecks(contract);
  
  if (!checks.canRenew) {
    await logRenewalFailure(contract.id, checks.reason);
    await sendRenewalBlockedNotification(contract, checks.reason);
    return;
  }
  
  // Create new contract
  const newContract = await createRenewalContract(contract);
  
  // Update old contract
  await updateContract(contract.id, {
    status: 'renewed',
    renewedToId: newContract.id,
  });
  
  // Log
  await logRenewalSuccess(contract.id, newContract.id);
  
  // Notify
  await sendRenewalConfirmation(contract, newContract);
}
```

### Pre-renewal Checks

```typescript
interface RenewalCheckResult {
  canRenew: boolean
  reason?: string
  blockers: string[]
}

async function preRenewalChecks(
  contract: Contract
): Promise<RenewalCheckResult> {
  const blockers: string[] = [];
  
  // Check 1: Auto-renewal enabled
  if (!contract.autoRenewalSettings?.enabled) {
    return { canRenew: false, reason: 'Auto-renewal disabled', blockers };
  }
  
  // Check 2: Not opted out
  if (contract.autoRenewalSettings.optedOutAt) {
    return { canRenew: false, reason: 'Customer opted out', blockers };
  }
  
  // Check 3: No unpaid invoices > 30 days
  const overdueInvoices = await getOverdueInvoices(contract.customerId, 30);
  if (overdueInvoices.length > 0) {
    blockers.push(`${overdueInvoices.length} unpaid invoices`);
  }
  
  // Check 4: Contract not terminated
  if (contract.status === 'terminated') {
    return { canRenew: false, reason: 'Contract terminated', blockers };
  }
  
  if (blockers.length > 0) {
    return { canRenew: false, reason: blockers.join(', '), blockers };
  }
  
  return { canRenew: true, blockers: [] };
}
```

### Create Renewal Contract

```typescript
async function createRenewalContract(
  oldContract: Contract
): Promise<Contract> {
  const settings = oldContract.autoRenewalSettings!;
  
  // Determine new pricing
  let newMonthlyFee: number;
  switch (settings.renewalPricing) {
    case 'same':
      newMonthlyFee = oldContract.monthlyFee;
      break;
    case 'current_rate':
      newMonthlyFee = await getCurrentRate(
        oldContract.spaceType,
        oldContract.buildingId
      );
      break;
    case 'custom':
      newMonthlyFee = settings.customMonthlyFee!;
      break;
  }
  
  // Calculate dates
  const newStartDate = addDays(parseISO(oldContract.endDate), 1);
  const duration = settings.renewalDuration || oldContract.durationMonths;
  const newEndDate = addMonths(newStartDate, duration);
  
  // Create new contract
  const newContract = await createContract({
    customerId: oldContract.customerId,
    buildingId: oldContract.buildingId,
    spaceId: oldContract.spaceId,
    templateId: oldContract.templateId,
    contractType: oldContract.contractType,
    startDate: formatISO(newStartDate),
    endDate: formatISO(newEndDate),
    durationMonths: duration,
    monthlyFee: newMonthlyFee,
    depositAmount: oldContract.depositAmount,
    autoRenewalSettings: settings,
    renewedFromId: oldContract.id,
    status: 'active',
  });
  
  // Generate contract content
  await generateContractContent(newContract.id);
  
  return newContract;
}
```

### Opt-out Handler

```typescript
// GET /contracts/:id/cancel-auto-renewal?token=xxx
async function handleOptOut(
  contractId: string,
  token: string,
  reason?: string
): Promise<void> {
  // Validate token
  const tokenRecord = await validateOptOutToken(token);
  if (!tokenRecord || tokenRecord.contractId !== contractId) {
    throw new Error('Invalid or expired token');
  }
  
  // Update contract
  await updateContract(contractId, {
    'autoRenewalSettings.enabled': false,
    'autoRenewalSettings.optedOutAt': new Date().toISOString(),
    'autoRenewalSettings.optedOutBy': 'customer',
    'autoRenewalSettings.optedOutReason': reason,
  });
  
  // Mark token as used
  await markTokenUsed(token);
  
  // Notify manager
  await notifyManager({
    type: 'auto_renewal_opted_out',
    contractId,
    reason,
  });
  
  // Log
  await logOptOut(contractId, 'customer', reason);
}
```

### Notification Templates

```typescript
const renewalNotificationTemplates = {
  first_notice: {
    subject: '[Cobi] Thông báo gia hạn hợp đồng {{contractCode}}',
    daysBeforeExpiry: 30,
  },
  reminder: {
    subject: '[Cobi] Nhắc nhở: HĐ {{contractCode}} sắp gia hạn',
    daysBeforeExpiry: 14,
  },
  final_notice: {
    subject: '[Cobi] QUAN TRỌNG: HĐ {{contractCode}} gia hạn trong 7 ngày',
    daysBeforeExpiry: 7,
  },
  confirmation: {
    subject: '[Cobi] Xác nhận: HĐ {{contractCode}} đã được gia hạn',
    daysBeforeExpiry: 0,
  },
  blocked: {
    subject: '[Cobi] Lưu ý: Gia hạn tự động không thực hiện được',
    daysBeforeExpiry: 0,
  },
};
```
