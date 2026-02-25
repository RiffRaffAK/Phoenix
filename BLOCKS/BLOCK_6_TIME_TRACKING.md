# BLOCK 6: Nanosecond Precision Time Tracking

> **Status:** ACTIVE | **Precision:** 1 nanosecond | **Immutable:** YES | **Multi-Jurisdiction:** 200+

---

## 6.1 Overview

Block 6 is the time tracking substrate of Phoenix Wolf Systems. It provides nanosecond-precision labor time tracking, wage calculation, overtime detection, and historical time ledger management for all CAVE entities and their workers. Time is treated as the sovereign resource it is — every nanosecond of labor is accounted for and compensated fairly.

> *"Time is the only resource that cannot be replaced. Phoenix Wolf Systems treats every second of your labor as sacred."*
> — Block 6 Preamble

---

## 6.2 Time Clock Architecture

### Nanosecond Precision Clock
```
TIME_CLOCK:
  source: CLOCK_REALTIME_NS (hardware)
  backup: Network Time Protocol (stratum 1)
  tertiary: Schumann Resonance lock (7.83 Hz)
  precision: 1 nanosecond
  max_drift: ±100 nanoseconds/day
  
  read_time():
    t_hw = hardware_clock_ns()
    t_ntp = ntp_clock_ns()
    t_schumann = schumann_derived_clock_ns()
    return consensus(t_hw, t_ntp, t_schumann)
```

### Clock-In / Clock-Out
```
CLOCK_IN(employee_id, cave_id):
  verify_identity(employee_id)  // biometric or cryptographic
  timestamp_in = nanosecond_clock()
  create_time_record({
    employee_id: employee_id,
    cave_id: cave_id,
    start_ns: timestamp_in,
    status: ACTIVE,
    hash_chain: SHA3_256(timestamp_in + previous_record_hash)
  })
  
CLOCK_OUT(employee_id, cave_id):
  timestamp_out = nanosecond_clock()
  close_time_record({
    end_ns: timestamp_out,
    duration_ns: timestamp_out - start_ns,
    status: CLOSED,
    hash_chain: SHA3_256(timestamp_out + record_hash)
  })
```

---

## 6.3 Wage Calculation Formulas

### Base Wage Calculation
```
WAGE_CALCULATION(time_record):
  duration_hours = time_record.duration_ns / 3_600_000_000_000
  
  base_rate = load_employee_rate(time_record.employee_id)
  jurisdiction = load_jurisdiction(time_record.work_location)
  
  // Ensure minimum wage compliance
  effective_rate = max(base_rate, jurisdiction.minimum_wage())
  
  // Base pay
  base_pay = duration_hours × effective_rate
  
  return base_pay
```

### Overtime Detection and Calculation
```
OVERTIME_CALCULATION(employee_id, pay_period):
  records = load_time_records(employee_id, pay_period)
  jurisdiction = load_jurisdiction(employee.work_location)
  
  // Daily overtime (some jurisdictions)
  for day in pay_period.days():
    daily_hours = sum(records.filter(date=day).duration_hours)
    if daily_hours > jurisdiction.daily_overtime_threshold():
      overtime_hours = daily_hours - jurisdiction.daily_overtime_threshold()
      daily_overtime_pay = overtime_hours × effective_rate × jurisdiction.daily_ot_multiplier()
  
  // Weekly overtime
  weekly_hours = sum(records.duration_hours)
  if weekly_hours > jurisdiction.weekly_overtime_threshold():
    weekly_overtime_hours = weekly_hours - jurisdiction.weekly_overtime_threshold()
    weekly_overtime_pay = weekly_overtime_hours × effective_rate × 1.5
  
  // Double time (California and equivalent)
  if jurisdiction.has_double_time():
    double_time_hours = calculate_double_time_hours(records, jurisdiction)
    double_time_pay = double_time_hours × effective_rate × 2.0
  
  return total_overtime_pay
```

---

## 6.4 Break Time Management

