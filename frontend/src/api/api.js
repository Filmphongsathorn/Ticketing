/**
 * api.js
 * ---------------------------------------------------------------------------
 * Central Axios instance for the Concert Ticket Booking frontend.
 *
 * Responsibilities:
 *  1. Base URL → Spring Cloud Gateway at http://localhost:8080
 *     (Vite dev server proxies /api/* so the URL becomes /api in-browser)
 *  2. Request interceptor  → attaches JWT from localStorage as Bearer token
 *  3. Response interceptor → normalises errors; auto-logs-out on 401
 * ---------------------------------------------------------------------------
 */

import axios from 'axios';

// ─── Constants ──────────────────────────────────────────────────────────────
const BASE_URL     = '/api/v1';       // Vite proxy → http://localhost:8080/api/v1
const TOKEN_KEY    = 'jwt_token';     // localStorage key used by AuthContext
const TIMEOUT_MS   = 15_000;         // 15 s request timeout

// ─── Create instance ────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — attach JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — normalise errors ────────────────────────────────
api.interceptors.response.use(
  // Pass successful responses straight through
  (response) => response,

  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message
                 ?? error.response?.data?.error
                 ?? error.message
                 ?? 'An unexpected error occurred.';

    // 401 Unauthorised → clear stale token and redirect to login
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Avoid hard redirect inside interceptor; dispatch a custom event instead
      // so React can handle navigation cleanly.
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // 403 Forbidden
    if (status === 403) {
      console.warn('[API] Forbidden – insufficient permissions.');
    }

    // Re-throw a normalised error object that components can consume
    return Promise.reject({
      status,
      message,
      raw: error,
    });
  },
);

// ─── Convenience helpers ─────────────────────────────────────────────────────

/** GET /events  — fetch all upcoming concerts */
export const fetchEvents = () => api.get('/events');

/** GET /events/:id  — fetch a single concert */
export const fetchEventById = (id) => api.get(`/events/${id}`);

/**
 * POST /orders  — place a ticket order
 * @param {Object} orderPayload
 * @param {string} orderPayload.eventId
 * @param {string[]} orderPayload.seatIds
 * @param {string} orderPayload.paymentToken  - tokenised card from payment provider
 */
export const createOrder = (orderPayload) => api.post('/orders', orderPayload);

/** GET /orders/:id  — fetch order confirmation */
export const fetchOrderById = (id) => api.get(`/orders/${id}`);

/** POST /auth/login  — obtain JWT (no token needed for this request) */
export const login = (credentials) => api.post('/auth/login', credentials);

/** POST /auth/register  — create account */
export const register = (userData) => api.post('/auth/register', userData);

export default api;
