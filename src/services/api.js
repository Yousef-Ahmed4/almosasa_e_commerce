import axios from 'axios';

const API_BASE_URL = 'https://erpapi.almoasasa-app.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Bearer token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────
export const loginUser = (phone, password) =>
  api.post('/app/auth/login', { phone, password });

export const registerUser = (data) =>
  api.post('/app/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getProfile = () => api.get('/app/profile');

export const updateProfile = (data) => api.put('/app/profile', data);

export const logoutUser = () => api.post('/user/logout');

export const getSettings = () => api.get('/app/settings');

// ─── Products ────────────────────────────────────────────────────
export const getProducts = (params = {}) =>
  api.get('/app/products', {
    params: { type: 'sale', ...params },
  });

export const getProduct = (id) => api.get(`/app/products/${id}`);

export const getCategories = () => api.get('/app/categories');

export const getProducingCompanies = () => api.get('/app/producing_companies');

// ─── Favorites ───────────────────────────────────────────────────
export const getFavorites = () => api.get('/app/favorites');

export const addToFavorites = (productId) =>
  api.post('/app/favorites', { product_id: productId });

export const removeFromFavorites = (productId) =>
  api.delete('/app/favorites', { data: { product_id: productId } });

export const checkFavorite = (productId) =>
  api.get(`/app/favorites/check/${productId}`);

// ─── Cart ────────────────────────────────────────────────────────
export const getCart = () => api.get('/app/cart');

export const addToCartAPI = (productId, unitId, price, quantity) =>
  api.post('/app/cart', { product_id: productId, unit_id: unitId, price, quantity }, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCartAPI = (cartItemId, quantity, price) =>
  api.put(`/app/cart/${cartItemId}`, null, {
    params: { quantity, price },
  });

export const deleteCartAPI = (variant = 'empty') =>
  api.delete(`/app/cart/${variant}`);

export const replaceCartAPI = (items) =>
  api.post('/app/cart/replace_cart', { items });

// ─── Bills / Orders ─────────────────────────────────────────────
export const getBills = () => api.get('/app/bills');

export const getBillDetail = (id) => api.get(`/app/bills/${id}`);

export const createBill = (billProducts, billDetails) =>
  api.post('/app/bills/sales/invoice', {
    bill_products: billProducts,
    bill_details: billDetails,
  });

export const returnBill = (billId) =>
  api.post('/app/bills/return/sales', { bill_id: billId }, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Offers ──────────────────────────────────────────────────────
export const getOffers = () => api.get('/app/offers');

export const getSpecialOffers = () => api.get('/app/special-offers');

// ─── Branches ────────────────────────────────────────────────────
export const getBranches = () => api.get('/app/branches');

export const getBranch = (id) => api.get(`/app/branches/${id}`);

// ─── Locations ───────────────────────────────────────────────────
export const getLocations = () => api.get('/app/locations');

export default api;
