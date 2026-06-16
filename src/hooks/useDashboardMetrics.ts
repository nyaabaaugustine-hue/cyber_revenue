import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { DashboardMetrics } from '../types';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get<DashboardMetrics>('/dashboard/metrics');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};