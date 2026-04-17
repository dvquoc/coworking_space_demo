# F-19 – Phân khúc khách hàng (Customer Segmentation)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-19 |
| Epic | EP-03 - Customer Management |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 17/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Cho phép gắn **tags** để phân loại khách hàng theo nhiều tiêu chí (giá trị, hành vi, nguồn...). Tags giúp filter nhanh, tạo campaigns và cá nhân hóa dịch vụ.

**Business Rationale:**
- **Segmentation Marketing**: Nhắm đúng đối tượng với đúng offer
- **Service Personalization**: VIP customers nhận ưu đãi đặc biệt
- **Customer Intelligence**: Phân tích theo nhóm (spend by segment)
- **Quick Filtering**: Tìm nhanh nhóm khách hàng quan tâm

**Predefined Tags:**
| Tag | Mô tả | Criteria |
|-----|-------|----------|
| VIP | Khách hàng VIP | Manual assignment |
| Long-term | Khách dài hạn | Có contract > 6 tháng |
| Referral | Đã giới thiệu KH mới | referredCustomers > 0 |
| New | Khách mới | Tạo trong 30 ngày gần |
| Premium | Spend cao | Total spend > 100M |
| At-risk | Có nguy cơ rời bỏ | Không hoạt động 90 ngày |

**Business Rules:**
- Tags có thể manual assign hoặc auto-assign (cron job)
- Một customer có thể có nhiều tags
- Admin có quyền create/edit/delete custom tags
- Tags xuất hiện trong: Customer List filter, Customer Details, Reports

**Out of Scope:**
- Tag-based automation rules → Phase 2
- Marketing campaign linking → Phase 2
- Predictive segmentation (ML) → Phase 3

## User Story

> Là **Manager/Sale**, tôi muốn **gắn tag phân loại cho khách hàng** để **dễ dàng filter và cá nhân hóa dịch vụ**.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Tag Management (Admin)

- [ ] **AC1**: Menu "Cài đặt > Tags" accessible cho role `admin`
- [ ] **AC2**: Hiển thị list tags hệ thống:
  | Column | Notes |
  |--------|-------|
  | Tag Name | Text |
  | Color | Color chip |
  | Type | System/Custom |
  | Customer Count | Số KH có tag |

- [ ] **AC3**: System tags (predefined) không thể delete, chỉ có thể edit color
- [ ] **AC4**: Custom tags có thể CRUD đầy đủ

### Create Custom Tag

- [ ] **AC5**: Button "Tạo tag mới" mở modal
- [ ] **AC6**: Form tạo tag:
  | Field | Type | Required | Validation |
  |-------|------|----------|------------|
  | name | text | Yes | 2-30 chars, chữ/số/-/_ |
  | displayName | text | Yes | 2-50 chars |
  | color | color picker | Yes | Hex code |
  | description | textarea | No | Max 200 chars |

- [ ] **AC7**: Tag name unique (case-insensitive)
- [ ] **AC8**: Sau khi tạo, tag xuất hiện trong list và có thể assign cho customers

### Assign Tags to Customer

- [ ] **AC9**: Trong Customer Details (F-18), tags section có button "Edit tags"
- [ ] **AC10**: Click → Modal với multi-select dropdown tất cả available tags
- [ ] **AC11**: Tags hiện tại được pre-selected
- [ ] **AC12**: Save → update customer tags
- [ ] **AC13**: Tags hiển thị dưới dạng chips với màu tương ứng

### Bulk Tag Assignment

- [ ] **AC14**: Trong Customer List (F-17), chọn nhiều customers (checkbox)
- [ ] **AC15**: Action bar xuất hiện: "Đã chọn X khách hàng" + Actions
- [ ] **AC16**: Action "Add tag" → multi-select tags to add
- [ ] **AC17**: Action "Remove tag" → multi-select tags to remove
- [ ] **AC18**: Confirm → bulk update
- [ ] **AC19**: Toast: "Đã cập nhật tag cho X khách hàng"

### Filter by Tags

- [ ] **AC20**: Customer List (F-17) có filter "Tags"
- [ ] **AC21**: Multi-select tags filter (AND logic)
- [ ] **AC22**: "Exclude tags" option (KHÔNG có tag X)
- [ ] **AC23**: URL reflects: `?tags=VIP,Premium&excludeTags=At-risk`

### Auto-assign Rules (System)

