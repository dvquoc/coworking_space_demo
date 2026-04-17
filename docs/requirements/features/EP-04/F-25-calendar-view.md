# F-25 – Calendar View for Bookings

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-25 |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Should have |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations (Extended) |

## Mô tả nghiệp vụ

Hiển thị **calendar view** visualizing bookings theo thời gian để:
- **Staff**: Xem overview tất cả bookings để quản lý space availability
- **Customer**: Xem available time slots khi browsing spaces
- **Operations**: Identify patterns, peak hours, gaps

**Calendar Types:**
1. **Staff Calendar**: Tất cả bookings across all spaces
2. **Space Calendar**: Single space availability by date/time
3. **Customer Calendar**: "My Bookings" personal calendar

**Views:**
- **Day View**: Hourly timeline (7am-10pm)
- **Week View**: 7 days overview
- **Month View**: Full month grid

**Integration:**
- FullCalendar.js library (feature-rich, customizable)
- Color coding by status
- Click to view booking details
- Real-time updates (WebSocket)

## User Story

> Là **Staff**, tôi muốn **xem calendar view của tất cả bookings** để **nhanh chóng identify conflicts** và quản lý space utilization.

> Là **Customer**, khi chọn space, tôi muốn **xem calendar availability** để **dễ dàng pick time slot phù hợp** mà không cần thử từng slot.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Staff Calendar - All Bookings

- [ ] **AC1**: Staff menu: "Bookings" → "Calendar View"
- [ ] **AC2**: Default view: Week view (current week)
- [ ] **AC3**: View switcher: [Day] [Week] [Month] buttons
- [ ] **AC4**: Date navigation: [◀ Previous] [Today] [Next ▶]
- [ ] **AC5**: Current date highlighted with border
- [ ] **AC6**: Display all bookings across all spaces in building(s)

### Booking Display on Calendar

- [ ] **AC7**: Each booking shown as colored block/event
- [ ] **AC8**: Event shows:
  - Booking code (BK-001)
  - Customer name
  - Space name
  - Time range
- [ ] **AC9**: Color coding by status:
  - 🟢 Green: Confirmed
  - 🟡 Yellow: Awaiting approval
  - 🔵 Blue: Pending payment
  - 🟣 Purple: In progress (checked-in)
  - ⚫ Gray: Completed
  - 🔴 Red: Cancelled/No-show
- [ ] **AC10**: Event size proportional to duration

### Filters & Search

- [ ] **AC11**: Filter panel (sidebar/dropdown):
  - Building (multi-select)
  - Floor (multi-select)
  - Space type (multi-select)
  - Status (multi-select)
  - Customer type (Individual/Company)
- [ ] **AC12**: Apply filters: Calendar updates instantly
- [ ] **AC13**: Clear filters button
- [ ] **AC14**: Search box: By customer name or booking code

### Day View

- [ ] **AC15**: Time axis: 7:00 AM - 10:00 PM (configurable)
- [ ] **AC16**: Each space = separate row (multi-resource view)
- [ ] **AC17**: Bookings displayed in time slots
- [ ] **AC18**: Overlapping bookings (conflicts) highlighted in red
- [ ] **AC19**: Empty slots clearly visible

### Week View

- [ ] **AC20**: 7 columns (Mon-Sun)
- [ ] **AC21**: Each day shows bookings as stacked blocks
- [ ] **AC22**: Today column highlighted
- [ ] **AC23**: Hover over event: Tooltip with full details

### Month View

- [ ] **AC24**: Calendar grid (6 weeks)
- [ ] **AC25**: Each date cell shows:
  - Number of bookings: "5 bookings"
  - Dots colored by status
- [ ] **AC26**: Click date: Show day view
- [ ] **AC27**: Navigate months: ◀ Mar 2026 ▶

### Event Interaction

- [ ] **AC28**: Click event: Open booking detail modal
- [ ] **AC29**: Modal shows:
  - Full booking info
  - Customer details
  - Actions: Edit, Cancel (if allowed)
- [ ] **AC30**: Hover event: Quick tooltip (customer, space, time)

### Space Availability Calendar (Customer Portal)

