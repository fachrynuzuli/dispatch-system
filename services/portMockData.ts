import {
  EquipmentAvailability,
  EquipmentUtilization,
  LoadingRate,
  FuelEfficiency,
  BargeOperation,
  BargeStatus,
  DeliveryTrendPoint,
  WoodSpecies,
  StackLoadingTime,
  CargoType,
} from '../types';

// ─── Equipment Data ─────────────────────────────────────────────────────────

export const MOCK_EQUIPMENT_AVAILABILITY: EquipmentAvailability[] = [
  { unit: 'MHP001', availability: 92, downtime: 1.9 },
  { unit: 'MHP002', availability: 88, downtime: 2.9 },
  { unit: 'MHP003', availability: 96, downtime: 1.0 },
  { unit: 'MHP004', availability: 85, downtime: 3.6 },
];

export const MOCK_EQUIPMENT_UTILIZATION: EquipmentUtilization[] = [
  { unit: 'MHP001', utilization: 73, availableHours: 22.1, workingHours: 16.1 },
  { unit: 'MHP002', utilization: 65, availableHours: 21.1, workingHours: 13.7 },
  { unit: 'MHP003', utilization: 78, availableHours: 23.0, workingHours: 17.9 },
  { unit: 'MHP004', utilization: 68, availableHours: 20.4, workingHours: 13.9 },
];

// ─── Loading Rates ──────────────────────────────────────────────────────────

export const LOADING_RATE_TARGET = 355; // t/h

export const MOCK_LOADING_RATES_BY_UNIT: LoadingRate[] = [
  { name: 'MHP001', rate: 360, target: LOADING_RATE_TARGET },
  { name: 'MHP002', rate: 349, target: LOADING_RATE_TARGET },
  { name: 'MHP003', rate: 442, target: LOADING_RATE_TARGET },
  { name: 'MHP004', rate: 326, target: LOADING_RATE_TARGET },
];

export const MOCK_LOADING_RATES_BY_OPERATOR: LoadingRate[] = [
  { name: 'Budi S.', rate: 382, target: LOADING_RATE_TARGET },
  { name: 'Andi R.', rate: 345, target: LOADING_RATE_TARGET },
  { name: 'Hendra W.', rate: 410, target: LOADING_RATE_TARGET },
  { name: 'Rizki F.', rate: 338, target: LOADING_RATE_TARGET },
  { name: 'Syaiful H.', rate: 367, target: LOADING_RATE_TARGET },
  { name: 'Taufik M.', rate: 395, target: LOADING_RATE_TARGET },
  { name: 'Dedi K.', rate: 372, target: LOADING_RATE_TARGET },
  { name: 'Bambang R.', rate: 405, target: LOADING_RATE_TARGET },
  { name: 'Yanto P.', rate: 328, target: LOADING_RATE_TARGET },
  { name: 'Agus S.', rate: 355, target: LOADING_RATE_TARGET },
  { name: 'Wawan B.', rate: 420, target: LOADING_RATE_TARGET },
  { name: 'Eko J.', rate: 315, target: LOADING_RATE_TARGET },
  { name: 'Ferry A.', rate: 388, target: LOADING_RATE_TARGET },
  { name: 'Iwan C.', rate: 342, target: LOADING_RATE_TARGET },
];

export const MOCK_LOADING_RATES_BY_WOOD: LoadingRate[] = [
  { name: 'ACDB', rate: 385, target: LOADING_RATE_TARGET },
  { name: 'ACBO', rate: 342, target: LOADING_RATE_TARGET },
  { name: 'ACWC', rate: 415, target: LOADING_RATE_TARGET },
  { name: 'AMDB', rate: 310, target: LOADING_RATE_TARGET },
  { name: 'GMDB', rate: 395, target: LOADING_RATE_TARGET },
  { name: 'EUWC', rate: 358, target: LOADING_RATE_TARGET },
  { name: 'AMBO', rate: 358, target: LOADING_RATE_TARGET },
];

export const MOCK_LOADING_RATES_BY_BARGE: LoadingRate[] = [
  { name: '300ft', rate: 390, target: LOADING_RATE_TARGET },
  { name: '420ft', rate: 410, target: LOADING_RATE_TARGET },
  { name: '270ft', rate: 365, target: LOADING_RATE_TARGET },
  { name: '280ft', rate: 340, target: LOADING_RATE_TARGET },
  { name: '230ft', rate: 320, target: LOADING_RATE_TARGET },
  { name: '260ft', rate: 330, target: LOADING_RATE_TARGET },
  { name: '290ft', rate: 375, target: LOADING_RATE_TARGET },
];

// ─── Fuel Efficiency ────────────────────────────────────────────────────────

export const FUEL_EFFICIENCY_TARGET = 0.15; // L/t

export const MOCK_FUEL_BY_UNIT: FuelEfficiency[] = [
  { name: 'MHP001', efficiency: 0.144, target: FUEL_EFFICIENCY_TARGET },
  { name: 'MHP002', efficiency: 0.149, target: FUEL_EFFICIENCY_TARGET },
  { name: 'MHP003', efficiency: 0.161, target: FUEL_EFFICIENCY_TARGET },
  { name: 'MHP004', efficiency: 0.152, target: FUEL_EFFICIENCY_TARGET },
];

