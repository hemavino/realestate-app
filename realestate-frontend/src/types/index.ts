// User & Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

// Property Types
export const PropertyType = {
  Villa: 'Villa',
  Apartment: 'Apartment',
  Land: 'Land',
} as const;

export type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType: PropertyType;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormValues {
  title: string;
  location: string;
  price: number;
  propertyType: PropertyType | null;
  description: string | '';
}

// Pagination Types
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  propertyType?: PropertyType;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

// API Error Type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
