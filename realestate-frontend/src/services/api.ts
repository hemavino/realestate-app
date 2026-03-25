import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Property,
  PropertyFormValues,
  PaginatedResponse,
  PaginationParams,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on login/register pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    console.log(response)
    return response.data;
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (params: PaginationParams): Promise<PaginatedResponse<Property>> => {
    const response = await api.get<PaginatedResponse<Property>>('/properties', {
      params: {
        page: params.pageNumber,
        pageSize: params.pageSize,
        search: params.searchTerm || undefined,
        propertyType: params.propertyType || undefined,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  create: async (data: PropertyFormValues): Promise<Property> => {
    const response = await api.post<Property>('/properties', data);
    return response.data;
  },

  update: async (id: string, data: PropertyFormValues): Promise<Property> => {
    const response = await api.put<Property>(`/properties/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

export default api;
