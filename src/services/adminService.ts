import api from './api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AdminDashboardStats {
  total_users: number;
  total_partners: number;
  total_admins: number;
  total_listings: number;
  total_bookings: number;
  total_revenue: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  role: 'user' | 'partner' | 'admin';
  business_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  updated_at?: string;
}

export interface AdminAccommodation {
  id: number;
  name: string;
  description: string;
  property_type: string;
  status: string;
  address: string;
  city: string;
  country: string;
  price_per_night: number | string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  owner: number | Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminBooking {
  id: number;
  accommodation: number | Record<string, unknown>;
  guest: number | Record<string, unknown>;
  check_in: string;
  check_out: string;
  guests_count: number;
  children_count: number;
  total_nights: number;
  price_per_night: number | string;
  total_price: number | string;
  host_earnings: number | string;
  status: string;
  special_requests: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: T[];
}

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get<AdminDashboardResponse>(
    '/api/admin/dashboard/'
  );

  return response.data;
};

// ─────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────

export interface AdminUserFilters {
  page?: number;
  page_size?: number;
  role?: string;
  search?: string;
}

export const getAdminUsers = async (
  filters: AdminUserFilters = {}
): Promise<PaginatedResponse<AdminUser>> => {
  const response = await api.get<PaginatedResponse<AdminUser>>(
    '/api/admin/users/',
    {
      params: filters,
    }
  );

  return response.data;
};

export const getAdminUser = async (
  id: number
): Promise<AdminUser> => {
  const response = await api.get<AdminUser>(
    `/api/admin/users/${id}/`
  );

  return response.data;
};

export const updateAdminUser = async (
  id: number,
  data: Partial<AdminUser>
): Promise<AdminUser> => {
  const response = await api.patch<AdminUser>(
    `/api/admin/users/${id}/`,
    data
  );

  return response.data;
};

export const deleteAdminUser = async (
  id: number
): Promise<void> => {
  await api.delete(`/api/admin/users/${id}/`);
};

// ─────────────────────────────────────────────
// Accommodations / Listings
// ─────────────────────────────────────────────

export interface AdminListingFilters {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
}

export const getAdminListings = async (
  filters: AdminListingFilters = {}
): Promise<PaginatedResponse<AdminAccommodation>> => {
  const response = await api.get<
    PaginatedResponse<AdminAccommodation>
  >('/api/admin/listings/', {
    params: filters,
  });

  return response.data;
};

export const getAdminListing = async (
  id: number
): Promise<AdminAccommodation> => {
  const response = await api.get<AdminAccommodation>(
    `/api/admin/listings/${id}/`
  );

  return response.data;
};

export const updateAdminListing = async (
  id: number,
  data: Partial<AdminAccommodation>
): Promise<AdminAccommodation> => {
  const response = await api.patch<AdminAccommodation>(
    `/api/admin/listings/${id}/`,
    data
  );

  return response.data;
};

export const deleteAdminListing = async (
  id: number
): Promise<void> => {
  await api.delete(`/api/admin/listings/${id}/`);
};

// ─────────────────────────────────────────────
// Bookings
// ─────────────────────────────────────────────

export interface AdminBookingFilters {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
}

export const getAdminBookings = async (
  filters: AdminBookingFilters = {}
): Promise<PaginatedResponse<AdminBooking>> => {
  const response = await api.get<
    PaginatedResponse<AdminBooking>
  >('/api/admin/bookings/', {
    params: filters,
  });

  return response.data;
};