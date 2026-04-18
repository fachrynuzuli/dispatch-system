import { Truck, TruckStatus, Inspection, InspectionDecision, DispatchRequest, Driver, SparePart, InventoryStatus, Vessel, VesselStatus } from '../types';

// --- Data Generators ---

const generateTrucks = (): Truck[] => {
  const trucks: Truck[] = [];
  const configs = [
    { prefix: 'TRK-A-', model: 'Mercedes Axor', weightClass: '40t', count: 15, brands: ['Mercedes-Benz'] },
    { prefix: 'TRK-B-', model: 'Volvo FMX 500', weightClass: '55t', count: 20, brands: ['Volvo'] },
    { prefix: 'TRK-C-', model: 'Volvo FH-16', weightClass: '150t', count: 10, brands: ['Volvo'] },
    { prefix: 'TRK-D-', model: 'Scania R620', weightClass: '130t', count: 10, brands: ['Scania'] },
  ];

  // Base coordinates for Riau/Pekanbaru area
  const baseLat = 0.5071;
  const baseLng = 101.4478;

  configs.forEach(cfg => {
    for (let i = 0; i < cfg.count; i++) {
      const numCode = Math.floor(Math.random() * 9000) + 1000; 
      const plateNum = Math.floor(Math.random() * 8999) + 1000;
      const plateSuffix = ['JA', 'AB', 'XY', 'KA', 'ZU'][Math.floor(Math.random() * 5)];
      
      const statusRoll = Math.random();
      let status = TruckStatus.AVAILABLE;
      if (statusRoll > 0.7) status = TruckStatus.ON_TRIP;
      else if (statusRoll > 0.9) status = TruckStatus.MAINTENANCE;
      else if (statusRoll > 0.95) status = TruckStatus.INSPECTION_PENDING;

      // Random scatter around base location
      const lat = baseLat + (Math.random() - 0.5) * 1.5;
      const lng = baseLng + (Math.random() - 0.5) * 1.5;

      trucks.push({
        id: `${cfg.prefix}${numCode}`,
        plate: `BM-${plateNum}-${plateSuffix}`,
        model: cfg.model,
        mileage: Math.floor(Math.random() * 300000) + 20000,
        status: status,
        healthScore: Math.floor(Math.random() * 51) + 50, 
        lastInspection: `2025-${Math.floor(Math.random() * 11) + 1}-15`,
        purchaseDate: `20${Math.floor(Math.random() * 5) + 18}-05-20`,
        location: [lat, lng]
      });
    }
  });

  return trucks.slice(0, 50);
};

const generateRequests = (): DispatchRequest[] => {
  const customers = [
    { name: 'Port Facility Alpha', loc: 'North District' },
    { name: 'Logistics Hub Beta', loc: 'South District' },
    { name: 'Industrial Park Gamma', loc: 'North District' },
    { name: 'Distribution Center Delta', loc: 'South District' },
    { name: 'Warehouse Complex Epsilon', loc: 'Central Complex' },
    { name: 'Manufacturing Site Zeta', loc: 'East Port' },
    { name: 'Storage Yard Eta', loc: 'West Valley' },
    { name: 'Processing Plant Theta', loc: 'Highlands' },
    { name: 'Assembly Line Iota', loc: 'Lowlands' }
  ];

  const requests: DispatchRequest[] = [];
  
  for (let i = 0; i < 25; i++) {
    const cust = customers[Math.floor(Math.random() * customers.length)];
    const isHeavy = Math.random() > 0.7;
    const isSuperHeavy = Math.random() > 0.9;
    
    let weight = 40 + Math.floor(Math.random() * 15);
    if (isHeavy) weight = 55 + Math.floor(Math.random() * 10);
    if (isSuperHeavy) weight = 130 + Math.floor(Math.random() * 35); 

    requests.push({
      id: `REQ-${5000 + i}`,
      customerName: cust.name,
      destination: cust.loc,
      cargoWeight: weight,
      requiredDate: `2025-12-${Math.floor(Math.random() * 30) + 1}`,
      status: Math.random() > 0.5 ? 'Pending' : 'Assigned'
    });
  }
  return requests;
};

const generateDrivers = (): Driver[] => {
  const names = [
    "Budi Santoso", "Eko Prasetyo", "Agus Setiawan", "Dedi Kurniawan", 
    "Iwan Fals", "Joko Anwar", "Slamet Riyadi", "Hendra Gunawan", 
    "Bambang Pamungkas", "Rudi Hartono", "Asep Sunandar", "Ucok Baba",
    "Toni Sucipto", "Ferry Rotinsulu", "Boaz Solossa", "Evan Dimas",
    "Rizky Pora", "Andik Vermansah", "Kurnia Meiga", "Markus Horison"
  ];
  
  return names.map((name, i) => {
    const isSenior = i < 8; // First 8 are seniors
    const statusRoll = Math.random();
    
    return {
      id: `DRV-${100 + i}`,
      name,
      licenseClass: isSenior ? 'SIM B2 Umum' : 'SIM B2 Umum', // Most fleet drivers need B2
      status: statusRoll > 0.6 ? 'On Trip' : statusRoll > 0.9 ? 'Resting' : 'Available',
      fatigueLevel: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
      safetyScore: isSenior ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 25),
      yearsExperience: isSenior ? 10 + Math.floor(Math.random() * 15) : 2 + Math.floor(Math.random() * 8),
      certifications: isSenior ? ['Heavy Haul', 'Hazmat', 'Defensive Driving'] : ['Defensive Driving']
    };
  });
};

