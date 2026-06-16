import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { AgentStats } from '../types';
import { PaginatedResponse } from '../api/client';

export const useAgents = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['agents', params],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<AgentStats>>('/agents', params);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
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
    staleTime: 1000 * 60 * 10,
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