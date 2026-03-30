import type { DefaultSession } from 'next-auth';

// Extend NextAuth session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  sku: string;
  brand?: string | null;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  status: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: ProductImage[];
  category: Category;
  tags: Tag[];
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number | null;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  options: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  giftNote?: string | null;
  product: ProductWithDetails;
  variant?: ProductVariant | null;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantName?: string | null;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  currency: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  giftMessage?: string | null;
  createdAt: Date;
  items: OrderItem[];
}

export interface Address {
  id: string;
  label?: string | null;
  firstName: string;
  lastName: string;
  company?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: {
    name?: string | null;
    avatar?: string | null;
  };
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'OVERNIGHT';
  giftMessage?: string;
  couponCode?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  averageOrderValue: number;
  aovChange: number;
  totalCustomers: number;
  customersChange: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}