const generateInspections = (trucks: Truck[]): Inspection[] => {
  const inspections: Inspection[] = [];
  const inspectionTrucks = trucks.filter((_, i) => i % 5 === 0); 

  inspectionTrucks.forEach((truck, idx) => {
    const passed = Math.random() > 0.4;
    inspections.push({
      id: `PSI-${2025001 + idx}`,
      truckId: truck.id,
      date: '2025-12-05',
      inspectorName: ['Budi Santoso', 'Agus Setiawan', 'Rina Wati'][Math.floor(Math.random() * 3)],
      items: [
        { category: 'Tires', status: passed ? 'Pass' : 'Warning', notes: passed ? 'Good condition' : 'Tread depth < 4mm' },
        { category: 'Brakes', status: passed ? 'Pass' : 'Fail', notes: passed ? 'Responsive' : 'Pads worn out' },
        { category: 'Engine', status: 'Pass', notes: 'Normal operation' },
        { category: 'Hydraulics', status: Math.random() > 0.8 ? 'Fail' : 'Pass', notes: 'Check for leaks' }
      ],
      overallNotes: passed ? 'Vehicle is roadworthy.' : 'Requires maintenance before next heavy haul.',
      decision: passed ? InspectionDecision.DISPATCH_READY : InspectionDecision.WORKSHOP
    });
  });

  return inspections;
};

// --- Exported Data ---

export const MOCK_TRUCKS = generateTrucks();
export const MOCK_REQUESTS = generateRequests();
export const MOCK_DRIVERS = generateDrivers();
export const MOCK_INSPECTIONS = generateInspections(MOCK_TRUCKS);

export const MOCK_INVENTORY: SparePart[] = [
  { id: 'PRT-001', name: 'Heavy Duty Brake Pads', category: 'Brakes', stockLevel: 12, minimumStock: 20, unitCost: 150, supplier: 'Volvo Parts Inc', status: InventoryStatus.LOW_STOCK, lastRestocked: '2025-11-15' },
  { id: 'PRT-002', name: 'Synthetic Engine Oil (55gal)', category: 'Fluids', stockLevel: 5, minimumStock: 3, unitCost: 850, supplier: 'Lubricants Direct', status: InventoryStatus.IN_STOCK, lastRestocked: '2025-12-01' },
  { id: 'PRT-003', name: 'Air Filter Element', category: 'Filters', stockLevel: 0, minimumStock: 15, unitCost: 45, supplier: 'AutoParts Wholesale', status: InventoryStatus.OUT_OF_STOCK, lastRestocked: '2025-10-20' },
  { id: 'PRT-004', name: 'Alternator 24V', category: 'Electrical', stockLevel: 4, minimumStock: 2, unitCost: 320, supplier: 'ElectroTruck', status: InventoryStatus.IN_STOCK, lastRestocked: '2025-11-28' },
  { id: 'PRT-005', name: 'Transmission Fluid (5gal)', category: 'Fluids', stockLevel: 8, minimumStock: 10, unitCost: 120, supplier: 'Lubricants Direct', status: InventoryStatus.LOW_STOCK, lastRestocked: '2025-11-10' },
  { id: 'PRT-006', name: 'Hydraulic Hose Assembly', category: 'Hydraulics', stockLevel: 15, minimumStock: 10, unitCost: 85, supplier: 'HydraFlex', status: InventoryStatus.IN_STOCK, lastRestocked: '2025-12-05' },
  { id: 'PRT-007', name: 'Steering Pump', category: 'Steering', stockLevel: 1, minimumStock: 3, unitCost: 450, supplier: 'AutoParts Wholesale', status: InventoryStatus.LOW_STOCK, lastRestocked: '2025-09-15' },
  { id: 'PRT-008', name: 'LED Headlamp Bulbs', category: 'Electrical', stockLevel: 45, minimumStock: 20, unitCost: 25, supplier: 'ElectroTruck', status: InventoryStatus.IN_STOCK, lastRestocked: '2025-12-10' },
];

export const MOCK_VESSELS: Vessel[] = [
  { id: 'VSL-101', name: 'Oceanic Pioneer', type: 'Cargo Ship', eta: '2025-12-06T08:00:00Z', status: VesselStatus.ARRIVING, cargoType: 'Heavy Machinery', cargoWeight: 2500, destinationTerminal: 'North District Port' },
  { id: 'VSL-102', name: 'Barge Alpha-7', type: 'Barge', eta: '2025-12-05T14:30:00Z', status: VesselStatus.DOCKED, cargoType: 'Construction Materials', cargoWeight: 850, destinationTerminal: 'South District Terminal' },
  { id: 'VSL-103', name: 'Pacific Trader', type: 'Cargo Ship', eta: '2025-12-08T12:00:00Z', status: VesselStatus.IN_TRANSIT, cargoType: 'Raw Minerals', cargoWeight: 4200, destinationTerminal: 'East Port' },
  { id: 'VSL-104', name: 'Barge Beta-2', type: 'Barge', eta: '2025-12-05T09:00:00Z', status: VesselStatus.UNLOADING, cargoType: 'Steel Coils', cargoWeight: 1200, destinationTerminal: 'Central Complex Dock' },
];