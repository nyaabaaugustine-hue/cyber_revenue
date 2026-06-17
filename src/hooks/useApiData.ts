import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  Business,
  AgentStats,
  Collection,
  Anomaly,
  ActivityEntry,
  CommissionEntry,
  ComplianceCheck,
  ReconciliationEntry,
  Dispute,
  Asset,
  DueCollection,
  RevenueTrend,
  CategoryBreakdown,
  Zone,
  User,
  Alert,
} from '../types';

// ─── Additional types not in ../types ────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description: string;
  businessCount: number;
  revenue: number;
}

export interface DashboardMetricsFlat {
  revenueToday: string;
  revenueYesterday: string;
  revenueThisWeek: string;
  revenueLastWeek: string;
  revenueThisMonth: string;
  revenueLastMonth: string;
  revenueTarget: string;
  revenueTargetPercent: string;
  collectionsToday: number;
  collectionsThisWeek: number;
  collectionsThisMonth: number;
  collectionsPending: number;
  businessesTotal: number;
  businessesActive: number;
  businessesInactive: number;
  businessesFlagged: number;
  businessesPaid: number;
  businessesDue: number;
  businessesOverdue: number;
  agentsTotal: number;
  agentsActive: number;
  agentsInField: number;
  agentsOffline: number;
  agentsAvgPerformance: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get<DashboardMetricsFlat>('/analytics/dashboard');
      return response.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
};

export const useRevenueTrends = () => {
  return useQuery({
    queryKey: ['revenue-trends'],
    queryFn: async () => {
      const response = await api.get<RevenueTrend[]>('/analytics/revenue-trends');
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useCategoryBreakdown = () => {
  return useQuery({
    queryKey: ['category-breakdown'],
    queryFn: async () => {
      const response = await api.get<CategoryBreakdown[]>('/analytics/category-breakdown');
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useActivityLog = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['activity-log', params],
    queryFn: async () => {
      const response = await api.get<{ data: ActivityEntry[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/analytics/activity',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

// ─── Collections ─────────────────────────────────────────────────────────────

export const useCollections = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  paymentMethod?: string;
}) => {
  return useQuery({
    queryKey: ['collections', params],
    queryFn: async () => {
      const response = await api.get<{ data: Collection[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/collections',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

export const useDueCollections = () => {
  return useQuery({
    queryKey: ['due-collections'],
    queryFn: async () => {
      const response = await api.get<DueCollection[]>('/collections/due');
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Collection>) => {
      const response = await api.post<Collection>('/collections', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['due-collections'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
  });
};

// ─── Businesses ──────────────────────────────────────────────────────────────

export const useBusinesses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  zoneId?: string;
  categoryId?: string;
}) => {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: async () => {
      const response = await api.get<{ data: Business[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/businesses',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

export const useBusiness = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      const response = await api.get<Business>(`/businesses/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useZones = () => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const response = await api.get<Zone[]>('/businesses/zones');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/businesses/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Agents ──────────────────────────────────────────────────────────────────

export const useAgents = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['agents', params],
    queryFn: async () => {
      const response = await api.get<{ data: AgentStats[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/agents',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

export const useAgent = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const response = await api.get<AgentStats>(`/agents/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AgentStats> }) => {
      const response = await api.put<AgentStats>(`/agents/${id}`, updates);
      return response.data;
    },
    onSuccess: (updatedAgent) => {
      queryClient.setQueryData(['agent', updatedAgent.officerId], updatedAgent);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/resources/users');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Anomalies ───────────────────────────────────────────────────────────────

export const useAnomalies = () => {
  return useQuery({
    queryKey: ['anomalies'],
    queryFn: async () => {
      const response = await api.get<Anomaly[]>('/management/anomalies');
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useResolveAnomaly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<Anomaly>(`/management/anomalies/${id}/resolve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
  });
};

// ─── Alerts ──────────────────────────────────────────────────────────────────

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await api.get<Alert[]>('/management/alerts');
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};

// ─── Disputes ────────────────────────────────────────────────────────────────

export const useDisputes = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['disputes', params],
    queryFn: async () => {
      const response = await api.get<{ data: Dispute[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/management/disputes',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Dispute> }) => {
      const response = await api.put<Dispute>(`/management/disputes/${id}`, updates);
      return response.data;
    },
    onSuccess: (updatedDispute) => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};

// ─── Compliance ──────────────────────────────────────────────────────────────

export const useComplianceChecks = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['compliance-checks', params],
    queryFn: async () => {
      const response = await api.get<{ data: ComplianceCheck[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/management/compliance',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

// ─── Commissions ─────────────────────────────────────────────────────────────

export const useCommissions = (params?: { page?: number; limit?: number; officerId?: string; status?: string }) => {
  return useQuery({
    queryKey: ['commissions', params],
    queryFn: async () => {
      const response = await api.get<{ data: CommissionEntry[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/management/commissions',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

// ─── Reconciliation ──────────────────────────────────────────────────────────

export const useReconciliation = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['reconciliation', params],
    queryFn: async () => {
      const response = await api.get<{ data: ReconciliationEntry[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/management/reconciliation',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

// ─── Assets ──────────────────────────────────────────────────────────────────

export const useAssets = (params?: { page?: number; limit?: number; type?: string; assignedTo?: string }) => {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: async () => {
      const response = await api.get<{ data: Asset[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
        '/resources/assets',
        params,
      );
      return response.data;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};
