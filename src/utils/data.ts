import { Business, Collection, AgentStats, Alert, DashboardStats, RevenueTrend, CategoryBreakdown, Zone, User, Anomaly } from "../types";
import { Location } from "../types";

export const currentUser: User = {
  id: "user-1",
  fullName: "Dr. Kwame Asante",
  email: "kwame.asante@kma.gov.gh",
  phone: "+233 24 123 4567",
  role: "admin",
  districtId: "dist-1",
  districtName: "Kumasi Metropolitan",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1d7c059347?w=200&h=200&fit=crop&crop=face",
  isActive: true,
  lastActiveAt: "2024-06-14T10:30:00Z"
};

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users.find(u => u.role === 'admin');
}

export const dashboardStats: DashboardStats = {
  todayRevenue: 24580,
  todayCollections: 156,
  todayVisits: 89,
  weekRevenue: 168750,
  weekCollections: 892,
  monthRevenue: 645000,
  targetRevenue: 800000,
  activeAgents: 18,
  totalAgents: 24,
  pendingSync: 12,
  businessesRegistered: 3420,
  businessesActive: 3150,
  businessesFlagged: 23,
  collectionRate: 80.6
};

const defaultBiz = {
  location: { lat: 6.6885, lng: -1.5273 },
  levyStatus: 'paid' as const,
  totalOutstanding: 0,
  lastAmountPaid: null,
  lastPaymentDate: null,
  lastVisitedBy: null,
  notes: null,
  photos: [],
  documents: [],
};

