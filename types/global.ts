export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'accountant';
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  barcode: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  categoryId: string;
  category: string;
  categoryAr: string;
  image?: string;
  description?: string;
  descriptionAr?: string;
  taxRate?: number;
}

export interface Customer {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  email?: string;
  address?: string;
  addressAr?: string;
  totalPurchases: number;
  openingBalance: number;
  currentBalance: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  nameAr: string;
  phone: string;
  email?: string;
  address?: string;
  addressAr?: string;
  totalOrders: number;
  openingBalance: number;
  currentBalance: number;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerId?: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  cashierId: string;
  cashier: User;
  status: 'completed' | 'pending' | 'cancelled' | 'returned';
  notes?: string;
}

export interface CashboxTransaction {
  id: string;
  type: 'add' | 'subtract';
  amount: number;
  description: string;
  descriptionAr: string;
  date: Date;
  isActive: boolean;
  source: 'manual' | 'sale' | 'purchase' | 'expense' | 'customer' | 'supplier';
  referenceId?: string;
}

export interface Language {
  code: 'en' | 'ar';
  name: string;
  isRTL: boolean;
}

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export interface Settings {
  taxRate: number;
  currency: string;
  currencySymbol: string;
  businessName: string;
  businessNameAr: string;
  businessAddress: string;
  businessAddressAr: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  receiptFooter: string;
  receiptFooterAr: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  vatNumber: string;
  crNumber: string;
  autoAddSalesToCashbox: boolean;
  autoDeductPurchasesFromCashbox: boolean;
  autoDeductExpensesFromCashbox: boolean;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  date: Date;
  supplierId: string;
  supplier: Supplier;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  product: Product;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Expense {
  id: string;
  date: Date;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending';
  notes?: string;
}

export interface Inquiry {
  id: string;
  type: 'product' | 'customer' | 'supplier' | 'sale' | 'purchase' | 'expense';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  filters: any;
  results: any[];
  createdAt: Date;
}