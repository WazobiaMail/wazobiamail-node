/**
 * ---------------------------------------------------------------
 * Company Name: Bonifade Technologies
 * Developer: Bowofade Oyerinde
 * GitHub: oyenet1
 * Created Date: 2026-11-09
 * ---------------------------------------------------------------
 */

/**
 * Standard API envelope returned by WazobiaMail for all successful operations.
 */
export interface WazobiaApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Pagination metadata included with list queries.
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated collection envelope.
 */
export interface CollectionPage<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * Common success response containing an acknowledgment message.
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}
