import { Business, AgentStats, Collection, Anomaly, DashboardMetrics, ActivityEntry, CommissionEntry, ComplianceCheck, ReconciliationEntry, Dispute, Asset } from '../types';
import { generateBusinesses, generateAgents, generateCollections, generateAnomalies, generateDashboardMetrics } from '../utils/simulation';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockBackend {
  private businesses: Business[];
  private agents: AgentStats[];
  private collections: Collection[];
  private anomalies: Anomaly[];
  private metrics: DashboardMetrics;

  constructor() {
    this.businesses = generateBusinesses(60);
    this.agents = generateAgents(8);
    this.collections = generateCollections(this.businesses, this.agents, 30);
    this.anomalies = generateAnomalies(this.agents, this.businesses);
    this.metrics = generateDashboardMetrics(this.businesses, this.agents, this.collections, this.anomalies);
  }

  async getBusinesses(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    await delay(300);
    let filtered = [...this.businesses];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(search) || 
        b.businessId.toLowerCase().includes(search)
      );
    }
    
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(b => b.status === params.status);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  async getBusiness(id: string) {
    await delay(200);
    const business = this.businesses.find(b => b.id === id);
    if (!business) throw new Error('Business not found');
    return business;
  }

  async updateBusiness(id: string, updates: Partial<Business>) {
    await delay(400);
    const index = this.businesses.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Business not found');
    
    this.businesses[index] = { ...this.businesses[index], ...updates };
    return this.businesses[index];
  }

  async getAgents(params?: { page?: number; limit?: number; search?: string }) {
    await delay(300);
    let filtered = [...this.agents];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.officerName.toLowerCase().includes(search) || 
        a.zone.toLowerCase().includes(search)
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  async getAgent(id: string) {
    await delay(200);
    const agent = this.agents.find(a => a.officerId === id);
    if (!agent) throw new Error('Agent not found');
    return agent;
  }

  async updateAgent(id: string, updates: Partial<AgentStats>) {
    await delay(400);
    const index = this.agents.findIndex(a => a.officerId === id);
    if (index === -1) throw new Error('Agent not found');
    
    this.agents[index] = { ...this.agents[index], ...updates };
    return this.agents[index];
  }

  async getCollections(params?: { page?: number; limit?: number; businessId?: string; paymentMethod?: string }) {
    await delay(300);
    let filtered = [...this.collections];
    
    if (params?.businessId) {
      filtered = filtered.filter(c => c.businessId === params.businessId);
    }
    
    if (params?.paymentMethod && params.paymentMethod !== 'all') {
      filtered = filtered.filter(c => c.paymentMethod === params.paymentMethod);
    }
    
    filtered.sort((a, b) => new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime());
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  async getDashboardMetrics() {
    await delay(200);
    return this.metrics;
  }

  async getAnomalies(params?: { page?: number; limit?: number; resolved?: boolean }) {
    await delay(300);
    let filtered = [...this.anomalies];
    
    if (params?.resolved !== undefined) {
      filtered = filtered.filter(a => a.isResolved === params.resolved);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  async resolveAnomaly(id: string) {
    await delay(400);
    const index = this.anomalies.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Anomaly not found');
    
    this.anomalies[index] = { ...this.anomalies[index], isResolved: true };
    return this.anomalies[index];
  }

  async createCollection(data: Partial<Collection>) {
    await delay(500);
    const collection: Collection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      receiptNumber: `KSI-${new Date().getFullYear()}-${String(Math.random().toString().substr(2, 5)).padStart(5, '0')}`,
      businessId: data.businessId || '',
      businessName: this.businesses.find(b => b.id === data.businessId)?.name || '',
      businessCode: this.businesses.find(b => b.id === data.businessId)?.businessId || '',
      visitId: data.visitId || `visit-${Date.now()}`,
      officerId: data.officerId || '',
      officerName: this.agents.find(a => a.officerId === data.officerId)?.officerName || '',
      amount: data.amount || 0,
      paymentMethod: data.paymentMethod || 'cash',
      mobileMoneyRef: data.mobileMoneyRef || null,
      collectionDate: new Date().toISOString(),
      gpsVerified: data.gpsVerified || false,
      collectionLocation: data.collectionLocation || { lat: 6.6885, lng: -1.5273 },
      isSynced: false,
      receiptUrl: null,
      notes: data.notes || null,
    };
    
    this.collections.unshift(collection);
    this.updateMetrics();
    return collection;
  }

  private updateMetrics() {
    this.metrics = generateDashboardMetrics(
      this.businesses,
      this.agents,
      this.collections,
      this.anomalies
    );
  }

  async getCurrentUser() {
    await delay(200);
    return {
      id: 'user-1',
      fullName: 'Dr. Kwame Asante',
      email: 'kwame.asante@kma.gov.gh',
      phone: '+233 24 123 4567',
      role: 'district_admin',
      districtId: 'dist-1',
      districtName: 'Kumasi Metropolitan',
      avatarUrl: 'https://images.unsplash.com/photo-1472099625465-8c8e0b8e8e0b?w=100&h=100&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: new Date().toISOString(),
    };
  }

  async login(email: string, password: string) {
    await delay(500);
    if (email && password) {
      return {
        id: 'user-1',
        fullName: 'Dr. Kwame Asante',
        email,
        phone: '+233 24 123 4567',
        role: 'district_admin',
        districtId: 'dist-1',
        districtName: 'Kumasi Metropolitan',
        avatarUrl: 'https://images.unsplash.com/photo-1472099625465-8c8e0b8e8e0b?w=100&h=100&fit=crop&crop=face',
        isActive: true,
        lastActiveAt: new Date().toISOString(),
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };
    }
    throw new Error('Invalid credentials');
  }

  async logout() {
    await delay(200);
    return { success: true };
  }

  async refreshToken() {
    await delay(300);
    return 'new-mock-jwt-token';
  }

  // Financial/Accounting endpoints
  async getFinancialSummary() {
    await delay(200);
    const totalCollections = this.collections.reduce((s, c) => s + c.amount, 0);
    return {
      totalRevenue: totalCollections,
      totalCollections,
      totalOutstanding: this.businesses.reduce((s, b) => s + b.totalOutstanding, 0),
      collectionRate: 68.5,
      periodRevenue: totalCollections * 0.3,
      previousPeriodRevenue: totalCollections * 0.25,
      revenueGrowth: 18.2,
      activeInvoices: 45,
      overdueInvoices: 12,
      pendingRemittances: 3,
      pendingRemittanceAmount: 15200,
    };
  }

  async getLedger(params?: { page?: number; limit?: number }) {
    await delay(300);
    const page = params?.page || 1;
    const limit = params?.limit || 25;
    const entries = Array.from({ length: 50 }, (_, i) => {
      const isDebit = i % 2 === 0;
      const amount = Math.random() * 5000 + 500;
      return {
        id: `ledger-${i}`,
        transactionId: `TXN-${String(10000 + i).padStart(6, '0')}`,
        accountCode: ['40100', '10100', '20100', '50100'][i % 4],
        accountName: ['Market Tolls Revenue', 'Cash & Bank', 'Accounts Receivable', 'Operating Expenses'][i % 4],
        description: ['Daily market collection', 'Levy payment', 'Business operating permit', 'Property rate collection', 'Sanitation fee'][i % 5],
        debit: isDebit ? amount : 0,
        credit: isDebit ? 0 : amount,
        balance: 125000 + (i + 1) * (isDebit ? amount : -amount),
        entryDate: new Date(Date.now() - i * 3600000 * 24).toISOString(),
        createdBy: 'Dr. Kwame Asante',
        reference: `REF-${String(2000 + i).padStart(6, '0')}`,
        referenceType: ['collection', 'invoice', 'remittance', 'adjustment'][i % 4],
      };
    });
    return {
      data: entries.slice((page - 1) * limit, page * limit),
      meta: { total: entries.length, page, limit },
    };
  }

  async getInvoices(params?: { page?: number; limit?: number; status?: string }) {
    await delay(300);
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    const statuses = ['paid', 'partial', 'overdue', 'sent', 'draft'];
    const invoices = Array.from({ length: 30 }, (_, i) => {
      const totalAmount = Math.random() * 10000 + 500;
      const partialPaid = totalAmount * (Math.random() * 0.8);
      const status = statuses[i % 5];
      return {
        id: `inv-${i}`,
        invoiceNumber: `INV-${String(2024000 + i).padStart(7, '0')}`,
        businessId: `BIZ-${100 + i}`,
        businessName: `Business ${String.fromCharCode(65 + (i % 26))} Enterprises`,
        amount: totalAmount,
        amountPaid: status === 'paid' ? totalAmount : status === 'partial' ? partialPaid : 0,
        balanceDue: status === 'paid' ? 0 : status === 'partial' ? totalAmount - partialPaid : totalAmount,
        issueDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
        dueDate: new Date(Date.now() + (i % 3 === 0 ? -1 : 1) * 86400000 * 15).toISOString(),
        period: `Q${(i % 4) + 1} 2026`,
        status,
        items: [
          { description: 'Market stall levy', quantity: 1, unitPrice: totalAmount * 0.6, amount: totalAmount * 0.6 },
          { description: 'Sanitation fee', quantity: 1, unitPrice: totalAmount * 0.4, amount: totalAmount * 0.4 },
        ],
        notes: '',
      };
    });
    const filtered = params?.status ? invoices.filter(i => i.status === params.status) : invoices;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit },
    };
  }

  async getRemittances(params?: { page?: number; limit?: number; status?: string }) {
    await delay(300);
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const statuses = ['pending', 'verified', 'rejected'];
    const officers = ['Kwesi Annan', 'Ama Serwaa', 'Kofi Mensah', 'Yaa Asantewaa', 'Eric Osei'];
    const remittances = Array.from({ length: 20 }, (_, i) => ({
      id: `rem-${i}`,
      remittanceNumber: `REM-${String(3000 + i).padStart(6, '0')}`,
      officerId: `OFF-${100 + i}`,
      officerName: officers[i % 5],
      amount: Math.random() * 15000 + 2000,
      cashAmount: Math.random() * 5000 + 500,
      mobileMoneyAmount: Math.random() * 8000 + 1000,
      posAmount: Math.random() * 2000 + 200,
      collectionCount: Math.floor(Math.random() * 20 + 5),
      status: statuses[i % 3],
      submittedAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
      verifiedAt: i % 3 !== 0 ? new Date(Date.now() - i * 3600000 * 2).toISOString() : null,
      verifiedBy: i % 3 !== 0 ? 'Dr. Kwame Asante' : null,
      notes: '',
    }));
    const filtered = params?.status ? remittances.filter(r => r.status === params.status) : remittances;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit },
    };
  }

  async getCashFlow(params?: { period?: string }) {
    await delay(200);
    const days = params?.period === 'month' ? 30 : 7;
    let balance = 500000;
    const entries = Array.from({ length: days }, (_, i) => {
      const inflows = Math.random() * 50000 + 15000;
      const outflows = Math.random() * 30000 + 10000;
      const net = inflows - outflows;
      balance += net;
      return {
        date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
        inflows,
        outflows,
        netCashFlow: net,
        balance,
      };
    });
    return entries;
  }

  async getDashboard() {
    await delay(200);
    return this.metrics;
  }

  // Activity / Audit Log
  private activityData: ActivityEntry[] = [];
  private generateActivityData() {
    if (this.activityData.length > 0) return;
    const actions = ['created', 'updated', 'deleted', 'approved', 'rejected', 'verified', 'assigned', 'synced', 'flagged', 'resolved'];
    const resourceTypes = ['collection', 'business', 'agent', 'remittance', 'invoice', 'dispute', 'user', 'commission', 'compliance', 'asset'];
    const officers = ['Kwesi Annan', 'Ama Serwaa', 'Kofi Mensah', 'Yaa Asantewaa', 'Eric Osei', 'Adwoa Boateng'];
    this.activityData = Array.from({ length: 100 }, (_, i) => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const actor = officers[Math.floor(Math.random() * officers.length)];
      const sev: ('info' | 'warning' | 'error' | 'success')[] = ['info', 'info', 'info', 'success', 'warning', 'error'];
      return {
        id: `act-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        actorId: `OFF-${100 + Math.floor(Math.random() * 5)}`,
        actorName: actor,
        actorRole: Math.random() > 0.7 ? 'Supervisor' : 'Field Officer',
        action,
        resourceType,
        resourceId: `${resourceType.slice(0, 4).toUpperCase()}-${String(1000 + i)}`,
        resourceName: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} #${i + 1}`,
        details: `${actor} ${action} ${resourceType} record`,
        severity: sev[Math.floor(Math.random() * sev.length)],
      };
    });
  }

  async getActivity(params?: { page?: number; limit?: number; actor?: string; action?: string }) {
    await delay(300);
    this.generateActivityData();
    let filtered = [...this.activityData];
    if (params?.actor) filtered = filtered.filter(a => a.actorName.toLowerCase().includes(params.actor!.toLowerCase()));
    if (params?.action) filtered = filtered.filter(a => a.action === params.action);
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const page = params?.page || 1;
    const limit = params?.limit || 25;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }

  // Commissions
  private commissionData: CommissionEntry[] = [];
  private generateCommissionData() {
    if (this.commissionData.length > 0) return;
    const officers = [
      { id: 'OFF-100', name: 'Kwesi Annan' },
      { id: 'OFF-101', name: 'Ama Serwaa' },
      { id: 'OFF-102', name: 'Kofi Mensah' },
      { id: 'OFF-103', name: 'Yaa Asantewaa' },
      { id: 'OFF-104', name: 'Eric Osei' },
    ];
    const periods = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
    const statuses: ('pending' | 'paid' | 'cancelled')[] = ['pending', 'paid', 'paid', 'paid', 'cancelled'];
    for (const officer of officers) {
      for (const period of periods) {
        const base = Math.random() * 8000 + 2000;
        const bonus = Math.random() > 0.4 ? Math.random() * 1500 : 0;
        const penalty = Math.random() > 0.6 ? Math.random() * 500 : 0;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        this.commissionData.push({
          id: `comm-${officer.id}-${period}`,
          officerId: officer.id,
          officerName: officer.name,
          period,
          baseCollection: base,
          bonusAmount: bonus,
          penaltyAmount: penalty,
          totalCommission: base + bonus - penalty,
          status,
          paidAt: status === 'paid' ? new Date(Date.now() - Math.random() * 86400000 * 30).toISOString() : null,
          breakdown: [
            { label: 'Base Collection Commission', amount: base },
            { label: 'Performance Bonus', amount: bonus },
            { label: 'Penalties', amount: -penalty },
          ],
        });
      }
    }
  }

  async getCommissions(params?: { page?: number; limit?: number; officerId?: string; status?: string }) {
    await delay(300);
    this.generateCommissionData();
    let filtered = [...this.commissionData];
    if (params?.officerId) filtered = filtered.filter(c => c.officerId === params.officerId);
    if (params?.status) filtered = filtered.filter(c => c.status === params.status);
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }

  // Compliance
  private complianceData: ComplianceCheck[] = [];
  private generateComplianceData() {
    if (this.complianceData.length > 0) return;
    const officers = [
      { id: 'OFF-100', name: 'Kwesi Annan' },
      { id: 'OFF-101', name: 'Ama Serwaa' },
      { id: 'OFF-102', name: 'Kofi Mensah' },
      { id: 'OFF-103', name: 'Yaa Asantewaa' },
      { id: 'OFF-104', name: 'Eric Osei' },
    ];
    const checkTypes = ['GPS Verification', 'Receipt Issuance', 'Daily Remittance', 'Route Adherence', 'Collection Report', 'Equipment Check'];
    for (let i = 0; i < 40; i++) {
      const officer = officers[Math.floor(Math.random() * officers.length)];
      const checkType = checkTypes[Math.floor(Math.random() * checkTypes.length)];
      const score = Math.floor(Math.random() * 40 + 60);
      const status: 'pass' | 'fail' | 'pending' = score >= 80 ? 'pass' : score >= 60 ? 'pending' : 'fail';
      this.complianceData.push({
        id: `comp-${i}`,
        officerId: officer.id,
        officerName: officer.name,
        checkType,
        status,
        checkedAt: new Date(Date.now() - Math.random() * 86400000 * 14).toISOString(),
        checkedBy: 'Systems Admin',
        details: `${checkType} check for ${officer.name} — score ${score}%`,
        score,
        requiredActions: status === 'fail' 
          ? ['Immediate corrective action required', 'Schedule retraining', 'Supervisor review']
          : status === 'pending' ? ['Review flagged items', 'Submit documentation'] : [],
      });
    }
  }

  async getCompliance(params?: { page?: number; limit?: number; status?: string }) {
    await delay(300);
    this.generateComplianceData();
    let filtered = [...this.complianceData];
    if (params?.status) filtered = filtered.filter(c => c.status === params.status);
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }

  // Disputes
  private disputeData: Dispute[] = [];
  private generateDisputeData() {
    if (this.disputeData.length > 0) return;
    const businesses = this.businesses.slice(0, 15);
    const officers = [this.agents[0], this.agents[1], this.agents[2], this.agents[3], this.agents[4]].filter(Boolean);
    const types: Dispute['type'][] = ['overpayment', 'underpayment', 'missing_receipt', 'wrong_amount', 'duplicate', 'other'];
    const statuses: Dispute['status'][] = ['open', 'investigating', 'resolved', 'dismissed'];
    for (let i = 0; i < 20; i++) {
      const biz = businesses[Math.floor(Math.random() * businesses.length)];
      const off = officers[Math.floor(Math.random() * officers.length)];
      const t = types[Math.floor(Math.random() * types.length)];
      const s = statuses[Math.floor(Math.random() * statuses.length)];
      this.disputeData.push({
        id: `disp-${i}`,
        businessId: biz?.id || '',
        businessName: biz?.name || '',
        collectorId: off?.officerId || '',
        collectorName: off?.officerName || '',
        type: t,
        amount: Math.random() * 5000 + 100,
        description: `${t.replace('_', ' ')} dispute — ${biz?.name || 'Unknown'}`,
        status: s,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 20).toISOString(),
        resolvedAt: s === 'resolved' || s === 'dismissed' ? new Date(Date.now() - Math.random() * 86400000 * 5).toISOString() : null,
        resolvedBy: s === 'resolved' || s === 'dismissed' ? 'Dr. Kwame Asante' : null,
        resolution: s === 'resolved' ? 'Amount adjusted and receipt reissued' : s === 'dismissed' ? 'No evidence of error found' : null,
      });
    }
  }

  async getDisputes(params?: { page?: number; limit?: number; status?: string }) {
    await delay(300);
    this.generateDisputeData();
    let filtered = [...this.disputeData];
    if (params?.status) filtered = filtered.filter(d => d.status === params.status);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }

  async resolveDispute(id: string, resolution: string) {
    await delay(400);
    const idx = this.disputeData.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Dispute not found');
    this.disputeData[idx].status = 'resolved';
    this.disputeData[idx].resolvedAt = new Date().toISOString();
    this.disputeData[idx].resolvedBy = 'Dr. Kwame Asante';
    this.disputeData[idx].resolution = resolution;
    return this.disputeData[idx];
  }

  // Bank Reconciliation
  private reconciliationData: ReconciliationEntry[] = [];
  private generateReconciliationData() {
    if (this.reconciliationData.length > 0) return;
    for (let i = 0; i < 30; i++) {
      const collected = Math.random() * 80000 + 10000;
      const variance = Math.random() > 0.7 ? (Math.random() * 2000 - 1000) : 0;
      const status: 'matched' | 'unmatched' | 'partial' | 'flagged' = 
        variance === 0 ? 'matched' : Math.abs(variance) < 100 ? 'partial' : Math.abs(variance) > 500 ? 'flagged' : 'unmatched';
      this.reconciliationData.push({
        id: `rec-${i}`,
        depositDate: new Date(Date.now() - Math.random() * 86400000 * 45).toISOString().split('T')[0],
        depositAmount: collected + variance,
        depositRef: `DEP-${String(5000 + i).padStart(6, '0')}`,
        collectedAmount: collected,
        variance,
        status,
        matchingEntries: Math.floor(Math.random() * 20 + 5),
        notes: status === 'flagged' ? 'Variance exceeds threshold — requires investigation' : '',
      });
    }
    this.reconciliationData.sort((a, b) => new Date(b.depositDate).getTime() - new Date(a.depositDate).getTime());
  }

  async getReconciliations(params?: { page?: number; limit?: number; status?: string }) {
    await delay(300);
    this.generateReconciliationData();
    let filtered = [...this.reconciliationData];
    if (params?.status) filtered = filtered.filter(r => r.status === params.status);
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }

  // Assets
  private assetData: Asset[] = [];
  private generateAssetData() {
    if (this.assetData.length > 0) return;
    const officers = ['Kwesi Annan', 'Ama Serwaa', 'Kofi Mensah', 'Yaa Asantewaa', 'Eric Osei', 'Adwoa Boateng', 'Isaac Donkor', 'Grace Amankwah'];
    const types: Asset['type'][] = ['phone', 'tablet', 'printer', 'uniform', 'id_card', 'other'];
    const conditions: Asset['condition'][] = ['new', 'good', 'fair', 'damaged', 'lost'];
    for (let i = 0; i < 25; i++) {
      const assigned = Math.random() > 0.2;
      const officer = officers[Math.floor(Math.random() * officers.length)];
      const t = types[Math.floor(Math.random() * types.length)];
      this.assetData.push({
        id: `asset-${i}`,
        type: t,
        serialNumber: `${t.slice(0, 2).toUpperCase()}-${String(10000 + Math.floor(Math.random() * 90000))}`,
        assignedTo: assigned ? `OFF-${100 + Math.floor(Math.random() * 8)}` : '',
        assignedToName: assigned ? officer : '',
        assignedAt: assigned ? new Date(Date.now() - Math.random() * 86400000 * 180).toISOString() : '',
        returnedAt: assigned && Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 86400000 * 30).toISOString() : null,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        notes: '',
      });
    }
  }

  async getAssets(params?: { page?: number; limit?: number; type?: string; assignedTo?: string }) {
    await delay(300);
    this.generateAssetData();
    let filtered = [...this.assetData];
    if (params?.type) filtered = filtered.filter(a => a.type === params.type);
    if (params?.assignedTo) filtered = filtered.filter(a => a.assignedTo === params.assignedTo);
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    };
  }
}

export const mockBackend = new MockBackend();
export default mockBackend;