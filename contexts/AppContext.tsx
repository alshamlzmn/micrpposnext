import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, Theme, Product, Customer, Sale, Supplier, Settings, Category, CashboxTransaction } from '@/types/global';
import { db, dbOperations, hydrateDates } from '@/lib/database';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

interface AppContextType {
  // User & Auth
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => boolean;
  register: (userData: any) => boolean;
  logout: () => void;
  
  // Language & Localization
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  // Data
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  sales: Sale[];
  cashboxTransactions: CashboxTransaction[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addSale: (sale: Sale) => void;
  updateSale: (sale: Sale) => void;
  addCashboxTransaction: (transaction: CashboxTransaction) => void;
  updateCashboxTransaction: (transaction: CashboxTransaction) => void;
  deleteCashboxTransaction: (id: string) => void;
  getCashboxBalance: () => number;
  
  // Customer debt payment
  payCustomerDebt: (customerId: string, amount: number) => void;
  
  // Backup and Restore
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
  
  // Cart for POS
  cartItems: Array<{ product: Product; quantity: number }>;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const languages: { [key: string]: Language } = {
  en: { code: 'en', name: 'English', isRTL: false },
  ar: { code: 'ar', name: 'العربية', isRTL: true },
};

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    pos: 'POS',
    sales: 'Sales',
    inventory: 'Inventory',
    customers: 'Customers',
    suppliers: 'Suppliers',
    reports: 'Reports',
    settings: 'Settings',
    
    // Dashboard
    welcome: 'Welcome back',
    todaySales: "Today's Sales",
    totalRevenue: 'Total Revenue',
    productsInStock: 'Products in Stock',
    lowStockAlerts: 'Low Stock Alerts',
    quickActions: 'Quick Actions',
    newSale: 'New Sale',
    addProduct: 'Add Product',
    addCustomer: 'Add Customer',
    addSupplier: 'Add Supplier',
    viewReports: 'View Reports',
    manageInventory: 'Manage Inventory',
    invoices: 'Invoices',
    help: 'Help & Support',
    
    // POS
    scanBarcode: 'Scan Barcode',
    searchProducts: 'Search products...',
    addToCart: 'Add to Cart',
    checkout: 'Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    cash: 'Cash',
    card: 'Card',
    transfer: 'Transfer',
    
    // Products
    productName: 'Product Name',
    price: 'Price',
    cost: 'Cost',
    stock: 'Stock',
    minStock: 'Min Stock',
    category: 'Category',
    barcode: 'Barcode',
    description: 'Description',
    taxRate: 'Tax Rate',
    
    // Customers
    customerName: 'Customer Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    totalPurchases: 'Total Purchases',
    
    // Suppliers
    supplierName: 'Supplier Name',
    totalOrders: 'Total Orders',
    
    // Settings
    generalSettings: 'General Settings',
    businessInfo: 'Business Information',
    businessName: 'Business Name',
    businessAddress: 'Business Address',
    businessPhone: 'Business Phone',
    businessEmail: 'Business Email',
    currency: 'Currency',
    defaultTaxRate: 'Default Tax Rate',
    receiptSettings: 'Receipt Settings',
    receiptFooter: 'Receipt Footer',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    date: 'Date',
    amount: 'Amount',
    quantity: 'Quantity',
    customer: 'Customer',
    supplier: 'Supplier',
    payment: 'Payment',
    status: 'Status',
    name: 'Name',
    actions: 'Actions',
    view: 'View',
    print: 'Print',
    return: 'Return',
    close: 'Close',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    pos: 'نقطة البيع',
    sales: 'المبيعات',
    inventory: 'المخزون',
    customers: 'العملاء',
    suppliers: 'الموردين',
    reports: 'التقارير',
    settings: 'الإعدادات',
    
    // Dashboard
    welcome: 'أهلاً بعودتك',
    todaySales: 'مبيعات اليوم',
    totalRevenue: 'إجمالي الإيرادات',
    productsInStock: 'المنتجات في المخزون',
    lowStockAlerts: 'تنبيهات انخفاض المخزون',
    quickActions: 'إجراءات سريعة',
    newSale: 'عملية بيع جديدة',
    addProduct: 'إضافة منتج',
    addCustomer: 'إضافة عميل',
    addSupplier: 'إضافة مورد',
    viewReports: 'عرض التقارير',
    manageInventory: 'إدارة المخزون',
    invoices: 'الفواتير',
    help: 'المساعدة والدعم',
    
    // POS
    scanBarcode: 'مسح الباركود',
    searchProducts: 'البحث عن المنتجات...',
    addToCart: 'إضافة للسلة',
    checkout: 'الدفع',
    total: 'المجموع',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    tax: 'الضريبة',
    cash: 'نقدي',
    card: 'كارت',
    transfer: 'تحويل',
    
    // Products
    productName: 'اسم المنتج',
    price: 'السعر',
    cost: 'التكلفة',
    stock: 'المخزون',
    minStock: 'الحد الأدنى للمخزون',
    category: 'الفئة',
    barcode: 'الباركود',
    description: 'الوصف',
    taxRate: 'معدل الضريبة',
    
    // Customers
    customerName: 'اسم العميل',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    totalPurchases: 'إجمالي المشتريات',
    
    // Suppliers
    supplierName: 'اسم المورد',
    totalOrders: 'إجمالي الطلبات',
    
    // Settings
    generalSettings: 'الإعدادات العامة',
    businessInfo: 'معلومات الشركة',
    businessName: 'اسم الشركة',
    businessAddress: 'عنوان الشركة',
    businessPhone: 'هاتف الشركة',
    businessEmail: 'بريد الشركة الإلكتروني',
    currency: 'العملة',
    defaultTaxRate: 'معدل الضريبة الافتراضي',
    receiptSettings: 'إعدادات الفاتورة',
    receiptFooter: 'تذييل الفاتورة',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    date: 'التاريخ',
    amount: 'المبلغ',
    quantity: 'الكمية',
    customer: 'العميل',
    supplier: 'المورد',
    payment: 'الدفع',
    status: 'الحالة',
    name: 'الاسم',
    actions: 'الإجراءات',
    view: 'عرض',
    print: 'طباعة',
    return: 'إرجاع',
    close: 'إغلاق',
  },
};

