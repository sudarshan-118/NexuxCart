export type Category = 'Electronics' | 'Clothing' | 'Home & Garden' | 'Sports' | 'Books';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  imageUrl: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'low_stock' | 'new_arrival' | 'order_update';
  read: boolean;
  createdAt: string;
}
