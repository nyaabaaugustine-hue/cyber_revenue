// CyberRevenue Simulation Engine - Creates realistic live experience
// This engine simulates real-world revenue operations with dynamic data

import { 
  Business, AgentStats, Collection, Visit, Notification, 
  AnomalyDetection, DashboardStats, RevenueTrend, CashRemittance,
  Dispute, LevyBill, ArrearsRecord, AIRoutePlan
} from '../types';

// Ghana District Data
const GHANA_NAMES = [
  'Kwame Asante', 'Ama Serwaa', 'Kofi Mensah', 'Akua Asantewaa', 'Yaw Appiah',
  'Adwoa Mensah', 'Kwesi Boateng', 'Efua Darko', 'Kojo Annan', 'Akosua Frimpong',
  'Yaw Mensah', 'Ama Pokuaa', 'Kofi Owusu', 'Adwoa Asante', 'Kwabena Agyeman',
  'Abena Owusu', 'Kwaku Darko', 'Akua Afriyie', 'Kojo Asante', 'Efua Mensah'
];

const BUSINESS_NAMES = [
  "Ama's Provisions Store", "Kofi's Welding Workshop", "Mama Adwoa's Restaurant",
  "Kwame's Barber Shop", "Akosua's Fabric Shop", "Yaw's Electrical Repairs",
  "Efua's Beauty Salon", "Kojo's Carpentry", "Adwoa's Tailoring", "Kwabena's Mechanic Shop",
  "Mame's Cold Store", "Kofi's Phone Repairs", "Akua's Vegetable Stall", "Yaw's Block Factory",
  "Ama's Hair Salon", "Kwesi's Printing Press", "Adwoa's Pharmacy", "Kojo's Transport",
  "Efua's Catering", "Kwame's Internet Cafe"
];

const ZONES = ['Zone A - Central', 'Zone B - Market', 'Zone C - Residential', 'Zone D - Industrial', 'Zone E - Outskirts'];

const CATEGORIES = [
  { name: 'Retail Shop', levy: 50, icon: '🏪' },
  { name: 'Food Vending', levy: 35, icon: '🍲' },
  { name: 'Hair Salon', levy: 40, icon: '💇' },
  { name: 'Workshop', levy: 60, icon: '🔧' },
  { name: 'Transport', levy: 80, icon: '🚐' },
  { name: 'Professional Services', levy: 100, icon: '💼' }
];

// Simulation State
let simulationState = {
  isRunning: false,
  tick: 0,
  agents: [] as AgentStats[],
  businesses: [] as Business[],
  collections: [] as Collection[],
  visits: [] as Visit[],
  notifications: [] as Notification[],
  anomalies: [] as AnomalyDetection[],
  remittances: [] as CashRemittance[],
  disputes: [] as Dispute[],
  levyBills: [] as LevyBill[],
  arrears: [] as ArrearsRecord[],
  routes: [] as AIRoutePlan[],
  listeners: [] as Function[],
  dashboardStats: null as DashboardStats | null,
  revenueTrend: [] as RevenueTrend[]
};

