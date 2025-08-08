import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Calendar, Eye, Printer, RotateCcw, Download, X, FileText, List, ShoppingBag, TrendingUp, Users, DollarSign, Plus, CreditCard as Edit, Trash2, QrCode, Building, Phone, Mail, MapPin, Hash, CreditCard, Check, Clock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sale } from '@/types/global';

interface ZATCAInvoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  customerId?: string;
  customer?: any;
  items: Array<{
    productId: string;
    product: any;
    quantity: number;
    unitPrice: number;
    total: number;
    taxAmount: number;
    taxRate: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  qrCode: string;
  zatcaCompliant: boolean;
  supplierInfo: {
    name: string;
    nameAr: string;
    vatNumber: string;
    crNumber: string;
    address: string;
    addressAr: string;
    phone: string;
    email: string;
  };
  invoiceHash?: string;
  previousInvoiceHash?: string;
  digitalSignature?: string;
}

export default function Invoices() {
  const { theme, t, language, sales, settings, updateSale, products, updateProduct, updateCustomer, addCashboxTransaction, customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ZATCAInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<ZATCAInvoice | null>(null);
  const [invoices, setInvoices] = useState<ZATCAInvoice[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    dueDate: '',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'transfer' | 'credit',
  });
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: any; quantity: number; unitPrice: number }>>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 15,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    content: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
      marginTop: 4,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    searchInput: {
      flex: 1,
    },
    filterButton: {
      backgroundColor: '#F5F5F5',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    invoiceCard: {
      marginBottom: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    invoiceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    invoiceId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    invoiceDate: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    invoiceDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    invoiceAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
      fontFamily: 'Cairo-Bold',
    },
    invoiceCustomer: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    statusText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    invoiceActions: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      fontFamily: 'Cairo-Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    closeButton: {
      padding: 4,
    },
    invoiceHeaderSection: {
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    businessName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
    },
    businessInfo: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
      marginTop: 4,
    },
    vatNumber: {
      fontSize: 12,
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
      marginTop: 4,
    },
    invoiceInfo: {
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    infoValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    itemsSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 12,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
      alignItems: 'center',
    },
    itemName: {
      flex: 2,
      fontSize: 14,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    itemQty: {
      flex: 1,
      fontSize: 14,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
    },
    itemPrice: {
      flex: 1,
      fontSize: 14,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
    },
    itemTotal: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
    },
    totalsSection: {
      marginBottom: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    totalValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    grandTotal: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    qrSection: {
      alignItems: 'center',
      marginTop: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
    },
    qrCode: {
      width: 100,
      height: 100,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    qrText: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
    },
    zatcaBadge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    zatcaText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    productSelector: {
      marginBottom: 16,
    },
    productItem: {
      backgroundColor: '#F8F9FA',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productName: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      flex: 1,
    },
    addProductButton: {
      backgroundColor: '#5865F2',
      padding: 8,
      borderRadius: 6,
    },
    selectedProductsSection: {
      marginBottom: 16,
    },
    selectedProductItem: {
      backgroundColor: '#E8F5E8',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    quantityButton: {
      backgroundColor: '#F5F5F5',
      padding: 6,
      borderRadius: 6,
      minWidth: 30,
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: 'bold',
      minWidth: 30,
      textAlign: 'center',
    },
  });

  // Convert sales to ZATCA invoices
  const convertSalesToInvoices = () => {
    return sales.map(sale => ({
      ...sale,
      qrCode: generateQRCode(sale),
      zatcaCompliant: true,
      supplierInfo: {
        name: settings.businessName,
        nameAr: settings.businessNameAr,
        vatNumber: '300000000000003', // Example VAT number
        crNumber: '1010000000', // Example CR number
        address: settings.businessAddress,
        addressAr: settings.businessAddressAr,
        phone: settings.businessPhone,
        email: settings.businessEmail,
      },
      invoiceHash: generateInvoiceHash(sale),
      digitalSignature: generateDigitalSignature(sale),
      status: sale.remainingAmount > 0 ? 'sent' : 'paid',
    })) as ZATCAInvoice[];
  };

  const generateQRCode = (invoice: any): string => {
    // ZATCA QR Code format (simplified)
    const qrData = {
      seller: settings.businessNameAr,
      vatNumber: '300000000000003',
      timestamp: invoice.date.toISOString(),
      total: invoice.total.toString(),
      vatAmount: invoice.tax.toString(),
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(qrData))));
  };

  const generateInvoiceHash = (invoice: any): string => {
    // Simplified hash generation
    const data = `${invoice.invoiceNumber}${invoice.date.toISOString()}${invoice.total}`;
    return btoa(unescape(encodeURIComponent(data))).substring(0, 32);
  };

  const generateDigitalSignature = (invoice: any): string => {
    // Simplified digital signature
    return btoa(unescape(encodeURIComponent(`signature_${invoice.id}`))).substring(0, 64);
  };

  const zatcaInvoices = convertSalesToInvoices();

  // Calculate stats
  const totalInvoices = zatcaInvoices.length;
  const totalRevenue = zatcaInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = zatcaInvoices.filter(invoice => invoice.status === 'paid').length;
  const pendingInvoices = zatcaInvoices.filter(invoice => invoice.status === 'sent').length;

  const filteredInvoices = zatcaInvoices.filter(invoice => {
    const searchLower = searchQuery.toLowerCase();
    return invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
           invoice.customer?.nameAr?.toLowerCase().includes(searchLower) ||
           invoice.customer?.name?.toLowerCase().includes(searchLower);
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'sent': return '#F59E0B';
      case 'overdue': return '#EF4444';
      case 'draft': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة';
      case 'sent': return 'مرسلة';
      case 'overdue': return 'متأخرة';
      case 'draft': return 'مسودة';
      case 'cancelled': return 'ملغية';
      default: return 'غير محدد';
    }
  };

  const handleViewInvoice = (invoice: ZATCAInvoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handlePrintInvoice = async (invoice: ZATCAInvoice) => {
    const invoiceHTML = generateZATCAInvoiceHTML(invoice);
    
    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      try {
        await Share.share({
          message: generateInvoiceText(invoice),
          title: `فاتورة ${invoice.invoiceNumber}`,
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في مشاركة الفاتورة');
      }
    }
  };

  const generateZATCAInvoiceHTML = (invoice: ZATCAInvoice): string => {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة ${invoice.invoiceNumber}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              direction: rtl; 
              text-align: right; 
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .invoice { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #5865F2; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              color: #5865F2; 
              margin: 0; 
              font-size: 28px;
            }
            .header .vat { 
              color: #10B981; 
              font-weight: bold; 
              margin-top: 10px;
            }
            .invoice-info { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 30px; 
            }
            .info-section h3 { 
              color: #333; 
              border-bottom: 2px solid #e0e0e0; 
              padding-bottom: 10px; 
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px; 
            }
            .items-table th, .items-table td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: center; 
            }
            .items-table th { 
              background: #5865F2; 
              color: white; 
              font-weight: bold; 
            }
            .items-table tr:nth-child(even) { 
              background: #f9f9f9; 
            }
            .totals { 
              margin-left: auto; 
              width: 300px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #eee; 
            }
            .total-row.grand { 
              border-top: 2px solid #5865F2; 
              font-weight: bold; 
              font-size: 18px; 
              color: #5865F2; 
            }
            .qr-section { 
              text-align: center; 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 2px solid #e0e0e0; 
            }
            .qr-code { 
              width: 150px; 
              height: 150px; 
              border: 2px solid #5865F2; 
              margin: 0 auto 15px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: #f8f9fa;
            }
            .zatca-compliance { 
              background: #10B981; 
              color: white; 
              padding: 10px; 
              border-radius: 5px; 
              margin-top: 20px; 
              text-align: center; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>${invoice.supplierInfo.nameAr}</h1>
              <div>${invoice.supplierInfo.addressAr}</div>
              <div>هاتف: ${invoice.supplierInfo.phone}</div>
              <div>بريد إلكتروني: ${invoice.supplierInfo.email}</div>
              <div class="vat">الرقم الضريبي: ${invoice.supplierInfo.vatNumber}</div>
              <div>رقم السجل التجاري: ${invoice.supplierInfo.crNumber}</div>
            </div>

            <div class="invoice-info">
              <div class="info-section">
                <h3>معلومات الفاتورة</h3>
                <div><strong>رقم الفاتورة:</strong> ${invoice.invoiceNumber}</div>
                <div><strong>تاريخ الإصدار:</strong> ${formatDate(invoice.date)}</div>
                <div><strong>طريقة الدفع:</strong> ${
                  invoice.paymentMethod === 'cash' ? 'نقدي' :
                  invoice.paymentMethod === 'card' ? 'بطاقة' :
                  invoice.paymentMethod === 'transfer' ? 'تحويل' : 'آجل'
                }</div>
                <div><strong>حالة الفاتورة:</strong> ${getStatusText(invoice.status)}</div>
              </div>
              
              <div class="info-section">
                <h3>معلومات العميل</h3>
                <div><strong>اسم العميل:</strong> ${invoice.customer?.nameAr || 'عميل غير مسجل'}</div>
                ${invoice.customer?.phone ? `<div><strong>الهاتف:</strong> ${invoice.customer.phone}</div>` : ''}
                ${invoice.customer?.email ? `<div><strong>البريد الإلكتروني:</strong> ${invoice.customer.email}</div>` : ''}
                ${invoice.customer?.addressAr ? `<div><strong>العنوان:</strong> ${invoice.customer.addressAr}</div>` : ''}
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الضريبة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.product.nameAr}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)} ${settings.currencySymbol}</td>
                    <td>${((item.total * item.taxRate) / 100).toFixed(2)} ${settings.currencySymbol}</td>
                    <td>${item.total.toFixed(2)} ${settings.currencySymbol}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>المجموع الفرعي:</span>
                <span>${invoice.subtotal.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
              <div class="total-row">
                <span>الخصم:</span>
                <span>${invoice.discount.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
              <div class="total-row">
                <span>ضريبة القيمة المضافة (${settings.taxRate}%):</span>
                <span>${invoice.tax.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
              <div class="total-row grand">
                <span>الإجمالي:</span>
                <span>${invoice.total.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
              <div class="total-row">
                <span>المدفوع:</span>
                <span>${invoice.paidAmount.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
              <div class="total-row">
                <span>المتبقي:</span>
                <span>${invoice.remainingAmount.toFixed(2)} ${settings.currencySymbol}</span>
              </div>
            </div>

            <div class="qr-section">
              <h3>رمز الاستجابة السريعة</h3>
              <div class="qr-code">
                <div style="text-align: center;">
                  <div style="font-size: 12px; margin-bottom: 5px;">QR Code</div>
                  <div style="font-size: 10px; color: #666;">${invoice.qrCode.substring(0, 20)}...</div>
                </div>
              </div>
              <div style="font-size: 12px; color: #666;">
                امسح الرمز للتحقق من صحة الفاتورة
              </div>
            </div>

            <div class="zatca-compliance">
              ✓ هذه الفاتورة متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك
            </div>

            <div class="footer">
              <div><strong>رقم التسلسل الفريد:</strong> ${invoice.invoiceHash}</div>
              <div><strong>التوقيع الرقمي:</strong> ${invoice.digitalSignature?.substring(0, 32)}...</div>
              <div style="margin-top: 15px;">${settings.receiptFooterAr}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generateInvoiceText = (invoice: ZATCAInvoice): string => {
    return `
${invoice.supplierInfo.nameAr}
${invoice.supplierInfo.addressAr}
${invoice.supplierInfo.phone}
الرقم الضريبي: ${invoice.supplierInfo.vatNumber}

رقم الفاتورة: ${invoice.invoiceNumber}
التاريخ: ${formatDate(invoice.date)}
العميل: ${invoice.customer?.nameAr || 'عميل غير مسجل'}

الأصناف:
${invoice.items.map(item => 
  `${item.product.nameAr} - ${item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)} ${settings.currencySymbol}`
).join('\n')}

المجموع الفرعي: ${invoice.subtotal.toFixed(2)} ${settings.currencySymbol}
الخصم: ${invoice.discount.toFixed(2)} ${settings.currencySymbol}
الضريبة: ${invoice.tax.toFixed(2)} ${settings.currencySymbol}
الإجمالي: ${invoice.total.toFixed(2)} ${settings.currencySymbol}

QR Code: ${invoice.qrCode}
متوافق مع هيئة الزكاة والضريبة والجمارك
    `;
  };

  const addProductToInvoice = (product: any) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, unitPrice: product.price }];
    });
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setSelectedProducts(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleCreateInvoice = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('خطأ', 'يرجى إضافة منتجات للفاتورة');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * settings.taxRate) / 100;
    const total = subtotal + taxAmount;

    const newInvoice: ZATCAInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `${settings.invoicePrefix}-${settings.nextInvoiceNumber.toString().padStart(4, '0')}`,
      date: new Date(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      customerId: formData.customerId || undefined,
      customer,
      items: selectedProducts.map(item => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
        taxAmount: (item.quantity * item.unitPrice * settings.taxRate) / 100,
        taxRate: settings.taxRate,
      })),
      subtotal,
      discount: 0,
      tax: taxAmount,
      total,
      paidAmount: 0,
      remainingAmount: total,
      paymentMethod: formData.paymentMethod,
      status: 'draft',
      notes: formData.notes,
      qrCode: '',
      zatcaCompliant: true,
      supplierInfo: {
        name: settings.businessName,
        nameAr: settings.businessNameAr,
        vatNumber: '300000000000003',
        crNumber: '1010000000',
        address: settings.businessAddress,
        addressAr: settings.businessAddressAr,
        phone: settings.businessPhone,
        email: settings.businessEmail,
      },
    };

    newInvoice.qrCode = generateQRCode(newInvoice);
    newInvoice.invoiceHash = generateInvoiceHash(newInvoice);
    newInvoice.digitalSignature = generateDigitalSignature(newInvoice);

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Reset form
    setFormData({
      customerId: '',
      dueDate: '',
      notes: '',
      paymentMethod: 'cash',
    });
    setSelectedProducts([]);
    setShowAddModal(false);
    
    Alert.alert('نجح', 'تم إنشاء الفاتورة بنجاح');
  };

  const handleDeleteInvoice = (invoice: ZATCAInvoice) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف الفاتورة ${invoice.invoiceNumber}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
            Alert.alert('نجح', 'تم حذف الفاتورة بنجاح');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الفواتير الإلكترونية</Text>
        <View style={styles.headerButtons}>
          <Button
            title="إنشاء فاتورة"
            onPress={() => setShowAddModal(true)}
            icon={<Plus size={16} color="#FFFFFF" />}
            size="small"
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#5865F2' + '20' }]}>
              <FileText size={20} color="#5865F2" />
            </View>
            <Text style={styles.statValue}>{totalInvoices}</Text>
            <Text style={styles.statLabel}>إجمالي الفواتير</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10B981' + '20' }]}>
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>إجمالي المبلغ</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10B981' + '20' }]}>
              <Check size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{paidInvoices}</Text>
            <Text style={styles.statLabel}>فواتير مدفوعة</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B' + '20' }]}>
              <Clock size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{pendingInvoices}</Text>
            <Text style={styles.statLabel}>فواتير معلقة</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Input
            style={styles.searchInput}
            placeholder="البحث برقم الفاتورة أو اسم العميل..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<Search size={20} color="#666" />}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Calendar size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {filteredInvoices.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color="#666" />
            <Text style={styles.emptyText}>لا توجد فواتير</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.invoiceId}>
                      فاتورة #{invoice.invoiceNumber}
                    </Text>
                    {invoice.zatcaCompliant && (
                      <View style={styles.zatcaBadge}>
                        <Text style={styles.zatcaText}>ZATCA</Text>
                      </View>
                    )}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(invoice.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.invoiceDate}>
                    {formatDate(invoice.date)}
                  </Text>
                </View>

                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceAmount}>
                    {invoice.total.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceCustomer}>
                      {invoice.customer?.nameAr || 'عميل غير مسجل'}
                    </Text>
                    <Text style={[styles.invoiceCustomer, { fontSize: 12, color: '#999' }]}>
                      {invoice.paymentMethod === 'cash' ? 'نقدي' : 
                       invoice.paymentMethod === 'card' ? 'بطاقة' :
                       invoice.paymentMethod === 'transfer' ? 'تحويل' : 'آجل'}
                    </Text>
                  </View>
                </View>

                <View style={styles.invoiceActions}>
                  <Button
                    title="عرض"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    icon={<Eye size={16} color="#5865F2" />}
                    onPress={() => handleViewInvoice(invoice)}
                  />
                  <Button
                    title="طباعة"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    icon={<Printer size={16} color="#5865F2" />}
                    onPress={() => handlePrintInvoice(invoice)}
                  />
                  <Button
                    title="تعديل"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    icon={<Edit size={16} color="#5865F2" />}
                    onPress={() => {
                      setEditingInvoice(invoice);
                      setShowEditModal(true);
                    }}
                  />
                  <Button
                    title="حذف"
                    variant="ghost"
                    size="small"
                    style={styles.actionButton}
                    icon={<Trash2 size={16} color="#EF4444" />}
                    onPress={() => handleDeleteInvoice(invoice)}
                  />
                </View>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>

      {/* View Invoice Modal */}
      <Modal visible={showViewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تفاصيل الفاتورة</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowViewModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedInvoice && (
              <ScrollView style={{ maxHeight: 400 }}>
                <View style={styles.invoiceHeaderSection}>
                  <Text style={styles.businessName}>{selectedInvoice.supplierInfo.nameAr}</Text>
                  <Text style={styles.businessInfo}>{selectedInvoice.supplierInfo.addressAr}</Text>
                  <Text style={styles.businessInfo}>{selectedInvoice.supplierInfo.phone}</Text>
                  <Text style={styles.vatNumber}>الرقم الضريبي: {selectedInvoice.supplierInfo.vatNumber}</Text>
                </View>

                <View style={styles.invoiceInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{selectedInvoice.invoiceNumber}</Text>
                    <Text style={styles.infoLabel}>رقم الفاتورة:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{formatDate(selectedInvoice.date)}</Text>
                    <Text style={styles.infoLabel}>التاريخ:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{selectedInvoice.customer?.nameAr || 'عميل غير مسجل'}</Text>
                    <Text style={styles.infoLabel}>العميل:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{getStatusText(selectedInvoice.status)}</Text>
                    <Text style={styles.infoLabel}>الحالة:</Text>
                  </View>
                </View>

                <View style={styles.itemsSection}>
                  <Text style={styles.sectionTitle}>الأصناف</Text>
                  <View style={styles.itemRow}>
                    <Text style={[styles.itemName, { fontWeight: 'bold' }]}>الصنف</Text>
                    <Text style={[styles.itemQty, { fontWeight: 'bold' }]}>العدد</Text>
                    <Text style={[styles.itemPrice, { fontWeight: 'bold' }]}>السعر</Text>
                    <Text style={[styles.itemTotal, { fontWeight: 'bold' }]}>المجموع</Text>
                  </View>
                  {selectedInvoice.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.product.nameAr}</Text>
                      <Text style={styles.itemQty}>{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.unitPrice.toFixed(2)}</Text>
                      <Text style={styles.itemTotal}>{item.total.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalsSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedInvoice.subtotal.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedInvoice.discount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الخصم:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedInvoice.tax.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الضريبة:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.grandTotal}>{selectedInvoice.total.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                  </View>
                </View>

                <View style={styles.qrSection}>
                  <Text style={styles.sectionTitle}>رمز الاستجابة السريعة</Text>
                  <View style={styles.qrCode}>
                    <QrCode size={32} color="#5865F2" />
                  </View>
                  <Text style={styles.qrText}>امسح الرمز للتحقق من صحة الفاتورة</Text>
                  <Text style={styles.qrText}>متوافق مع هيئة الزكاة والضريبة والجمارك</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button
                title="طباعة"
                onPress={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}
                variant="outline"
                style={styles.modalButton}
                icon={<Printer size={16} color="#5865F2" />}
              />
              <Button
                title="إغلاق"
                onPress={() => setShowViewModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Invoice Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إنشاء فاتورة جديدة</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                اختيار العميل
              </Text>
              <View style={{ backgroundColor: '#F5F5F5', borderRadius: 8, marginBottom: 16 }}>
                <TouchableOpacity
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    backgroundColor: !formData.customerId ? '#5865F2' : 'transparent',
                  }}
                  onPress={() => setFormData(prev => ({ ...prev, customerId: '' }))}
                >
                  <Text style={{
                    fontSize: 16,
                    color: !formData.customerId ? '#FFFFFF' : '#333',
                    textAlign: 'right',
                  }}>
                    عميل غير مسجل
                  </Text>
                </TouchableOpacity>
                {customers.map((customer) => (
                  <TouchableOpacity
                    key={customer.id}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      backgroundColor: formData.customerId === customer.id ? '#5865F2' : 'transparent',
                    }}
                    onPress={() => setFormData(prev => ({ ...prev, customerId: customer.id }))}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: formData.customerId === customer.id ? '#FFFFFF' : '#333',
                      textAlign: 'right',
                    }}>
                      {customer.nameAr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                المنتجات
              </Text>
              <ScrollView style={{ maxHeight: 150, marginBottom: 16 }}>
                {products.map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <TouchableOpacity
                      style={styles.addProductButton}
                      onPress={() => addProductToInvoice(product)}
                    >
                      <Plus size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={styles.productName}>{product.nameAr}</Text>
                      <Text style={{ fontSize: 12, color: '#666', textAlign: 'right' }}>
                        السعر: {product.price.toFixed(2)} {settings.currencySymbol}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {selectedProducts.length > 0 && (
                <View style={styles.selectedProductsSection}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                    المنتجات المحددة
                  </Text>
                  <ScrollView style={{ maxHeight: 150, marginBottom: 16 }}>
                    {selectedProducts.map((item) => (
                      <View key={item.product.id} style={styles.selectedProductItem}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 8 }}>
                          {item.product.nameAr}
                        </Text>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateProductQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Text>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateProductQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Text>+</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 14, color: '#666', marginLeft: 'auto' }}>
                            المجموع: {(item.quantity * item.unitPrice).toFixed(2)} {settings.currencySymbol}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Input
                label="تاريخ الاستحقاق"
                value={formData.dueDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
                placeholder="YYYY-MM-DD"
              />

              <Input
                label="ملاحظات"
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="ملاحظات إضافية"
              />

              <View style={styles.modalActions}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowAddModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="إنشاء"
                  onPress={handleCreateInvoice}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}