- [ ] **AC31**: Customer browsing space: Click "View Calendar"
- [ ] **AC32**: Shows availability for THAT space only
- [ ] **AC33**: Available slots: Green/white background
- [ ] **AC34**: Booked slots: Gray (blocked)
- [ ] **AC35**: Click available slot: Pre-fill booking form with that time
- [ ] **AC36**: Display: "✓ Available" or "✗ Booked"

### My Bookings Calendar (Customer Portal)

- [ ] **AC37**: Customer menu: "My Bookings" → "Calendar View"
- [ ] **AC38**: Shows ONLY customer's own bookings
- [ ] **AC39**: Color coding same as staff view
- [ ] **AC40**: Click event: View booking details, download QR, cancel

### Real-time Updates

- [ ] **AC41**: When new booking created: Appears on calendar (no refresh)
- [ ] **AC42**: When booking cancelled: Removed from calendar
- [ ] **AC43**: When status changes: Color updates instantly
- [ ] **AC44**: Uses WebSocket or Server-Sent Events

### Export & Print

- [ ] **AC45**: "Export" button: Download as .ics (iCalendar format)
- [ ] **AC46**: "Print" button: Print-friendly view
- [ ] **AC47**: Export respects current filters

## Dữ liệu / Fields

### Calendar Event Object

```typescript
interface CalendarEvent {
  // Event ID
  id: string; // Booking ID
  
  // Display
  title: string; // "BK-001: Meeting Room A - John Doe"
  start: Date; // ISO 8601
  end: Date;
  
  // Styling
  backgroundColor: string; // Based on status
  borderColor: string;
  textColor: string;
  
  // Extended Props (for detail modal)
  extendedProps: {
    bookingCode: string;
    customerId: string;
    customerName: string;
    spaceId: string;
    spaceName: string;
    status: BookingStatus;
    price: number;
    checkInTime?: Date;
    checkOutTime?: Date;
  };
  
  // Resource (for day view multi-resource)
  resourceId?: string; // Space ID for grouping
}
```

### API Response Format

```typescript
interface CalendarDataResponse {
  events: CalendarEvent[];
  resources?: Array<{ // For day view
    id: string; // Space ID
    title: string; // Space name
    building: string;
    floor: number;
  }>;
  meta: {
    totalBookings: number;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Staff Views Week Calendar

```
Given Staff "Alice" logged in
And Current date: 16/04/2026 (Wednesday)
And 10 bookings exist this week across all spaces

When Alice navigates to "Bookings" → "Calendar View"

Then Page displays:
  • Week view by default
  • 7 columns: 14-20 April 2026
  • Today (16/04) column highlighted
  • 10 booking events displayed:
    - 3 confirmed (green)
    - 2 awaiting approval (yellow)
    - 1 pending payment (blue)
    - 2 in progress (purple)
    - 2 completed (gray)
And Calendar title: "14 - 20 April 2026"
And Events show: "BK-XXX: Space Name - Customer"
```

### Scenario 2: Filter by Building & Space Type

```
Given Calendar showing all 50 bookings (all buildings)

When Staff applies filters:
  • Building: "Building 1" (selected)
  • Space Type: "Meeting Room" (selected)
And Click "Apply Filters"

Then Calendar updates:
  • Shows only 8 bookings
  • All in Building 1
  • All Meeting Rooms
And Filter badge: "🔍 2 filters active"
And "Clear Filters" button visible
```

### Scenario 3: Day View - Multi-Resource

```
Given Staff switches to "Day View"
And Selects date: 16/04/2026
And Building 1 has 5 spaces

Then Calendar displays:
  • Time axis: 7:00 AM - 10:00 PM
  • 5 rows (one per space):
    - Hot Desk A
    - Meeting Room A
    - Meeting Room B
    - Private Office 201
    - Conference Room
  • Bookings displayed in time slots:
    - Meeting Room A: 9:00-11:00 (BK-001, confirmed)
    - Meeting Room B: 14:00-16:00 (BK-002, awaiting approval)
    - Conference Room: 16:00-18:00 (BK-003, in progress)
  • Empty slots clearly visible (white background)
```

### Scenario 4: Click Event to View Details

```
Given Week calendar displayed
And Event "BK-001" visible (Meeting Room A, 16/04 9:00-11:00)

When Staff clicks "BK-001" event