const bizDocuments: Record<string, any[]> = {
  "1": [
    { id: "doc-1-1", name: "Levy Payment Receipt - Jan 2024", type: "receipt", date: "2024-01-20T10:00:00Z", amount: 500, status: "valid", notes: "Annual levy payment" },
    { id: "doc-1-2", name: "Business Operating License", type: "license", date: "2024-01-15T08:00:00Z", status: "valid", notes: "Valid until Dec 2024" },
    { id: "doc-1-3", name: "Fire Safety Certificate", type: "certificate", date: "2024-02-10T09:00:00Z", status: "valid", notes: "Annual inspection passed" },
    { id: "doc-1-4", name: "Levy Payment Receipt - Feb 2024", type: "receipt", date: "2024-02-20T10:00:00Z", amount: 500, status: "valid" },
    { id: "doc-1-5", name: "Health Permit", type: "permit", date: "2024-03-01T08:00:00Z", status: "valid", notes: "Food handling approved" },
    { id: "doc-1-6", name: "Levy Payment Receipt - Mar 2024", type: "receipt", date: "2024-03-20T10:00:00Z", amount: 500, status: "valid" },
    { id: "doc-1-7", name: "Q1 Tax Invoice", type: "invoice", date: "2024-04-01T08:00:00Z", amount: 1500, status: "valid", notes: "Quarterly tax" },
    { id: "doc-1-8", name: "Levy Payment Receipt - Apr 2024", type: "receipt", date: "2024-04-20T10:00:00Z", amount: 500, status: "valid" },
  ],
  "2": [
    { id: "doc-2-1", name: "Levy Payment Receipt - Jan 2024", type: "receipt", date: "2024-01-22T10:00:00Z", amount: 350, status: "valid" },
    { id: "doc-2-2", name: "Food Hygiene License", type: "license", date: "2024-01-10T08:00:00Z", status: "valid", notes: "Food safety certified" },
    { id: "doc-2-3", name: "Health Inspection Report", type: "certificate", date: "2024-03-15T09:00:00Z", status: "valid" },
    { id: "doc-2-4", name: "Levy Payment Receipt - Feb 2024", type: "receipt", date: "2024-02-22T10:00:00Z", amount: 350, status: "valid" },
    { id: "doc-2-5", name: "Signage Permit", type: "permit", date: "2024-02-01T08:00:00Z", status: "expired", notes: "Needs renewal" },
  ],
  "3": [
    { id: "doc-3-1", name: "Business Registration Certificate", type: "certificate", date: "2024-03-05T11:00:00Z", status: "valid" },
    { id: "doc-3-2", name: "Levy Payment Receipt - Mar 2024", type: "receipt", date: "2024-03-20T10:00:00Z", amount: 750, status: "valid" },
    { id: "doc-3-3", name: "Duplicate Collection Dispute", type: "dispute", date: "2024-06-08T16:00:00Z", status: "disputed", notes: "Flagged for investigation" },
    { id: "doc-3-4", name: "Electronics Import Permit", type: "permit", date: "2024-04-01T08:00:00Z", status: "valid" },
    { id: "doc-3-5", name: "Q1 Tax Invoice", type: "invoice", date: "2024-04-01T08:00:00Z", amount: 2200, status: "valid" },
    { id: "doc-3-6", name: "Levy Payment Receipt - Apr 2024", type: "receipt", date: "2024-04-20T10:00:00Z", amount: 750, status: "valid" },
    { id: "doc-3-7", name: "Levy Payment Receipt - May 2024", type: "receipt", date: "2024-05-20T10:00:00Z", amount: 750, status: "valid" },
  ],
  "4": [
    { id: "doc-4-1", name: "Pharmacy Operating License", type: "license", date: "2024-01-28T09:00:00Z", status: "valid", notes: "FDA approved" },
    { id: "doc-4-2", name: "Drug Handling Certificate", type: "certificate", date: "2024-02-15T09:00:00Z", status: "valid" },
    { id: "doc-4-3", name: "Levy Payment Receipt - Jan 2024", type: "receipt", date: "2024-01-30T10:00:00Z", amount: 600, status: "valid" },
    { id: "doc-4-4", name: "Levy Payment Receipt - Feb 2024", type: "receipt", date: "2024-02-28T10:00:00Z", amount: 600, status: "valid" },
    { id: "doc-4-5", name: "Levy Payment Receipt - Mar 2024", type: "receipt", date: "2024-03-28T10:00:00Z", amount: 600, status: "valid" },
    { id: "doc-4-6", name: "Levy Payment Receipt - Apr 2024", type: "receipt", date: "2024-04-28T10:00:00Z", amount: 600, status: "valid" },
    { id: "doc-4-7", name: "Q2 Tax Invoice", type: "invoice", date: "2024-07-01T08:00:00Z", amount: 1800, status: "pending" },
    { id: "doc-4-8", name: "Cold Storage Permit", type: "permit", date: "2024-03-01T08:00:00Z", status: "valid" },
  ],
  "5": [
    { id: "doc-5-1", name: "Tailoring Business License", type: "license", date: "2024-02-10T13:00:00Z", status: "expired", notes: "License expired - needs renewal" },
    { id: "doc-5-2", name: "Levy Payment Receipt - Feb 2024", type: "receipt", date: "2024-02-20T10:00:00Z", amount: 250, status: "valid" },
    { id: "doc-5-3", name: "Overpayment Notice", type: "notice", date: "2024-05-20T11:00:00Z", status: "pending", notes: "Customer claims overpayment of GHS 150" },
    { id: "doc-5-4", name: "Trade Association Membership", type: "certificate", date: "2024-01-15T08:00:00Z", status: "valid" },
  ],
  "6": [
    { id: "doc-6-1", name: "Service Business License", type: "license", date: "2024-04-01T08:00:00Z", status: "valid" },
    { id: "doc-6-2", name: "Environmental Compliance Certificate", type: "certificate", date: "2024-04-15T09:00:00Z", status: "valid", notes: "Water discharge approved" },
    { id: "doc-6-3", name: "Levy Payment Receipt - Apr 2024", type: "receipt", date: "2024-04-20T10:00:00Z", amount: 300, status: "valid" },
    { id: "doc-6-4", name: "Levy Payment Receipt - May 2024", type: "receipt", date: "2024-05-20T10:00:00Z", amount: 300, status: "valid" },
    { id: "doc-6-5", name: "Levy Payment Receipt - Jun 2024", type: "receipt", date: "2024-06-13T15:00:00Z", amount: 300, status: "valid" },
    { id: "doc-6-6", name: "Water Usage Permit", type: "permit", date: "2024-04-01T08:00:00Z", status: "valid" },
    { id: "doc-6-7", name: "Q2 Tax Invoice", type: "invoice", date: "2024-07-01T08:00:00Z", amount: 900, status: "pending" },
  ],
};

