// 프로덕션: /api 사용 (Nginx 프록시)
// 개발: 환경 변수 또는 /api 사용 (Vite proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const ACCESS_TOKEN_KEY = 'cinecollector:access_token';
const REFRESH_TOKEN_KEY = 'cinecollector:refresh_token';

export type Role = 'COLLECTOR' | 'THEATER' | 'CREATOR' | 'ADMIN';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export type ApiError = Error & { status?: number };

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (tokens: TokenPair) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const buildQueryString = (params: Record<string, string | number | undefined | null>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...rest } = options;
  const headers = new Headers(rest.headers || {});
  headers.set('Accept', 'application/json');

  const hasBody = rest.body !== undefined && rest.body !== null;
  if (hasBody && !(rest.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers,
  });

  if (!response.ok) {
    let message = 'API 요청에 실패했습니다.';
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      } else if (typeof errorBody?.error === 'string') {
        message = errorBody.error;
      }
    } catch {
      // ignore parse error
    }

    const error: ApiError = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();
  if (json && typeof json === 'object' && 'data' in json) {
    return (json.data ?? null) as T;
  }

  return json as T;
}

// ==================== Types ====================

export interface UserResponse {
  name: string;
  email: string;
  role: Role;
  profile_image?: string | null;
  created_at?: string | null;
}

export interface MovieResponse {
  movie_id: number;
  title: string;
  director?: string | null;
  release_date?: string | null;
  poster_image?: string | null;
  description?: string | null;
}

export interface MovieCreateRequest {
  title: string;
  director?: string;
  release_date?: string;
  poster_image?: string;
  description?: string;
}

export interface MovieUpdateRequest {
  title?: string;
  director?: string;
  release_date?: string;
  poster_image?: string;
  description?: string;
}

export interface EventResponse {
  event_id: number;
  movie_id: number;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  status: string;
  created_by: number;
}