- [ ] **AC24**: Tag "New": Auto-assign cho customers created trong 30 ngày
- [ ] **AC25**: Tag "New": Auto-remove sau 30 ngày
- [ ] **AC26**: Tag "Long-term": Auto-assign khi có contract duration > 6 tháng
- [ ] **AC27**: Tag "Referral": Auto-assign khi customer.referredCustomers > 0
- [ ] **AC28**: Tag "Premium": Auto-assign khi totalSpent > 100,000,000 VND
- [ ] **AC29**: Tag "At-risk": Auto-assign khi lastActivityDate > 90 ngày
- [ ] **AC30**: Auto-assign chạy daily (cron job backend)
- [ ] **AC31**: Manual override: Admin có thể remove auto-assigned tags

### Tag UI Components

- [ ] **AC32**: Tag chip component:
  - Background color faded (10%)
  - Text color solid
  - Optional: X button for quick remove
- [ ] **AC33**: Tag trong list compact: `[VIP] [Long-term]`
- [ ] **AC34**: Tag tooltip hiển thị description
- [ ] **AC35**: Quick-action: Click tag trong list → filter by tag

### Delete Tag

- [ ] **AC36**: Delete custom tag → confirm dialog
- [ ] **AC37**: Warning: "Tag này đang được gắn cho X khách hàng. Xóa sẽ gỡ tag khỏi tất cả."
- [ ] **AC38**: Confirm → remove tag from system và tất cả customers

## Dữ liệu / Fields

### Tag Entity

```typescript
interface Tag {
  id: string;
  name: string;          // slug: vip, long-term, custom-tag
  displayName: string;   // display: VIP, Long-term, Custom Tag
  color: string;         // hex: #22c55e
  description?: string;
  type: 'system' | 'custom';
  autoAssign: boolean;   // true nếu có auto-assign rule
  customerCount: number;
  createdAt: string;
  createdBy?: { id: string; name: string; };
}

interface CustomerTag {
  tagId: string;
  tagName: string;
  tagDisplayName: string;
  tagColor: string;
  assignedAt: string;
  assignedBy: 'system' | { id: string; name: string; };
}
```

### Predefined System Tags

```typescript
const SYSTEM_TAGS: Tag[] = [
  {
    id: 'tag-vip',
    name: 'vip',
    displayName: 'VIP',
    color: '#eab308', // amber-500
    description: 'Khách hàng VIP, cần ưu tiên chăm sóc đặc biệt',
    type: 'system',
    autoAssign: false
  },
  {
    id: 'tag-long-term',
    name: 'long-term',
    displayName: 'Long-term',
    color: '#22c55e', // green-500
    description: 'Khách hàng có hợp đồng dài hạn (> 6 tháng)',
    type: 'system',
    autoAssign: true
  },
  {
    id: 'tag-referral',
    name: 'referral',
    displayName: 'Referral',
    color: '#3b82f6', // blue-500
    description: 'Khách hàng đã giới thiệu khách mới',
    type: 'system',
    autoAssign: true
  },
  {
    id: 'tag-new',
    name: 'new',
    displayName: 'New',
    color: '#06b6d4', // cyan-500
    description: 'Khách hàng mới (< 30 ngày)',
    type: 'system',
    autoAssign: true
  },
  {
    id: 'tag-premium',
    name: 'premium',
    displayName: 'Premium',
    color: '#8b5cf6', // violet-500
    description: 'Khách hàng chi tiêu cao (> 100M)',
    type: 'system',
    autoAssign: true
  },
  {
    id: 'tag-at-risk',
    name: 'at-risk',
    displayName: 'At-risk',
    color: '#ef4444', // red-500
    description: 'Khách hàng không hoạt động > 90 ngày',
    type: 'system',
    autoAssign: true
  }
];
```

## API Contracts

### List Tags

```
GET /api/tags
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "tag-vip",
      "name": "vip",
      "displayName": "VIP",
      "color": "#eab308",
      "description": "Khách hàng VIP",
      "type": "system",
      "autoAssign": false,
      "customerCount": 15
    },
    {
      "id": "tag-custom-001",
      "name": "partner",
      "displayName": "Partner",
      "color": "#14b8a6",
      "type": "custom",
      "autoAssign": false,
      "customerCount": 8
    }
  ]
}
```

### Create Custom Tag

```
POST /api/tags
Authorization: Bearer {token}

Request:
{
  "name": "enterprise-client",
  "displayName": "Enterprise Client",
  "color": "#6366f1",
  "description": "Khách hàng doanh nghiệp lớn"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "tag-custom-002",
    "name": "enterprise-client",
    "displayName": "Enterprise Client",
    "color": "#6366f1",
    "description": "Khách hàng doanh nghiệp lớn",
    "type": "custom",
    "autoAssign": false,
    "customerCount": 0,
    "createdAt": "2026-04-17T10:00:00Z"
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "TAG_NAME_EXISTS",
    "message": "Tag với tên này đã tồn tại"
  }
}
```

