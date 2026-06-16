import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { User } from '../types';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await api.get<User>('/auth/me');
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post<{ user: User; token: string; refreshToken: string }>('/auth/login', { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data.user);
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(['current-user'], null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  });
};