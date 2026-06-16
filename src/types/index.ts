// Core Types for CyberRevenue Command System

export interface Location {
  lat: number;
  lng: number;
}

export interface Business {
  id: string;
  businessId: string;
  name: string;
  categoryId: string;
  categoryName: string;
  ownerName: string;
  ownerPhone: string;
  location: Location;
  locationDescription: string | null;
  districtId: string;
  zoneId: string;
  zoneName: string;
  photos: string[];
  status: 'active' | 'inactive' | 'flagged' | 'closed';
  levyStatus: 'paid' | 'due' | 'overdue' | 'partial' | 'waived';
  totalOutstanding: number;
  lastAmountPaid: number | null;
  lastPaymentDate: string | null;
  registeredBy: string;
  registeredByName?: string;
  registeredAt: string;
  lastVisitedAt: string | null;
  lastVisitedBy: string | null;
  lastCollectionAmount?: number;
  totalCollected?: number;
  notes: string | null;
}

export interface AgentStats {
  officerId: string;
  officerName: string;
  officerPhone: string;
  zone: string;
  isActive: boolean;
  status: 'in-field' | 'on-break' | 'offline' | 'active' | 'break';
  lastLocation: Location | null;
  lastActiveAt: string;
  todayCollections: number;
  todayAmount: number;
  todayVisits?: number;
  weekCollections: number;
  weekAmount: number;
  monthCollections: number;
  monthAmount: number;
  targetAmount: number;
  targetPercent: number;
  performanceScore: number;
  businessesVisited: number;
  avgCollectionTime: number;
  avatarUrl?: string;
}

export interface Collection {
  id: string;
  receiptNumber: string;
  businessId: string;
  businessName: string;
  businessCode?: string;
  visitId?: string;
  officerId: string;
  officerName: string;
  amount: number;
  paymentMethod: 'cash' | 'mobile_money' | 'pos' | 'other';
  mobileMoneyRef: string | null;
  collectionDate: string;
  gpsVerified: boolean;
  collectionLocation?: Location;
  isSynced?: boolean;
  receiptUrl: string | null;
  notes: string | null;
}

export interface Anomaly {
  id: string;
  type: 'duplicate_collection' | 'gps_mismatch' | 'inactive_agent' | 'cash_shortage' | 'sync_conflict';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  officerId: string | null;
  officerName: string | null;
  businessId: string | null;
  businessName: string | null;
  collectionId: string | null;
  metadata: Record<string, string | number | null>;
  createdAt: string;
  detectedAt: string;
  isResolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
}

export interface DashboardMetrics {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    target: number;
    targetPercent: number;
  };
  collections: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
  };
  businesses: {
    total: number;
    active: number;
    inactive: number;
    flagged: number;
    paid: number;
    due: number;
    overdue: number;
  };
  agents: {
    total: number;
    active: number;
    inField: number;
    offline: number;
    avgPerformance: number;
  };
  recentCollections: Collection[];
  anomalies: Anomaly[];
}

export type UserRole = 'admin' | 'supervisor' | 'accountant' | 'manager' | 'field_officer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  districtId: string;
  districtName: string;
  zoneId?: string;
  zoneName?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastActiveAt: string;
}

export interface Permission {
  resource: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'resolve')[];
}