### Update Customer Tags

```
PUT /api/customers/{customerId}/tags
Authorization: Bearer {token}

Request:
{
  "tagIds": ["tag-vip", "tag-long-term", "tag-custom-001"]
}

Response 200:
{
  "success": true,
  "data": {
    "customerId": "uuid",
    "tags": [
      { "tagId": "tag-vip", "tagName": "vip", "tagDisplayName": "VIP", "tagColor": "#eab308" },
      { "tagId": "tag-long-term", "tagName": "long-term", "tagDisplayName": "Long-term", "tagColor": "#22c55e" },
      { "tagId": "tag-custom-001", "tagName": "partner", "tagDisplayName": "Partner", "tagColor": "#14b8a6" }
    ]
  }
}
```

### Bulk Tag Update

```
POST /api/customers/bulk/tags
Authorization: Bearer {token}

Request:
{
  "customerIds": ["uuid1", "uuid2", "uuid3"],
  "addTags": ["tag-vip"],
  "removeTags": ["tag-at-risk"]
}

Response 200:
{
  "success": true,
  "data": {
    "updated": 3,
    "results": [
      { "customerId": "uuid1", "success": true },
      { "customerId": "uuid2", "success": true },
      { "customerId": "uuid3", "success": true }
    ]
  }
}
```

### Delete Custom Tag

```
DELETE /api/tags/{tagId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "deleted": true,
    "customersAffected": 8
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_SYSTEM_TAG",
    "message": "Không thể xóa tag hệ thống"
  }
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Xem list tags

```gherkin
Given Admin đã đăng nhập
And Hệ thống có 6 system tags + 2 custom tags

When Navigate to /settings/tags

Then Page hiển thị 8 tags
And System tags có badge "System"
And Custom tags có badge "Custom"
And Mỗi tag hiển thị customer count
```

### Scenario 2: Create custom tag

```gherkin
Given Admin đang ở Tags management page

When Click "Tạo tag mới"
And Nhập:
  - Name: "enterprise-client"
  - Display Name: "Enterprise Client"
  - Color: #6366f1 (Indigo)
  - Description: "Khách hàng doanh nghiệp lớn"
And Click "Lưu"

Then Tag mới xuất hiện trong list
And Toast: "Đã tạo tag thành công"
```

### Scenario 3: Assign tags to customer

```gherkin
Given Customer "CUS-0001" có tags: [VIP]
And Manager đang xem Customer Details

When Click "Edit tags"
And Select thêm: [Long-term] [Premium]
And Click "Lưu"

Then Customer tags = [VIP] [Long-term] [Premium]
And Tags hiển thị với màu tương ứng
```

### Scenario 4: Bulk add tag

```gherkin
Given Manager đang ở Customer List
And Select 5 customers (checkbox)

When Click "Add tag"
And Select tag "VIP"
And Confirm

Then Toast: "Đã thêm tag VIP cho 5 khách hàng"
And 5 customers đều có tag VIP
```

### Scenario 5: Filter by tags

```gherkin
Given Customer List có:
  - 15 customers với tag VIP
  - 8 customers với tag Premium
  - 5 customers có cả VIP và Premium

When Select filter Tags: [VIP], [Premium]

Then Hiển thị 5 customers (AND logic)
And URL: ?tags=vip,premium
```

### Scenario 6: Auto-assign new tag

```gherkin
Given Daily cron job runs
And Customer "CUS-0100" created 5 ngày trước
And Customer "CUS-0100" chưa có tag "New"

When Cron job sync tags

Then Customer "CUS-0100" được gắn tag "New" (auto)
```

### Scenario 7: Auto-remove new tag

```gherkin
Given Customer "CUS-0050" có tag "New" (assigned 35 ngày trước)

When Cron job sync tags

Then Tag "New" được gỡ khỏi "CUS-0050"
```

### Scenario 8: Delete custom tag

```gherkin
Given Custom tag "Partner" có 8 customers
And Admin click Delete

Then Dialog: "Tag này đang được gắn cho 8 khách hàng. Xóa sẽ gỡ tag khỏi tất cả."

When Confirm delete