export const businesses: Business[] = [
  {
    ...defaultBiz,
    id: "1",
    businessId: "KSI-0001-MKT",
    name: "Makola Trading Ventures",
    categoryId: "cat-1",
    categoryName: "Trading",
    ownerName: "Ama Serwaa",
    ownerPhone: "+233 24 123 4567",
    locationDescription: "Near Kejetia Market, Block C, Stall 45",
    districtId: "dist-1",
    zoneId: "zone-1",
    zoneName: "Zone A - Central",
    photos: [
      "https://images.unsplash.com/photo-1556742049-0cfed4476c77?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674?w=400&h=300&fit=crop"
    ],
    status: "active",
    registeredBy: "off-1",
    registeredByName: "Emmanuel Owusu",
    registeredAt: "2024-01-15T08:30:00Z",
    lastVisitedAt: "2024-06-10T14:20:00Z",
    lastCollectionAmount: 150,
    totalCollected: 1850,
    documents: bizDocuments["1"],
  },
  {
    ...defaultBiz,
    id: "2",
    businessId: "KSI-0002-RST",
    name: "Adwoa's Chop Bar",
    categoryId: "cat-2",
    categoryName: "Food & Beverage",
    ownerName: "Adwoa Mensah",
    ownerPhone: "+233 20 987 6543",
    locationDescription: "Adum Road, opposite KFC",
    districtId: "dist-1",
    zoneId: "zone-2",
    zoneName: "Zone B - Adum",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
    ],
    status: "active",
    registeredBy: "off-2",
    registeredByName: "Akua Mensah",
    registeredAt: "2024-02-20T10:00:00Z",
    lastVisitedAt: "2024-06-12T09:15:00Z",
    lastCollectionAmount: 200,
    totalCollected: 2400,
    documents: bizDocuments["2"],
  },
  {
    ...defaultBiz,
    id: "3",
    businessId: "KSI-0003-SHP",
    name: "Kwame's Electronics Shop",
    categoryId: "cat-3",
    categoryName: "Electronics",
    ownerName: "Kwame Asante",
    ownerPhone: "+233 27 456 7890",
    locationDescription: "Kejetia, second floor, Shop 12",
    districtId: "dist-1",
    zoneId: "zone-1",
    zoneName: "Zone A - Central",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1531525645387-7f14be1fbd09?w=400&h=300&fit=crop"
    ],
    status: "flagged",
    registeredBy: "off-1",
    registeredByName: "Emmanuel Owusu",
    registeredAt: "2024-03-05T11:45:00Z",
    lastVisitedAt: "2024-06-08T16:30:00Z",
    lastCollectionAmount: 500,
    totalCollected: 3200,
    notes: "Flagged for duplicate collection investigation"
  },
  {
    ...defaultBiz,
    id: "4",
    businessId: "KSI-0004-DRG",
    name: "Peace Pharmacy",
    categoryId: "cat-4",
    categoryName: "Pharmaceuticals",
    ownerName: "Dr. Grace Owusu",
    ownerPhone: "+233 24 321 0987",
    locationDescription: "Bantama High Street, near the market",
    districtId: "dist-1",
    zoneId: "zone-3",
    zoneName: "Zone C - Bantama",
    photos: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop"
    ],
    status: "active",
    registeredBy: "off-3",
    registeredByName: "Kofi Asante",
    registeredAt: "2024-01-28T09:00:00Z",
    lastVisitedAt: "2024-06-11T10:45:00Z",
    lastCollectionAmount: 350,
    totalCollected: 4200
  },
  {
    ...defaultBiz,
    id: "5",
    businessId: "KSI-0005-TLR",
    name: "Ofori's Tailoring Shop",
    categoryId: "cat-5",
    categoryName: "Fashion & Textiles",
    ownerName: "Ofori Boateng",
    ownerPhone: "+233 55 789 0123",
    locationDescription: "Asafo Interchange, Ground Floor",
    districtId: "dist-1",
    zoneId: "zone-2",
    zoneName: "Zone B - Adum",
    photos: [
      "https://images.unsplash.com/photo-1558171813-4c088753a8a4?w=400&h=300&fit=crop"
    ],
    status: "inactive",
    registeredBy: "off-2",
    registeredByName: "Akua Mensah",
    registeredAt: "2024-02-10T13:20:00Z",
    lastVisitedAt: "2024-05-20T11:00:00Z",
    lastCollectionAmount: 0,
    totalCollected: 980
  },
  {
    ...defaultBiz,
    id: "6",
    businessId: "KSI-0006-GRG",
    name: "Nana's Car Wash",
    categoryId: "cat-6",
    categoryName: "Services",
    ownerName: "Nana Kwame",
    ownerPhone: "+233 20 654 3210",
    locationDescription: "Suame Roundabout, opposite the filling station",
    districtId: "dist-1",
    zoneId: "zone-4",
    zoneName: "Zone D - Suame",
    photos: [
      "https://images.unsplash.com/photo-1520672646695-012a7e33e0e3?w=400&h=300&fit=crop"
    ],
    status: "active",
    registeredBy: "off-4",
    registeredByName: "Ama Boateng",
    registeredAt: "2024-04-01T08:00:00Z",
    lastVisitedAt: "2024-06-13T15:30:00Z",
    lastCollectionAmount: 120,
    totalCollected: 1560
  }
];

