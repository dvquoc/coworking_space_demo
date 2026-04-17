# EP-14 – Community & Events Management

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | EP-14 |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 2 - Growth Features |
| Độ ưu tiên | Nice to have |

## Mô tả

Quản lý sự kiện cộng đồng: workshops, networking events, training sessions. Customers đăng ký tham gia, check-in tại sự kiện, feedback sau sự kiện. Tăng engagement và tạo community.

## Features thuộc Epic này

### Phase 2 Features

| ID | Tên | Mô tả ngắn | Trạng thái |
|----|-----|------------|------------|
| F-111 | Event creation | Tạo sự kiện, set capacity, date/time | Draft |
| F-112 | Event registration | Customers đăng ký tham gia | Draft |
| F-113 | Event check-in | Check-in attendees tại sự kiện | Draft |
| F-114 | Event calendar | Lịch sự kiện, filter by type | Draft |

## Data Models

### Event
```typescript
interface Event {
  id: string;
  title: string;                // "Networking Evening"
  description: string;
  type: EventType;
  
  // Schedule
  startDate: Date;
  endDate: Date;
  location: string;             // "Meeting Room A, Building 1"
  
  // Capacity
  maxAttendees: number;
  currentAttendees: number;
  
  // Registration
  registrationDeadline?: Date;
  isPublic: boolean;            // Public (all customers) or Private (invite-only)
  
  // Status
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  
  // Organizer
  organizerId: string;          // Staff ID
  
  createdAt: Date;
  updatedAt: Date;
}

enum EventType {
  WORKSHOP = 'workshop',         // Workshop, training
  NETWORKING = 'networking',     // Networking event
  SEMINAR = 'seminar',
  SOCIAL = 'social',             // Happy hour, lunch
  OTHER = 'other'
}
```

### EventRegistration
```typescript
interface EventRegistration {
  id: string;
  eventId: string;
  customerId: string;
  
  // Registration
  registeredAt: Date;
  status: 'registered' | 'checked_in' | 'cancelled' | 'no_show';
  
  // Check-in
  checkInTime?: Date;
  
  // Feedback
  rating?: number;              // 1-5 stars
  feedbackText?: string;
}
```

## User Stories

### US-111: Create event
> Là **Manager**, tôi muốn **tạo event** để **organize community activities**

**Acceptance Criteria**:
- [ ] Form: title, description, type, date/time, location, capacity
- [ ] Set registration deadline
- [ ] Public/private option
- [ ] Status: draft → can edit, published → customers can register

### US-112: Customer registers for event
> Là **Customer**, tôi muốn **đăng ký tham gia event** để **join community**

**Acceptance Criteria**:
- [ ] View event list (published, upcoming)
- [ ] Click "Register"
- [ ] If not full → Registration created, status registered
- [ ] If full → Waitlist (optional) or "Event Full"
- [ ] Confirmation email sent

### US-113: Check-in at event
> Là **Event organizer**, tôi muốn **check-in attendees** để **track participation**

**Acceptance Criteria**:
- [ ] Event day → Organizer opens check-in screen
- [ ] Scan customer QR code or search by name
- [ ] Mark registration status → checked_in
- [ ] Track: registered vs checked_in count

### US-114: Post-event feedback
> Là **Customer**, tôi muốn **rate event** để **provide feedback**

**Acceptance Criteria**:
- [ ] After event ends, customers receive feedback link
- [ ] Rate 1-5 stars, optional comment
- [ ] Feedback saved to EventRegistration

## Scenarios

### Scenario 1: Create networking event
```
Given Manager wants to organize networking event
When Create event:
  - title: "Cobi Networking Evening"
  - type: networking
  - date: 2026-05-15 18:00-21:00
  - location: "Rooftop, Building 1"
  - maxAttendees: 50
  - isPublic: true
And Click "Publish"
Then Event.status → published
And Customers can see event in calendar và register
```

### Scenario 2: Customer registers
```
Given Event "Networking Evening" published, currentAttendees = 45/50
When Customer "CUS-020" clicks "Register"
Then EventRegistration created:
  - status: registered
And Event.currentAttendees → 46
And Confirmation email sent to customer
```

### Scenario 3: Event check-in
```
Given Event day, 40 customers registered
When Organizer scans customer QR at venue
Then Registration.status → checked_in, checkInTime = now
And Dashboard shows: 25/40 checked in
```

## Phụ thuộc

**Phụ thuộc vào**:
- EP-03: Customer (attendees)
- EP-02: Property (event location = meeting rooms)

## Out of Scope Phase 2
- Waitlist for full events → Phase 3
- Event photos gallery → Phase 3
- Integration with calendar (Google Calendar sync) → Phase 3

## Technical Notes

### Notifications
- Event published → Email to all customers (if public)
- Reminder 1 day before event
- Post-event feedback request

### Capacity Management
- Before registration: Check `currentAttendees < maxAttendees`
- Use optimistic locking to prevent over-booking

## Ghi chú
- Phase 2 vì community building là growth feature
- Events tăng customer engagement và retention
