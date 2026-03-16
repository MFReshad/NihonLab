import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Configuration and Utilities
export const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  registration_method: 'email' | 'google';
  is_active: boolean;
  date_joined: string;
  
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface ErrorResponse {
  error: string;
}

// Token management
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const setTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Make authenticated API request with automatic token refresh
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let accessToken = getAccessToken();

  // Add authorization header
  const headers = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // First attempt
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401 && accessToken) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      throw new Error('No refresh token available');
    }

    // Try refreshing the token
    const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!refreshResponse.ok) {
      clearTokens();
      throw new Error('Token refresh failed');
    }

    const data = await refreshResponse.json();
    setTokens({ access: data.access, refresh: refreshToken });

    // Retry the original request with new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${data.access}`,
      },
    });
  }

  return response;
};

// API Methods
export const api = {
  // Auth endpoints
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },

  googleAuth: async (credential: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Google authentication failed');
    }

    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      clearTokens();
      return;
    }

    try {
      await authenticatedFetch(`${API_BASE_URL}/users/logout/`, {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/users/profile/`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }

    return data.user;
  },

  // Add more API methods as needed
};