### Break Requirements by Jurisdiction
| Jurisdiction Type | Short Break | Meal Break | Trigger |
|---|---|---|---|
| California-style | 10 min/4 hrs | 30 min unpaid / 5 hrs | Mandatory |
| Federal (FLSA) | 20 min (paid if <30) | 30 min (unpaid if relieved) | Guideline |
| EU-style | 20 min / 6 hrs | 30 min / 6 hrs | Mandatory |
| Custom | Configurable | Configurable | Per agreement |

### Automated Break Tracking
```
BREAK_TRACKER(employee_session):
  elapsed_hours = session.elapsed_hours()
  breaks_taken = session.breaks_taken()
  jurisdiction = load_jurisdiction(employee.work_location)
  
  required_breaks = jurisdiction.calculate_required_breaks(elapsed_hours)
  
  if breaks_taken < required_breaks.short_breaks:
    ALERT_EMPLOYEE("Break required", priority=LOW)
    ALERT_MANAGER("Break compliance", priority=LOW)
    LOG_BREAK_VIOLATION_RISK()
  
  if elapsed_hours > jurisdiction.meal_break_trigger:
    if not breaks_taken.has_meal_break():
      ALERT_EMPLOYEE("Meal break required", priority=HIGH)
      AUTO_CLOCK_OUT_MEAL_BREAK()  // for mandatory states
```

---

## 6.5 Multi-Jurisdiction Labor Law Integration

Time tracking integrates with the CAVE labor law compliance engine (Block 5) for automatic compliance across all relevant jurisdictions:

| Jurisdiction Feature | Detection | Action |
|---|---|---|
| Minimum wage below threshold | Real-time | Automatic rate increase |
| Overtime not paid | End of pay period | Automatic overtime calculation |
| Break not provided | During shift | Manager alert + record |
| Rest period violation | Between shifts | Flagged for compliance review |
| Child labor hour violation | Real-time | Immediate alert + restriction |
| Shift scheduling violation | Schedule creation | Block non-compliant schedule |
| Predictive scheduling violation | 2 weeks prior | Penalty calculation |

---

## 6.6 Time Zone Management

```
TIMEZONE_HANDLER:
  // All internal records stored in UTC nanoseconds
  internal_time = UTC_nanoseconds
  
  // Display conversion
  display_time = convert_to_local(internal_time, employee.timezone)
  
  // Jurisdiction determination
  jurisdiction = determine_from_work_location_coordinates(lat, lon)
  applicable_tz = jurisdiction.timezone
  
  // DST handling
  if applicable_tz.is_dst_observing(display_time):
    display_time = apply_dst_offset(display_time, applicable_tz)
  
  // International Date Line
  if crossing_date_line(work_location):
    handle_date_line_crossing(time_record)
```

---

## 6.7 Attendance Verification

Multiple verification methods are supported, in order of security level:

| Method | Security Level | Privacy Level | Description |
|---|---|---|---|
| Biometric (fingerprint) | HIGH | MEDIUM | Stored as hash, never raw |
| Biometric (face) | HIGH | LOW (opt-in only) | Camera at work site |
| Cryptographic key | HIGH | HIGH | Hardware security key |
| Mobile device + GPS | MEDIUM | MEDIUM | Location-aware mobile app |
| Badge scan | MEDIUM | HIGH | Traditional RFID |
| Manager verification | LOW | HIGH | Manual punch-in oversight |
| Honor system | LOW | HIGHEST | For trusted remote workers |

All verification methods produce an identical time record format. The verification method used is logged but does not affect wage calculation.

---

## 6.8 Productivity Metrics

Productivity tracking is **always opt-in** and fully transparent to the employee:

```
PRODUCTIVITY_TRACKING (opt-in only):
  Tracked (with consent):
    - Tasks completed (from project management integration)
    - Customer interactions (count only, not content)
    - Output metrics (units, tickets, pages — industry-specific)
    - Active session time vs. idle time (aggregate only)
  
  NEVER Tracked:
    - Keystrokes
    - Screenshot capture
    - Website visits (outside company systems)
    - Personal communications
    - Location outside work hours
    - Biometric data outside verification
```

