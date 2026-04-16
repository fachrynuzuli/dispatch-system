# Design Brief: AI-First Supply Chain Command Platform

## 1. Feature Summary

An AI-first logistics command platform for Transport Command Center operators managing end-to-end heavy-haul supply chains — from incoming barge arrivals and port loading through truck dispatch, route monitoring, woodyard unloading, and workshop maintenance cycles. The platform embeds intelligent decision-making at every operational node so that micro-decisions across the chain are calculated, accountable, and traceable — not left to muscle memory. This is the prototype/demo for what aims to be the **#1 AI-first Fleet Management System B2B software in the world**.

**Target domains**: Timber/Pulp & Paper, Mining, Port Container, General Heavy-Haul.

---

## 2. Primary User Action

The Transport Command Center operator opens this platform for exactly **three reasons**:

| Intent | Question | Typical Actions |
|--------|----------|-----------------|
| **Monitor** | "What needs my attention right now?" | Check maintenance schedules, inspection results, incoming barges, alerts |
| **Dispatch** | "What should I dispatch next?" | Post-inspection ready trucks, takt-time slots, unplanned incoming requests |
| **Plan** | "What's tomorrow's plan?" | Create or edit AI-assisted dispatch plans for the next cycle |

The platform must make all three intents instantly accessible from the moment of login — no hunting, no navigation maze.

---

## 3. Design Direction

### Three Distinct Modes (Theme-Level Distinction)

The user explicitly wants **three experiential modes** embedded as selectable themes, each matching a different operational posture:

#### A. **Calm Intelligence** (Default / Monitor mode)
- **Feel**: Clean, ambient awareness. Only what matters surfaces. Warm, low-strain.
- **When**: Routine monitoring, reviewing status, scanning for exceptions.
- **Aesthetic**: Think air traffic control at 2AM when all flights are on schedule. Quiet confidence. Muted surfaces, subtle data, alerts that *earn* their visual weight.

#### B. **Mission Control** (Plan mode)
- **Feel**: Structured, methodical, status-oriented. Dense but organized.
- **When**: Creating tomorrow's dispatch plan, allocating trucks, reviewing berthing schedules.
- **Aesthetic**: Think NASA flight director console — clear status boards, structured grids, everything in its designated zone. Information-rich but never chaotic.

#### C. **War Room** (Dispatch / Active Ops mode)
- **Feel**: High-control, data-rich, decisive. Urgency without panic.
- **When**: Active dispatching, real-time monitoring, responding to events.
- **Aesthetic**: Think military operations center during a deployment — live feeds, decisive action surfaces, clear chain of command between AI recommendation and human decision.

### AI Interaction Philosophy

Three tiers of AI autonomy (paralleling coding agents like Claude Code, Cursor):

| Mode | Behavior | Visual Distinction |
|------|----------|-------------------|
| **Secure** | AI asks before doing anything risky. Safety maximized, speed lowest. | AI suggestions clearly require explicit human approval |
| **Review-driven** | AI does most work, pauses at key moments for review. | AI actions appear as "pending review" items the operator confirms |
| **Agent-driven** | AI acts autonomously, prioritizing speed. | AI actions stream as completed, with undo/override available |

> [!IMPORTANT]
> **Critical design constraint**: There must be a **clean, unmistakable visual distinction** between AI-initiated actions and human-initiated actions throughout the entire interface. When AI suggests something, the suggestion must be *right* — this means AI confidence visualization is non-negotiable.

### Anti-References (What This Must NOT Be)

- **NOT Jira**: No multi-approval flows, no bloated navigation, no glorified spreadsheet UI.
- **NOT Generic GPS Tracker**: No spinning numbers going nowhere, no data vomit, no dashboard headaches.
- **NOT SAP**: No multi-layer approval chains, no excessive mouse travel, no click-clack busywork, no non-deterministic UI patterns.

---

## 4. Layout Strategy

### Information Architecture — The Operations Chain

The platform follows the actual operational flow, not an arbitrary nav structure:

```
INBOUND                    YARD                      OUTBOUND
─────────                  ────                      ────────
Incoming Barge ──┐
Berthing Plan ───┤         Truck Inspection ──┐      Route Optimization
Material Handler ┤         Workshop/Repair ───┤      Load at Port
Port Loading ────┘         Part Readiness ────┤      Travel & Monitor
                           Truck Readiness ───┘      Unload at Woodyard
                                                     Weighing (loaded/empty)
                                                     Net Weight Capture
                    ┌──────────────────────┐
                    │   DISPATCH CENTER    │
                    │   (The Decision Hub) │
                    └──────────────────────┘
```