const defaultAgent = {
  officerPhone: '',
  lastLocation: null,
  targetAmount: 0,
  targetPercent: 0,
  performanceScore: 0,
  weekCollections: 0,
  weekAmount: 0,
  monthCollections: 0,
  monthAmount: 0,
  businessesVisited: 0,
  avgCollectionTime: 0,
};

export const agentStats: AgentStats[] = [
  {
    ...defaultAgent,
    officerId: "off-1",
    officerName: "Emmanuel Owusu",
    zone: "Zone A - Central",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1d7c059347?w=100&h=100&fit=crop&crop=face",
    todayAmount: 4500,
    todayCollections: 28,
    todayVisits: 15,
    weekAmount: 28500,
    weekCollections: 156,
    monthAmount: 95000,
    monthCollections: 520,
    performanceScore: 94,
    isActive: true,
    lastActiveAt: "2024-06-14T10:30:00Z",
    status: 'active'
  },
  {
    ...defaultAgent,
    officerId: "off-2",
    officerName: "Akua Mensah",
    zone: "Zone B - Adum",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    todayAmount: 3800,
    todayCollections: 22,
    todayVisits: 12,
    weekAmount: 24200,
    weekCollections: 134,
    monthAmount: 82000,
    monthCollections: 445,
    performanceScore: 88,
    isActive: true,
    lastActiveAt: "2024-06-14T10:25:00Z",
    status: 'active'
  },
  {
    ...defaultAgent,
    officerId: "off-3",
    officerName: "Kofi Asante",
    zone: "Zone C - Bantama",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    todayAmount: 3200,
    todayCollections: 19,
    todayVisits: 10,
    weekAmount: 19800,
    weekCollections: 112,
    monthAmount: 68000,
    monthCollections: 380,
    performanceScore: 82,
    isActive: true,
    lastActiveAt: "2024-06-14T09:45:00Z",
    status: 'break'
  },
  {
    ...defaultAgent,
    officerId: "off-4",
    officerName: "Ama Boateng",
    zone: "Zone D - Suame",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    todayAmount: 2900,
    todayCollections: 17,
    todayVisits: 9,
    weekAmount: 17500,
    weekCollections: 98,
    monthAmount: 58000,
    monthCollections: 320,
    performanceScore: 76,
    isActive: false,
    lastActiveAt: "2024-06-14T08:00:00Z",
    status: 'offline'
  },
  {
    ...defaultAgent,
    officerId: "off-5",
    officerName: "Yaw Darko",
    zone: "Zone E - Tafo",
    avatarUrl: "https://images.unsplash.com/photo-1472099625465-8c8e0b8e8e0b?w=100&h=100&fit=crop&crop=face",
    todayAmount: 4100,
    todayCollections: 24,
    todayVisits: 14,
    weekAmount: 26800,
    weekCollections: 145,
    monthAmount: 88000,
    monthCollections: 485,
    performanceScore: 91,
    isActive: true,
    lastActiveAt: "2024-06-14T10:20:00Z",
    status: 'active'
  }
];

const defaultCollection = {
  mobileMoneyRef: null,
  receiptUrl: null,
  notes: null,
  collectionLocation: undefined,
};

