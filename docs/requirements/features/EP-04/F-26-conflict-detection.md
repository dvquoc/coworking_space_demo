# F-26 – Conflict Detection (Prevent Double-Booking)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| ID | F-26 |
| Epic | EP-04 - Booking & Reservation |
| Độ ưu tiên | Must have (Critical) |
| Người tạo | BA |
| Ngày tạo | 16/04/2026 |
| Trạng thái | Draft |
| Phase | Phase 1 - Core Operations |

## Mô tả nghiệp vụ

Hệ thống tự động phát hiện và **ngăn chặn double-booking** (đặt trùng) cho cùng một space trong cùng khung thời gian. Đây là tính năng **critical** để đảm bảo:
- Không có 2 customer cùng book 1 space cùng lúc
- Tránh conflicts và disputes
- Đảm bảo data integrity
- Maintain customer trust

**Conflict scenarios cần xử lý:**
1. **Complete overlap**: Booking mới hoàn toàn trùng với booking cũ
2. **Partial overlap**: Booking mới chỉ trùng một phần
3. **Concurrent booking attempts**: 2 users book cùng lúc (race condition)
4. **Extension conflicts**: Extend booking hiện tại nhưng trùng với booking khác

**Không coi là conflict:**
- Back-to-back bookings: BookingA 10:00-12:00, BookingB 12:00-14:00 ✅
- Cancelled/no-show bookings
- Different spaces (cùng floor khác space ✅)
- Maintenance periods (separate check)

## User Story

> Là **System**, tôi muốn **tự động phát hiện conflicts** khi tạo/sửa booking để **ngăn chặn double-booking**, đảm bảo integrity và customer experience.

## Tiêu chí chấp nhận (Acceptance Criteria)

### Detection Algorithm
- [ ] **AC1**: Check conflicts khi:
  - Tạo booking mới (F-24, F-24B)
  - Edit booking (F-27)
  - Extend duration
  - Reschedule (change time)
- [ ] **AC2**: Conflict query logic:
  ```
  EXISTS booking WHERE:
    space_id = requested_space_id
    AND status NOT IN ('cancelled', 'no_show')
    AND start_time < requested_end_time
    AND end_time > requested_start_time
  ```
- [ ] **AC3**: Back-to-back KHÔNG conflict:
  - BookingA 10:00-12:00, BookingB 12:00-14:00 → OK ✅
  - End time của A == Start time của B → Allowed
- [ ] **AC4**: Overlaps bất kỳ thời gian nào → Conflict ❌

### Error Handling
- [ ] **AC5**: Nếu phát hiện conflict:
  - Return error code: `BOOKING_CONFLICT`
  - Không save booking vào database
  - Show user-friendly error message
- [ ] **AC6**: Error message chi tiết:
  - "Space [name] is already booked"
  - "Conflicting booking: [time range]"
  - "Booked by: [customer]" (nếu staff view)
- [ ] **AC7**: Suggest alternatives:
  - Time slots available before/after
  - Other spaces cùng type và capacity
  - Nearest available time

### Concurrent Request Handling
- [ ] **AC8**: Use **database locking** để prevent race condition:
  - `SELECT ... FOR UPDATE` (pessimistic locking)
  - HOẶC optimistic locking với `version` field
- [ ] **AC9**: Nếu 2 users book cùng lúc:
  - First request wins
  - Second request gets conflict error
  - Total time từ check → insert < 200ms

### Performance
- [ ] **AC10**: Conflict check < 100ms (95th percentile)
- [ ] **AC11**: Index optimization: `(space_id, start_time, end_time, status)`
- [ ] **AC12**: Avoid full table scan, limit query to specific space

### Integration
- [ ] **AC13**: Conflict check integrated vào:
  - Create booking API (F-24, F-24B)
  - Edit booking API (F-27)
  - Bulk booking API (future)
- [ ] **AC14**: Calendar UI real-time highlighting:
  - Show booked slots as red/disabled
  - Update availability after each booking