### Visual Hierarchy

1. **Dispatch Center** is the gravitational center — the primary workspace where allocation decisions happen.
2. **Inbound pipeline** (barges, port) feeds into dispatch from the left/top.
3. **Yard status** (trucks, maintenance, inspection) feeds into dispatch from the center.
4. **Outbound operations** (routes, loading, unloading) flow out from dispatch to the right/bottom.
5. **AI layer** is ever-present but non-intrusive — a persistent intelligence surface (not a chatbot drawer).

### Parallel Planning Streams

The operational flow has **branching activities** that happen in parallel during planning:

- Port material handler allocation
- Workshop maintenance scheduling
- Truck allocation
- Woodyard material handler allocation

These must be represented as concurrent lanes or parallel tracks, not forced into a single linear flow.

---

## 5. Key States

### Global States

| State | What User Sees | What User Feels |
|-------|---------------|-----------------|
| **All Clear** | Minimal alerts, plan on track, green signals | Confidence, calm |
| **Attention Needed** | Specific items flagged, prioritized by urgency | Focused, directed |
| **Active Dispatch** | Live operations feed, real-time position, events streaming | In control, decisive |
| **Planning Mode** | Tomorrow's plan canvas, allocation grids, AI suggestions | Methodical, strategic |

### Per-Node States (Each Operational Node)

| State | Description |
|-------|-------------|
| **Idle** | No activity, showing last known status |
| **Awaiting Input** | AI has a suggestion, waiting for human confirmation |
| **In Progress** | Active operation underway (truck en route, barge berthing, repair in workshop) |
| **Blocked** | Dependency unmet (part not available, truck failed inspection, berth occupied) |
| **Completed** | Operation finished, results captured |
| **Exception** | Unexpected event (delay, accident, unplanned maintenance) |

### Edge Cases

- **Empty fleet**: Zero available trucks — AI should proactively surface this
- **Mass inspection failure**: Multiple trucks fail simultaneously — escalation pattern
- **Barge surge**: Multiple barges arriving same window — bottleneck detection
- **Workshop overflow**: More repair orders than workshop capacity — queue management
- **No connectivity**: Offline/degraded state for field operations
- **First-time use**: Demo/onboarding mode with guided hotspots (SCNSoft pattern)

---

## 6. Interaction Model

### Core Interactions

**AI-Assisted Planning (Primary Flow)**
1. Operator opens Planning mode
2. AI pre-generates recommended dispatch plan based on: incoming barges, truck readiness, driver availability, maintenance schedules, takt time
3. Plan appears as a structured allocation — trucks mapped to routes, drivers to trucks, material handlers to jetties
4. Operator reviews, adjusts, approves (or asks AI to re-optimize specific segments)
5. Approved plan becomes tomorrow's active dispatch queue

**Real-Time Dispatch (Active Ops)**
1. Truck becomes ready (post-inspection/maintenance)
2. AI matches truck + driver to next pending request
3. Single-action confirm OR auto-dispatch (depending on autonomy mode)
4. Live tracking begins — events stream in (departure, loading, weighing, arrival)
5. Exceptions surface as interruptions that demand attention

**Exception Handling**
1. Event occurs (delay, accident, breakdown)
2. AI analyzes impact on downstream operations
3. AI suggests corrective action (re-route, swap truck, delay berth)
4. Operator confirms or overrides
5. Cascade effects update automatically across all affected nodes

### Navigation Model

- **No deep navigation trees** — maximum 2 levels from any screen to any action
- **Command palette / quick action bar** — keyboard-first for power users (Cmd+K pattern)
- **Contextual actions** — right-click or hover reveals relevant operations per node
- **AI as co-pilot** — not a chat window in the corner, but an embedded intelligence layer within each operational view

---

## 7. Content Requirements

### Operational Labels
- Use domain language: "Berth," "Jetty," "Material Handler," "Takt Time," "Net Weight," "Dispatch Ready"
- Avoid generic SaaS language: "Tickets," "Tasks," "Backlog," "Sprint"