export const recentCollections: Collection[] = [
  {
    ...defaultCollection,
    id: "col-1",
    receiptNumber: "KSI-2024-00012345",
    businessId: "1",
    businessName: "Makola Trading Ventures",
    officerId: "off-1",
    officerName: "Emmanuel Owusu",
    amount: 150,
    paymentMethod: "mobile_money",
    mobileMoneyRef: "MOM-284729",
    collectionDate: "2024-06-14T10:30:00Z",
    gpsVerified: true
  },
  {
    ...defaultCollection,
    id: "col-2",
    receiptNumber: "KSI-2024-00012346",
    businessId: "2",
    businessName: "Adwoa's Chop Bar",
    officerId: "off-2",
    officerName: "Akua Mensah",
    amount: 200,
    paymentMethod: "cash",
    collectionDate: "2024-06-14T10:15:00Z",
    gpsVerified: true
  },
  {
    ...defaultCollection,
    id: "col-3",
    receiptNumber: "KSI-2024-00012347",
    businessId: "4",
    businessName: "Peace Pharmacy",
    officerId: "off-3",
    officerName: "Kofi Asante",
    amount: 350,
    paymentMethod: "pos",
    collectionDate: "2024-06-14T09:45:00Z",
    gpsVerified: true
  },
  {
    ...defaultCollection,
    id: "col-4",
    receiptNumber: "KSI-2024-00012348",
    businessId: "6",
    businessName: "Nana's Car Wash",
    officerId: "off-5",
    officerName: "Yaw Darko",
    amount: 120,
    paymentMethod: "mobile_money",
    mobileMoneyRef: "MOM-395817",
    collectionDate: "2024-06-14T09:30:00Z",
    gpsVerified: true
  },
  {
    ...defaultCollection,
    id: "col-5",
    receiptNumber: "KSI-2024-00012349",
    businessId: "3",
    businessName: "Kwame's Electronics Shop",
    officerId: "off-1",
    officerName: "Emmanuel Owusu",
    amount: 500,
    paymentMethod: "cash",
    collectionDate: "2024-06-14T09:00:00Z",
    gpsVerified: false
  }
];

