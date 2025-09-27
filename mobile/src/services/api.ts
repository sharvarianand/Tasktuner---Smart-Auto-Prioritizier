import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ERROR_MESSAGES } from '../config/constants';
import { ApiResponse, PaginatedResponse } from '../types';

export async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function pingBackend(timeoutMs = 3000): Promise<{ ok: boolean; message?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Backend health is served at '/'
    const base = API_BASE_URL.replace(/\/?api\/?$/, "");
    const res = await fetch(`${base}/`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, message: `HTTP ${res.status}` };
    const text = await res.text().catch(() => "");
    return { ok: true, message: text };
  } catch (e: any) {
    clearTimeout(timeout);
    return { ok: false, message: e?.message || "Network error" };
  }
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('auth_token');
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add user ID header for backend
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          config.headers['x-user-id'] = userId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.clearAuth();
          // You might want to redirect to login here
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || ERROR_MESSAGES.server;
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error(ERROR_MESSAGES.network);
    } else {
      // Other error
      return new Error(error.message || ERROR_MESSAGES.unknown);
    }
  }

  // Auth methods
  async setAuthToken(token: string, userId: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_id', userId);
  }

  async clearAuth() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_id');
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // Upload method for files
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
