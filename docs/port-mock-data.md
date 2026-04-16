# Mock Data Extracted from Dashboard.jsx

This document contains all the mock data identified in `src/components/Dashboard.jsx`.

## 1. Constants and Colors
```javascript
const COLORS = ["#38BDF8", "#FB923C", "#A78BFA", "#34D399"];
const TARGET_COLOR = "#F59E0B";
const DAILY_ACTUAL = 14136;
const MTD_ACTUAL_BASE = 196336;
```

## 2. Equipment Data
### Availability Data (`availData`)
| Unit | Availability (%) | Downtime (h) |
| :--- | :--- | :--- |
| MHP001 | 92 | 1.9 |
| MHP002 | 88 | 2.9 |
| MHP003 | 96 | 1.0 |
| MHP004 | 85 | 3.6 |

### Utilization Data (`utilData`)
| Unit | Utilization (%) | Available (h) | Working (h) |
| :--- | :--- | :--- | :--- |
| MHP001 | 73 | 22.1 | 16.1 |
| MHP002 | 65 | 21.1 | 13.7 |
| MHP003 | 78 | 23.0 | 17.9 |
| MHP004 | 68 | 20.4 | 13.9 |

## 3. Performance Data (Loading & Fuel)
- **Unit Target**: 355 t/h
- **Operator Target**: 355 t/h
- **Wood Type Target**: 355 t/h

#### Units
- MHP001: 360
- MHP002: 349
- MHP003: 442
- MHP004: 326

#### Operators (Sample)
- Budi S.: 382
- Andi R.: 345
- Hendra W.: 410
- Rizki F.: 338
- Syaiful H.: 367
- Taufik M.: 395
- Dedi K.: 372
- Bambang R.: 405
- Yanto P.: 328
- Agus S.: 355
- Wawan B.: 420
- Eko J.: 315
- Ferry A.: 388
- Iwan C.: 342

#### Wood Types
- Accacia Crassicarpa Debark (ACDB): 385
- Accacia Crassicarpa Barkon (ACBO): 342
- Accacia Crassicarpa Woodchip (ACWC): 415
- Accacia Mangium Debark (AMDB): 310
- Gmelina Arborea Debark (GMDB): 395
- Eucalyptus Woodchip (EUWC): 358
- Accacia Mangium Barkon (AMBO): 358

#### Cargo Types
- Pulp
- Paper
- Salt
- Coal
- Burnt Lime
- Palm Kernel Shell
- Palm Kernel Expeller

#### Barge Sizes
- 300ft: 390
- 420ft: 410
- 270ft: 365
- 280ft: 340
- 230ft: 320
- 260ft: 330
- 290ft: 375

### Fuel Efficiency Data 
- **Target**: 0.15 L/t

#### Units
- MHP001: 0.144
- MHP002: 0.149
- MHP003: 0.161
- MHP004: 0.152

#### Operators (Sample)
- Budi S.: 0.138
- Andi R.: 0.142
- Hendra W.: 0.115
- Rizki F.: 0.148
- Syaiful H.: 0.152
- Taufik M.: 0.155
- Dedi K.: 0.158
- Bambang R.: 0.161
- Yanto P.: 0.164
- Agus S.: 0.167
- Wawan B.: 0.170
- Eko J.: 0.173
- Ferry A.: 0.176
- Iwan C.: 0.179

## 4. Barge Operations
### Current Barge Data (`bargeData`)
| Barge | LP | Attach | Detach | Budget | Duration | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KLM MAJU | LP-01 | 06:12 | 09:45 | 3h 30m | 3h 33m | done |
| BG HARAPAN | LP-02 | 07:30 | 11:10 | 3h 45m | 3h 40m | done |
| TK SINAR | LP-01 | 10:00 | — | 4h 00m | In Progress | live |
| KM BERKAH | LP-03 | 13:15 | — | 12h 15m | In Progress | live |
| DHL EXPRESS | LP-04 | — | — | 18h 30m | — | incoming |

### Barge Pool (`bargePool`)
A list of 9 barges used for dynamic data generation (KLM MAJU, BG HARAPAN, TK SINAR, KM BERKAH, BG SEJAHTERA, KM LESTARI, TK INDAH, BG MAKMUR, DHL EXPRESS).

## 5. Logistics Detail
### Loading Time by Stack (`stackData`)
- Single Trailer: 00:19 avg, 4 trips
- Double Trailer: 00:22 avg, 14 trips
- Triple Trailer: 00:24 avg, 38 trips
- Quad Trailer: 00:30 avg, 29 trips

### Delivery Trend (`deliveryTrend`)
10 days of Target (19,000-20,500) vs Actual (14,136-23,100).

### Wood Species Mix (`woodTypeData`)
- ACDB: 74%, 10,447t
- AMDB: 2%, 278t
- GMDB: 24%, 3,411t