export const dueCollections = [
  {
    id: 'due-1', businessId: 'BIZ-001', businessName: 'Adom Supermarket', amountDue: 2500,
    dueDate: '2024-06-10', daysOverdue: 4, status: 'overdue' as const,
    zone: 'Zone A - Central', ownerName: 'Kwesi Adom', ownerPhone: '+233 24 111 2233'
  },
  {
    id: 'due-2', businessId: 'BIZ-002', businessName: 'Amakom Pharmacy', amountDue: 1800,
    dueDate: '2024-06-12', daysOverdue: 2, status: 'overdue' as const,
    zone: 'Zone A - Central', ownerName: 'Akosua Mensah', ownerPhone: '+233 24 222 3344'
  },
  {
    id: 'due-3', businessId: 'BIZ-003', businessName: 'Kejetia Traders', amountDue: 3200,
    dueDate: '2024-06-15', daysOverdue: -1, status: 'due' as const,
    zone: 'Zone B - Adum', ownerName: 'Yaw Boateng', ownerPhone: '+233 24 333 4455'
  },
  {
    id: 'due-4', businessId: 'BIZ-004', businessName: 'Asafo Hardware', amountDue: 950,
    dueDate: '2024-06-08', daysOverdue: 6, status: 'overdue' as const,
    zone: 'Zone C - Bantama', ownerName: 'Ama Serwaa', ownerPhone: '+233 24 444 5566'
  },
  {
    id: 'due-5', businessId: 'BIZ-005', businessName: 'Bantama Mart', amountDue: 1500,
    dueDate: '2024-06-14', daysOverdue: 0, status: 'due' as const,
    zone: 'Zone C - Bantama', ownerName: 'Kofi Asante', ownerPhone: '+233 24 555 6677'
  },
  {
    id: 'due-6', businessId: 'BIZ-006', businessName: 'Suame Auto Parts', amountDue: 4200,
    dueDate: '2024-06-05', daysOverdue: 9, status: 'overdue' as const,
    zone: 'Zone D - Suame', ownerName: 'Emmanuel Nyarko', ownerPhone: '+233 24 666 7788'
  },
  {
    id: 'due-7', businessId: 'BIZ-007', businessName: 'Tafo Textiles', amountDue: 1100,
    dueDate: '2024-06-13', daysOverdue: 1, status: 'overdue' as const,
    zone: 'Zone E - Tafo', ownerName: 'Akua Frimpong', ownerPhone: '+233 24 777 8899'
  },
  {
    id: 'due-8', businessId: 'BIZ-008', businessName: 'Dichemso Grocers', amountDue: 780,
    dueDate: '2024-06-18', daysOverdue: -4, status: 'due' as const,
    zone: 'Zone A - Central', ownerName: 'Mensah Osei', ownerPhone: '+233 24 888 9900'
  },
  {
    id: 'due-9', businessId: 'BIZ-009', businessName: 'Adum Electronics', amountDue: 500,
    dueDate: '2024-06-20', daysOverdue: -6, status: 'due' as const,
    zone: 'Zone B - Adum', ownerName: 'Nana Yaa', ownerPhone: '+233 24 999 0011'
  },
  {
    id: 'due-10', businessId: 'BIZ-010', businessName: 'Abinkuu Market Stalls', amountDue: 2800,
    dueDate: '2024-06-07', daysOverdue: 7, status: 'overdue' as const,
    zone: 'Zone D - Suame', ownerName: 'Rashid Mohammed', ownerPhone: '+233 25 111 2233'
  },
  {
    id: 'due-11', businessId: 'BIZ-011', businessName: 'Asem North Store', amountDue: 1350,
    dueDate: '2024-06-16', daysOverdue: -2, status: 'due' as const,
    zone: 'Zone E - Tafo', ownerName: 'Grace Ofori', ownerPhone: '+233 25 222 3344'
  },
  {
    id: 'due-12', businessId: 'BIZ-012', businessName: 'Bomso Restaurant', amountDue: 650,
    dueDate: '2024-06-11', daysOverdue: 3, status: 'overdue' as const,
    zone: 'Zone C - Bantama', ownerName: 'Abena Serwaah', ownerPhone: '+233 25 333 4455'
  },
  {
    id: 'due-13', businessId: 'BIZ-013', businessName: 'Bantama Butchery', amountDue: 1900,
    dueDate: '2024-06-09', daysOverdue: 5, status: 'partial' as const,
    zone: 'Zone C - Bantama', ownerName: 'Issah Yakubu', ownerPhone: '+233 25 444 5566'
  },
  {
    id: 'due-14', businessId: 'BIZ-014', businessName: 'Kejetia ShoeMart', amountDue: 300,
    dueDate: '2024-06-22', daysOverdue: -8, status: 'due' as const,
    zone: 'Zone B - Adum', ownerName: 'Abigail Donkor', ownerPhone: '+233 25 555 6677'
  },
  {
    id: 'due-15', businessId: 'BIZ-015', businessName: 'Ayigya Mart', amountDue: 2200,
    dueDate: '2024-06-06', daysOverdue: 8, status: 'overdue' as const,
    zone: 'Zone A - Central', ownerName: 'Daniel Asare', ownerPhone: '+233 25 666 7788'
  },
];

export const alerts: Alert[] = [
  {
    id: "alert-1",
    type: "fraud",
    title: "Duplicate Collection Detected",
    description: "Business KSI-0003-SHP flagged for potential duplicate collection of GHS 500",
    timestamp: "2024-06-14T10:00:00Z",
    isRead: false,
    priority: "high",
    actionRequired: true
  },
  {
    id: "alert-2",
    type: "inactive",
    title: "Agent Inactive",
    description: "Ama Boateng has been inactive for 2+ hours during work hours",
    timestamp: "2024-06-14T09:30:00Z",
    isRead: false,
    priority: "medium"
  },
  {
    id: "alert-3",
    type: "sync",
    title: "Sync Pending",
    description: "12 offline records pending upload from field agents",
    timestamp: "2024-06-14T09:00:00Z",
    isRead: true,
    priority: "low"
  },
  {
    id: "alert-4",
    type: "anomaly",
    title: "GPS Anomaly",
    description: "Collection at KSI-0005-TLR recorded 150m from business location",
    timestamp: "2024-06-14T08:30:00Z",
    isRead: true,
    priority: "medium"
  },
  {
    id: "alert-5",
    type: "warning",
    title: "High Value Collection",
    description: "Collection of GHS 2,500 requires supervisor approval",
    timestamp: "2024-06-14T08:00:00Z",
    isRead: false,
    priority: "high",
    actionRequired: true
  }
];