export const MOCK_FUEL_BY_OPERATOR: FuelEfficiency[] = [
  { name: 'Budi S.', efficiency: 0.138, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Andi R.', efficiency: 0.142, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Hendra W.', efficiency: 0.115, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Rizki F.', efficiency: 0.148, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Syaiful H.', efficiency: 0.152, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Taufik M.', efficiency: 0.155, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Dedi K.', efficiency: 0.158, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Bambang R.', efficiency: 0.161, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Yanto P.', efficiency: 0.164, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Agus S.', efficiency: 0.167, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Wawan B.', efficiency: 0.170, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Eko J.', efficiency: 0.173, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Ferry A.', efficiency: 0.176, target: FUEL_EFFICIENCY_TARGET },
  { name: 'Iwan C.', efficiency: 0.179, target: FUEL_EFFICIENCY_TARGET },
];

// ─── Barge Operations ───────────────────────────────────────────────────────

export const MOCK_BARGE_OPERATIONS: BargeOperation[] = [
  { name: 'KLM MAJU', loadingPoint: 'LP-01', attachTime: '06:12', detachTime: '09:45', budgetDuration: '3h 30m', actualDuration: '3h 33m', status: 'done' },
  { name: 'BG HARAPAN', loadingPoint: 'LP-02', attachTime: '07:30', detachTime: '11:10', budgetDuration: '3h 45m', actualDuration: '3h 40m', status: 'done' },
  { name: 'TK SINAR', loadingPoint: 'LP-01', attachTime: '10:00', detachTime: null, budgetDuration: '4h 00m', actualDuration: 'In Progress', status: 'live' },
  { name: 'KM BERKAH', loadingPoint: 'LP-03', attachTime: '13:15', detachTime: null, budgetDuration: '12h 15m', actualDuration: 'In Progress', status: 'live' },
  { name: 'DHL EXPRESS', loadingPoint: 'LP-04', attachTime: null, detachTime: null, budgetDuration: '18h 30m', actualDuration: null, status: 'incoming' },
];

export const BARGE_POOL = [
  'KLM MAJU', 'BG HARAPAN', 'TK SINAR', 'KM BERKAH',
  'BG SEJAHTERA', 'KM LESTARI', 'TK INDAH', 'BG MAKMUR', 'DHL EXPRESS',
];

// ─── Delivery Trends ────────────────────────────────────────────────────────

export const DAILY_ACTUAL = 14136;
export const MTD_ACTUAL_BASE = 196336;

export const MOCK_DELIVERY_TREND: DeliveryTrendPoint[] = [
  { day: 'Day 1', target: 19000, actual: 18500 },
  { day: 'Day 2', target: 19200, actual: 17800 },
  { day: 'Day 3', target: 19500, actual: 20100 },
  { day: 'Day 4', target: 19800, actual: 19600 },
  { day: 'Day 5', target: 20000, actual: 21200 },
  { day: 'Day 6', target: 20200, actual: 14136 },
  { day: 'Day 7', target: 19600, actual: 22300 },
  { day: 'Day 8', target: 19900, actual: 23100 },
  { day: 'Day 9', target: 20500, actual: 19800 },
  { day: 'Day 10', target: 20000, actual: 20700 },
];

// ─── Wood Species Mix ───────────────────────────────────────────────────────

export const MOCK_WOOD_SPECIES: WoodSpecies[] = [
  { code: 'ACDB', fullName: 'Accacia Crassicarpa Debark', percentage: 74, tonnage: 10447 },
  { code: 'AMDB', fullName: 'Accacia Mangium Debark', percentage: 2, tonnage: 278 },
  { code: 'GMDB', fullName: 'Gmelina Arborea Debark', percentage: 24, tonnage: 3411 },
];

// ─── Stack Loading Time ─────────────────────────────────────────────────────

export const MOCK_STACK_LOADING: StackLoadingTime[] = [
  { stackType: 'Single Trailer', avgTime: '00:19', trips: 4 },
  { stackType: 'Double Trailer', avgTime: '00:22', trips: 14 },
  { stackType: 'Triple Trailer', avgTime: '00:24', trips: 38 },
  { stackType: 'Quad Trailer', avgTime: '00:30', trips: 29 },
];

// ─── Cargo Types ────────────────────────────────────────────────────────────

export const MOCK_CARGO_TYPES: CargoType[] = [
  { name: 'Pulp', color: '#38BDF8' },
  { name: 'Paper', color: '#FB923C' },
  { name: 'Salt', color: '#A78BFA' },
  { name: 'Coal', color: '#34D399' },
  { name: 'Burnt Lime', color: '#F59E0B' },
  { name: 'Palm Kernel Shell', color: '#EC4899' },
  { name: 'Palm Kernel Expeller', color: '#8B5CF6' },
];

// ─── Dashboard Color Constants ──────────────────────────────────────────────

export const CHART_COLORS = ['#38BDF8', '#FB923C', '#A78BFA', '#34D399'];
export const TARGET_COLOR = '#F59E0B';
