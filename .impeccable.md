## Design Context

### Users
Logistics managers and Transport Command Center operators managing end-to-end heavy-haul supply chains. They use this tool for 8+ hours a day to monitor fleet health, generate dispatch plans via AI, and actively manage real-time transport operations. The environment requires low eye strain and high situational awareness.

### Brand Personality
Accurate, clean, deterministic. The interface should feel like a high-precision instrument—confident, free of bloat, and completely trustworthy.

### Aesthetic Direction
A "Calm Intelligence" primary mode (built on Flexoki-inspired warm/low-strain neutrals) that reduces eye fatigue during long shifts, shifting into "Mission Control" or "War Room" modes for high-density planning or active ops. The visual language must clearly distinguish AI-suggested actions (requiring review) from human-initiated actions. The design should avoid bloated generic SaaS patterns (no rounded glassmorphism, no side-stripe borders). Typography should explore highly readable, precision-focused sans-serifs paired with technical monospace fonts for telemetry.

### Design Principles
1. **Low-Strain Clarity:** Use perceptually uniform OKLCH colors, tint neutrals toward the brand hue, and rely on the Flexoki "warm paper" ethos to prevent eye fatigue.
2. **Deterministic Layouts:** Establish a clear visual hierarchy (Inbound -> Yard -> Outbound) where data has a designated zone. Favor structured grids and predictable patterns.
3. **Accountable AI:** Every AI action must be visually distinct, explicitly stating its reasoning and confidence score, defaulting to a "Review-driven" mode.
4. **Information Density over Decorative Fluff:** Eliminate overused "designy" elements (gradient text, arbitrary borders, nested cards). Replace margin-collapse chaos with predictable gap-based spacing.
5. **Moral Accessibility Choice:** Enforce WCAG AA contrast minimums and build colorblind-safe palettes for all status indicators (Alerts/Errors/Success), vital for quick-glance operational safety. 