Then Detail modal opens:
  • Title: "Booking Details - BK-001"
  • Customer: John Doe (john@example.com)
  • Space: Meeting Room A, Floor 3
  • Date: 16/04/2026
  • Time: 9:00-11:00 (2 hours)
  • Status: Confirmed (green badge)
  • Price: 600,000 VND
  • Actions:
    - [View Full Details]
    - [Edit Booking] (if allowed)
    - [Cancel Booking]
And Click outside: Modal closes
```

### Scenario 5: Customer Views Space Availability

```
Given Customer "Bob" browsing "Meeting Room A"
And Views space detail page
And Clicks "View Calendar" button

Then Space availability calendar opens:
  • Week view
  • Shows ONLY "Meeting Room A" bookings
  • Available slots: Light green background
  • Booked slots: Gray, labeled "Unavailable"
  • Today: 16/04/2026
  • Display:
    - 16/04 9:00-11:00: ✗ Booked
    - 16/04 14:00-18:00: ✓ Available
    - 17/04 All day: ✓ Available
And Hover booked slot: "Reserved by another customer"
And Click available slot 14:00: Prefill booking form
```

### Scenario 6: Customer "My Bookings" Calendar

```
Given Customer "Sara" has 3 upcoming bookings

When Sara navigates to "My Bookings" → "Calendar View"

Then Calendar displays:
  • Month view
  • Only Sara's 3 bookings visible:
    - 18/04: Hot Desk A (confirmed) - green dot
    - 22/04: Meeting Room B (awaiting approval) - yellow dot
    - 25/04: Private Office (pending payment) - blue dot
  • Other dates: No events
And Click 18/04: Shows day view with that booking
And Click booking event: Detail modal with QR code
```

### Scenario 7: Real-time Update

```
Given Staff viewing calendar in week view
And WebSocket connection active

When Manager approves booking "BK-005" (status: awaiting_approval → confirmed)
And Event happened at backend

Then Calendar auto-updates:
  • BK-005 event color: Yellow → Green
  • No page refresh needed
  • Smooth transition animation
And Staff sees change immediately
```

### Scenario 8: Export to iCalendar (.ics)

```
Given Staff has filtered calendar:
  • Date range: 14-20 April 2026
  • Building 1 only
  • 8 bookings visible

When Staff clicks "Export" button
And Selects format: "iCalendar (.ics)"

Then System generates .ics file:
  • Filename: "bookings_20260414-20260420.ics"
  • Contains 8 events
  • Each event has:
    - SUMMARY: Booking code + Space
    - DTSTART/DTEND: Times
    - DESCRIPTION: Customer, price details
    - LOCATION: Space address
And Browser downloads file
And Staff can import to Google Calendar, Outlook, Apple Calendar
```

### Scenario 9: Month View - High Density Day

```
Given Month view displayed
And Date 20/04/2026 has 12 bookings

Then That date cell shows:
  • "12 bookings"
  • Colored dots (max 5 visible dots, then "+7")
  • Dot colors represent statuses:
    - 🟢🟢🟢🟢🟡 +7
And Click date: Navigate to day view for 20/04
And Day view shows all 12 bookings in timeline
```

### Scenario 10: Detect Overlap/Conflict

```
Given Day view displayed for Meeting Room A
And Existing booking: 14:00-16:00 (confirmed)
And New booking created: 15:00-17:00 (CONFLICT)

Then Calendar displays:
  • Both events visible
  • Overlapping portion: Red border/background
  • Warning icon: ⚠️ on both events
  • Tooltip: "Conflict detected with BK-XXX"