export const revenueTrend: RevenueTrend[] = [
  { date: "Mon", amount: 28500, target: 30000 },
  { date: "Tue", amount: 32400, target: 30000 },
  { date: "Wed", amount: 29800, target: 30000 },
  { date: "Thu", amount: 35200, target: 30000 },
  { date: "Fri", amount: 24300, target: 30000 },
  { date: "Sat", amount: 18550, target: 20000 },
  { date: "Sun", amount: 0, target: 0 }
];

export const categoryBreakdown: CategoryBreakdown[] = [
  { category: "Trading", revenue: 185000, count: 1240, percentage: 28.7 },
  { category: "Food & Beverage", revenue: 125000, count: 890, percentage: 19.4 },
  { category: "Electronics", revenue: 95000, count: 420, percentage: 14.7 },
  { category: "Pharmaceuticals", revenue: 78000, count: 280, percentage: 12.1 },
  { category: "Services", revenue: 62500, count: 590, percentage: 9.7 },
  { category: "Fashion", revenue: 48500, count: 320, percentage: 7.5 },
  { category: "Others", revenue: 51000, count: 280, percentage: 7.9 }
];

export const zones: Zone[] = [
  { id: "zone-1", name: "Zone A - Central", districtId: "dist-1", businessCount: 890, revenue: 185000, supervisor: "Emmanuel Owusu" },
  { id: "zone-2", name: "Zone B - Adum", districtId: "dist-1", businessCount: 720, revenue: 142000, supervisor: "Akua Mensah" },
  { id: "zone-3", name: "Zone C - Bantama", districtId: "dist-1", businessCount: 650, revenue: 128000, supervisor: "Kofi Asante" },
  { id: "zone-4", name: "Zone D - Suame", districtId: "dist-1", businessCount: 580, revenue: 98000, supervisor: "Ama Boateng" },
  { id: "zone-5", name: "Zone E - Tafo", districtId: "dist-1", businessCount: 580, revenue: 92000, supervisor: "Yaw Darko" }
];

export const users: User[] = [
  {
    id: "user-1",
    fullName: "Dr. Kwame Asante",
    email: "kwame.asante@kma.gov.gh",
    phone: "+233 24 123 4567",
    role: "admin",
    districtId: "dist-1",
    districtName: "Kumasi Metropolitan",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1d7c059347?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T10:30:00Z"
  },
  {
    id: "user-2",
    fullName: "Mrs. Abena Yiadom",
    email: "abena.yiadom@kma.gov.gh",
    phone: "+233 20 234 5678",
    role: "supervisor",
    districtId: "dist-1",
    districtName: 'Kumasi Metropolitan',
    zoneId: "zone-1",
    zoneName: "Zone A - Central",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T10:25:00Z"
  },
  {
    id: "user-3",
    fullName: "Mr. John Mensah",
    email: "john.mensah@kma.gov.gh",
    phone: "+233 27 345 6789",
    role: "supervisor",
    districtId: "dist-1",
    districtName: 'Kumasi Metropolitan',
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T09:00:00Z"
  },
  {
    id: "user-4",
    fullName: "Ms. Esi Gyan",
    email: "esi.gyan@kma.gov.gh",
    phone: "+233 24 456 7890",
    role: "accountant",
    districtId: "dist-1",
    districtName: "Kumasi Metropolitan",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T08:45:00Z"
  },
  {
    id: "user-5",
    fullName: "Mr. Kwabena Danso",
    email: "kwabena.danso@kma.gov.gh",
    phone: "+233 20 567 8901",
    role: "manager",
    districtId: "dist-1",
    districtName: "Kumasi Metropolitan",
    avatarUrl: "https://images.unsplash.com/photo-1472099625465-8c8e0b8e8e0b?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T07:30:00Z"
  },
  {
    id: "user-6",
    fullName: "Mr. Kofi Appiah",
    email: "kofi.appiah@kma.gov.gh",
    phone: "+233 27 678 9012",
    role: "field_officer",
    districtId: "dist-1",
    districtName: "Kumasi Metropolitan",
    zoneId: "zone-2",
    zoneName: "Zone B - Adum",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    isActive: true,
    lastActiveAt: "2024-06-14T06:00:00Z"
  }
];

