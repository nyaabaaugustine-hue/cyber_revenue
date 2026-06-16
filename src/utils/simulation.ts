// Local Simulation Engine for CyberRevenue
// Generates realistic, dynamic data for demonstration

import { Business, AgentStats, Collection, Anomaly, DashboardMetrics, Location } from '../types';

// Kumasi, Ghana - Central coordinates
const KUMASI_CENTER: Location = { lat: 6.6885, lng: -1.5273 };

// Zone definitions for Kumasi
const ZONES = [
  { name: 'Adum', offset: { lat: 0.015, lng: -0.008 } },
  { name: 'Kejetia', offset: { lat: 0.008, lng: 0.012 } },
  { name: 'Bantama', offset: { lat: -0.012, lng: -0.015 } },
  { name: 'Asokwa', offset: { lat: -0.018, lng: 0.02 } },
  { name: 'Suame', offset: { lat: 0.022, lng: 0.008 } },
];

const BUSINESS_NAMES = [
  "Ama's Provisions Store", "Kwame's Electrical Shop", "Owusu Pharmacy",
  "Adwoa Beauty Salon", "Kofi's Tailoring", "Mensah Hardware Store",
  "Akua's Restaurant", "Yaw's Auto Parts", "Afia's Fabric Shop",
  "Kofi's Phone Repairs", "Grace's Cosmetics", "Daniel's Bookshop",
  "Ruth's Cold Store", "Samuel's Printing Press", "Comfort's Eatery",
  "Joseph's Welding Shop", "Elizabeth's Day Care", "Michael's Car Wash",
  "Victoria's Fashion", "Patrick's Cyber Cafe"
];

const CATEGORIES = [
  { name: 'Retail Shop', rate: 50 },
  { name: 'Food Vending', rate: 30 },
  { name: 'Service Provider', rate: 40 },
  { name: 'Manufacturing', rate: 100 },
  { name: 'Transport', rate: 60 },
];

const FIRST_NAMES = ['Kwame', 'Kofi', 'Ama', 'Adwoa', 'Kwesi', 'Yaw', 'Akua', 'Afia', 'Kwadwo', 'Akosua'];
const LAST_NAMES = ['Mensah', 'Owusu', 'Asante', 'Boateng', 'Ofori', 'Appiah', 'Dankwa', 'Adu', 'Osei', 'Amponsah'];

// Utility functions
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;

const generateId = (prefix: string): string => 
  `${prefix}-${randomInt(1000, 9999)}`;

const generatePhone = (): string => 
  `0${randomElement(['20', '24', '26', '27', '28', '50', '54', '55', '56', '57'])}${randomInt(1000000, 9999999)}`;

const generateLocation = (base: Location, spread: number = 0.02): Location => ({
  lat: base.lat + randomFloat(-spread, spread),
  lng: base.lng + randomFloat(-spread, spread),
});

// Generate Businesses
export const generateBusinesses = (count: number = 50): Business[] => {
  const businesses: Business[] = [];
  
  for (let i = 0; i < count; i++) {
    const zone = randomElement(ZONES);
    const category = randomElement(CATEGORIES);
    const location = generateLocation({
      lat: KUMASI_CENTER.lat + zone.offset.lat,
      lng: KUMASI_CENTER.lng + zone.offset.lng
    }, 0.008);
    
    const levyStatus = randomElement(['paid', 'paid', 'paid', 'due', 'due', 'overdue', 'overdue', 'partial'] as const);
    const status = Math.random() > 0.9 ? 'flagged' : 'active';
    
    businesses.push({
      id: `biz-${i + 1}`,
      businessId: `KSI-${String(i + 1).padStart(4, '0')}-${zone.name.substring(0, 3).toUpperCase()}`,
      name: randomElement(BUSINESS_NAMES),
      categoryId: `cat-${CATEGORIES.indexOf(category) + 1}`,
      categoryName: category.name,
      ownerName: `${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`,
      ownerPhone: generatePhone(),
      location,
      locationDescription: `Near ${zone.name} Market`,
      districtId: 'dist-1',
      zoneId: `zone-${ZONES.indexOf(zone) + 1}`,
      zoneName: zone.name,
      photos: [],
      status,
      levyStatus,
      totalOutstanding: levyStatus === 'paid' ? 0 : category.rate * randomInt(1, 3),
      lastAmountPaid: category.rate,
      lastPaymentDate: levyStatus === 'paid' ? new Date(Date.now() - randomInt(1, 30) * 86400000).toISOString() : null,
      registeredBy: 'officer-1',
      registeredAt: new Date(Date.now() - randomInt(30, 365) * 86400000).toISOString(),
      lastVisitedAt: new Date(Date.now() - randomInt(1, 14) * 86400000).toISOString(),
      lastVisitedBy: `officer-${randomInt(1, 5)}`,
      notes: null,
    });
  }
  
  return businesses;
};

// Generate Agents
export const generateAgents = (count: number = 8): AgentStats[] => {
  const agents: AgentStats[] = [];
  
  for (let i = 0; i < count; i++) {
    const zone = ZONES[i % ZONES.length];
    const targetAmount = randomInt(800, 1500) * 10;
    const monthAmount = randomInt(50, 100) / 100 * targetAmount;
    const isActive = Math.random() > 0.15;
    
    agents.push({
      officerId: `officer-${i + 1}`,
      officerName: `${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`,
      officerPhone: generatePhone(),
      zone: zone.name,
      isActive,
      status: isActive ? randomElement(['in-field', 'in-field', 'on-break']) : 'offline',
      lastLocation: isActive ? generateLocation({
        lat: KUMASI_CENTER.lat + zone.offset.lat,
        lng: KUMASI_CENTER.lng + zone.offset.lng
      }, 0.01) : null,
      lastActiveAt: new Date(Date.now() - randomInt(1, 60) * 60000).toISOString(),
      todayCollections: isActive ? randomInt(5, 20) : 0,
      todayAmount: isActive ? randomInt(200, 800) : 0,
      weekCollections: randomInt(30, 100),
      weekAmount: randomInt(2000, 5000),
      monthCollections: randomInt(100, 300),
      monthAmount,
      targetAmount,
      targetPercent: Math.round((monthAmount / targetAmount) * 100),
      performanceScore: randomInt(60, 98),
      businessesVisited: randomInt(10, 50),
      avgCollectionTime: randomInt(3, 8),
    });
  }
  
  return agents;
};

