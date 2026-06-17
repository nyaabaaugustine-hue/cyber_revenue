import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export interface AgentDashboardData {
  agent: {
    id: string;
    userId: string;
    officerId: string;
    officerName: string;
    officerPhone: string;
    zone: string;
    status: string;
    todayCollections: number;
    todayAmount: string;
    todayVisits: number;
    weekCollections: number;
    weekAmount: string;
    monthCollections: number;
    monthAmount: string;
    targetAmount: string;
    targetPercent: number;
    performanceScore: number;
    businessesVisited: number;
    lastLat: string | null;
    lastLng: string | null;
    lastActiveAt: string | null;
  };
  todayCollections: number;
  todayRevenue: string;
  todayVisits: number;
  assignedBusinesses: number;
}

export interface AgentZoneBusiness {
  id: string;
  name: string;
  businessId: string;
  ownerName: string;
  ownerPhone: string;
  zoneId: string;
  status: string;
  levyStatus: string;
  totalOutstanding: string;
  lastAmountPaid: string | null;
  lastPaymentDate: string | null;
  photos: string[];
  locationDescription: string | null;
}

export interface AgentCollection {
  id: string;
  receiptNumber: string;
  businessId: string;
  businessName: string;
  businessCode: string | null;
  officerId: string;
  officerName: string | null;
  amount: string;
  paymentMethod: string;
  mobileMoneyRef: string | null;
  collectionDate: string;
  gpsVerified: boolean;
  collectionLat: string | null;
  collectionLng: string | null;
  isSynced: boolean;
  notes: string | null;
  createdAt: string;
}

export const useAgentDashboard = () => {
  return useQuery({
    queryKey: ['agent-dashboard'],
    queryFn: async () => {
      const response = await api.get<AgentDashboardData>('/agents/dashboard');
      return response.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
};

export const useAgentZoneBusinesses = (zoneId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['agent-zone-businesses', zoneId],
    queryFn: async () => {
      const response = await api.get<AgentZoneBusiness[]>(`/collections/zone/${zoneId}`);
      return response.data;
    },
    enabled: enabled && !!zoneId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAgentCollections = (today = false) => {
  return useQuery({
    queryKey: ['agent-collections', today],
    queryFn: async () => {
      const response = await api.get<{ data: AgentCollection[]; total: number }>(`/collections/my`, { today: today ? 'true' : 'false', limit: 100 });
      return response.data;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};
