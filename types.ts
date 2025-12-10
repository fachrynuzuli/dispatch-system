export enum TruckStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip',
  MAINTENANCE = 'Maintenance',
  INSPECTION_PENDING = 'Inspection Pending'
}

export enum InspectionDecision {
  PENDING = 'Pending',
  DISPATCH_READY = 'Dispatch Ready',
  WORKSHOP = 'Workshop Required'
}

export interface Truck {
  id: string;
  plate: string;
  model: string;
  mileage: number;
  status: TruckStatus;
  healthScore: number; // 0-100
  lastInspection: string;
  purchaseDate: string;
  location: [number, number]; // [lat, lng]
}

export interface Inspection {
  id: string;
  truckId: string;
  date: string;
  inspectorName: string;
  items: {
    category: string;
    status: 'Pass' | 'Fail' | 'Warning';
    notes: string;
  }[];
  overallNotes: string;
  decision: InspectionDecision;
  aiAnalysis?: string;
}

export interface DispatchRequest {
  id: string;
  customerName: string;
  destination: string;
  cargoWeight: number; // in tons
  requiredDate: string;
  status: 'Pending' | 'Assigned' | 'Completed';
  assignedTruckId?: string;
  assignedDriverId?: string;
}

// New Driver Types
export interface Driver {
  id: string;
  name: string;
  licenseClass: 'SIM B1' | 'SIM B2 Umum'; 
  status: 'Available' | 'On Trip' | 'Resting' | 'Leave';
  fatigueLevel: 'Low' | 'Medium' | 'High'; // AI inferred or sensor data
  safetyScore: number; // 0-100
  yearsExperience: number;
  certifications: string[]; // e.g., 'Heavy Haul', 'Hazmat'
}

// Updated types for AI Dispatch
export interface DispatchAssignment {
  requestId: string;
  truckId: string;
  driverId: string;
  reasoning: string;
  confidenceScore: number;
}

export type ViewState = 'dashboard' | 'assets' | 'drivers' | 'inspections' | 'dispatch' | 'map';

export interface FilterOption {
  label: string;
  value: string;
}