# Case Study: Fleet Dispatch System (FDS)
## Intelligent Logistics Optimization with Gemini AI

### 1. Executive Summary
The **Fleet Dispatch System (FDS)** is a next-generation logistics command center designed for heavy-haul fleet operations in Southeast Asia. By integrating **Google Gemini AI**, FDS transforms raw telemetry and manual reports into actionable dispatch intelligence, ensuring the right driver is in the right truck for the right cargo, every time.

---

### 2. The Challenge: "The Logistics Rubik's Cube"
Traditional fleet management suffers from three critical "blind spots":
*   **Sub-Optimal Dispatching**: Human dispatchers often struggle to balance vehicle capacity (e.g., a 150t Volvo vs. a 40t Axor) with driver experience and current fatigue levels.
*   **Maintenance Subjectivity**: Mechanic notes are often messy or inconsistent, leading to "good enough" trucks being sent on high-stress long hauls.
*   **Reactive Lifecycle Management**: Vehicles are often replaced based on arbitrary age rather than actual health-to-mileage ratios.

---

### 3. The Solution: AI-Augmented Operations
FDS solves these problems by placing **Gemini AI** at the center of the decision-making loop.

#### A. The "Three-Way Match" (Dispatch Optimization)
Instead of simple scheduling, the AI performs a real-time assessment of:
1.  **The Request**: Weight, destination, and priority.
2.  **The Asset**: Model capability, current health score, and mileage.
3.  **The Human**: Experience, safety history, and fatigue level.
*Outcome: Assignments that maximize safety and fuel efficiency while minimizing mechanical wear.*

#### B. Automated Inspection Analysis
When an inspection is logged, Gemini analyzes the category-wise pass/fail status and the inspector's handwritten notes. It identifies "hidden" criticalities—such as a hydraulic warning on a super-heavy haul unit—and provides a clear "Dispatch Ready" or "Workshop Required" recommendation.

#### C. Predictive Asset Lifespan
Using historical mileage and purchase data, FDS generates a "Useful Life" prediction for every unit in the fleet. This allows managers to transition from reactive repairs to strategic refurbishments, extending the fleet's ROI.

---

### 4. Design & UX: The "Flexoki" System
FDS utilizes the **Flexoki** color palette—a warm, paper-inspired design system.
*   **Why?**: Logistics managers spend 8+ hours a day looking at screens. Standard "high-contrast blue" software causes eye fatigue. 
*   **The Feel**: The warm paper background and earthy oranges/yellows create a "calm-tech" environment, allowing critical alerts (in Red) to stand out more effectively.

---

### 5. Technical Stack
*   **Engine**: React 19 (ES6+ Modules)
*   **Intelligence**: @google/genai (Gemini 2.5 Flash)
*   **Styling**: Tailwind CSS with custom Flexoki tokens
*   **Visualization**: Recharts (Health Distribution) & Pigeon Maps (Live Telemetry)
*   **Icons**: Lucide React

---

### 6. Installation & Deployment
1.  Ensure an `API_KEY` for Google Gemini is provided in the environment.
2.  Import map handles all dependencies via `esm.sh`.
3.  Application is offline-ready and responsive across desktop and mobile tablet formats.

---
*Developed by the Senior Frontend Engineering Team.*