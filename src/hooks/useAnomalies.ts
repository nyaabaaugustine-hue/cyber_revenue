import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Anomaly } from '../types';
import { PaginatedResponse } from '../api/client';

export const useAnomalies = (params?: { page?: number; limit?: number; resolved?: boolean }) => {
  return useQuery({
    queryKey: ['anomalies', params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Anomaly>>('/anomalies', params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useResolveAnomaly = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<Anomaly>(`/anomalies/${id}/resolve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anomalies'] });
    },
  });
};