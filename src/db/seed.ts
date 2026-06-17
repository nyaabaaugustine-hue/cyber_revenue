import { db } from './index';
import * as s from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  console.log('  Clearing existing data...');
  const tables = [
    'due_collections', 'financial_summaries', 'cash_flow_entries', 'category_breakdowns',
    'revenue_trends', 'alerts', 'dashboard_metrics', 'budget_lines', 'account_codes',
    'ledger_entries', 'assets', 'reconciliation_entries', 'compliance_checks',
    'commissions', 'activity_log', 'notifications', 'arrears_records', 'levy_bills',
    'disputes', 'remittances', 'invoices', 'anomalies', 'collections', 'visits',
    'agents', 'businesses', 'users', 'categories', 'zones', 'districts',
  ];
  const list = tables.join(', ');
  await db.execute(sql.raw(`TRUNCATE ${list} CASCADE`));

  // ── Districts ──
  console.log('  Seeding districts...');
  const [dist] = await db.insert(s.districts).values({
    id: 'dist-1',
    name: 'Kumasi Metropolitan',
    code: 'KMA-001',
    region: 'Ashanti',
  }).returning();

  // ── Zones ──
  console.log('  Seeding zones...');
  const zoneData: (typeof s.zones.$inferInsert)[] = [
    { id: 'zone-1', name: 'Zone A - Central', districtId: dist.id, businessCount: 890, revenue: '185000' },
    { id: 'zone-2', name: 'Zone B - Adum', districtId: dist.id, businessCount: 720, revenue: '142000' },
    { id: 'zone-3', name: 'Zone C - Bantama', districtId: dist.id, businessCount: 650, revenue: '128000' },
    { id: 'zone-4', name: 'Zone D - Suame', districtId: dist.id, businessCount: 580, revenue: '98000' },
    { id: 'zone-5', name: 'Zone E - Tafo', districtId: dist.id, businessCount: 580, revenue: '92000' },
  ];
  await db.insert(s.zones).values(zoneData);

  // ── Categories ──
  console.log('  Seeding categories...');
  const catData: (typeof s.categories.$inferInsert)[] = [
    { id: 'cat-1', name: 'Trading', rate: '50', icon: '🏪' },
    { id: 'cat-2', name: 'Food & Beverage', rate: '35', icon: '🍲' },
    { id: 'cat-3', name: 'Electronics', rate: '60', icon: '🔌' },
    { id: 'cat-4', name: 'Pharmaceuticals', rate: '80', icon: '💊' },
    { id: 'cat-5', name: 'Fashion & Textiles', rate: '40', icon: '👗' },
    { id: 'cat-6', name: 'Services', rate: '45', icon: '🔧' },
    { id: 'cat-7', name: 'Others', rate: '30', icon: '📦' },
  ];
  await db.insert(s.categories).values(catData);

  // ── Users ──
  console.log('  Seeding users...');
  const userData: (typeof s.users.$inferInsert)[] = [
    {
      id: 'user-1', fullName: 'Dr. Kwame Asante', email: 'kwame.asante@kma.gov.gh',
      phone: '+233 24 123 4567', role: 'admin', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      avatarUrl: 'https://ui-avatars.com/api/?name=Kwame+Asante&background=1e3a5f&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T10:30:00Z'),
    },
    {
      id: 'user-2', fullName: 'Mrs. Abena Yiadom', email: 'abena.yiadom@kma.gov.gh',
      phone: '+233 20 234 5678', role: 'supervisor', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      zoneId: 'zone-1', zoneName: 'Zone A - Central',
      avatarUrl: 'https://ui-avatars.com/api/?name=Abena+Yiadom&background=8b5cf6&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T10:25:00Z'),
    },
    {
      id: 'user-3', fullName: 'Mr. John Mensah', email: 'john.mensah@kma.gov.gh',
      phone: '+233 27 345 6789', role: 'supervisor', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      avatarUrl: 'https://ui-avatars.com/api/?name=John+Mensah&background=0891b2&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T09:00:00Z'),
    },
    {
      id: 'user-4', fullName: 'Ms. Esi Gyan', email: 'esi.gyan@kma.gov.gh',
      phone: '+233 24 456 7890', role: 'accountant', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      avatarUrl: 'https://ui-avatars.com/api/?name=Esi+Gyan&background=059669&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T08:45:00Z'),
    },
    {
      id: 'user-5', fullName: 'Mr. Kwabena Danso', email: 'kwabena.danso@kma.gov.gh',
      phone: '+233 20 567 8901', role: 'manager', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      avatarUrl: 'https://ui-avatars.com/api/?name=Kwabena+Danso&background=7c3aed&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T07:30:00Z'),
    },
    {
      id: 'user-6', fullName: 'Mr. Kofi Appiah', email: 'kofi.appiah@kma.gov.gh',
      phone: '+233 27 678 9012', role: 'field_officer', districtId: dist.id, districtName: 'Kumasi Metropolitan',
      zoneId: 'zone-2', zoneName: 'Zone B - Adum',
      avatarUrl: 'https://ui-avatars.com/api/?name=Kofi+Appiah&background=dc2626&color=fff&size=200&bold=true',
      isActive: true, lastActiveAt: new Date('2024-06-14T06:00:00Z'),
    },
  ];
  await db.insert(s.users).values(userData);

  // Update zone supervisors
  await db.update(s.zones).set({ supervisorId: 'user-2' }).where(sql`id = 'zone-1'`).execute();
  await db.update(s.zones).set({ supervisorId: 'user-3' }).where(sql`id = 'zone-3'`).execute();

  // ── Businesses ──
  console.log('  Seeding businesses...');
  const bizData: (typeof s.businesses.$inferInsert)[] = [
    {
      id: '1', businessId: 'KSI-0001-MKT', name: 'Makola Trading Ventures',
      categoryId: 'cat-1', categoryName: 'Trading', ownerName: 'Ama Serwaa', ownerPhone: '+233 24 123 4567',
      lat: '6.6885', lng: '-1.5273', locationDescription: 'Near Kejetia Market, Block C, Stall 45',
      districtId: dist.id, zoneId: 'zone-1', zoneName: 'Zone A - Central',
      photos: ['https://images.unsplash.com/photo-1556742049-0cfed4476c77?w=800&h=600&fit=crop'],
      status: 'active', levyStatus: 'paid', totalOutstanding: '0', totalCollected: '1850',
      lastCollectionAmount: '150', registeredBy: 'user-1', registeredByName: 'Emmanuel Owusu',
      registeredAt: new Date('2024-01-15T08:30:00Z'), lastVisitedAt: new Date('2024-06-10T14:20:00Z'),
    },
    {
      id: '2', businessId: 'KSI-0002-RST', name: 'Adwoa\'s Chop Bar',
      categoryId: 'cat-2', categoryName: 'Food & Beverage', ownerName: 'Adwoa Mensah', ownerPhone: '+233 20 987 6543',
      lat: '6.6900', lng: '-1.5200', locationDescription: 'Adum Road, opposite KFC',
      districtId: dist.id, zoneId: 'zone-2', zoneName: 'Zone B - Adum',
      photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
      status: 'active', levyStatus: 'paid', totalOutstanding: '0', totalCollected: '2400',
      lastCollectionAmount: '200', registeredBy: 'user-2', registeredByName: 'Akua Mensah',
      registeredAt: new Date('2024-02-20T10:00:00Z'), lastVisitedAt: new Date('2024-06-12T09:15:00Z'),
    },
    {
      id: '3', businessId: 'KSI-0003-SHP', name: 'Kwame\'s Electronics Shop',
      categoryId: 'cat-3', categoryName: 'Electronics', ownerName: 'Kwame Asante', ownerPhone: '+233 27 456 7890',
      lat: '6.6870', lng: '-1.5250', locationDescription: 'Kejetia, second floor, Shop 12',
      districtId: dist.id, zoneId: 'zone-1', zoneName: 'Zone A - Central',
      photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
      status: 'flagged', levyStatus: 'overdue', totalOutstanding: '500', totalCollected: '3200',
      lastCollectionAmount: '500', registeredBy: 'user-1', registeredByName: 'Emmanuel Owusu',
      registeredAt: new Date('2024-03-05T11:45:00Z'), lastVisitedAt: new Date('2024-06-08T16:30:00Z'),
      notes: 'Flagged for duplicate collection investigation',
    },
    {
      id: '4', businessId: 'KSI-0004-DRG', name: 'Peace Pharmacy',
      categoryId: 'cat-4', categoryName: 'Pharmaceuticals', ownerName: 'Dr. Grace Owusu', ownerPhone: '+233 24 321 0987',
      lat: '6.6950', lng: '-1.5350', locationDescription: 'Bantama High Street, near the market',
      districtId: dist.id, zoneId: 'zone-3', zoneName: 'Zone C - Bantama',
      photos: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop'],
      status: 'active', levyStatus: 'paid', totalOutstanding: '0', totalCollected: '4200',
      lastCollectionAmount: '350', registeredBy: 'user-3', registeredByName: 'Kofi Asante',
      registeredAt: new Date('2024-01-28T09:00:00Z'), lastVisitedAt: new Date('2024-06-11T10:45:00Z'),
    },
    {
      id: '5', businessId: 'KSI-0005-TLR', name: 'Ofori\'s Tailoring Shop',
      categoryId: 'cat-5', categoryName: 'Fashion & Textiles', ownerName: 'Ofori Boateng', ownerPhone: '+233 55 789 0123',
      lat: '6.6910', lng: '-1.5220', locationDescription: 'Asafo Interchange, Ground Floor',
      districtId: dist.id, zoneId: 'zone-2', zoneName: 'Zone B - Adum',
      photos: ['https://images.unsplash.com/photo-1558171813-4c088753a8a4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556742049-0cfed4476c77?w=800&h=600&fit=crop'],
      status: 'inactive', levyStatus: 'paid', totalOutstanding: '0', totalCollected: '980',
      registeredBy: 'user-2', registeredByName: 'Akua Mensah',
      registeredAt: new Date('2024-02-10T13:20:00Z'), lastVisitedAt: new Date('2024-05-20T11:00:00Z'),
    },
    {
      id: '6', businessId: 'KSI-0006-GRG', name: 'Nana\'s Car Wash',
      categoryId: 'cat-6', categoryName: 'Services', ownerName: 'Nana Kwame', ownerPhone: '+233 20 654 3210',
      lat: '6.7000', lng: '-1.5100', locationDescription: 'Suame Roundabout, opposite the filling station',
      districtId: dist.id, zoneId: 'zone-4', zoneName: 'Zone D - Suame',
      photos: ['https://images.unsplash.com/photo-1520672646695-012a7e33e0e3?w=800&h=600&fit=crop'],
      status: 'active', levyStatus: 'paid', totalOutstanding: '0', totalCollected: '1560',
      lastCollectionAmount: '120', registeredBy: 'user-4', registeredByName: 'Ama Boateng',
      registeredAt: new Date('2024-04-01T08:00:00Z'), lastVisitedAt: new Date('2024-06-13T15:30:00Z'),
    },
  ];
  await db.insert(s.businesses).values(bizData);

  // ── Agents ──
  console.log('  Seeding agents...');
  const agentData: (typeof s.agents.$inferInsert)[] = [
    {
      id: 'agent-1', userId: 'user-1', officerId: 'off-1', officerName: 'Emmanuel Owusu',
      officerPhone: '+233 24 111 2233', zone: 'Zone A - Central', isActive: true,
      status: 'active', todayCollections: 28, todayAmount: '4500', todayVisits: 15,
      weekCollections: 156, weekAmount: '28500', monthCollections: 520, monthAmount: '95000',
      targetAmount: '100000', targetPercent: '95', performanceScore: 94,
      businessesVisited: 120, avgCollectionTime: 12,
      lastActiveAt: new Date('2024-06-14T10:30:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Emmanuel+Owusu&background=2563eb&color=fff&size=200&bold=true',
    },
    {
      id: 'agent-2', userId: 'user-2', officerId: 'off-2', officerName: 'Akua Mensah',
      officerPhone: '+233 24 222 3344', zone: 'Zone B - Adum', isActive: true,
      status: 'active', todayCollections: 22, todayAmount: '3800', todayVisits: 12,
      weekCollections: 134, weekAmount: '24200', monthCollections: 445, monthAmount: '82000',
      targetAmount: '90000', targetPercent: '91', performanceScore: 88,
      businessesVisited: 98, avgCollectionTime: 15,
      lastActiveAt: new Date('2024-06-14T10:25:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Akua+Mensah&background=7c3aed&color=fff&size=200&bold=true',
    },
    {
      id: 'agent-3', userId: 'user-3', officerId: 'off-3', officerName: 'Kofi Asante',
      officerPhone: '+233 24 333 4455', zone: 'Zone C - Bantama', isActive: true,
      status: 'active', todayCollections: 19, todayAmount: '3200', todayVisits: 10,
      weekCollections: 112, weekAmount: '19800', monthCollections: 380, monthAmount: '68000',
      targetAmount: '80000', targetPercent: '85', performanceScore: 82,
      businessesVisited: 85, avgCollectionTime: 18,
      lastActiveAt: new Date('2024-06-14T09:45:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Kofi+Asante&background=dc2626&color=fff&size=200&bold=true',
    },
    {
      id: 'agent-4', userId: 'user-4', officerId: 'off-4', officerName: 'Ama Boateng',
      officerPhone: '+233 24 444 5566', zone: 'Zone D - Suame', isActive: false,
      status: 'offline', todayCollections: 17, todayAmount: '2900', todayVisits: 9,
      weekCollections: 98, weekAmount: '17500', monthCollections: 320, monthAmount: '58000',
      targetAmount: '75000', targetPercent: '77', performanceScore: 76,
      businessesVisited: 72, avgCollectionTime: 20,
      lastActiveAt: new Date('2024-06-14T08:00:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Ama+Boateng&background=059669&color=fff&size=200&bold=true',
    },
    {
      id: 'agent-5', userId: 'user-5', officerId: 'off-5', officerName: 'Yaw Darko',
      officerPhone: '+233 24 555 6677', zone: 'Zone E - Tafo', isActive: true,
      status: 'active', todayCollections: 24, todayAmount: '4100', todayVisits: 14,
      weekCollections: 145, weekAmount: '26800', monthCollections: 485, monthAmount: '88000',
      targetAmount: '95000', targetPercent: '93', performanceScore: 91,
      businessesVisited: 110, avgCollectionTime: 13,
      lastActiveAt: new Date('2024-06-14T10:20:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Yaw+Darko&background=0891b2&color=fff&size=200&bold=true',
    },
    {
      id: 'agent-6', userId: 'user-6', officerId: 'off-6', officerName: 'Kofi Appiah',
      officerPhone: '+233 27 678 9012', zone: 'Zone B - Adum', isActive: true,
      status: 'active', todayCollections: 12, todayAmount: '2100', todayVisits: 8,
      weekCollections: 78, weekAmount: '14200', monthCollections: 260, monthAmount: '48000',
      targetAmount: '60000', targetPercent: '80', performanceScore: 85,
      businessesVisited: 65, avgCollectionTime: 14,
      lastActiveAt: new Date('2024-06-14T10:15:00Z'),
      avatarUrl: 'https://ui-avatars.com/api/?name=Kofi+Appiah&background=dc2626&color=fff&size=200&bold=true',
    },
  ];
  await db.insert(s.agents).values(agentData);

  // ── Visits ──
  console.log('  Seeding visits...');
  const visitData: (typeof s.visits.$inferInsert)[] = [
    {
      id: 'visit-1', businessId: '1', officerId: 'user-1', officerName: 'Emmanuel Owusu',
      date: new Date('2024-06-14T10:30:00Z'), status: 'completed',
      notes: 'Routine collection visit', collectionAmount: '150', paymentMethod: 'mobile_money',
      gpsVerified: true,
    },
    {
      id: 'visit-2', businessId: '2', officerId: 'user-2', officerName: 'Akua Mensah',
      date: new Date('2024-06-14T10:15:00Z'), status: 'completed',
      collectionAmount: '200', paymentMethod: 'cash', gpsVerified: true,
    },
    {
      id: 'visit-3', businessId: '4', officerId: 'user-3', officerName: 'Kofi Asante',
      date: new Date('2024-06-14T09:45:00Z'), status: 'completed',
      collectionAmount: '350', paymentMethod: 'pos', gpsVerified: true,
    },
    {
      id: 'visit-4', businessId: '6', officerId: 'user-5', officerName: 'Yaw Darko',
      date: new Date('2024-06-14T09:30:00Z'), status: 'completed',
      collectionAmount: '120', paymentMethod: 'mobile_money', gpsVerified: true,
    },
    {
      id: 'visit-5', businessId: '3', officerId: 'user-1', officerName: 'Emmanuel Owusu',
      date: new Date('2024-06-14T09:00:00Z'), status: 'completed',
      collectionAmount: '500', paymentMethod: 'cash', gpsVerified: false,
    },
  ];
  await db.insert(s.visits).values(visitData);

  // ── Collections ──
  console.log('  Seeding collections...');
  const colData: (typeof s.collections.$inferInsert)[] = [
    {
      id: 'col-1', receiptNumber: 'KSI-2024-00012345', businessId: '1', businessName: 'Makola Trading Ventures',
      visitId: 'visit-1', officerId: 'user-1', officerName: 'Emmanuel Owusu',
      amount: '150', paymentMethod: 'mobile_money', mobileMoneyRef: 'MOM-284729',
      collectionDate: new Date('2024-06-14T10:30:00Z'), gpsVerified: true,
      collectionLat: '6.6885', collectionLng: '-1.5273',
    },
    {
      id: 'col-2', receiptNumber: 'KSI-2024-00012346', businessId: '2', businessName: 'Adwoa\'s Chop Bar',
      visitId: 'visit-2', officerId: 'user-2', officerName: 'Akua Mensah',
      amount: '200', paymentMethod: 'cash',
      collectionDate: new Date('2024-06-14T10:15:00Z'), gpsVerified: true,
      collectionLat: '6.6900', collectionLng: '-1.5200',
    },
    {
      id: 'col-3', receiptNumber: 'KSI-2024-00012347', businessId: '4', businessName: 'Peace Pharmacy',
      visitId: 'visit-3', officerId: 'user-3', officerName: 'Kofi Asante',
      amount: '350', paymentMethod: 'pos',
      collectionDate: new Date('2024-06-14T09:45:00Z'), gpsVerified: true,
      collectionLat: '6.6950', collectionLng: '-1.5350',
    },
    {
      id: 'col-4', receiptNumber: 'KSI-2024-00012348', businessId: '6', businessName: 'Nana\'s Car Wash',
      visitId: 'visit-4', officerId: 'user-5', officerName: 'Yaw Darko',
      amount: '120', paymentMethod: 'mobile_money', mobileMoneyRef: 'MOM-395817',
      collectionDate: new Date('2024-06-14T09:30:00Z'), gpsVerified: true,
      collectionLat: '6.7000', collectionLng: '-1.5100',
    },
    {
      id: 'col-5', receiptNumber: 'KSI-2024-00012349', businessId: '3', businessName: 'Kwame\'s Electronics Shop',
      visitId: 'visit-5', officerId: 'user-1', officerName: 'Emmanuel Owusu',
      amount: '500', paymentMethod: 'cash',
      collectionDate: new Date('2024-06-14T09:00:00Z'), gpsVerified: false,
      collectionLat: '6.6880', collectionLng: '-1.5240',
    },
  ];
  await db.insert(s.collections).values(colData);

  // ── Anomalies ──
  console.log('  Seeding anomalies...');
  const anomalyData: (typeof s.anomalies.$inferInsert)[] = [
    {
      id: 'anom-1', type: 'duplicate_collection', severity: 'warning',
      title: 'Potential Duplicate Collection',
      description: 'Same business collected twice within 2 hours — KSI-0003-SHP',
      officerId: 'user-1', officerName: 'Emmanuel Owusu', businessId: '3', businessName: 'Kwame\'s Electronics Shop',
      collectionId: 'col-x1', metadata: { timeDiff: '1h 45m' },
      createdAt: new Date('2024-06-14T10:00:00Z'), detectedAt: new Date('2024-06-14T10:00:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-2', type: 'gps_mismatch', severity: 'info',
      title: 'GPS Location Mismatch',
      description: 'Collection location 150m from registered business location for KSI-0005-TLR',
      officerId: 'user-2', officerName: 'Akua Mensah', businessId: '5', businessName: 'Ofori\'s Tailoring Shop',
      collectionId: 'col-x2', metadata: { distance: '150m' },
      createdAt: new Date('2024-06-14T08:30:00Z'), detectedAt: new Date('2024-06-14T08:30:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-3', type: 'inactive_agent', severity: 'warning',
      title: 'Agent Inactive',
      description: 'No activity from agent Ama Boateng for 3+ hours during work hours',
      officerId: 'user-4', officerName: 'Ama Boateng',
      metadata: { inactiveDuration: '3h 22m' },
      createdAt: new Date('2024-06-14T09:30:00Z'), detectedAt: new Date('2024-06-14T09:30:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-4', type: 'cash_shortage', severity: 'error',
      title: 'Cash Shortage Detected',
      description: 'Remittance of GHS 2,500 submitted but expected GHS 3,200 — difference of GHS 700',
      officerId: 'user-1', officerName: 'Emmanuel Owusu',
      metadata: { expected: 3200, submitted: 2500, difference: 700 },
      createdAt: new Date('2024-06-14T07:00:00Z'), detectedAt: new Date('2024-06-14T07:00:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-5', type: 'sync_conflict', severity: 'error',
      title: 'Sync Conflict',
      description: '12 offline records conflict with server data — manual reconciliation required',
      metadata: { recordCount: 12 },
      createdAt: new Date('2024-06-13T18:00:00Z'), detectedAt: new Date('2024-06-13T18:00:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-6', type: 'gps_mismatch', severity: 'warning',
      title: 'GPS Anomaly',
      description: 'Check-in location recorded 85km from previous stop within 2 minutes',
      officerId: 'user-5', officerName: 'Yaw Darko', businessId: '6', businessName: 'Nana\'s Car Wash',
      collectionId: 'col-x3', metadata: { speed: '85km/h' },
      createdAt: new Date('2024-06-14T06:30:00Z'), detectedAt: new Date('2024-06-14T06:30:00Z'),
      isResolved: false,
    },
    {
      id: 'anom-7', type: 'duplicate_collection', severity: 'info',
      title: 'Duplicate Receipt Issued',
      description: 'Receipt KSI-2024-00012345 was issued twice for different amounts',
      officerId: 'user-3', officerName: 'Kofi Asante', businessId: '4', businessName: 'Peace Pharmacy',
      collectionId: 'col-x4', metadata: { receipt: 'KSI-2024-00012345' },
      createdAt: new Date('2024-06-12T14:00:00Z'), detectedAt: new Date('2024-06-12T14:00:00Z'),
      isResolved: true, resolvedBy: 'user-1', resolvedAt: new Date('2024-06-13T10:00:00Z'),
    },
    {
      id: 'anom-8', type: 'inactive_agent', severity: 'info',
      title: 'Agent Late Start',
      description: 'Agent Kofi Asante started collection route 2 hours late',
      officerId: 'user-3', officerName: 'Kofi Asante',
      metadata: { delayMinutes: 120 },
      createdAt: new Date('2024-06-11T10:00:00Z'), detectedAt: new Date('2024-06-11T10:00:00Z'),
      isResolved: true, resolvedBy: 'user-1', resolvedAt: new Date('2024-06-11T14:00:00Z'),
    },
  ];
  await db.insert(s.anomalies).values(anomalyData);

  // ── Invoices ──
  console.log('  Seeding invoices...');
  const invData: (typeof s.invoices.$inferInsert)[] = [
    {
      id: 'inv-1', invoiceNumber: 'INV-2024-0001', businessId: '1', businessName: 'Makola Trading Ventures',
      amount: '2500', amountPaid: '1850', balanceDue: '650', issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-30'), period: 'June 2024', status: 'partial',
      items: [{ description: 'Monthly Trading Levy', quantity: 1, unitPrice: 2500, amount: 2500 }],
    },
    {
      id: 'inv-2', invoiceNumber: 'INV-2024-0002', businessId: '2', businessName: 'Adwoa\'s Chop Bar',
      amount: '1800', amountPaid: '1800', balanceDue: '0', issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-30'), period: 'June 2024', status: 'paid',
      items: [{ description: 'Monthly Food & Beverage Levy', quantity: 1, unitPrice: 1800, amount: 1800 }],
    },
    {
      id: 'inv-3', invoiceNumber: 'INV-2024-0003', businessId: '4', businessName: 'Peace Pharmacy',
      amount: '3500', amountPaid: '3200', balanceDue: '300', issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-30'), period: 'June 2024', status: 'partial',
      items: [{ description: 'Monthly Pharmaceutical Levy', quantity: 1, unitPrice: 3500, amount: 3500 }],
    },
    {
      id: 'inv-4', invoiceNumber: 'INV-2024-0004', businessId: '3', businessName: 'Kwame\'s Electronics Shop',
      amount: '4000', amountPaid: '3200', balanceDue: '800', issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-15'), period: 'June 2024', status: 'overdue',
      items: [{ description: 'Monthly Electronics Levy', quantity: 1, unitPrice: 4000, amount: 4000 }],
    },
    {
      id: 'inv-5', invoiceNumber: 'INV-2024-0005', businessId: '6', businessName: 'Nana\'s Car Wash',
      amount: '1200', amountPaid: '1200', balanceDue: '0', issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-30'), period: 'June 2024', status: 'paid',
      items: [{ description: 'Monthly Service Levy', quantity: 1, unitPrice: 1200, amount: 1200 }],
    },
  ];
  await db.insert(s.invoices).values(invData);

  // ── Remittances ──
  console.log('  Seeding remittances...');
  const remitData: (typeof s.remittances.$inferInsert)[] = [
    {
      id: 'rem-1', remittanceNumber: 'REM-2024-0001', officerId: 'user-1', officerName: 'Emmanuel Owusu',
      amount: '4500', cashAmount: '2000', mobileMoneyAmount: '1500', posAmount: '1000',
      collectionCount: 28, status: 'pending', submittedAt: new Date('2024-06-14T12:00:00Z'),
    },
    {
      id: 'rem-2', remittanceNumber: 'REM-2024-0002', officerId: 'user-2', officerName: 'Akua Mensah',
      amount: '3800', cashAmount: '1800', mobileMoneyAmount: '1200', posAmount: '800',
      collectionCount: 22, status: 'verified', submittedAt: new Date('2024-06-14T11:30:00Z'),
      verifiedAt: new Date('2024-06-14T13:00:00Z'), verifiedBy: 'user-1',
    },
    {
      id: 'rem-3', remittanceNumber: 'REM-2024-0003', officerId: 'user-3', officerName: 'Kofi Asante',
      amount: '3200', cashAmount: '1500', mobileMoneyAmount: '1000', posAmount: '700',
      collectionCount: 19, status: 'pending', submittedAt: new Date('2024-06-14T11:00:00Z'),
    },
  ];
  await db.insert(s.remittances).values(remitData);

  // ── Due Collections ──
  console.log('  Seeding due collections...');
  const dueData: (typeof s.dueCollections.$inferInsert)[] = [
    { id: 'due-1', businessId: '1', businessName: 'Makola Trading Ventures', amountDue: '650', dueDate: new Date('2024-06-30'), daysOverdue: 0, status: 'due', zone: 'Zone A - Central', ownerName: 'Ama Serwaa', ownerPhone: '+233 24 123 4567' },
    { id: 'due-2', businessId: '3', businessName: 'Kwame\'s Electronics Shop', amountDue: '800', dueDate: new Date('2024-06-15'), daysOverdue: 1, status: 'overdue', zone: 'Zone A - Central', ownerName: 'Kwame Asante', ownerPhone: '+233 27 456 7890' },
    { id: 'due-3', businessId: '4', businessName: 'Peace Pharmacy', amountDue: '300', dueDate: new Date('2024-06-30'), daysOverdue: 0, status: 'due', zone: 'Zone C - Bantama', ownerName: 'Dr. Grace Owusu', ownerPhone: '+233 24 321 0987' },
    { id: 'due-4', businessId: '5', businessName: 'Ofori\'s Tailoring Shop', amountDue: '980', dueDate: new Date('2024-05-31'), daysOverdue: 14, status: 'overdue', zone: 'Zone B - Adum', ownerName: 'Ofori Boateng', ownerPhone: '+233 55 789 0123' },
  ];
  await db.insert(s.dueCollections).values(dueData);

  // ── Notifications ──
  console.log('  Seeding notifications...');
  const notifData: (typeof s.notifications.$inferInsert)[] = [
    { userId: 'user-1', title: 'Duplicate Collection Alert', message: 'Business KSI-0003-SHP was collected twice within 2 hours', type: 'warning', isRead: false, createdAt: new Date('2024-06-14T10:00:00Z') },
    { userId: 'user-1', title: 'Agent Inactive', message: 'Ama Boateng has been inactive for 3+ hours', type: 'warning', isRead: false, createdAt: new Date('2024-06-14T09:30:00Z') },
    { userId: 'user-2', title: 'GPS Anomaly', message: 'Collection recorded 150m from business location', type: 'info', isRead: true, createdAt: new Date('2024-06-14T08:30:00Z') },
    { userId: 'user-1', title: 'Sync Pending', message: '12 offline records pending upload', type: 'info', isRead: true, createdAt: new Date('2024-06-14T09:00:00Z') },
    { userId: 'user-1', title: 'Cash Shortage', message: 'GHS 700 shortage detected in Emmanuel Owusu\'s remittance', type: 'error', isRead: false, createdAt: new Date('2024-06-14T07:00:00Z') },
    { userId: 'user-1', title: 'Revenue Target Update', message: 'Current collection rate is 80.6% of monthly target', type: 'success', isRead: true, createdAt: new Date('2024-06-14T06:00:00Z') },
  ];
  await db.insert(s.notifications).values(notifData);

  // ── Alerts ──
  console.log('  Seeding alerts...');
  const alertData: (typeof s.alerts.$inferInsert)[] = [
    { id: 'alert-1', type: 'fraud', title: 'Duplicate Collection Detected', description: 'Business KSI-0003-SHP flagged for potential duplicate collection of GHS 500', timestamp: new Date('2024-06-14T10:00:00Z'), isRead: false, priority: 'high', actionRequired: true, userId: 'user-1' },
    { id: 'alert-2', type: 'inactive', title: 'Agent Inactive', description: 'Ama Boateng has been inactive for 2+ hours during work hours', timestamp: new Date('2024-06-14T09:30:00Z'), isRead: false, priority: 'medium', userId: 'user-1' },
    { id: 'alert-3', type: 'sync', title: 'Sync Pending', description: '12 offline records pending upload from field agents', timestamp: new Date('2024-06-14T09:00:00Z'), isRead: true, priority: 'low', userId: 'user-1' },
    { id: 'alert-4', type: 'anomaly', title: 'GPS Anomaly', description: 'Collection at KSI-0005-TLR recorded 150m from business location', timestamp: new Date('2024-06-14T08:30:00Z'), isRead: true, priority: 'medium', userId: 'user-2' },
    { id: 'alert-5', type: 'warning', title: 'High Value Collection', description: 'Collection of GHS 2,500 requires supervisor approval', timestamp: new Date('2024-06-14T08:00:00Z'), isRead: false, priority: 'high', actionRequired: true, userId: 'user-1' },
  ];
  await db.insert(s.alerts).values(alertData);

  // ── Revenue Trends ──
  console.log('  Seeding revenue trends...');
  const trendData: (typeof s.revenueTrends.$inferInsert)[] = [
    { date: 'Mon', amount: '28500', target: '30000' },
    { date: 'Tue', amount: '32400', target: '30000' },
    { date: 'Wed', amount: '29800', target: '30000' },
    { date: 'Thu', amount: '35200', target: '30000' },
    { date: 'Fri', amount: '24300', target: '30000' },
    { date: 'Sat', amount: '18550', target: '20000' },
    { date: 'Sun', amount: '0', target: '0' },
  ];
  await db.insert(s.revenueTrends).values(trendData);

  // ── Category Breakdowns ──
  console.log('  Seeding category breakdowns...');
  const catBreakData: (typeof s.categoryBreakdowns.$inferInsert)[] = [
    { category: 'Trading', revenue: '185000', count: 1240, percentage: '28.7' },
    { category: 'Food & Beverage', revenue: '125000', count: 890, percentage: '19.4' },
    { category: 'Electronics', revenue: '95000', count: 420, percentage: '14.7' },
    { category: 'Pharmaceuticals', revenue: '78000', count: 280, percentage: '12.1' },
    { category: 'Services', revenue: '62500', count: 590, percentage: '9.7' },
    { category: 'Fashion', revenue: '48500', count: 320, percentage: '7.5' },
    { category: 'Others', revenue: '51000', count: 280, percentage: '7.9' },
  ];
  await db.insert(s.categoryBreakdowns).values(catBreakData);

  // ── Dashboard Metrics Snapshot ──
  console.log('  Seeding dashboard metrics...');
  await db.insert(s.dashboardMetrics).values({
    revenueToday: '24580', revenueYesterday: '22300', revenueThisWeek: '168750', revenueLastWeek: '152000',
    revenueThisMonth: '645000', revenueLastMonth: '580000', revenueTarget: '800000', revenueTargetPercent: '80.6',
    collectionsToday: 156, collectionsThisWeek: 892, collectionsThisMonth: 3450, collectionsPending: 12,
    businessesTotal: 3420, businessesActive: 3150, businessesInactive: 270, businessesFlagged: 23,
    businessesPaid: 2800, businessesDue: 450, businessesOverdue: 170,
    agentsTotal: 24, agentsActive: 18, agentsInField: 12, agentsOffline: 6, agentsAvgPerformance: '86.2',
  });

  // ── Activity Log ──
  console.log('  Seeding activity log...');
  const logData: (typeof s.activityLog.$inferInsert)[] = [
    { actorId: 'user-1', actorName: 'Dr. Kwame Asante', actorRole: 'admin', action: 'Logged in', resourceType: 'session', resourceId: 'session-1', severity: 'info', timestamp: new Date('2024-06-14T06:00:00Z') },
    { actorId: 'user-1', actorName: 'Dr. Kwame Asante', actorRole: 'admin', action: 'Resolved anomaly anom-7', resourceType: 'anomaly', resourceId: 'anom-7', resourceName: 'Duplicate Receipt Issued', severity: 'success', timestamp: new Date('2024-06-13T10:00:00Z') },
    { actorId: 'user-5', actorName: 'Yaw Darko', actorRole: 'field_officer', action: 'Submitted remittance', resourceType: 'remittance', resourceId: 'rem-3', details: 'GHS 4,100 — 24 collections', severity: 'info', timestamp: new Date('2024-06-14T11:00:00Z') },
    { actorId: 'user-1', actorName: 'Dr. Kwame Asante', actorRole: 'admin', action: 'Registered new business', resourceType: 'business', resourceId: '6', resourceName: 'Nana\'s Car Wash', severity: 'success', timestamp: new Date('2024-04-01T08:00:00Z') },
    { actorId: 'user-2', actorName: 'Akua Mensah', actorRole: 'field_officer', action: 'Collected payment', resourceType: 'collection', resourceId: 'col-2', details: 'GHS 200 from Adwoa\'s Chop Bar', severity: 'info', timestamp: new Date('2024-06-14T10:15:00Z') },
  ];
  await db.insert(s.activityLog).values(logData);

  // ── Commission Entries ──
  console.log('  Seeding commissions...');
  const commData: (typeof s.commissions.$inferInsert)[] = [
    { officerId: 'user-1', officerName: 'Emmanuel Owusu', period: 'May 2024', baseCollection: '95000', bonusAmount: '5000', penaltyAmount: '0', totalCommission: '10000', status: 'paid', paidAt: new Date('2024-06-05'), breakdown: [{ label: 'Base Commission (5%)', amount: 4750 }, { label: 'Performance Bonus', amount: 5000 }, { label: 'Timeliness Bonus', amount: 250 }] },
    { officerId: 'user-2', officerName: 'Akua Mensah', period: 'May 2024', baseCollection: '82000', bonusAmount: '3000', penaltyAmount: '0', totalCommission: '7100', status: 'paid', paidAt: new Date('2024-06-05'), breakdown: [{ label: 'Base Commission (5%)', amount: 4100 }, { label: 'Performance Bonus', amount: 3000 }] },
    { officerId: 'user-3', officerName: 'Kofi Asante', period: 'May 2024', baseCollection: '68000', bonusAmount: '2000', penaltyAmount: '500', totalCommission: '4900', status: 'pending', breakdown: [{ label: 'Base Commission (5%)', amount: 3400 }, { label: 'Performance Bonus', amount: 2000 }, { label: 'Late Start Penalty', amount: -500 }] },
  ];
  await db.insert(s.commissions).values(commData);

  // ── Compliance Checks ──
  console.log('  Seeding compliance checks...');
  const compData: (typeof s.complianceChecks.$inferInsert)[] = [
    { officerId: 'user-1', officerName: 'Emmanuel Owusu', checkType: 'Daily Route Compliance', status: 'pass', checkedAt: new Date('2024-06-14'), checkedBy: 'user-1', details: 'All 15 planned visits completed', score: 95, requiredActions: [] },
    { officerId: 'user-2', officerName: 'Akua Mensah', checkType: 'Daily Route Compliance', status: 'pass', checkedAt: new Date('2024-06-14'), checkedBy: 'user-1', details: '12 of 12 visits completed', score: 100, requiredActions: [] },
    { officerId: 'user-4', officerName: 'Ama Boateng', checkType: 'GPS Tracking Compliance', status: 'fail', checkedAt: new Date('2024-06-14'), checkedBy: 'user-1', details: 'GPS ping lost for 3+ hours during work hours', score: 45, requiredActions: ['Maintain GPS tracking during work hours', 'Report any device issues to IT'] },
  ];
  await db.insert(s.complianceChecks).values(compData);

  // ── Assets ──
  console.log('  Seeding assets...');
  const assetData: (typeof s.assets.$inferInsert)[] = [
    { type: 'phone', serialNumber: 'SAMS22-001', assignedTo: 'user-1', assignedToName: 'Emmanuel Owusu', assignedAt: new Date('2024-01-15'), condition: 'good' },
    { type: 'tablet', serialNumber: 'TAB-IPAD-002', assignedTo: 'user-2', assignedToName: 'Akua Mensah', assignedAt: new Date('2024-01-20'), condition: 'good' },
    { type: 'phone', serialNumber: 'TECNO-003', assignedTo: 'user-3', assignedToName: 'Kofi Asante', assignedAt: new Date('2024-02-01'), condition: 'fair', notes: 'Screen has minor crack' },
    { type: 'uniform', serialNumber: 'UNI-001', assignedTo: 'user-1', assignedToName: 'Emmanuel Owusu', assignedAt: new Date('2024-01-15'), condition: 'good' },
    { type: 'id_card', serialNumber: 'ID-001', assignedTo: 'user-1', assignedToName: 'Emmanuel Owusu', assignedAt: new Date('2024-01-10'), condition: 'good' },
  ];
  await db.insert(s.assets).values(assetData);

  // ── Account Codes ──
  console.log('  Seeding account codes...');
  const acctData: (typeof s.accountCodes.$inferInsert)[] = [
    { code: 'REV-001', name: 'Business Operating Levy', type: 'revenue', category: 'Direct Revenue' },
    { code: 'REV-002', name: 'Trading License Fees', type: 'revenue', category: 'Direct Revenue' },
    { code: 'REV-003', name: 'Property Rates', type: 'revenue', category: 'Direct Revenue' },
    { code: 'REV-004', name: 'Fines & Penalties', type: 'revenue', category: 'Other Revenue' },
    { code: 'ASS-001', name: 'Cash in Transit', type: 'asset', category: 'Current Assets' },
    { code: 'ASS-002', name: 'Accounts Receivable', type: 'asset', category: 'Current Assets' },
    { code: 'LIAB-001', name: 'Unremitted Collections', type: 'liability', category: 'Current Liabilities' },
    { code: 'EXP-001', name: 'Administrative Expenses', type: 'expense', category: 'Operating Expenses' },
  ];
  await db.insert(s.accountCodes).values(acctData);

  // ── Ledger Entries ──
  console.log('  Seeding ledger entries...');
  const ledgerData: (typeof s.ledgerEntries.$inferInsert)[] = [
    { transactionId: 'col-1', accountCode: 'REV-001', accountName: 'Business Operating Levy', description: 'Collection from Makola Trading Ventures', debit: '0', credit: '150', balance: '150', entryDate: new Date('2024-06-14T10:30:00Z'), reference: 'KSI-2024-00012345', referenceType: 'collection' },
    { transactionId: 'col-2', accountCode: 'REV-001', accountName: 'Business Operating Levy', description: 'Collection from Adwoa\'s Chop Bar', debit: '0', credit: '200', balance: '350', entryDate: new Date('2024-06-14T10:15:00Z'), reference: 'KSI-2024-00012346', referenceType: 'collection' },
    { transactionId: 'col-3', accountCode: 'REV-001', accountName: 'Business Operating Levy', description: 'Collection from Peace Pharmacy', debit: '0', credit: '350', balance: '700', entryDate: new Date('2024-06-14T09:45:00Z'), reference: 'KSI-2024-00012347', referenceType: 'collection' },
    { transactionId: 'col-4', accountCode: 'REV-001', accountName: 'Business Operating Levy', description: 'Collection from Nana\'s Car Wash', debit: '0', credit: '120', balance: '820', entryDate: new Date('2024-06-14T09:30:00Z'), reference: 'KSI-2024-00012348', referenceType: 'collection' },
    { transactionId: 'col-5', accountCode: 'REV-001', accountName: 'Business Operating Levy', description: 'Collection from Kwame\'s Electronics Shop', debit: '0', credit: '500', balance: '1320', entryDate: new Date('2024-06-14T09:00:00Z'), reference: 'KSI-2024-00012349', referenceType: 'collection' },
  ];
  await db.insert(s.ledgerEntries).values(ledgerData);

  // ── Budget Lines ──
  console.log('  Seeding budget lines...');
  const budgetData: (typeof s.budgetLines.$inferInsert)[] = [
    { code: 'BUD-2024-001', name: 'Revenue Collection Operations', allocated: '500000', spent: '385000', remaining: '115000', fiscalYear: 2024, category: 'Operations' },
    { code: 'BUD-2024-002', name: 'Technology & Equipment', allocated: '250000', spent: '180000', remaining: '70000', fiscalYear: 2024, category: 'Capital' },
    { code: 'BUD-2024-003', name: 'Staff Training & Development', allocated: '100000', spent: '45000', remaining: '55000', fiscalYear: 2024, category: 'HR' },
    { code: 'BUD-2024-004', name: 'Community Engagement', allocated: '80000', spent: '32000', remaining: '48000', fiscalYear: 2024, category: 'Outreach' },
  ];
  await db.insert(s.budgetLines).values(budgetData);

  // ── Financial Summary ──
  console.log('  Seeding financial summary...');
  await db.insert(s.financialSummaries).values({
    totalRevenue: '4560000', totalCollections: '4320000', totalOutstanding: '240000',
    collectionRate: '94.7', periodRevenue: '645000', previousPeriodRevenue: '580000',
    revenueGrowth: '11.2', activeInvoices: 450, overdueInvoices: 38,
    pendingRemittances: 2, pendingRemittanceAmount: '7700',
  });

  // ── Reconciliation Entries ──
  console.log('  Seeding reconciliation entries...');
  const reconData: (typeof s.reconciliationEntries.$inferInsert)[] = [
    { depositDate: new Date('2024-06-14'), depositAmount: '4500', depositRef: 'DEP-001', collectedAmount: '4500', variance: '0', status: 'matched', matchingEntries: 28, notes: 'Emmanuel Owusu - daily remittance' },
    { depositDate: new Date('2024-06-14'), depositAmount: '3800', depositRef: 'DEP-002', collectedAmount: '3800', variance: '0', status: 'matched', matchingEntries: 22, notes: 'Akua Mensah - daily remittance' },
    { depositDate: new Date('2024-06-14'), depositAmount: '3000', depositRef: 'DEP-003', collectedAmount: '3200', variance: '-200', status: 'flagged', matchingEntries: 19, notes: 'Kofi Asante - shortage of GHS 200' },
  ];
  await db.insert(s.reconciliationEntries).values(reconData);

  // ── Disputes ──
  console.log('  Seeding disputes...');
  const dispData: (typeof s.disputes.$inferInsert)[] = [
    {
      businessId: '5', businessName: 'Ofori\'s Tailoring Shop', collectorId: 'user-2', collectorName: 'Akua Mensah',
      type: 'wrong_amount', amount: '200', description: 'Business owner claims they were charged GHS 200 extra on their July levy',
      status: 'open', createdAt: new Date('2024-06-13'),
    },
    {
      businessId: '3', businessName: 'Kwame\'s Electronics Shop', collectorId: 'user-1', collectorName: 'Emmanuel Owusu',
      type: 'duplicate', amount: '500', description: 'Two collection receipts issued on same day for different amounts',
      status: 'investigating', createdAt: new Date('2024-06-14'),
    },
    {
      businessId: '6', businessName: 'Nana\'s Car Wash', collectorId: 'user-5', collectorName: 'Yaw Darko',
      type: 'missing_receipt', amount: '120', description: 'Payment made but no official receipt provided',
      status: 'open', createdAt: new Date('2024-06-12'),
    },
  ];
  await db.insert(s.disputes).values(dispData);

  // ── Levy Bills ──
  console.log('  Seeding levy bills...');
  const levyData: (typeof s.levyBills.$inferInsert)[] = [
    { businessId: '1', businessName: 'Makola Trading Ventures', amount: '2500', dueDate: new Date('2024-06-30'), status: 'partial', period: 'June 2024' },
    { businessId: '2', businessName: 'Adwoa\'s Chop Bar', amount: '1800', dueDate: new Date('2024-06-30'), status: 'paid', period: 'June 2024' },
    { businessId: '3', businessName: 'Kwame\'s Electronics Shop', amount: '4000', dueDate: new Date('2024-06-15'), status: 'overdue', period: 'June 2024' },
    { businessId: '4', businessName: 'Peace Pharmacy', amount: '3500', dueDate: new Date('2024-06-30'), status: 'partial', period: 'June 2024' },
    { businessId: '5', businessName: 'Ofori\'s Tailoring Shop', amount: '1500', dueDate: new Date('2024-06-15'), status: 'overdue', period: 'June 2024' },
    { businessId: '6', businessName: 'Nana\'s Car Wash', amount: '1200', dueDate: new Date('2024-06-30'), status: 'paid', period: 'June 2024' },
  ];
  await db.insert(s.levyBills).values(levyData);

  // ── Arrears Records ──
  console.log('  Seeding arrears records...');
  const arrData: (typeof s.arrearsRecords.$inferInsert)[] = [
    { businessId: '3', businessName: 'Kwame\'s Electronics Shop', totalArrears: '800', oldestBillDate: new Date('2024-05-15'), status: 'active', lastPaymentDate: new Date('2024-06-08'), lastPaymentAmount: '500' },
    { businessId: '5', businessName: 'Ofori\'s Tailoring Shop', totalArrears: '980', oldestBillDate: new Date('2024-04-15'), status: 'payment_plan', lastPaymentDate: new Date('2024-05-20'), lastPaymentAmount: '200' },
  ];
  await db.insert(s.arrearsRecords).values(arrData);

  // ── Cash Flow Entries ──
  console.log('  Seeding cash flow entries...');
  const cfData: (typeof s.cashFlowEntries.$inferInsert)[] = [
    { date: new Date('2024-06-14'), inflows: '24580', outflows: '12000', netCashFlow: '12580', balance: '12580' },
    { date: new Date('2024-06-13'), inflows: '35200', outflows: '15000', netCashFlow: '20200', balance: '32780' },
    { date: new Date('2024-06-12'), inflows: '29800', outflows: '14000', netCashFlow: '15800', balance: '48580' },
    { date: new Date('2024-06-11'), inflows: '32400', outflows: '13500', netCashFlow: '18900', balance: '67480' },
    { date: new Date('2024-06-10'), inflows: '28500', outflows: '11000', netCashFlow: '17500', balance: '84980' },
  ];
  await db.insert(s.cashFlowEntries).values(cfData);

  console.log('✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
