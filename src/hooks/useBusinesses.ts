import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Business } from '../types';
import { PaginatedResponse } from '../api/client';

export const useBusinesses = (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Business>>('/businesses', params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Business> }) => {
      const response = await api.put<Business>(`/businesses/${id}`, updates);
      return response.data;
    },
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(['business', updatedBusiness.id], updatedBusiness);
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
};