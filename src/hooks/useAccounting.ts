import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { LedgerEntry, Invoice, Remittance, FinancialSummary, CashFlowEntry } from '../types';

export function useFinancialSummary() {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => api.get<FinancialSummary>('/api/v1/financial/summary'),
    staleTime: 1000 * 60 * 2,
  });
}

export function useLedger(params?: { page?: number; limit?: number; accountCode?: string; fromDate?: string; toDate?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.accountCode) searchParams.set('accountCode', params.accountCode);
  if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
  if (params?.toDate) searchParams.set('toDate', params.toDate);
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ['ledger', params],
    queryFn: () => api.get<{ data: LedgerEntry[]; meta: { total: number; page: number; limit: number } }>(`/api/v1/financial/ledger${qs ? `?${qs}` : ''}`),
    staleTime: 1000 * 60 * 2,
  });
}

export function useInvoices(params?: { businessId?: string; status?: string; page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.businessId) searchParams.set('businessId', params.businessId);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => api.get<{ data: Invoice[]; meta: { total: number; page: number; limit: number } }>(`/api/v1/financial/invoices${qs ? `?${qs}` : ''}`),
    staleTime: 1000 * 60 * 2,
  });
}

export function useRemittances(params?: { status?: string; officerId?: string; page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.officerId) searchParams.set('officerId', params.officerId);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ['remittances', params],
    queryFn: () => api.get<{ data: Remittance[]; meta: { total: number; page: number; limit: number } }>(`/api/v1/financial/remittances${qs ? `?${qs}` : ''}`),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCashFlow(params?: { period?: string; months?: number }) {
  return useQuery({
    queryKey: ['cashflow', params],
    queryFn: () => api.get<CashFlowEntry[]>(`/api/v1/financial/cashflow${params?.period ? `?period=${params.period}` : ''}`),
    staleTime: 1000 * 60 * 5,
  });
}
