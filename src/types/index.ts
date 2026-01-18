export interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  size: string;
  type: string;
  barcode: string;
  quantity: number;
  imageUrl?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface PurchaseRequest {
  productId: number;
  quantity: number;
}

export interface RestockRequest {
  productId: number;
  quantity: number;
}