And Staff can click to resolve
```

## UI/UX Design

### Staff Week View

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Bookings Calendar                    [Day][Week][Month]     │
│  ◀ Previous  |  14 - 20 April 2026  |  Next ▶   [Today]        │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [Building 1 ▼] [All Floors ▼] [All Types ▼]          │
│           [Status: All ▼]  [Clear Filters]  🔍 [Search...]      │
├─────────────────────────────────────────────────────────────────┤
│       Mon 14  Tue 15  Wed 16  Thu 17  Fri 18  Sat 19  Sun 20   │
│                         TODAY                                   │
├─────────────────────────────────────────────────────────────────┤
│ 9:00  │       │       │ BK-001 │       │       │       │       │
│       │       │       │ MeetA  │       │       │       │       │
│       │       │       │ John   │       │       │       │       │
│       │       │       │ [Green]│       │       │       │       │
├─────────────────────────────────────────────────────────────────┤
│ 14:00 │ BK-002│       │       │       │ BK-004│       │       │
│       │ Conf  │       │       │       │ Hot A │       │       │
│       │ Sara  │       │       │       │ Bob   │       │       │
│       │[Yellow│       │       │       │[Green]│       │       │
├─────────────────────────────────────────────────────────────────┤
│       [Export .ics]  [Print]                   🔔 Real-time ON  │
└─────────────────────────────────────────────────────────────────┘
```

### Day View - Multi-Resource

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Wednesday, 16 April 2026            [Day][Week][Month]      │
│  ◀ Previous  |  Today  |  Next ▶                                │
├─────────────────────────────────────────────────────────────────┤
│ Space          │ 7AM  8AM  9AM  10AM  11AM  12PM  1PM  2PM  3PM │
├─────────────────────────────────────────────────────────────────┤
│ Hot Desk A     │                                  [BK-004]      │
│                │                                  Bob, 2h       │
│                │                                  [Green]       │
├─────────────────────────────────────────────────────────────────┤
│ Meeting Room A │           [BK-001: John Doe, 2h]               │
│                │           [Green - Confirmed]                  │
├─────────────────────────────────────────────────────────────────┤
│ Meeting Room B │                              [BK-002]          │
│                │                              Sara, 2h          │
│                │                              [Yellow]          │
├─────────────────────────────────────────────────────────────────┤
│ Conf Room      │                                        [BK-003] │
│                │                                        Alice    │
│                │                                        [Purple] │
└─────────────────────────────────────────────────────────────────┘
```

### Customer Space Availability

```
┌──────────────────────────────────────────────────┐
│  Meeting Room A - Availability                   │
│  Week of 14 - 20 April 2026                      │
├──────────────────────────────────────────────────┤
│       Mon 14  Tue 15  Wed 16  Thu 17  Fri 18    │
├──────────────────────────────────────────────────┤
│ 9:00  ✓ Avail ✓ Avail ✗ Booked ✓ Avail ✓ Avail │
│ 14:00 ✓ Avail ✗ Booked ✓ Avail ✓ Avail ✓ Avail │
│ 16:00 ✗ Booked ✓ Avail ✓ Avail ✗ Booked ✓ Avail│
├──────────────────────────────────────────────────┤
│  Legend: ✓ Available (click to book)            │
│          ✗ Booked (unavailable)                  │
│                                                  │
│  [Close]                                         │
└──────────────────────────────────────────────────┘
```

### Event Detail Modal

```
┌──────────────────────────────────────────┐
│  Booking Details - BK-001            [×] │
├──────────────────────────────────────────┤
│                                          │
│  Status: ✅ Confirmed                    │
│                                          │
│  📍 Meeting Room A                       │
│     Floor 3, Building 1                  │
│                                          │
│  👤 Customer: John Doe                   │
│     📧 john@example.com                  │
│     📱 0912345678                         │
│                                          │
│  📅 Wednesday, 16 April 2026             │
│  ⏰ 9:00 AM - 11:00 AM (2 hours)         │
│                                          │
│  💰 Price: 600,000 VND                   │
│  💳 Payment: Paid                        │
│                                          │
│  📝 Notes: "Need projector"              │
│                                          │
│  [View Full Details]                     │
│  [Edit Booking]  [Cancel Booking]        │
│                                          │
└──────────────────────────────────────────┘
```

## API Endpoints

```typescript
// Get calendar data for date range
GET /api/calendar/bookings
Query: {
  start: '2026-04-14T00:00:00Z'; // ISO 8601
  end: '2026-04-20T23:59:59Z';
  building?: string;
  floor?: number;
  spaceType?: string;
  status?: string[];
}
Response: CalendarDataResponse

// Get availability for specific space
GET /api/spaces/:spaceId/availability
Query: {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day'; // Hour for day view, day for month
}
Response: {
  space: SpaceInfo;
  slots: Array<{
    start: Date;
    end: Date;
    available: boolean;
    bookingId?: string; // If booked
  }>;
}