export interface EventListResponse {
  event_id: number;
  movie_title: string;
  event_title: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface EventDetailResponse {
  event_id: number;
  movie: {
    movie_id: number;
    title: string;
    image?: string | null;
  };
  title: string;
  status: string;
  start_date: string;
  end_date: string;
  week_no: number;
  image?: string | null;
  perks: Array<{
    perk_id: number;
    name: string;
    type: string;
    description?: string | null;
    limit_per_user: number;
    quantity: number;
    image?: string | null;
    theaters: Array<{
      theater_id: number;
      name: string;
      location: string;
      stock: number;
      status: string;
      status_message: string;
    }>;
  }>;
}

export interface EventCreateRequest {
  movie_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface EventUpdateRequest {
  title?: string;
  start_date?: string;
  end_date?: string;
  week_no?: number;
}

export interface EventWithPerkCreateRequest {
  movie_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  perks: Array<{
    name: string;
    type: string;
    limit_per_user: number;
    quantity: number;
    description?: string;
  }>;
}

export interface CollectionResponse {
  collection_id: number;
  perk_id: number;
  user_id: number;
  status: string;
  collected_at: string;
}

export interface CollectionCreateRequest {
  perk_id: number;
}

export interface CollectionUpdateRequest {
  status?: string;
}

export interface ViewingRecordResponse {
  record_id: number;
  user_id: number;
  movie_id: number;
  viewing_date: string;
  rating?: number | null;
  review?: string | null;
  theater_id?: number | null;
}

export interface ViewingRecordCreateRequest {
  movie_id: number;
  view_date: string;
  theater_id: number;
  rating?: number;
  review?: string;
  is_public?: boolean;
  image_urls?: string[];
  perk_ids?: number[];
}

export interface ViewingRecordUpdateRequest {
  view_date?: string;
  rating?: number;
  review?: string;
  theater_id?: number;
  is_public?: boolean;
}

export interface HomeViewingRecordResponse {
  record_id: number;
  user_name: string;
  movie_title: string;
  viewing_date: string;
  rating?: number | null;
  review?: string | null;
  poster_image?: string | null;
}

export interface PerkResponse {
  perk_id: number;
  event_id: number;
  name: string;
  type: string;
  limit_per_user: number;
  quantity: number;
  description?: string | null;
}

export interface PerkCreateRequest {
  event_id: number;
  name: string;
  type: string;
  limit_per_user: number;
  quantity: number;
  description?: string;
}

export interface PerkUpdateRequest {
  name?: string;
  type?: string;
  limit_per_user?: number;
  quantity?: number;
  description?: string;
}

export interface InventoryResponse {
  inventory_id: number;
  perk_id: number;
  theater_id: number;
  stock: number;
  status: string;
}

export interface InventoryCreateRequest {
  perk_id: number;
  theater_id: number;
  stock: number;
  status: string;
}

export interface InventoryUpdateRequest {
  stock?: number;
  status?: string;
}

export interface TheaterResponse {
  theater_id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  manager_id: number;
}

export interface TheaterCreateRequest {
  name: string;
  address?: string;
  phone?: string;
}

export interface TheaterUpdateRequest {
  name?: string;
  address?: string;
  phone?: string;
}

export interface PerkApplicationRequest {
  perk_id: number;
  theater_id: number;
  quantity: number;
}

export interface PerkApplicationResponse {
  application_id: number;
  user_id: number;
  perk_id: number;
  theater_id: number;
  quantity: number;
  is_obtained: boolean;
}

export interface PresignedUrlRequest {
  directory: string;
  file_name: string;
  content_type: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  final_url: string;
}

// ==================== API Functions ====================

// Users API
export const usersApi = {
  login: (email: string, password: string) =>
    apiRequest<TokenPair>('/users/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    apiRequest<TokenPair>('/users/signup', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiRequest<UserResponse>('/users/me'),

  updateProfile: (data: { name?: string; profile_image?: string }) =>
    apiRequest<UserResponse>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Movies API
export const moviesApi = {
  getAll: () => apiRequest<MovieResponse[]>('/movies'),

  getById: (movieId: number) => apiRequest<MovieResponse>(`/movies/${movieId}`),

  create: (data: MovieCreateRequest) =>
    apiRequest<MovieResponse>('/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (movieId: number, data: MovieUpdateRequest) =>
    apiRequest<MovieResponse>(`/movies/${movieId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (movieId: number) =>
    apiRequest<void>(`/movies/${movieId}`, {
      method: 'DELETE',
    }),
};

// Events API
export const eventsApi = {
  getAll: () => apiRequest<EventResponse[]>('/events'),

  getList: (params?: { status?: string; movie_title?: string; event_title?: string }) =>
    apiRequest<EventListResponse[]>(`/events/list${buildQueryString(params || {})}`),

  getById: (eventId: number) => apiRequest<EventResponse>(`/events/${eventId}`),

  getDetail: (eventId: number) => apiRequest<EventDetailResponse>(`/events/${eventId}/detail`),

  create: (data: EventCreateRequest) =>
    apiRequest<EventResponse>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createWithPerk: (data: EventWithPerkCreateRequest) =>
    apiRequest<EventResponse>('/events/with-perk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (eventId: number, data: EventUpdateRequest) =>
    apiRequest<EventResponse>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (eventId: number) =>
    apiRequest<void>(`/events/${eventId}`, {
      method: 'DELETE',
    }),

  getManagementStatistics: () =>
    apiRequest<any>('/events/management/statistics'),

  getManagementList: (params?: { status?: string; movie_title?: string; event_title?: string }) =>
    apiRequest<EventListResponse[]>(`/events/management/list${buildQueryString(params || {})}`),
};

// Collections API
export const collectionsApi = {
  getMyCollections: () => apiRequest<CollectionResponse[]>('/collections'),

  create: (data: CollectionCreateRequest) =>
    apiRequest<CollectionResponse>('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (perkId: number, data: CollectionUpdateRequest) =>
    apiRequest<CollectionResponse>(`/collections/${perkId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (perkId: number) =>
    apiRequest<void>(`/collections/${perkId}`, {
      method: 'DELETE',
    }),
};

// Viewing Records API
export const viewingRecordsApi = {
  getMyRecords: () => apiRequest<ViewingRecordResponse[]>('/viewing-records'),

  getHomeRecords: () => apiRequest<HomeViewingRecordResponse[]>('/viewing-records/home'),

  getMyViewingRecords: (params?: { movie_title?: string }) =>
    apiRequest<HomeViewingRecordResponse[]>(`/viewing-records/my${buildQueryString(params || {})}`),

  getStatistics: () => apiRequest<any>('/viewing-records/statistics'),

  create: (data: ViewingRecordCreateRequest) =>
    apiRequest<ViewingRecordResponse>('/viewing-records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (recordId: number, data: ViewingRecordUpdateRequest) =>
    apiRequest<ViewingRecordResponse>(`/viewing-records/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (recordId: number) =>
    apiRequest<void>(`/viewing-records/${recordId}`, {
      method: 'DELETE',
    }),
};

// Viewing Record Images API
export const viewingRecordImagesApi = {
  create: (data: { record_id: number; image_url: string }) =>
    apiRequest<any>('/viewing-record-images', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByRecordId: (recordId: number) =>
    apiRequest<any[]>(`/viewing-record-images/records/${recordId}`),

  delete: (imageId: number) =>
    apiRequest<void>(`/viewing-record-images/${imageId}`, {
      method: 'DELETE',
    }),
};

// Perks API
export const perksApi = {
  getByEvent: (eventId: number) => apiRequest<PerkResponse[]>(`/perks/events/${eventId}`),

  create: (data: PerkCreateRequest) =>
    apiRequest<PerkResponse>('/perks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (perkId: number, data: PerkUpdateRequest) =>
    apiRequest<PerkResponse>(`/perks/${perkId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (perkId: number) =>
    apiRequest<void>(`/perks/${perkId}`, {
      method: 'DELETE',
    }),
};

// Inventory API
export const inventoryApi = {
  getStatistics: () => apiRequest<any>('/inventory/statistics'),

  getList: (params?: { movie_title?: string; perk_name?: string }) =>
    apiRequest<any[]>(`/inventory/list${buildQueryString(params || {})}`),

  getApplicants: (perkId: number) =>
    apiRequest<any[]>(`/inventory/${perkId}/applicants`),

  getTheaterStockDistribution: (perkId: number) =>
    apiRequest<any>(`/inventory/${perkId}/distribution`),

  create: (data: InventoryCreateRequest) =>
    apiRequest<InventoryResponse>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (perkId: number, data: InventoryUpdateRequest) =>
    apiRequest<InventoryResponse>(`/inventory/${perkId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateStock: (perkId: number, theaterId: number, data: InventoryUpdateRequest) =>
    apiRequest<InventoryResponse>(`/inventory/${perkId}/theaters/${theaterId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (perkId: number) =>
    apiRequest<void>(`/inventory/${perkId}`, {
      method: 'DELETE',
    }),

  selectTheaters: (data: { perk_id: number; theater_ids: number[] }) =>
    apiRequest<void>('/inventory/theaters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  distributeStock: (perkId: number, data: { theater_stocks: Array<{ theater_id: number; stock: number }> }) =>
    apiRequest<void>(`/inventory/${perkId}/distribution`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Theaters API
export const theatersApi = {
  getAll: () => apiRequest<TheaterResponse[]>('/theaters'),

  getById: (theaterId: number) => apiRequest<TheaterResponse>(`/theaters/${theaterId}`),

  getMyTheater: () => apiRequest<TheaterResponse>('/theaters/my'),

  create: (data: TheaterCreateRequest) =>
    apiRequest<TheaterResponse>('/theaters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (theaterId: number, data: TheaterUpdateRequest) =>
    apiRequest<TheaterResponse>(`/theaters/${theaterId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (theaterId: number) =>
    apiRequest<void>(`/theaters/${theaterId}`, {
      method: 'DELETE',
    }),
};

// Perk Applications API
export const perkApplicationsApi = {
  apply: (data: PerkApplicationRequest) =>
    apiRequest<PerkApplicationResponse>('/perk-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Movie Collections API
export const movieCollectionsApi = {
  getMovieCollection: (movieId: number) =>
    apiRequest<any>(`/movies/${movieId}/collection`),

  getMyMovieCollections: () =>
    apiRequest<any[]>('/movies/my/collection'),

  getPerkCollectionStatistics: () =>
    apiRequest<any>('/movies/perk-collection/statistics'),

  getPerkCollectionList: (params?: { movie_title?: string; filter?: string }) =>
    apiRequest<any[]>(`/movies/perk-collection/list${buildQueryString(params || {})}`),
};

// S3/Files API
export const filesApi = {
  getPresignedUrl: (data: PresignedUrlRequest) =>
    apiRequest<PresignedUrlResponse>('/files/presigned-url', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