## Dữ liệu / Fields

### Conflict Check Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| spaceId | UUID | Yes | Space to check |
| startTime | ISO DateTime | Yes | Requested start time |
| endTime | ISO DateTime | Yes | Requested end time |
| excludeBookingId | UUID | No | Exclude khi edit (để không conflict với chính nó) |

### Conflict Response

```typescript
interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts?: Array<{
    bookingId: string;
    bookingCode: string;
    customerId: string;
    customerName: string; // Optional, nếu staff view
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
  }>;
  alternatives?: Array<{
    type: 'time_slot' | 'space';
    spaceId?: string;
    spaceName?: string;
    startTime?: Date;
    endTime?: Date;
    reason: string; // "Available 2 hours later", "Similar space available"
  }>;
}
```

## Scenarios (Given / When / Then)

### Scenario 1: Complete Overlap (Exact same time)

```
Given Meeting Room 101 đã có booking:
  • Booking "BK-001"
  • Time: 10:00-12:00 ngày 20/04/2026
  • Status: confirmed

When User cố tạo booking mới:
  • Space: Meeting Room 101
  • Time: 10:00-12:00 ngày 20/04/2026

Then System check conflicts:
  • Query: start_time < 12:00 AND end_time > 10:00
  • Found: BK-001
And Return error:
  • hasConflict: true
  • conflicts: [BK-001]
  • Message: "❌ Meeting Room 101 is already booked 10:00-12:00"
And Booking không được tạo
```

### Scenario 2: Partial Overlap (Start earlier)

```
Given Meeting Room 101 booked 10:00-12:00
When User book 09:00-11:00 (overlap 1 hour: 10:00-11:00)

Then Conflict detected:
  • Requested: 09:00-11:00
  • Existing: 10:00-12:00
  • Overlap: 10:00-11:00 (1 hour)
And Error: "Conflict from 10:00-11:00"
And Suggest alternative: "Available 12:00-14:00"
```

### Scenario 3: Partial Overlap (Extend past existing)

```
Given Meeting Room 101 booked 10:00-12:00
When User book 11:30-13:00 (overlap 30 min: 11:30-12:00)

Then Conflict detected:
  • Overlap: 11:30-12:00
And Error: "Room already booked until 12:00"
And Suggest: "Available after 12:00. Book 12:00-13:30?"
```

### Scenario 4: Back-to-Back (NO Conflict)

```
Given Meeting Room 101 booked 10:00-12:00
When User book 12:00-14:00 (start = previous end)

Then NO conflict:
  • Check: start_time (12:00) < existing.end_time (12:00)? NO
  • Check: end_time (14:00) > existing.start_time (10:00)? YES
  • BUT start_time == existing.end_time → Special case: Allow
And Booking created successfully ✅
```

### Scenario 5: Concurrent Requests (Race Condition)

```
Given Meeting Room 101 available 14:00-16:00
When User A và User B cùng lúc book 14:00-16:00:
  • Request A arrives 10:30:00.123
  • Request B arrives 10:30:00.456 (333ms sau)

# --- In Database Transaction ---

Then Request A:
  • BEGIN TRANSACTION
  • SELECT ... FOR UPDATE (lock rows)
  • Check conflicts: None found
  • INSERT booking (BK-A)
  • COMMIT
  • Response: Success ✅

And Request B (333ms sau):
  • BEGIN TRANSACTION
  • SELECT ... FOR UPDATE (wait for lock)
  • Lock released after Request A commits
  • Check conflicts: Found BK-A
  • ROLLBACK (no insert)
  • Response: Conflict ❌

And Final state: Only BK-A exists in database
And User B sees: "Room just booked by another customer. Please select another time."
```

### Scenario 6: Edit Booking (No Self-Conflict)

