import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export interface DashboardMetrics {
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

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get<DashboardMetrics>('/analytics/dashboard');
      return response.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
};