// Initialize Simulation
export function initializeSimulation(): void {
  // Create Businesses
  simulationState.businesses = Array.from({ length: 150 }, (_, i) => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
    const status = Math.random() > 0.15 ? 'active' : 
                   Math.random() > 0.5 ? 'flagged' : 'inactive';
    const levyStatus = Math.random() > 0.3 ? 'paid' : 
                       Math.random() > 0.5 ? 'overdue' : 'due';
    
    return {
      id: `biz-${i.toString().padStart(4, '0')}`,
      businessId: `KMA-${(i + 1).toString().padStart(4, '0')}-${category.name.substring(0, 3).toUpperCase()}`,
      name: BUSINESS_NAMES[i % BUSINESS_NAMES.length] + (i >= BUSINESS_NAMES.length ? ` ${Math.floor(i / BUSINESS_NAMES.length) + 1}` : ''),
      categoryId: `cat-${CATEGORIES.indexOf(category)}`,
      categoryName: category.name,
      ownerName: GHANA_NAMES[Math.floor(Math.random() * GHANA_NAMES.length)],
      ownerPhone: `+233 ${Math.floor(Math.random() * 900000000 + 200000000)}`,
      location: {
        lat: 6.6885 + (Math.random() - 0.5) * 0.02,
        lng: -1.5273 + (Math.random() - 0.5) * 0.02
      },
      locationDescription: `Near ${['Kejetia', 'Adum', 'Bantama', 'Asokwa', 'Suame'][Math.floor(Math.random() * 5)]}`,
      districtId: 'dist-kma',
      zoneId: zone,
      zoneName: zone,
      photos: [],
      status: status as Business['status'],
      levyStatus: levyStatus as Business['levyStatus'],
      totalCollected: Math.floor(Math.random() * 5000) + 500,
      totalOutstanding: levyStatus === 'paid' ? 0 : Math.floor(Math.random() * 300) + 50,
      lastVisitedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      registeredBy: 'officer-001',
      lastAmountPaid: null,
      lastPaymentDate: null,
      lastVisitedBy: null,
      notes: null
    };
  });

  // Create Agents
  simulationState.agents = Array.from({ length: 12 }, (_, i) => {
    const zone = ZONES[i % ZONES.length];
    const todayAmount = Math.floor(Math.random() * 800) + 200;
    const monthlyTarget = 15000;
    const monthlyAmount = Math.floor(Math.random() * 15000) + 5000;
    
    return {
      officerId: `officer-${(i + 1).toString().padStart(3, '0')}`,
      officerName: GHANA_NAMES[i % GHANA_NAMES.length],
      officerPhone: `+233 ${Math.floor(Math.random() * 900000000 + 200000000)}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${GHANA_NAMES[i]}`,
      zone: zone,
      status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'break' : 'offline',
      todayAmount: todayAmount,
      todayCollections: Math.floor(Math.random() * 15) + 3,
      todayVisits: Math.floor(Math.random() * 20) + 8,
      weekCollections: Math.floor(Math.random() * 50) + 10,
      weekAmount: Math.floor(Math.random() * 4000) + 1000,
      monthCollections: Math.floor(Math.random() * 200) + 40,
      monthAmount: monthlyAmount,
      targetAmount: monthlyTarget,
      targetPercent: Math.round((monthlyAmount / monthlyTarget) * 100),
      performanceScore: Math.floor(Math.random() * 30) + 70,
      businessesVisited: Math.floor(Math.random() * 100) + 20,
      avgCollectionTime: Math.floor(Math.random() * 15) + 3,
      lastLocation: {
        lat: 6.6885 + (Math.random() - 0.5) * 0.01,
        lng: -1.5273 + (Math.random() - 0.5) * 0.01
      },
      lastActiveAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      isActive: Math.random() > 0.2
    };
  });

  // Create Initial Collections
  const now = Date.now();
  simulationState.collections = Array.from({ length: 50 }, (_, i) => {
    const business = simulationState.businesses[Math.floor(Math.random() * simulationState.businesses.length)];
    const agent = simulationState.agents[Math.floor(Math.random() * simulationState.agents.length)];
    const amount = Math.floor(Math.random() * 150) + 30;
    
    return {
      id: `coll-${i.toString().padStart(5, '0')}`,
      receiptNumber: `KMA-2024-${(10000 + i).toString()}`,
      businessId: business.id,
      businessName: business.name,
      officerId: agent.officerId,
      officerName: agent.officerName,
      amount: amount,
      paymentMethod: Math.random() > 0.4 ? 'cash' : 'mobile_money',
      mobileMoneyRef: null,
      collectionDate: new Date(now - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      gpsVerified: Math.random() > 0.1,
      receiptUrl: null,
      notes: null
    };
  });

  // Create Initial Notifications
  simulationState.notifications = [
    {
      id: 'notif-001',
      userId: '',
      type: 'warning',
      title: 'New Collection Recorded',
      message: 'GHS 150 collected from Ama\'s Provisions by Kwame Asante',
      isRead: false,
      createdAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 'notif-002',
      userId: '',
      type: 'success',
      title: 'Target Milestone',
      message: 'Kofi Mensah reached 80% of monthly target!',
      isRead: false,
      createdAt: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: 'notif-003',
      userId: '',
      type: 'warning',
      title: 'GPS Anomaly Detected',
      message: 'Unusual location pattern detected for Officer Yaw Appiah',
      isRead: false,
      createdAt: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'notif-004',
      userId: '',
      type: 'info',
      title: 'Cash Remittance Pending',
      message: '3 officers have unsubmitted cash remittances',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  // Create Initial Anomalies
  simulationState.anomalies = [
    {
      id: 'anom-001',
      type: 'gps_spoof',
      severity: 'high',
      title: 'GPS Anomaly Detected',
      description: 'GPS location moved impossibly fast (85km/h between stops)',
      relatedEntities: { officerId: 'officer-005', officerName: 'Yaw Appiah' },
      status: 'open',
      detectedAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'anom-002',
      type: 'ghost_visit',
      severity: 'medium',
      title: 'Ghost Visit Detected',
      description: 'Check-in location was 180m from business location',
      relatedEntities: { officerId: 'officer-008', officerName: 'Efua Darko', businessId: 'biz-0023', businessName: "Mama Adwoa's Restaurant" },
      status: 'open',
      detectedAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  // Create Revenue Trend (Last 30 days)
  simulationState.revenueTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseRevenue = 25000 + Math.sin(i / 5) * 5000;
    const dailyRevenue = baseRevenue + (Math.random() - 0.3) * 8000;
    
    return {
      date: date.toISOString().split('T')[0],
      amount: Math.round(dailyRevenue),
      target: 30000,
      collections: Math.round(dailyRevenue / 80)
    };
  });

  // Calculate Dashboard Stats
  updateDashboardStats();

  simulationState.isRunning = true;
}

// Update Dashboard Statistics
function updateDashboardStats(): void {
  const todayRevenue = simulationState.collections
    .filter(c => new Date(c.collectionDate).toDateString() === new Date().toDateString())
    .reduce((sum, c) => sum + c.amount, 0);

  const monthRevenue = simulationState.revenueTrend
    .slice(-30)
    .reduce((sum, r) => sum + r.amount, 0);

  const activeAgents = simulationState.agents.filter(a => a.isActive).length;

  const weekRevenue = simulationState.revenueTrend.slice(-7).reduce((s, r) => s + r.amount, 0);

  simulationState.dashboardStats = {
    todayRevenue: todayRevenue + Math.floor(Math.random() * 500),
    todayCollections: simulationState.collections.filter(c => 
      new Date(c.collectionDate).toDateString() === new Date().toDateString()
    ).length,
    todayVisits: Math.floor(Math.random() * 80) + 40,
    weekRevenue: weekRevenue,
    weekCollections: Math.floor(Math.random() * 300) + 150,
    monthRevenue: monthRevenue,
    targetRevenue: 900000,
    activeAgents: activeAgents,
    totalAgents: simulationState.agents.length,
    pendingSync: Math.floor(Math.random() * 10),
    businessesRegistered: simulationState.businesses.length,
    businessesActive: simulationState.businesses.filter(b => b.status === 'active').length,
    businessesFlagged: simulationState.businesses.filter(b => b.status === 'flagged').length,
    collectionRate: Math.round((monthRevenue / 900000) * 100)
  };
}

// Simulation Tick - Updates every few seconds
export function simulationTick(): void {
  if (!simulationState.isRunning) return;
  
  simulationState.tick++;
  
  // Random agent movement
  simulationState.agents.forEach(agent => {
    if (agent.isActive && Math.random() > 0.7) {
      agent.lastLocation = {
        lat: agent.lastLocation!.lat + (Math.random() - 0.5) * 0.0005,
        lng: agent.lastLocation!.lng + (Math.random() - 0.5) * 0.0005
      };
    }
  });

  // Random collection event (10% chance per tick)
  if (Math.random() > 0.9) {
    generateRandomCollection();
  }

  // Random notification (5% chance per tick)
  if (Math.random() > 0.95) {
    generateRandomNotification();
  }

  // Update dashboard stats
  updateDashboardStats();

  // Notify listeners
  simulationState.listeners.forEach(listener => listener(getSimulationState()));
}

// Generate Random Collection
function generateRandomCollection(): void {
  const business = simulationState.businesses[Math.floor(Math.random() * simulationState.businesses.length)];
  const agent = simulationState.agents[Math.floor(Math.random() * simulationState.agents.length)];
  const amount = Math.floor(Math.random() * 150) + 30;

  const collection: Collection = {
    id: `coll-${Date.now()}`,
    receiptNumber: `KMA-2024-${10000 + simulationState.collections.length}`,
    businessId: business.id,
    businessName: business.name,
    officerId: agent.officerId,
    officerName: agent.officerName,
    amount: amount,
    paymentMethod: Math.random() > 0.4 ? 'cash' : 'mobile_money',
    mobileMoneyRef: null,
    collectionDate: new Date().toISOString(),
    gpsVerified: Math.random() > 0.1,
    receiptUrl: null,
    notes: null
  };

  simulationState.collections.unshift(collection);
  
  // Update agent stats
  const agentIndex = simulationState.agents.findIndex(a => a.officerId === agent.officerId);
  if (agentIndex !== -1) {
    simulationState.agents[agentIndex].todayAmount += amount;
    simulationState.agents[agentIndex].todayCollections++;
  }

  // Create notification
  addNotification({
    id: `notif-${Date.now()}`,
    userId: '',
    type: 'info',
    title: 'New Collection',
    message: `GHS ${amount} collected from ${business.name} by ${agent.officerName}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

// Generate Random Notification
function generateRandomNotification(): void {
  const notificationTypes = [
    { type: 'success' as const, title: 'Badge Earned', message: 'Kofi Mensah earned "Fire Collector" badge!' },
    { type: 'warning' as const, title: 'Agent Location Update', message: 'Agent moved to Zone B - Market area' },
    { type: 'info' as const, title: 'Visit Reminder', message: '5 businesses overdue for visit in Zone C' },
    { type: 'info' as const, title: 'Sync Complete', message: 'All offline records synchronized successfully' }
  ];

  const notif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
  
  addNotification({
    id: `notif-${Date.now()}`,
    userId: '',
    type: notif.type,
    title: notif.title,
    message: notif.message,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

// Add Notification
function addNotification(notification: Notification): void {
  simulationState.notifications.unshift(notification);
  if (simulationState.notifications.length > 50) {
    simulationState.notifications = simulationState.notifications.slice(0, 50);
  }
}

// Subscribe to State Changes
export function subscribeToSimulation(listener: Function): () => void {
  simulationState.listeners.push(listener);
  return () => {
    simulationState.listeners = simulationState.listeners.filter(l => l !== listener);
  };
}

// Get Current State
export function getSimulationState() {
  return {
    agents: simulationState.agents,
    businesses: simulationState.businesses,
    collections: simulationState.collections,
    visits: simulationState.visits,
    notifications: simulationState.notifications,
    anomalies: simulationState.anomalies,
    remittances: simulationState.remittances,
    disputes: simulationState.disputes,
    levyBills: simulationState.levyBills,
    arrears: simulationState.arrears,
    routes: simulationState.routes,
    dashboardStats: simulationState.dashboardStats,
    revenueTrend: simulationState.revenueTrend
  };
}

// Get Dashboard Stats
export function getDashboardStats(): DashboardStats | null {
  return simulationState.dashboardStats;
}

// Get Agents
export function getAgents(): AgentStats[] {
  return simulationState.agents;
}

// Get Businesses
export function getBusinesses(): Business[] {
  return simulationState.businesses;
}

// Get Collections
export function getCollections(): Collection[] {
  return simulationState.collections;
}

// Get Notifications
export function getNotifications(): Notification[] {
  return simulationState.notifications;
}

// Get Anomalies
export function getAnomalies(): AnomalyDetection[] {
  return simulationState.anomalies;
}

// Get Revenue Trend
export function getRevenueTrend(): RevenueTrend[] {
  return simulationState.revenueTrend;
}

// Mark Notification as Read
export function markNotificationRead(id: string): void {
  const notif = simulationState.notifications.find(n => n.id === id);
  if (notif) {
    notif.isRead = true;
  }
}

// Start Simulation Loop
let simulationInterval: number | null = null;

export function startSimulation(): void {
  if (simulationInterval) return;
  
  initializeSimulation();
  simulationInterval = window.setInterval(simulationTick, 3000); // Update every 3 seconds
}

export function stopSimulation(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  simulationState.isRunning = false;
}