```
Given Booking "BK-001" exists:
  • Space: Meeting Room 101
  • Time: 14:00-16:00

When Manager edit BK-001, extend to 14:00-17:00

Then Conflict check:
  • Query includes: exclude_booking_id = BK-001
  • So BK-001 không được coi là conflict với chính nó
  • Check other bookings: None found
And Update successful ✅

When Manager edit và có booking khác 16:30-18:00

Then Conflict detected:
  • New end time 17:00 overlaps with 16:30-18:00
  • Overlap: 16:30-17:00
And Error: "Cannot extend. Another booking starts at 16:30"
```

### Scenario 7: Cancelled Booking (Ignore in Check)

```
Given Meeting Room 101 có 2 bookings:
  • BK-001: 10:00-12:00, status: cancelled
  • BK-002: 14:00-16:00, status: confirmed

When User book 10:00-14:00

Then Conflict check:
  • Query: status NOT IN ('cancelled', 'no_show')
  • BK-001 ignored (cancelled)
  • Check overlap với BK-002: Yes (14:00)
And Conflict: "Overlaps with booking 14:00-16:00"
And Suggest: "Available 10:00-14:00 if you adjust end time"
```

### Scenario 8: Suggest Alternative Times

```
Given Meeting Room 101 schedule:
  • 09:00-11:00: Booked
  • 11:00-13:00: Available
  • 13:00-15:00: Booked
  • 15:00-17:00: Available

When User book 12:00-14:00 (conflicts với 13:00-15:00)

Then System suggest alternatives:
  • "Available 11:00-13:00 (before your requested time)"
  • "Available 15:00-17:00 (after your requested time)"
  • "Meeting Room 102 available 12:00-14:00 (similar room)"
And Sort by: Closest time match first
```

## Technical Implementation

### SQL Query (PostgreSQL)

```sql
-- Conflict check với pessimistic locking
BEGIN;

SELECT 
  id, booking_code, customer_id, start_time, end_time, status
FROM bookings
WHERE 
  space_id = :space_id
  AND id != COALESCE(:exclude_booking_id, '00000000-0000-0000-0000-000000000000')
  AND status NOT IN ('cancelled', 'no_show')
  AND start_time < :requested_end_time
  AND end_time > :requested_start_time
FOR UPDATE; -- Lock để prevent concurrent booking

-- Nếu no results: Insert booking
-- Nếu có results: Conflict, return error

COMMIT; -- hoặc ROLLBACK nếu conflict
```

### Database Index

```sql
CREATE INDEX idx_booking_conflict_check 
ON bookings (
  space_id, 
  start_time, 
  end_time, 
  status
) 
WHERE status NOT IN ('cancelled', 'no_show');

-- Partial index: Chỉ index active bookings
-- Significantly faster for conflict checks
```

### Backend Service (TypeScript)

```typescript
class BookingConflictService {
  async checkConflict(params: {
    spaceId: string;
    startTime: Date;
    endTime: Date;
    excludeBookingId?: string;
  }): Promise<ConflictCheckResult> {
    
    // Validate input
    if (params.startTime >= params.endTime) {
      throw new Error('Start time must be before end time');
    }
    
    // Query conflicts
    const conflicts = await db.query(`
      SELECT id, booking_code, customer_id, start_time, end_time
      FROM bookings
      WHERE space_id = $1
        AND ($2::uuid IS NULL OR id != $2)
        AND status NOT IN ('cancelled', 'no_show')
        AND start_time < $4
        AND end_time > $3
      FOR UPDATE
    `, [
      params.spaceId,
      params.excludeBookingId,
      params.startTime,
      params.endTime
    ]);
    
    if (conflicts.length === 0) {
      return { hasConflict: false };
    }
    
    // Generate alternatives
    const alternatives = await this.suggestAlternatives(params);
    
    return {
      hasConflict: true,
      conflicts: conflicts.map(c => ({
        bookingId: c.id,
        bookingCode: c.booking_code,
        startTime: c.start_time,
        endTime: c.end_time,
        status: c.status
      })),
      alternatives
    };
  }
  
  async suggestAlternatives(params: {...}): Promise<Alternative[]> {
    // Logic:
    // 1. Find available time slots cùng space
    // 2. Find similar spaces (same type, capacity) available
    // 3. Return top 3 suggestions
    // Implementation...
  }
}
```

