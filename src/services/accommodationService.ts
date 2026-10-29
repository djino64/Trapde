import api from './api';

export interface Accommodation {
  id: number;
  name: string;
  address: string;
  property_type: string;
  city: string;
  country: string;
  price_per_night: number;
  host_earnings?: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  has_wifi: boolean;
  has_pool: boolean;
  has_ac: boolean;
  main_photo: string | null;
  average_rating: number;
  review_count: number;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

export interface AccommodationPhoto {
  id: number;
  image: string;
  is_main: boolean;
  order: number;
}

export interface Bed {
  id: number;
  bed_type: string;
  quantity: number;
}

export interface Room {
  id: number;
  name: string;
  beds: Bed[];
}

export interface AccommodationReview {
  id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AccommodationDetail extends Accommodation {
  description: string;
  photos: AccommodationPhoto[];
  rooms: Room[];
  reviews: AccommodationReview[];
  weekly_price?: number;
}

export interface AccommodationFilters {
  search?: string;
  city?: string;
  country?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  max_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  has_wifi?: boolean;
  has_pool?: boolean;
  has_ac?: boolean;
  has_kitchen?: boolean;
  has_washing_machine?: boolean;
  has_tv?: boolean;
  has_jacuzzi?: boolean;
  accepts_children?: boolean;
  pets_allowed?: string;
  ordering?: string;
  page?: number;
}

export interface Booking {
  id: number;
  accommodation: number;
  accommodation_name: string;
  accommodation_city: string;
  guest: number;
  guest_name: string;
  main_photo: string | null;
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
}

export interface AvailabilityResponse {
  available: boolean;
}

export const accommodationService = {
  /**
   * Liste des logements publics
   */
  async getAccommodations(
    filters: AccommodationFilters = {}
  ) {
    const response = await api.get('/accommodations/', {
      params: filters,
    });

    return response.data;
  },

  /**
   * Détail d'un logement
   */
  async getAccommodation(id: number): Promise<AccommodationDetail> {
    const response = await api.get(`/accommodations/${id}/`);
    return response.data;
  },

  /**
   * Créer un logement
   * Réservé au Partner
   */
  async createAccommodation(data: FormData | Record<string, unknown>) {
    const response = await api.post(
      '/accommodations/create/',
      data
    );

    return response.data;
  },

  /**
   * Mes logements
   */
  async getMyAccommodations() {
    const response = await api.get('/accommodations/mine/');
    return response.data;
  },

  /**
   * Modifier un logement
   */
  async updateAccommodation(
    id: number,
    data: FormData | Record<string, unknown>
  ) {
    const response = await api.patch(
      `/accommodations/${id}/`,
      data
    );

    return response.data;
  },

  /**
   * Supprimer un logement
   */
  async deleteAccommodation(id: number) {
    await api.delete(`/accommodations/${id}/`);
  },

  /**
   * Upload plusieurs photos
   */
  async uploadPhotos(id: number, files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post(
      `/accommodations/${id}/photos/`,
      formData
    );

    return response.data;
  },

  /**
   * Supprimer une photo
   */
  async deletePhoto(
    accommodationId: number,
    photoId: number
  ) {
    const response = await api.delete(
      `/accommodations/${accommodationId}/photos/`,
      {
        params: {
          photo_id: photoId,
        },
      }
    );

    return response.data;
  },

  /**
   * Vérifier disponibilité
   */
  async checkAvailability(
    accommodationId: number,
    checkIn: string,
    checkOut: string
  ): Promise<AvailabilityResponse> {
    const response = await api.post(
      `/accommodations/${accommodationId}/availability/`,
      {
        check_in: checkIn,
        check_out: checkOut,
      }
    );

    return response.data;
  },

  /**
   * Créer une réservation
   */
  async createBooking(data: {
    accommodation: number;
    check_in: string;
    check_out: string;
    guests_count: number;
    children_count?: number;
    special_requests?: string;
  }): Promise<Booking> {
    const response = await api.post(
      '/accommodations/bookings/create/',
      data
    );

    return response.data;
  },

  /**
   * Mes réservations
   */
  async getMyBookings(): Promise<Booking[]> {
    const firstPage = await api.get<
      Booking[] | { results?: Booking[]; next?: string | null }
    >('/accommodations/bookings/');

    if (Array.isArray(firstPage.data)) {
      return firstPage.data;
    }

    const bookings = [...(firstPage.data.results ?? [])];
    let next = firstPage.data.next ?? null;

    while (next) {
      const response = await api.get<{
        results?: Booking[];
        next?: string | null;
      }>(next);
      bookings.push(...(response.data.results ?? []));
      next = response.data.next ?? null;
    }

    return bookings;
  },

  /**
   * Détail réservation
   */
  async getBooking(id: number): Promise<Booking> {
    const response = await api.get(
      `/accommodations/bookings/${id}/`
    );

    return response.data;
  },

  /**
   * Annuler réservation
   */
  async cancelBooking(id: number) {
    const response = await api.patch(
      `/accommodations/bookings/${id}/`,
      {
        status: 'cancelled',
      }
    );

    return response.data;
  },

  /**
   * Réservations reçues par le Partner
   */
  async getHostBookings() {
    const response = await api.get(
      '/accommodations/bookings/host/'
    );

    return response.data;
  },

  /**
   * Confirmer réservation
   */
  async confirmBooking(id: number) {
    const response = await api.patch(
      `/accommodations/bookings/${id}/`,
      {
        status: 'confirmed',
      }
    );

    return response.data;
  },

  /**
   * Terminer réservation
   */
  async completeBooking(id: number) {
    const response = await api.patch(
      `/accommodations/bookings/${id}/`,
      {
        status: 'completed',
      }
    );

    return response.data;
  },

  /**
   * Reviews d'un logement
   */
  async getReviews(accommodationId: number) {
    const response = await api.get(
      `/accommodations/${accommodationId}/reviews/`
    );

    return response.data;
  },

  /**
   * Créer un review
   */
  async createReview(data: {
    accommodation: number;
    rating: number;
    comment: string;
  }) {
    const response = await api.post(
      '/accommodations/reviews/create/',
      data
    );

    return response.data;
  },
};