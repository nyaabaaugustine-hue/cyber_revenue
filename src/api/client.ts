import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearAuth } from '../store/authStore';
import { mockBackend } from './mockBackend';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const USE_MOCK_BACKEND = import.meta.env.VITE_USE_MOCK_BACKEND === 'true' || !import.meta.env.VITE_API_URL;

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    if (USE_MOCK_BACKEND) {
      this.client = this.setupMockClient();
    } else {
      this.client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.setupInterceptors();
    }
  }

  private setupMockClient() {
    const mockClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    mockClient.interceptors.request.use((config) => {
      console.log(`[MOCK] ${config.method?.toUpperCase()} ${config.url}`, config.data);
      return config;
    });

    mockClient.interceptors.response.use(
      (response) => {
        console.log(`[MOCK] Response ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error(`[MOCK] Error ${error.config?.url}`, error);
        return Promise.reject(error);
      }
    );

    return mockClient;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        const body = response.data;
        if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
          response.data = body.data;
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch {
            clearAuth();
            return Promise.reject(error);
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
            withCredentials: true,
          });
          const body = response.data;
          const data = body?.data || body;
          const newToken = data?.token || body?.token;
          localStorage.setItem('token', newToken);
          return newToken;
        } catch {
          throw new Error('Token refresh failed');
        }
      })();
    }
    return this.refreshPromise;
  }

  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        status: error.response.status,
        message: (error.response.data as any)?.message || error.message,
        code: (error.response.data as any)?.code,
        details: error.response.data,
      };
    }
    return {
      status: 0,
      message: error.message || 'Network error',
      code: 'NETWORK_ERROR',
    };
  }

  get<T>(url: string, params?: Record<string, any>) {
    if (USE_MOCK_BACKEND) {
      return this.handleMockRequest<T>(url, 'GET', undefined, params);
    }
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: any) {
    if (USE_MOCK_BACKEND) {
      return this.handleMockRequest<T>(url, 'POST', data);
    }
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: any) {
    if (USE_MOCK_BACKEND) {
      return this.handleMockRequest<T>(url, 'PUT', data);
    }
    return this.client.put<T>(url, data);
  }

  patch<T>(url: string, data?: any) {
    if (USE_MOCK_BACKEND) {
      return this.handleMockRequest<T>(url, 'PATCH', data);
    }
    return this.client.patch<T>(url, data);
  }

  delete<T>(url: string) {
    if (USE_MOCK_BACKEND) {
      return this.handleMockRequest<T>(url, 'DELETE');
    }
    return this.client.delete<T>(url);
  }

  private async handleMockRequest<T>(url: string, method: string, data?: any, params?: Record<string, any>): Promise<{ data: T }> {
    const parts = url.split('/').filter(Boolean);
    // Support both /api/v1/resource and /resource patterns
    const startIdx = parts.findIndex(p => ['businesses', 'agents', 'collections', 'anomalies', 'dashboard', 'auth', 'financial', 'activity', 'commissions', 'compliance', 'disputes', 'reconciliation', 'assets'].includes(p));
    const resource = parts[startIdx] || parts[0];
    const id = parts[startIdx + 1];
    const subResource = parts[startIdx + 2];
    
    switch (resource) {
      case 'financial':
        switch (subResource) {
          case 'summary': return { data: await mockBackend.getFinancialSummary() as T };
          case 'ledger': return { data: await mockBackend.getLedger(params) as T };
          case 'invoices': return { data: await mockBackend.getInvoices(params) as T };
          case 'remittances': return { data: await mockBackend.getRemittances(params) as T };
          case 'cashflow': return { data: await mockBackend.getCashFlow(params) as T };
        }
        break;
      case 'businesses':
        if (id) {
          if (method === 'PUT' || method === 'PATCH') {
            return { data: await mockBackend.updateBusiness(id, data) as T };
          }
          return { data: await mockBackend.getBusiness(id) as T };
        }
        return { data: await mockBackend.getBusinesses(params) as T };
      
      case 'agents':
        if (id) {
          if (method === 'PUT' || method === 'PATCH') {
            return { data: await mockBackend.updateAgent(id, data) as T };
          }
          return { data: await mockBackend.getAgent(id) as T };
        }
        return { data: await mockBackend.getAgents(params) as T };
      
      case 'collections':
        if (method === 'POST') {
          return { data: await mockBackend.createCollection(data) as T };
        }
        return { data: await mockBackend.getCollections(params) as T };
      
      case 'anomalies':
        if (id && method === 'POST' && url.includes('/resolve')) {
          return { data: await mockBackend.resolveAnomaly(id) as T };
        }
        if (id) {
          return { data: await mockBackend.getAnomalies({ ...params, resolved: false }) as T };
        }
        return { data: await mockBackend.getAnomalies(params) as T };
      
      case 'dashboard':
        if (id === 'metrics' || url.includes('/metrics')) {
          return { data: await mockBackend.getDashboardMetrics() as T };
        }
        return { data: await mockBackend.getDashboard() as T };
        break;
      
      case 'auth':
        if (url.includes('/login')) {
          return { data: await mockBackend.login(data.email, data.password) as T };
        }
        if (url.includes('/logout')) {
          return { data: await mockBackend.logout() as T };
        }
        if (url.includes('/me')) {
          return { data: await mockBackend.getCurrentUser() as T };
        }
        break;
      
      case 'activity':
        return { data: await mockBackend.getActivity(params) as T };
      
      case 'commissions':
        return { data: await mockBackend.getCommissions(params) as T };
      
      case 'compliance':
        return { data: await mockBackend.getCompliance(params) as T };
      
      case 'disputes':
        if (id && method === 'POST' && url.includes('/resolve')) {
          return { data: await mockBackend.resolveDispute(id, data?.resolution) as T };
        }
        return { data: await mockBackend.getDisputes(params) as T };
      
      case 'reconciliation':
        return { data: await mockBackend.getReconciliations(params) as T };
      
      case 'assets':
        return { data: await mockBackend.getAssets(params) as T };
    }
    
    throw new Error(`Mock endpoint not implemented: ${method} ${url}`);
  }
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const api = new ApiClient();
export default api;