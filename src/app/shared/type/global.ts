export interface AppResponse {
  success: boolean
  message: string
  data?: Record<string, unknown>
  timestamp: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sort?: { [key: string]: 'asc' | 'desc' }
  filters?: { [key: string]: string | number | boolean | null }
  search?: string
}

export interface PaginationMetadata {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMetadata
}

export interface PageResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMetadata;
  timestamp: string;
}

