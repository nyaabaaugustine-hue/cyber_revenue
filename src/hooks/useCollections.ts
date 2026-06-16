import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Collection } from '../types';
import { PaginatedResponse } from '../api/client';

export const useCollections = (params?: { page?: number; limit?: number; businessId?: string; paymentMethod?: string }) => {
  return useQuery({
    queryKey: ['collections', params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Collection>>('/collections', params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
  });
};