Then Tag "Partner" bị xóa
And 8 customers không còn tag "Partner"
```

## UI/UX Guidelines

### Tags Management Page

```
┌─────────────────────────────────────────────────────────────────┐
│ Tags Management                              [+ Tạo tag mới]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ System Tags                                                     │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [●] VIP          │ System │ 15 customers │ [Edit color]    ││
│ │ [●] Long-term    │ System │ 42 customers │ [Edit color]    ││
│ │ [●] Referral     │ System │ 23 customers │ [Edit color]    ││
│ │ [●] New          │ System │  8 customers │ [Edit color]    ││
│ │ [●] Premium      │ System │ 12 customers │ [Edit color]    ││
│ │ [●] At-risk      │ System │  5 customers │ [Edit color]    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Custom Tags                                                     │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [●] Partner      │ Custom │  8 customers │ [Edit] [Delete] ││
│ │ [●] Enterprise   │ Custom │  3 customers │ [Edit] [Delete] ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Edit Tags Modal (Customer)

```
┌─────────────────────────────────────────────────┐
│ Chỉnh sửa tags                              [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│ Khách hàng: Nguyen Van A (CUS-0001)             │
│                                                 │
│ Tags                                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ [✓ VIP] [✓ Long-term] [  Premium]           │ │
│ │ [  Referral] [  New] [  At-risk]            │ │
│ │ [  Partner] [  Enterprise]                  │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│                         [Hủy]    [Lưu thay đổi] │
└─────────────────────────────────────────────────┘
```

### Tag Chip Component

```
┌────────────────┐
│ [●] VIP    [x] │  ← With remove option
└────────────────┘

┌────────┐
│ [●] VIP│  ← Compact (in list)
└────────┘
```

### Design Tokens

- Tag chip: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium`
- Tag color dot: `w-2 h-2 rounded-full` with `backgroundColor: tag.color`
- Tag background: `backgroundColor: tag.color + '1A'` (10% opacity)
- Tag text: `color: tag.color`
- Tag remove button: `hover:bg-black/5 rounded-full p-0.5`
- Tags filter: multi-select dropdown with checkboxes
- Bulk action bar: `fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4`

## Technical Notes

### Tag Color Handling

```typescript
// Generate faded background from hex color
function getTagStyles(hexColor: string) {
  return {
    backgroundColor: hexColor + '1A', // 10% opacity
    color: hexColor
  };
}

// Tag component
function TagChip({ tag, onRemove }: { tag: Tag; onRemove?: () => void }) {
  const styles = getTagStyles(tag.color);
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={styles}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
      {tag.displayName}
      {onRemove && (
        <button onClick={onRemove} className="hover:bg-black/5 rounded-full p-0.5">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
```

### Filter Logic

```typescript
// Tags filter: AND logic (customer must have ALL selected tags)
const filterByTags = (customers: Customer[], tagIds: string[]) => {
  if (tagIds.length === 0) return customers;
  
  return customers.filter(customer =>
    tagIds.every(tagId => customer.tags.includes(tagId))
  );
};

// Exclude tags filter
const filterExcludeTags = (customers: Customer[], excludeTagIds: string[]) => {
  if (excludeTagIds.length === 0) return customers;
  
  return customers.filter(customer =>
    !excludeTagIds.some(tagId => customer.tags.includes(tagId))
  );
};
```

### Auto-assign Cron (Backend)

```typescript
// Daily cron job for auto-assign tags
async function syncCustomerTags() {
  // 1. Tag "New": Add to customers created < 30 days
  await db.customers
    .where('createdAt', '>', dayjs().subtract(30, 'day'))
    .addTag('new');
  
  // 2. Tag "New": Remove from customers created >= 30 days
  await db.customers
    .where('createdAt', '<=', dayjs().subtract(30, 'day'))
    .removeTag('new');
  
  // 3. Tag "Long-term": Check contract duration
  // 4. Tag "Premium": Check totalSpent
  // 5. Tag "At-risk": Check lastActivityDate
}
```

## Dependencies

**Phụ thuộc vào:**
- EP-01: Authentication (role check)
- F-16: Customer Profile (customer entity)
- F-17: Customer List (tags filter)
- F-18: Customer Details (tags display/edit)

**Được sử dụng bởi:**
- Reports: Segment analysis by tag
- Marketing Campaigns: Tag-based targeting (Phase 2)

## Ghi chú

- Tags là cách đơn giản nhất để segment customers
- System tags có auto-assign rules, custom tags hoàn toàn manual
- AND logic cho multi-tag filter (stricter, more useful)
- Bulk tag operations quan trọng cho productivity
- Tag colors nên contrast đủ để phân biệt được
