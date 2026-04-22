'use server';

import { mockDb } from './db';
import { Order, Product, Review } from './types';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
  return mockDb.products;
}

export async function getProduct(id: string) {
  return mockDb.products.find((p) => p.id === id);
}

export async function getReviews(productId: string) {
  return mockDb.reviews.filter((r) => r.productId === productId);
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>) {
  const newReview: Review = {
    ...review,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  mockDb.reviews.push(newReview);
  revalidatePath(`/product/${review.productId}`);
  return newReview;
}

export async function checkout(userId: string, cartItems: { product: Product; quantity: number }[]) {
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order: Order = {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  mockDb.orders.push(order);
  
  for (const item of cartItems) {
    const p = mockDb.products.find((p) => p.id === item.product.id);
    if (p) {
      p.stock -= item.quantity;
      if (p.stock <= 5) {
        mockDb.notifications.push({
          id: Math.random().toString(36).substring(2, 9),
          userId: 'admin',
          message: `Low stock alert for ${p.name}. Only ${p.stock} left!`,
          type: 'low_stock',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  }
  
  revalidatePath('/profile');
  revalidatePath('/admin/orders');
  return order;
}

export async function getOrders(userId?: string) {
  if (userId) {
    return mockDb.orders.filter((o) => o.userId === userId);
  }
  return mockDb.orders;
}

// Admin Actions
export async function addProduct(p: Omit<Product, 'id' | 'createdAt'>) {
  const newProd = {
    ...p,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  mockDb.products.push(newProd);
  revalidatePath('/admin/products');
  revalidatePath('/products');
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const idx = mockDb.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockDb.products[idx] = { ...mockDb.products[idx], ...updates };
    revalidatePath('/admin/products');
    revalidatePath('/products');
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const order = mockDb.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    mockDb.notifications.push({
        id: Math.random().toString(36).substring(2, 9),
        userId: order.userId,
        message: `Your order #${order.id} is now ${status}.`,
        type: 'order_update',
        read: false,
        createdAt: new Date().toISOString()
    });
    revalidatePath('/admin/orders');
    revalidatePath('/profile');
  }
}

export async function getNotifications(userId: string) {
  return mockDb.notifications.filter((n) => n.userId === userId || (n.userId === 'admin' && userId === 'u1'));
}

export async function getUsers() {
  return mockDb.users;
}