### Frontend Error Display (React)

```typescript
function BookingForm() {
  const [conflictError, setConflictError] = useState<ConflictCheckResult | null>(null);
  
  const handleSubmit = async () => {
    try {
      await createBooking(formData);
      // Success
    } catch (error) {
      if (error.code === 'BOOKING_CONFLICT') {
        setConflictError(error.details);
      }
    }
  };
  
  return (
    <>
      {conflictError && (
        <Alert type="error">
          <h4>❌ Booking Conflict Detected</h4>
          <p>
            {conflictError.conflicts[0].spaceName} is already booked 
            {formatTimeRange(conflictError.conflicts[0])}
          </p>
          
          <h5>Try these alternatives:</h5>
          <ul>
            {conflictError.alternatives.map(alt => (
              <li key={alt.id}>
                <button onClick={() => selectAlternative(alt)}>
                  {alt.reason}
                </button>
              </li>
            ))}
          </ul>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </>
  );
}
```

## Performance Benchmarks

| Metric | Target | Method |
|--------|--------|--------|
| Conflict check query | < 50ms | Indexed query, lock timeout 5s |
| Total transaction time | < 200ms | From check → insert → commit |
| Concurrent requests handling | 100 TPS | Connection pooling, optimistic locking |
| Lock wait timeout | 5 seconds | Prevent deadlocks |

## Edge Cases

### Case 1: Timezone Issues
- **Problem**: User in GMT+7, booking stored in UTC
- **Solution**: 
  - Frontend sends ISO 8601 with timezone
  - Backend converts to UTC for storage
  - Conflict check always in UTC
  - Display to user in local timezone

### Case 2: Daylight Saving Time
- **Problem**: March 10, 2:00 AM doesn't exist (DST forward)
- **Solution**: Use UTC internally, handle DST in presentation layer

### Case 3: Leap Seconds
- **Impact**: Minimal, booking granularity is minutes
- **Solution**: Ignore, not relevant for coworking bookings

### Case 4: Database Clock Drift
- **Problem**: App server time != DB server time
- **Solution**: 
  - Use DB server time as source of truth
  - `NOW()` from database, not application
  - Sync clocks với NTP

## Dependencies

**Phụ thuộc vào:**
- EP-02: Space data (spaceId must exist)
- Database: Transaction support (ACID), row-level locking

**Được sử dụng bởi:**
- F-24: Staff booking
- F-24B: Customer self-booking
- F-27: Edit/extend booking
- F-29: Recurring bookings (Phase 2)

## Out of Scope

**Phase 1 không làm:**
- Soft conflicts (warnings but allow override) → Phase 2
- Capacity-based conflicts (over-booking allowed) → Phase 2
- Resource conflicts (shared amenities) → Phase 3
- Predictive conflict alerts → Phase 3

## Testing Strategy

### Unit Tests
- Complete overlap detection
- Partial overlap (all variations)
- Back-to-back allowed
- Cancelled bookings ignored
- Self-exclusion when editing

### Integration Tests
- Database locking behavior
- Transaction rollback on conflict
- Concurrent request simulation (JMeter)

### Performance Tests
- 100 concurrent booking attempts
- Measure lock wait times
- Query execution plan analysis

## Monitoring & Alerts

### Metrics to Track
- Conflict error rate (should be < 5% of bookings)
- Avg conflict check duration
- Lock wait timeouts (should be rare)
- Race condition occurrences

### Alerts
- **Warning**: Conflict rate > 10% (may indicate UX issue)
- **Critical**: Lock wait timeout > 1/minute (database issue)
- **Critical**: Conflict check > 500ms (index problem)

---

**Version**: 1.0  
**Last Updated**: 16/04/2026  
**Author**: BA Team  
**Reviewed By**: Tech Lead