All productivity data belongs to the employee. They may revoke consent at any time, which immediately deletes all productivity data.

---

## 6.9 Pay Period Management

### Pay Period Types
| Type | Frequency | Periods/Year | Common In |
|---|---|---|---|
| Weekly | Every 7 days | 52 | Hourly workers |
| Bi-weekly | Every 14 days | 26 | Most US workers |
| Semi-monthly | Twice/month | 24 | Salaried US workers |
| Monthly | Once/month | 12 | International standard |
| Daily | Every day | 365 | Gig/daily workers |
| Real-time | Continuous | ∞ | Phoenix UBI-style |

### Pay Calculation Sequence
```
PAY_CALCULATION_SEQUENCE(pay_period, cave_id):
  Step 1: Collect all time records for period
  Step 2: Verify all time records (hash chain validation)
  Step 3: Calculate base wages
  Step 4: Calculate overtime
  Step 5: Apply bonuses and commissions
  Step 6: Apply benefits deductions
  Step 7: Apply tax withholdings (all applicable jurisdictions)
  Step 8: Apply garnishments (legally required)
  Step 9: Calculate net pay
  Step 10: Generate pay stub (detailed breakdown)
  Step 11: Schedule payment (or immediate if real-time)
  Step 12: Log pay event (immutable)
```

---

## 6.10 Historical Time Ledger

All time records are stored in an immutable, append-only ledger:

```
TIME_LEDGER:
  record_id: UUID
  employee_id: UUID
  cave_id: UUID
  start_ns: bigint (nanoseconds since Unix epoch)
  end_ns: bigint
  duration_ns: bigint
  location: {lat, lon} (encrypted)
  wage_rate: decimal
  gross_pay: decimal
  verification_method: VerificationMethod
  hash_chain: SHA3_256 (links to previous record)
  block_proof: proof_of_inclusion  // Merkle proof
  
  IMMUTABLE: true
  RETENTION: min(employee_lifetime + 7_years, forever)
```

**Access Control:**
- Employee sees their own records — always, forever
- CAVE owner sees their CAVE's records — for 7 years after employment ends
- Tax authorities see wage records — per jurisdiction requirements
- Labor authorities see on demand with valid legal order
- Courts see with valid order
- No other party has access

---

## 6.11 Integration with UBI System

Time tracking data flows directly into UBI calculations:

```
UBI_INTEGRATION:
  labor_income = calculate_period_wages(employee_id, period)
  ubi_base = load_ubi_rate(employee.jurisdiction)
  
  // UBI supplements labor income
  if labor_income < ubi_base:
    supplement = ubi_base - labor_income
    distribute_ubi_supplement(employee_id, supplement)
  elif labor_income > 0:
    // Still eligible for partial UBI
    partial_ubi = calculate_partial_ubi(labor_income, ubi_base)
    distribute_ubi(employee_id, partial_ubi)
  
  // Time worked contributes to platform royalty calculation
  total_labor_time = sum(all_employee_time_records)
  royalty_accrual = total_labor_time × DAILY_ROYALTY_RATE
  accrue_founder_royalty(royalty_accrual)
```

---

## 6.12 Leap Second Handling

```
LEAP_SECOND_HANDLER:
  // When a positive leap second is announced:
  on_leap_second_announcement(leap_second_ts):
    // Record will naturally span the leap second
    // Duration calculation accounts for 61-second minute
    update_duration_algorithm(period_containing_leap_second)
    notify_payroll_systems("Leap second in period: adjust if needed")
  
  // Historical correction
  if historical_record_spans_known_leap_second(record):
    corrected_duration = record.duration_ns + LEAP_SECOND_NS
    update_record_with_correction(record.id, corrected_duration)
    log_correction(record.id, "Leap second correction", timestamp_ns())
```

---

*Block 6 — Nanosecond Time Tracking | Immutable Ledger | Multi-Jurisdiction | Real-Time Compliance*
