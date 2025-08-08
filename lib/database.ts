import Dexie, { Table } from 'dexie';
import { Product, Customer, Supplier, Sale, Category, CashboxTransaction, Settings, User } from '@/types/global';

export interface DatabaseSchema {
  products: Product;
  customers: Customer;
  suppliers: Supplier;
  sales: Sale;
  categories: Category;
  cashboxTransactions: CashboxTransaction;
  settings: Settings & { id: string };
  users: User;
}

export class MicroPOSDatabase extends Dexie {
  products!: Table<Product>;
  customers!: Table<Customer>;
  suppliers!: Table<Supplier>;
  sales!: Table<Sale>;
  categories!: Table<Category>;
  cashboxTransactions!: Table<CashboxTransaction>;
  settings!: Table<Settings & { id: string }>;
  users!: Table<User>;

  constructor() {
    super('MicroPOSDatabase');
    
    this.version(1).stores({
      products: 'id, name, nameAr, barcode, categoryId, price, stock',
      customers: 'id, name, nameAr, phone, email, currentBalance',
      suppliers: 'id, name, nameAr, phone, email, currentBalance',
      sales: 'id, invoiceNumber, date, customerId, total, status',
      categories: 'id, name, nameAr',
      cashboxTransactions: 'id, type, date, amount, source, isActive',
      settings: 'id',
      users: 'id, email, role',
    });
  }
}

export const db = new MicroPOSDatabase();

// Helper function to convert date strings back to Date objects
export function hydrateDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // Check if string looks like an ISO date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(hydrateDates);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = hydrateDates(obj[key]);
    }
    return result;
  }
  
  return obj;
}

// Database operations
export const dbOperations = {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.products.toArray();
  },
  
  async addProduct(product: Product): Promise<void> {
    await db.products.add(product);
  },
  
  async updateProduct(product: Product): Promise<void> {
    await db.products.put(product);
  },
  
  async deleteProduct(id: string): Promise<void> {
    await db.products.delete(id);
  },

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.categories.toArray();
  },
  
  async addCategory(category: Category): Promise<void> {
    await db.categories.add(category);
  },
  
  async updateCategory(category: Category): Promise<void> {
    await db.categories.put(category);
  },
  
  async deleteCategory(id: string): Promise<void> {
    await db.categories.delete(id);
  },

  // Customers
  async getAllCustomers(): Promise<Customer[]> {
    return await db.customers.toArray();
  },
  
  async addCustomer(customer: Customer): Promise<void> {
    await db.customers.add(customer);
  },
  
  async updateCustomer(customer: Customer): Promise<void> {
    await db.customers.put(customer);
  },
  
  async deleteCustomer(id: string): Promise<void> {
    await db.customers.delete(id);
  },

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.suppliers.toArray();
  },
  
  async addSupplier(supplier: Supplier): Promise<void> {
    await db.suppliers.add(supplier);
  },
  
  async updateSupplier(supplier: Supplier): Promise<void> {
    await db.suppliers.put(supplier);
  },
  
  async deleteSupplier(id: string): Promise<void> {
    await db.suppliers.delete(id);
  },

  // Sales
  async getAllSales(): Promise<Sale[]> {
    return await db.sales.toArray();
  },
  
  async addSale(sale: Sale): Promise<void> {
    await db.sales.add(sale);
  },
  
  async updateSale(sale: Sale): Promise<void> {
    await db.sales.put(sale);
  },

  // Cashbox Transactions
  async getAllCashboxTransactions(): Promise<CashboxTransaction[]> {
    return await db.cashboxTransactions.toArray();
  },
  
  async addCashboxTransaction(transaction: CashboxTransaction): Promise<void> {
    await db.cashboxTransactions.add(transaction);
  },
  
  async updateCashboxTransaction(transaction: CashboxTransaction): Promise<void> {
    await db.cashboxTransactions.put(transaction);
  },
  
  async deleteCashboxTransaction(id: string): Promise<void> {
    await db.cashboxTransactions.delete(id);
  },

  // Settings
  async getSettings(): Promise<Settings | null> {
    const result = await db.settings.get('main');
    return result ? { ...result } : null;
  },
  
  async updateSettings(settings: Settings): Promise<void> {
    await db.settings.put({ ...settings, id: 'main' });
  },

  // Users
  async getAllUsers(): Promise<User[]> {
    return await db.users.toArray();
  },
  
  async addUser(user: User): Promise<void> {
    await db.users.add(user);
  },
  
  async updateUser(user: User): Promise<void> {
    await db.users.put(user);
  },

  // Backup and Restore
  async exportAllData(): Promise<string> {
    const data = {
      products: await db.products.toArray(),
      customers: await db.customers.toArray(),
      suppliers: await db.suppliers.toArray(),
      sales: await db.sales.toArray(),
      categories: await db.categories.toArray(),
      cashboxTransactions: await db.cashboxTransactions.toArray(),
      settings: await db.settings.toArray(),
      users: await db.users.toArray(),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  async importAllData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.products || !data.categories || !data.settings) {
        throw new Error('Invalid backup file format');
      }
      
      // Hydrate dates
      const hydratedData = hydrateDates(data);
      
      // Clear existing data
      await db.transaction('rw', db.products, db.customers, db.suppliers, db.sales, 
        db.categories, db.cashboxTransactions, db.settings, db.users, async () => {
        
        await db.products.clear();
        await db.customers.clear();
        await db.suppliers.clear();
        await db.sales.clear();
        await db.categories.clear();
        await db.cashboxTransactions.clear();
        await db.settings.clear();
        await db.users.clear();
        
        // Import new data
        if (hydratedData.products?.length) await db.products.bulkAdd(hydratedData.products);
        if (hydratedData.customers?.length) await db.customers.bulkAdd(hydratedData.customers);
        if (hydratedData.suppliers?.length) await db.suppliers.bulkAdd(hydratedData.suppliers);
        if (hydratedData.sales?.length) await db.sales.bulkAdd(hydratedData.sales);
        if (hydratedData.categories?.length) await db.categories.bulkAdd(hydratedData.categories);
        if (hydratedData.cashboxTransactions?.length) await db.cashboxTransactions.bulkAdd(hydratedData.cashboxTransactions);
        if (hydratedData.settings?.length) await db.settings.bulkAdd(hydratedData.settings);
        if (hydratedData.users?.length) await db.users.bulkAdd(hydratedData.users);
      });
      
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import backup data');
    }
  },

  // Initialize database with default data
  async initializeWithDefaults(): Promise<void> {
    const existingCategories = await db.categories.count();
    
    if (existingCategories === 0) {
      // Add default categories
      const defaultCategories: Category[] = [
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

      const defaultProducts: Product[] = [
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

      const defaultCustomers: Customer[] = [
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

      const defaultSuppliers: Supplier[] = [
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

      const defaultSettings: Settings & { id: string } = {
        id: 'main',
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
      };

      const defaultUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@micropos.com',
        role: 'admin',
      };

      // Add all default data
      await db.transaction('rw', db.categories, db.products, db.customers, db.suppliers, db.settings, db.users, async () => {
        await db.categories.bulkAdd(defaultCategories);
        await db.products.bulkAdd(defaultProducts);
        await db.customers.bulkAdd(defaultCustomers);
        await db.suppliers.bulkAdd(defaultSuppliers);
        await db.settings.add(defaultSettings);
        await db.users.add(defaultUser);
      });
    }
  },
};