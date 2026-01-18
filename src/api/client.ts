import axios from 'axios';
import { Product, PurchaseRequest, RestockRequest, User, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API для продуктов
export const productApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: number) => apiClient.get<Product>(`/products/${id}`),
  getByCategory: (category: string) => 
    apiClient.get<Product[]>(`/products/category/${category}`),
  filter: (filters: { type?: string; size?: string }) =>
    apiClient.get<Product[]>('/products/filter', { params: filters }),
  create: (product: Omit<Product, 'id'>) => 
    apiClient.post<Product>('/products', product),
  update: (id: number, product: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, product),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
  purchase: (purchaseData: PurchaseRequest) =>
    apiClient.post('/products/purchase', purchaseData),
  restock: (restockData: RestockRequest) =>
    apiClient.post('/products/restock', restockData),
  getReport: (filters?: { type?: string; size?: string }) =>
    apiClient.get('/products/report', { params: filters }),
};

// API для корзины
export const cartApi = {
  getCart: () => apiClient.get<CartItem[]>('/cart'),
  addToCart: (productId: number, quantity: number = 1) =>
    apiClient.post('/cart', { productId, quantity }),
  updateCartItem: (productId: number, quantity: number) =>
    apiClient.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId: number) => apiClient.delete(`/cart/${productId}`),
  clearCart: () => apiClient.delete('/cart'),
};

// API для авторизации
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<{ token: string; user: User }>('/auth/login', credentials),
  register: (data: RegisterData) =>
    apiClient.post<{ token: string; user: User }>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get<User>('/auth/me'),
};

export default apiClient;