export const anomalies: Anomaly[] = [
  {
    id: "anom-1",
    type: "duplicate_collection",
    severity: "warning",
    title: "Potential Duplicate Collection",
    description: "Same business collected twice within 2 hours — KSI-0003-SHP",
    officerId: "off-1",
    officerName: "Emmanuel Owusu",
    businessId: "3",
    businessName: "Kwame's Electronics Shop",
    collectionId: "col-x1",
    metadata: { timeDiff: "1h 45m" },
    createdAt: "2024-06-14T10:00:00Z",
    detectedAt: "2024-06-14T10:00:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-2",
    type: "gps_mismatch",
    severity: "info",
    title: "GPS Location Mismatch",
    description: "Collection location 150m from registered business location for KSI-0005-TLR",
    officerId: "off-2",
    officerName: "Akua Mensah",
    businessId: "5",
    businessName: "Ofori's Tailoring Shop",
    collectionId: "col-x2",
    metadata: { distance: "150m" },
    createdAt: "2024-06-14T08:30:00Z",
    detectedAt: "2024-06-14T08:30:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-3",
    type: "inactive_agent",
    severity: "warning",
    title: "Agent Inactive",
    description: "No activity from agent Ama Boateng for 3+ hours during work hours",
    officerId: "off-4",
    officerName: "Ama Boateng",
    businessId: null,
    businessName: null,
    collectionId: null,
    metadata: { inactiveDuration: "3h 22m" },
    createdAt: "2024-06-14T09:30:00Z",
    detectedAt: "2024-06-14T09:30:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-4",
    type: "cash_shortage",
    severity: "error",
    title: "Cash Shortage Detected",
    description: "Remittance of GHS 2,500 submitted but expected GHS 3,200 — difference of GHS 700",
    officerId: "off-1",
    officerName: "Emmanuel Owusu",
    businessId: null,
    businessName: null,
    collectionId: null,
    metadata: { expected: 3200, submitted: 2500, difference: 700 },
    createdAt: "2024-06-14T07:00:00Z",
    detectedAt: "2024-06-14T07:00:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-5",
    type: "sync_conflict",
    severity: "error",
    title: "Sync Conflict",
    description: "12 offline records conflict with server data — manual reconciliation required",
    officerId: null,
    officerName: null,
    businessId: null,
    businessName: null,
    collectionId: null,
    metadata: { recordCount: 12 },
    createdAt: "2024-06-13T18:00:00Z",
    detectedAt: "2024-06-13T18:00:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-6",
    type: "gps_mismatch",
    severity: "warning",
    title: "GPS Anomaly",
    description: "Check-in location recorded 85km from previous stop within 2 minutes",
    officerId: "off-5",
    officerName: "Yaw Darko",
    businessId: "6",
    businessName: "Nana's Car Wash",
    collectionId: "col-x3",
    metadata: { speed: "85km/h" },
    createdAt: "2024-06-14T06:30:00Z",
    detectedAt: "2024-06-14T06:30:00Z",
    isResolved: false,
    resolvedBy: null,
    resolvedAt: null,
  },
  {
    id: "anom-7",
    type: "duplicate_collection",
    severity: "info",
    title: "Duplicate Receipt Issued",
    description: "Receipt KSI-2024-00012345 was issued twice for different amounts",
    officerId: "off-3",
    officerName: "Kofi Asante",
    businessId: "4",
    businessName: "Peace Pharmacy",
    collectionId: "col-x4",
    metadata: { receipt: "KSI-2024-00012345" },
    createdAt: "2024-06-12T14:00:00Z",
    detectedAt: "2024-06-12T14:00:00Z",
    isResolved: true,
    resolvedBy: "user-1",
    resolvedAt: "2024-06-13T10:00:00Z",
  },
  {
    id: "anom-8",
    type: "inactive_agent",
    severity: "info",
    title: "Agent Late Start",
    description: "Agent Kofi Asante started collection route 2 hours late",
    officerId: "off-3",
    officerName: "Kofi Asante",
    businessId: null,
    businessName: null,
    collectionId: null,
    metadata: { delayMinutes: 120 },
    createdAt: "2024-06-11T10:00:00Z",
    detectedAt: "2024-06-11T10:00:00Z",
    isResolved: true,
    resolvedBy: "user-1",
    resolvedAt: "2024-06-11T14:00:00Z",
  },
];

export function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}