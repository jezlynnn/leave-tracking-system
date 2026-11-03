export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId: string | null;
  managerId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
