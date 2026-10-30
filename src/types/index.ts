export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  costPrice: number;
  discountPrice?: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  featured: boolean;
  bestSeller: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  images: string; // JSON string of string[]
  tags?: string | null;
  specs?: string | null;
  careInfo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // productId
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
  sku: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerId?: string | null;
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  district: string;
  area: string;
  deliveryNote?: string | null;
  socialUsername?: string | null;
  deliveryCharge: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'DUE' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_TO_SHIP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName?: string;
  stockIn: number;
  stockOut: number;
  remainingStock: number;
  reason: string;
  reference?: string | null;
  adminName: string;
  createdAt: string;
  product?: Product;
}

export interface SalesRecord {
  id: string;
  date: string;
  type: 'SALE' | 'RETURN' | 'ADJUSTMENT';
  categoryName: string;
  productId?: string | null;
  productName: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  total: number;
  profit: number;
  paymentMethod: string;
  customerName: string;
  notes?: string | null;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'PACKAGING' | 'DELIVERY' | 'MARKETING' | 'RAW_MATERIALS' | 'PRODUCT_PURCHASE' | 'PLATFORM' | 'OTHER';
  description: string;
  amount: number;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  district: string;
  area?: string | null;
  totalOrders: number;
  totalSpent: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product?: {
    name: string;
  };
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  address: string;
  inside_dhaka_delivery: string;
  outside_dhaka_delivery: string;
  diu_free_delivery: string;
  low_stock_threshold: string;
  currency_symbol: string;
  order_prefix: string;
}