export interface Alert {
  id: string;
  type: 'fraud' | 'inactive' | 'sync' | 'anomaly' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

export interface DashboardStats {
  todayRevenue: number;
  todayCollections: number;
  todayVisits: number;
  weekRevenue: number;
  weekCollections: number;
  monthRevenue: number;
  targetRevenue: number;
  activeAgents: number;
  totalAgents: number;
  pendingSync: number;
  businessesRegistered: number;
  businessesActive: number;
  businessesFlagged: number;
  collectionRate: number;
}

export interface RevenueTrend {
  date: string;
  amount: number;
  target: number;
}

export interface CategoryBreakdown {
  category: string;
  revenue: number;
  count: number;
  percentage: number;
}

export interface Zone {
  id: string;
  name: string;
  districtId: string;
  businessCount: number;
  revenue: number;
  supervisor: string;
}

export type PageType = 'dashboard' | 'map' | 'businesses' | 'agents' | 'collections' | 'reports' | 'ledger' | 'anomalies' | 'users' | 'settings' | 'activity' | 'commissions' | 'compliance' | 'disputes' | 'reconciliation' | 'assets';

export interface Visit {
  id: string;
  businessId: string;
  officerId: string;
  officerName: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  collectionAmount?: number;
  paymentMethod?: 'cash' | 'mobile_money' | 'pos' | 'other';
  gpsVerified: boolean;
  photos: string[];
  signature?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AnomalyDetection {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  relatedEntities: Record<string, string>;
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  assignedTo?: string;
}

export interface CashRemittance {
  id: string;
  officerId: string;
  officerName: string;
  amount: number;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface Dispute {
  id: string;
  businessId: string;
  businessName: string;
  collectorId: string;
  collectorName: string;
  type: 'overpayment' | 'underpayment' | 'missing_receipt' | 'wrong_amount' | 'duplicate' | 'other';
  amount: number;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolution: string | null;
}

export interface LevyBill {
  id: string;
  businessId: string;
  businessName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
  period: string;
  generatedAt: string;
}

export interface ArrearsRecord {
  id: string;
  businessId: string;
  businessName: string;
  totalArrears: number;
  oldestBillDate: string;
  status: 'active' | 'payment_plan' | 'legal' | 'written_off';
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface AIRoutePlan {
  id: string;
  officerId: string;
  date: string;
  route: Array<{
    businessId: string;
    businessName: string;
    location: Location;
    estimatedTime: number;
    priority: number;
  }>;
  totalDistance: number;
  estimatedDuration: number;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  createdAt: string;
}

// Accounting Module Types
export interface AccountCode {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  isActive: boolean;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  entryDate: string;
  createdBy: string;
  reference: string;
  referenceType: 'collection' | 'remittance' | 'invoice' | 'waiver' | 'adjustment';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string;
  businessName: string;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  issueDate: string;
  dueDate: string;
  period: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Remittance {
  id: string;
  remittanceNumber: string;
  officerId: string;
  officerName: string;
  amount: number;
  cashAmount: number;
  mobileMoneyAmount: number;
  posAmount: number;
  collectionCount: number;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  notes: string;
}

export interface BudgetLine {
  id: string;
  code: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  fiscalYear: number;
  category: string;
}

export interface CashFlowEntry {
  date: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  balance: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCollections: number;
  totalOutstanding: number;
  collectionRate: number;
  periodRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
  activeInvoices: number;
  overdueInvoices: number;
  pendingRemittances: number;
  pendingRemittanceAmount: number;
}

// Activity / Audit Log
export interface ActivityEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

// Commission / Incentive
export interface CommissionEntry {
  id: string;
  officerId: string;
  officerName: string;
  period: string;
  baseCollection: number;
  bonusAmount: number;
  penaltyAmount: number;
  totalCommission: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt: string | null;
  breakdown: { label: string; amount: number }[];
}

// Compliance Check
export interface ComplianceCheck {
  id: string;
  officerId: string;
  officerName: string;
  checkType: string;
  status: 'pass' | 'fail' | 'pending';
  checkedAt: string;
  checkedBy: string;
  details: string;
  score: number;
  requiredActions: string[];
}

// Bank Reconciliation
export interface ReconciliationEntry {
  id: string;
  depositDate: string;
  depositAmount: number;
  depositRef: string;
  collectedAmount: number;
  variance: number;
  status: 'matched' | 'unmatched' | 'partial' | 'flagged';
  matchingEntries: number;
  notes: string;
}

// Asset
export interface Asset {
  id: string;
  type: 'phone' | 'tablet' | 'printer' | 'uniform' | 'id_card' | 'other';
  serialNumber: string;
  assignedTo: string;
  assignedToName: string;
  assignedAt: string;
  returnedAt: string | null;
  condition: 'new' | 'good' | 'fair' | 'damaged' | 'lost';
  notes: string;
}