// Mock categories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food',
    nameAr: 'طعام',
    description: 'Food items',
    descriptionAr: 'المواد الغذائية',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Beverages',
    nameAr: 'مشروبات',
    description: 'Drinks and beverages',
    descriptionAr: 'المشروبات والعصائر',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Electronics',
    nameAr: 'إلكترونيات',
    description: 'Electronic devices',
    descriptionAr: 'الأجهزة الإلكترونية',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Clothing',
    nameAr: 'ملابس',
    description: 'Clothing and accessories',
    descriptionAr: 'الملابس والإكسسوارات',
    createdAt: new Date('2024-01-01'),
  },
];

// Mock data with Arabic products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pizza Vegetables',
    nameAr: 'بيتزا خضار',
    barcode: '240319010929',
    price: 15.0,
    cost: 10.0,
    stock: 10,
    minStock: 5,
    categoryId: '1',
    category: 'Food',
    categoryAr: 'طعام',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
  },
  {
    id: '2',
    name: 'Pure Honey',
    nameAr: 'عسل صافي',
    barcode: '333',
    price: 10.0,
    cost: 7.0,
    stock: 15,
    minStock: 5,
    categoryId: '1',
    category: 'Food',
    categoryAr: 'طعام',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
  },
  {
    id: '3',
    name: 'Olives',
    nameAr: 'زيتون',
    barcode: '1',
    price: 3.0,
    cost: 2.0,
    stock: 3,
    minStock: 5,
    categoryId: '1',
    category: 'Food',
    categoryAr: 'طعام',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/1649772/pexels-photo-1649772.jpeg',
  },
  {
    id: '4',
    name: 'Orange Juice',
    nameAr: 'عصير برتقال',
    barcode: '123456789',
    price: 5.0,
    cost: 3.0,
    stock: 20,
    minStock: 5,
    categoryId: '2',
    category: 'Beverages',
    categoryAr: 'مشروبات',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
  },
  {
    id: '5',
    name: 'Smartphone',
    nameAr: 'هاتف ذكي',
    barcode: '987654321',
    price: 500.0,
    cost: 350.0,
    stock: 8,
    minStock: 3,
    categoryId: '3',
    category: 'Electronics',
    categoryAr: 'إلكترونيات',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
  },
  {
    id: '6',
    name: 'T-Shirt',
    nameAr: 'تيشيرت',
    barcode: '456789123',
    price: 25.0,
    cost: 15.0,
    stock: 12,
    minStock: 5,
    categoryId: '4',
    category: 'Clothing',
    categoryAr: 'ملابس',
    taxRate: 15,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
  },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmad Ali',
    nameAr: 'أحمد علي',
    phone: '+966501234567',
    email: 'ahmad@example.com',
    totalPurchases: 15000,
    openingBalance: 0,
    currentBalance: 2500,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sara Mohammed',
    nameAr: 'سارة محمد',
    phone: '+966507654321',
    totalPurchases: 10000,
    openingBalance: 0,
    currentBalance: 1200,
    createdAt: new Date('2024-02-10'),
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Distributors',
    nameAr: 'موزعو التقنية',
    phone: '+966112345678',
    email: 'sales@techdist.com',
    totalOrders: 25000,
    openingBalance: 0,
    currentBalance: 0,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '2',
    name: 'Electronics Wholesale',
    nameAr: 'تجارة الإلكترونيات',
    phone: '+966112345679',
    email: 'orders@elecwholesale.com',
    totalOrders: 18500,
    openingBalance: 0,
    currentBalance: 0,
    createdAt: new Date('2024-01-05'),
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@micropos.com',
    role: 'admin',
  });
  const [language, setLanguage] = useState<Language>(languages.ar);
  const [theme, setTheme] = useState<Theme>({
    isDark: false,
    colors: {
      primary: '#5865F2',
      secondary: '#10B981',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  });
  
  const [settings, setSettings] = useState<Settings>({
    taxRate: 15,
    currency: 'SAR',
    currencySymbol: 'ريال',
    businessName: 'MicroPOS Store',
    businessNameAr: 'متجر مايكرو بوس',
    businessAddress: '123 Main Street, Riyadh',
    businessAddressAr: '123 الشارع الرئيسي، الرياض',
    businessPhone: '+966112345678',
    businessEmail: 'info@micropos.com',
    businessWebsite: 'https://micropos.com',
    receiptFooter: 'Thank you for your business!',
    receiptFooterAr: 'شكراً لتعاملكم معنا!',
    invoicePrefix: 'INV',
    nextInvoiceNumber: 1001,
    autoAddSalesToCashbox: true,
    autoDeductPurchasesFromCashbox: true,
    autoDeductExpensesFromCashbox: true,
  });
  
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cashboxTransactions, setCashboxTransactions] = useState<CashboxTransaction[]>([]);
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Initialize database and load data
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Initialize database with default data if empty
        await dbOperations.initializeWithDefaults();
        
        // Load all data from database
        const [
          dbCategories,
          dbProducts,
          dbCustomers,
          dbSuppliers,
          dbSales,
          dbCashboxTransactions,
          dbSettings,
        ] = await Promise.all([
          dbOperations.getAllCategories(),
          dbOperations.getAllProducts(),
          dbOperations.getAllCustomers(),
          dbOperations.getAllSuppliers(),
          dbOperations.getAllSales(),
          dbOperations.getAllCashboxTransactions(),
          dbOperations.getSettings(),
        ]);
        
        // Update state with loaded data
        setCategories(dbCategories);
        setProducts(dbProducts);
        setCustomers(dbCustomers);
        setSuppliers(dbSuppliers);
        setSales(dbSales);
        setCashboxTransactions(dbCashboxTransactions);
        
        if (dbSettings) {
          setSettings(dbSettings);
        }
        
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initializeDatabase();
  }, []);

  const t = (key: string): string => {
    return translations[language.code]?.[key] || key;
  };

  const login = (email: string, password: string): boolean => {
    // Simple demo authentication
    if (email === 'admin@micropos.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@micropos.com',
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const register = (userData: any): boolean => {
    // Simple demo registration
    setUser({
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'admin',
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    router.replace('/auth');
  };

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      isDark: !prev.isDark,
      colors: prev.isDark ? {
        primary: '#5865F2',
        secondary: '#10B981',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      } : {
        primary: '#3B82F6',
        secondary: '#34D399',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: '#334155',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
      },
    }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    dbOperations.updateSettings(updatedSettings);
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
    dbOperations.addCategory(category);
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    dbOperations.updateCategory(category);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    dbOperations.deleteCategory(id);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    dbOperations.addProduct(product);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    dbOperations.updateProduct(product);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    dbOperations.deleteProduct(id);
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
    dbOperations.addCustomer(customer);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    dbOperations.updateCustomer(customer);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    dbOperations.deleteCustomer(id);
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
    dbOperations.addSupplier(supplier);
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
    dbOperations.updateSupplier(supplier);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    dbOperations.deleteSupplier(id);
  };

  const addSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    dbOperations.addSale(sale);
    
    // Update product stock
    sale.items.forEach(item => {
      setProducts(prev => prev.map(product => 
        product.id === item.productId 
          ? { ...product, stock: product.stock - item.quantity }
          : product
      ));
    });

    // Update customer balance if customer selected and there's remaining amount
    if (sale.customerId && sale.paymentMethod === 'credit') {
      // For credit sales, add the full amount to customer debt
      setCustomers(prev => prev.map(customer =>
        customer.id === sale.customerId
          ? { 
              ...customer, 
              currentBalance: customer.currentBalance + sale.total,
              totalPurchases: customer.totalPurchases + sale.total
            }
          : customer
      ));
    } else if (sale.customerId && sale.remainingAmount > 0) {
      // For partial payments, add remaining amount to debt
      setCustomers(prev => prev.map(customer =>
        customer.id === sale.customerId
          ? { 
              ...customer, 
              currentBalance: customer.currentBalance + sale.remainingAmount,
              totalPurchases: customer.totalPurchases + sale.total
            }
          : customer
      ));
    } else if (sale.customerId && sale.remainingAmount === 0) {
      // Update total purchases even if fully paid
      setCustomers(prev => prev.map(customer =>
        customer.id === sale.customerId
          ? { ...customer, totalPurchases: customer.totalPurchases + sale.total }
          : customer
      ));
    }

    // Add cashbox transaction for the paid amount if auto-add is enabled
    if (sale.paidAmount > 0 && settings.autoAddSalesToCashbox) {
      const cashboxTransaction: CashboxTransaction = {
        id: Date.now().toString(),
        type: 'add',
        amount: Math.min(sale.paidAmount, sale.total),
        description: `Sale payment - Invoice ${sale.invoiceNumber}`,
        descriptionAr: `دفعة مبيعات - فاتورة ${sale.invoiceNumber}`,
        date: new Date(),
        isActive: true,
        source: 'sale',
        referenceId: sale.id,
      };
      addCashboxTransaction(cashboxTransaction);
    }

    // Update settings for next invoice number
    setSettings(prev => ({ ...prev, nextInvoiceNumber: prev.nextInvoiceNumber + 1 }));
    updateSettings({ nextInvoiceNumber: settings.nextInvoiceNumber + 1 });
  };

  const updateSale = (sale: Sale) => {
    setSales(prev => prev.map(s => s.id === sale.id ? sale : s));
    dbOperations.updateSale(sale);
  };

  const handleReturnSale = (sale: Sale) => {
    // Update sale status to returned
    setSales(prev => prev.map(s => s.id === sale.id ? { ...s, status: 'returned' as const } : s));
    
    // Return products to stock
    sale.items.forEach(item => {
      setProducts(prev => prev.map(product => 
        product.id === item.productId 
          ? { ...product, stock: product.stock + item.quantity }
          : product
      ));
    });

    // Update customer balance if applicable
    if (sale.customerId && sale.customer) {
      setCustomers(prev => prev.map(customer =>
        customer.id === sale.customerId
          ? { 
              ...customer, 
              currentBalance: Math.max(0, customer.currentBalance - sale.remainingAmount),
              totalPurchases: Math.max(0, customer.totalPurchases - sale.total)
            }
          : customer
      ));
    }

    // Add cashbox transaction for returned amount
    if (sale.paidAmount > 0) {
      const cashboxTransaction: CashboxTransaction = {
        id: Date.now().toString(),
        type: 'subtract',
        amount: sale.paidAmount,
        description: `Sale return - Invoice ${sale.invoiceNumber}`,
        descriptionAr: `إرجاع مبيعات - فاتورة ${sale.invoiceNumber}`,
        date: new Date(),
        isActive: true,
        source: 'sale',
        referenceId: sale.id,
      };
      addCashboxTransaction(cashboxTransaction);
    }
  };

  const addCashboxTransaction = (transaction: CashboxTransaction) => {
    setCashboxTransactions(prev => [transaction, ...prev]);
    dbOperations.addCashboxTransaction(transaction);
  };

  const updateCashboxTransaction = (transaction: CashboxTransaction) => {
    setCashboxTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    dbOperations.updateCashboxTransaction(transaction);
  };

  const deleteCashboxTransaction = (id: string) => {
    setCashboxTransactions(prev => prev.filter(t => t.id !== id));
    dbOperations.deleteCashboxTransaction(id);
  };

  const getCashboxBalance = (): number => {
    return cashboxTransactions
      .filter(t => t.isActive)
      .reduce((balance, transaction) => {
        return transaction.type === 'add' 
          ? balance + transaction.amount 
          : balance - transaction.amount;
      }, 0);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedCustomer(null);
  };

  const payCustomerDebt = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const newBalance = Math.max(0, customer.currentBalance - amount);
        return { ...customer, currentBalance: newBalance };
      }
      return customer;
    }));

    // Add cashbox transaction for the payment
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      addCashboxTransaction({
        id: Date.now().toString(),
        type: 'add',
        amount,
        description: `Customer debt payment - ${customer.name}`,
        descriptionAr: `سداد ذمة عميل - ${customer.nameAr}`,
        date: new Date(),
        isActive: true,
        source: 'customer',
        referenceId: customerId,
      });
    }
  };

  const exportData = async () => {
    try {
      const jsonData = await dbOperations.exportAllData();
      const fileName = `micropos-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      if (Platform.OS === 'web') {
        // For web, create a downloadable file
        const element = document.createElement('a');
        const file = new Blob([jsonData], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        // For mobile, save to device and share
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, jsonData);
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('فشل في تصدير البيانات');
    }
  };

  const importData = async () => {
    try {
      let jsonData: string;
      
      if (Platform.OS === 'web') {
        // For web, use file input
        return new Promise<void>((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = async (e: any) => {
            try {
              const file = e.target.files[0];
              if (!file) {
                reject(new Error('لم يتم اختيار ملف'));
                return;
              }
              
              const reader = new FileReader();
              reader.onload = async (event: any) => {
                try {
                  jsonData = event.target.result;
                  await dbOperations.importAllData(jsonData);
                  
                  // Reload data from database
                  const [
                    dbCategories,
                    dbProducts,
                    dbCustomers,
                    dbSuppliers,
                    dbSales,
                    dbCashboxTransactions,
                    dbSettings,
                  ] = await Promise.all([
                    dbOperations.getAllCategories(),
                    dbOperations.getAllProducts(),
                    dbOperations.getAllCustomers(),
                    dbOperations.getAllSuppliers(),
                    dbOperations.getAllSales(),
                    dbOperations.getAllCashboxTransactions(),
                    dbOperations.getSettings(),
                  ]);
                  
                  setCategories(dbCategories);
                  setProducts(dbProducts);
                  setCustomers(dbCustomers);
                  setSuppliers(dbSuppliers);
                  setSales(dbSales);
                  setCashboxTransactions(dbCashboxTransactions);
                  
                  if (dbSettings) {
                    setSettings(dbSettings);
                  }
                  
                  resolve();
                } catch (error) {
                  reject(error);
                }
              };
              reader.readAsText(file);
            } catch (error) {
              reject(error);
            }
          };
          input.click();
        });
      } else {
        // For mobile, use DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true,
        });
        
        if (result.canceled || !result.assets[0]) {
          throw new Error('لم يتم اختيار ملف');
        }
        
        jsonData = await FileSystem.readAsStringAsync(result.assets[0].uri);
        await dbOperations.importAllData(jsonData);
        
        // Reload data from database
        const [
          dbCategories,
          dbProducts,
          dbCustomers,
          dbSuppliers,
          dbSales,
          dbCashboxTransactions,
          dbSettings,
        ] = await Promise.all([
          dbOperations.getAllCategories(),
          dbOperations.getAllProducts(),
          dbOperations.getAllCustomers(),
          dbOperations.getAllSuppliers(),
          dbOperations.getAllSales(),
          dbOperations.getAllCashboxTransactions(),
          dbOperations.getSettings(),
        ]);
        
        setCategories(dbCategories);
        setProducts(dbProducts);
        setCustomers(dbCustomers);
        setSuppliers(dbSuppliers);
        setSales(dbSales);
        setCashboxTransactions(dbCashboxTransactions);
        
        if (dbSettings) {
          setSettings(dbSettings);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error(error instanceof Error ? error.message : 'فشل في استيراد البيانات');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        settings,
        updateSettings,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        customers,
        suppliers,
        sales,
        cashboxTransactions,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addSale,
        updateSale,
        addCashboxTransaction,
        updateCashboxTransaction,
        deleteCashboxTransaction,
        getCashboxBalance,
        cartItems,
        selectedCustomer,
        setSelectedCustomer,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        payCustomerDebt,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}