// Generate Collections
export const generateCollections = (businesses: Business[], agents: AgentStats[], count: number = 30): Collection[] => {
  const collections: Collection[] = [];
  
  for (let i = 0; i < count; i++) {
    const business = randomElement(businesses.filter(b => b.status === 'active'));
    const agent = randomElement(agents.filter(a => a.isActive));
    const amount = randomElement([30, 40, 50, 60, 80, 100, 120]);
    
    collections.push({
      id: `col-${i + 1}`,
      receiptNumber: `KSI-${new Date().getFullYear()}-${String(randomInt(10000, 99999)).padStart(5, '0')}`,
      businessId: business.id,
      businessName: business.name,
      businessCode: business.businessId,
      visitId: `visit-${i + 1}`,
      officerId: agent.officerId,
      officerName: agent.officerName,
      amount,
      paymentMethod: randomElement(['cash', 'cash', 'mobile_money', 'mobile_money'] as const),
      mobileMoneyRef: Math.random() > 0.5 ? `MOM-${randomInt(100000, 999999)}` : null,
      collectionDate: new Date(Date.now() - randomInt(1, 120) * 60000).toISOString(),
      gpsVerified: Math.random() > 0.1,
      collectionLocation: business.location,
      isSynced: Math.random() > 0.05,
      receiptUrl: null,
      notes: null,
    });
  }
  
  return collections.sort((a, b) => new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime());
};

// Generate Anomalies
export const generateAnomalies = (agents: AgentStats[], businesses: Business[]): Anomaly[] => {
  const anomalies: Anomaly[] = [
    {
      id: 'anom-1',
      type: 'duplicate_collection',
      severity: 'warning',
      title: 'Potential Duplicate Collection',
      description: 'Same business collected twice within 2 hours',
      officerId: agents[0]?.officerId,
      officerName: agents[0]?.officerName,
      businessId: businesses[0]?.id,
      businessName: businesses[0]?.name,
      collectionId: 'col-x1',
      metadata: { timeDiff: '1h 45m' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      detectedAt: new Date(Date.now() - 3600000).toISOString(),
      isResolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
    {
      id: 'anom-2',
      type: 'gps_mismatch',
      severity: 'info',
      title: 'GPS Location Mismatch',
      description: 'Collection location 150m from registered business location',
      officerId: agents[1]?.officerId,
      officerName: agents[1]?.officerName,
      businessId: businesses[1]?.id,
      businessName: businesses[1]?.name,
      collectionId: 'col-x2',
      metadata: { distance: '150m' },
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      detectedAt: new Date(Date.now() - 7200000).toISOString(),
      isResolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
    {
      id: 'anom-3',
      type: 'inactive_agent',
      severity: 'warning',
      title: 'Agent Inactive',
      description: 'No activity from agent for 3+ hours during work hours',
      officerId: agents[2]?.officerId,
      officerName: agents[2]?.officerName,
      businessId: null,
      businessName: null,
      collectionId: null,
      metadata: { inactiveDuration: '3h 22m' },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      detectedAt: new Date(Date.now() - 1800000).toISOString(),
      isResolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
  ];
  
  return anomalies;
};

// Generate Dashboard Metrics
export const generateDashboardMetrics = (businesses: Business[], agents: AgentStats[], collections: Collection[], anomalies: Anomaly[]): DashboardMetrics => {
  const todayRevenue = collections
    .filter(c => new Date(c.collectionDate).toDateString() === new Date().toDateString())
    .reduce((sum, c) => sum + c.amount, 0);
  
  return {
    revenue: {
      today: todayRevenue,
      yesterday: todayRevenue * 0.85,
      thisWeek: todayRevenue * 5.2,
      lastWeek: todayRevenue * 4.8,
      thisMonth: todayRevenue * 22,
      lastMonth: todayRevenue * 20,
      target: 150000,
      targetPercent: 68.5,
    },
    collections: {
      today: collections.filter(c => new Date(c.collectionDate).toDateString() === new Date().toDateString()).length,
      thisWeek: randomInt(150, 200),
      thisMonth: randomInt(600, 800),
      pending: randomInt(5, 15),
    },
    businesses: {
      total: businesses.length,
      active: businesses.filter(b => b.status === 'active').length,
      inactive: businesses.filter(b => b.status === 'inactive').length,
      flagged: businesses.filter(b => b.status === 'flagged').length,
      paid: businesses.filter(b => b.levyStatus === 'paid').length,
      due: businesses.filter(b => b.levyStatus === 'due').length,
      overdue: businesses.filter(b => b.levyStatus === 'overdue').length,
    },
    agents: {
      total: agents.length,
      active: agents.filter(a => a.isActive).length,
      inField: agents.filter(a => a.status === 'in-field').length,
      offline: agents.filter(a => a.status === 'offline').length,
      avgPerformance: Math.round(agents.reduce((sum, a) => sum + a.performanceScore, 0) / agents.length),
    },
    recentCollections: collections.slice(0, 10),
    anomalies,
  };
};