### AI Communication
- AI outputs must be **terse, confident, and actionable**
- Format: **Decision → Reasoning → Confidence** (not reasoning → reasoning → reasoning → maybe a decision)
- Example: "Dispatch TRK-C-4021 to North Port. Volvo FH-16, 150t capacity matches 140t cargo. Driver Budi Santoso: 15yr exp, Heavy Haul cert, safety 96. Confidence: 94%."

### Status Language
- Use operational verbs: "Berthing," "Loading," "Inspecting," "Repairing," "Dispatching," "Travelling," "Unloading," "Weighing"
- Avoid: "Processing," "Pending," "In Queue" (too generic)

### Empty States
- Not "No data available" — instead, contextual: "No barges scheduled for today. Next arrival: Oceanic Pioneer, Dec 6 08:00."
- Empty dispatch queue: "All trucks dispatched. Fleet utilization: 94%. Next available: TRK-A-2031 at 14:30."

### Error/Exception Messages
- Not "An error occurred" — instead: "Truck TRK-B-7721 failed hydraulics inspection. Workshop bay 3 available. AI recommends repair priority: HIGH (affects tomorrow's 140t haul to North Port)."

### Dynamic Content Ranges
- Trucks: 10–500+ (prototype: 50)
- Drivers: 10–200+ (prototype: 20)
- Active dispatch requests: 0–100+ per day (prototype: 25)
- Barges: 0–20 per port per day (prototype: 4)
- Spare parts: 50–5000 SKUs (prototype: 8)

---

## 8. Recommended References

For implementation, consult these design references (from impeccable skill):

| Reference | Why |
|-----------|-----|
| `spatial-design.md` | Complex multi-panel layouts, parallel planning streams, dense data grids |
| `interaction-design.md` | AI confirmation flows, command palette, progressive disclosure |
| `motion-design.md` | State transitions between calm/mission/war modes, live data animations |
| `color-and-contrast.md` | Three distinct theme palettes, status color systems, AI vs human distinction |
| `typography.md` | Data-dense typography scales, monospace for operational codes, hierarchy in tables |
| `ux-writing.md` | Operational language, AI output formatting, empty/error states |

---

## 9. Open Questions

> [!IMPORTANT]
> ### Questions That Will Impact Implementation

1. **Three-theme scope for prototype**: Building three fully distinct themes (Calm Intelligence, Mission Control, War Room) is substantial. For the prototype:
   - Should all three be fully built now?
   - Or should we nail one (Calm Intelligence as default) and stub the other two?
   - Or should the themes be more like density/contrast adjustments rather than fully different visual systems?

Answer: Nail the Calm Intelligence (current theme) first. The other two can be stubbed for now.

2. **Operational flow completeness**: Your flow description (#7) covers ~15 distinct operational nodes. For the prototype, which subset should be fully interactive vs. shown as read-only status?
   - **Fully interactive (CRUD + AI)**: Dispatch, Truck Readiness, Inspection
   - **Read + AI analysis**: Barge/Berthing, Port Loading, Workshop
   - **Read-only / stub**: Woodyard, Weighing, Route Optimization
   - Does this prioritization match your intent?

Answer: perfect.

3. **Demo mode**: The SCNSoft-style guided tour — should this be:
   - A separate deployment/branch (as you described)?
   - Or a toggleable overlay within the same app (like Intercom product tours)?
   - When do you plan to build this? Before or after the prototype matures?

Answer: another deployment on different branch. build after prototype complete.

4. **AI autonomy modes**: For the prototype, should we implement all three AI modes (Secure / Review / Agent-driven), or start with Review-driven as the default and add the others later?

Answer: start with Review-driven as the default and add the others later.

5. **Data model expansion**: The current types.ts covers Trucks, Drivers, Inspections, Dispatch Requests, Spare Parts, and Vessels. The expanded flow adds:
   - Berthing Plan (jetty allocation + time slots)
   - Material Handler / Mantsinen (equipment allocation)
   - Woodyard (unloading bays, material handlers)
   - Weighbridge (loaded/empty weights, net weight)
   - Workshop (work orders, defect lists, repair status)
   - Route optimization data
   
   Should all of these be modeled in the prototype, or a focused subset?

Answer: focused subset.

6. **Naming**: "Fleet Dispatch System (FDS)" reflects the current scope. With the expanded vision, should the platform be renamed? Some directions:
   - Keep FDS (familiar, specific)
   - "Supply Chain Command" / "SCC"
   - "Operations Command Platform" / "OCP"  
   - Something else entirely?

Answer: Keep FDS (familiar, specific)