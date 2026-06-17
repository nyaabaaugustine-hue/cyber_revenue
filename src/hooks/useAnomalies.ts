import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export interface AnomalyData {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string | null;
  officerId: string | null;
  officerName: string | null;
  businessId: string | null;
  businessName: string | null;
  collectionId: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  detectedAt: string;
  isResolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
}

export const useAnomalies = () => {
  return useQuery({
    queryKey: ['anomalies'],
    queryFn: async () => {
      const response = await api.get<AnomalyData[]>('/management/anomalies');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useResolveAnomaly = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<AnomalyData>(`/management/anomalies/${id}/resolve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] });
    },
  });
};