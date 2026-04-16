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

// Inventory Types
export enum InventoryStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface SparePart {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minimumStock: number;
  unitCost: number;
  supplier: string;
  status: InventoryStatus;
  lastRestocked: string;
}

// Updated types for AI Dispatch
export interface DispatchAssignment {
  requestId: string;
  truckId: string;
  driverId: string;
  reasoning: string;
  confidenceScore: number;
}

export enum VesselStatus {
  IN_TRANSIT = 'In Transit',
  ARRIVING = 'Arriving',
  DOCKED = 'Docked',
  UNLOADING = 'Unloading',
  DEPARTED = 'Departed'
}

export interface Vessel {
  id: string;
  name: string;
  type: 'Barge' | 'Cargo Ship';
  eta: string; // ISO date string or relative time
  status: VesselStatus;
  cargoType: string;
  cargoWeight: number; // tons
  destinationTerminal: string;
}

export type ViewState = 'dashboard' | 'assets' | 'drivers' | 'inspections' | 'dispatch' | 'map' | 'inventory' | 'vessels';

export interface FilterOption {
  label: string;
  value: string;
}

// ─── Port Operations Types ──────────────────────────────────────────────────

export interface EquipmentAvailability {
  unit: string;
  availability: number; // percentage
  downtime: number; // hours
}

export interface EquipmentUtilization {
  unit: string;
  utilization: number; // percentage
  availableHours: number;
  workingHours: number;
}

export interface LoadingRate {
  name: string; // unit, operator, wood type, or barge size
  rate: number; // t/h
  target: number;
}

export interface FuelEfficiency {
  name: string;
  efficiency: number; // L/t
  target: number;
}

export type BargeStatus = 'done' | 'live' | 'incoming';

export interface BargeOperation {
  name: string;
  loadingPoint: string;
  attachTime: string | null;
  detachTime: string | null;
  budgetDuration: string;
  actualDuration: string | null;
  status: BargeStatus;
}

export interface DeliveryTrendPoint {
  day: string;
  target: number;
  actual: number;
}

export interface WoodSpecies {
  code: string;
  fullName: string;
  percentage: number;
  tonnage: number;
}

export interface StackLoadingTime {
  stackType: string;
  avgTime: string;
  trips: number;
}

export interface CargoType {
  name: string;
  color: string;
}