// Get customer's bookings for calendar
GET /api/customer/bookings/calendar
Query: { start: Date; end: Date; }
Response: CalendarDataResponse

// Real-time updates (WebSocket)
WS /ws/calendar
Events:
  • booking.created
  • booking.updated
  • booking.cancelled
  • booking.status_changed
Payload: { event: CalendarEvent }
```

## Technical Notes

### FullCalendar Integration

```typescript
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';

function BookingCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  useEffect(() => {
    // Initial load
    fetchCalendarData();
    
    // WebSocket for real-time updates
    const ws = new WebSocket('ws://api/ws/calendar');
    ws.onmessage = (msg) => {
      const update = JSON.parse(msg.data);
      handleEventUpdate(update);
    };
  }, []);
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, resourceTimelinePlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,timeGridWeek,dayGridMonth'
      }}
      events={events}
      eventClick={handleEventClick}
      eventColor="#3788d8"
      eventClassNames={(arg) => getEventClass(arg.event.extendedProps.status)}
      height="auto"
    />
  );
}
```

### Color Mapping

```typescript
const STATUS_COLORS = {
  confirmed: {
    backgroundColor: '#22c55e', // Green
    borderColor: '#16a34a',
    textColor: '#ffffff'
  },
  awaiting_approval: {
    backgroundColor: '#eab308', // Yellow
    borderColor: '#ca8a04',
    textColor: '#ffffff'
  },
  pending_payment: {
    backgroundColor: '#3b82f6', // Blue
    borderColor: '#2563eb',
    textColor: '#ffffff'
  },
  in_progress: {
    backgroundColor: '#a855f7', // Purple
    borderColor: '#9333ea',
    textColor: '#ffffff'
  },
  completed: {
    backgroundColor: '#6b7280', // Gray
    borderColor: '#4b5563',
    textColor: '#ffffff'
  },
  cancelled: {
    backgroundColor: '#ef4444', // Red
    borderColor: '#dc2626',
    textColor: '#ffffff'
  },
  no_show: {
    backgroundColor: '#f87171', // Light red
    borderColor: '#ef4444',
    textColor: '#000000'
  }
};
```

### Performance Optimization

- **Caching**: Cache calendar data for 1 minute
- **Pagination**: Load events only for visible date range
- **Lazy loading**: Load event details on click
- **Debouncing**: Filter changes debounced 300ms
- **Virtualization**: For day view with many resources (>20)

### Export .ics Generation

```typescript
import ical from 'ical-generator';

function exportToICalendar(events: CalendarEvent[]) {
  const calendar = ical({ name: 'Cobi Bookings' });
  
  events.forEach(event => {
    calendar.createEvent({
      start: event.start,
      end: event.end,
      summary: event.title,
      description: `Customer: ${event.extendedProps.customerName}\nPrice: ${event.extendedProps.price} VND`,
      location: event.extendedProps.spaceName,
      url: `https://cobi.vn/bookings/${event.id}`
    });
  });
  
  const icsContent = calendar.toString();
  downloadFile('bookings.ics', icsContent);
}
```

## Dependencies

**Phụ thuộc vào:**
- F-24: Staff booking (data source)
- F-24B: Customer booking (data source)
- F-26: Conflict detection (show overlaps)
- EP-01: Auth (permissions)

**Được sử dụng bởi:**
- EP-11: Reports (booking patterns analysis)
- F-27: Booking management (quick navigation)

## Out of Scope

**Phase 1 không làm:**
- Drag & drop to reschedule → Phase 2
- Create booking directly from calendar (click empty slot) → Phase 2
- Resource utilization heatmap → Phase 2
- Calendar sharing (public URL) → Phase 3
- Integration with Google Calendar (2-way sync) → Phase 3

## Testing Checklist

- [ ] Week view displays all bookings correctly
- [ ] Day view shows multi-resource timeline
- [ ] Month view shows booking count per date
- [ ] Event colors match status correctly
- [ ] Click event opens detail modal
- [ ] Filters update calendar instantly
- [ ] Real-time updates work (WebSocket)
- [ ] Customer availability shows correct slots
- [ ] Export .ics file works
- [ ] Mobile responsive (touch-friendly)

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team
