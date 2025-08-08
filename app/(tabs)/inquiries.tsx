import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  Platform,
  Share,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Package, Users, Truck, ShoppingCart, DollarSign, TrendingDown, Calendar, FileText, X, ChartBar as BarChart3, Receipt, Printer, RotateCcw, CreditCard, Check, Clock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sale } from '@/types/global';

const { width } = Dimensions.get('window');

export default function Inquiries() {
  const { theme, t, language, products, customers, suppliers, sales, settings, cashboxTransactions, updateSale, updateProduct, updateCustomer, addCashboxTransaction } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailedInvoiceModal, setShowDetailedInvoiceModal] = useState(false);
  const [selectedDetailedInvoice, setSelectedDetailedInvoice] = useState<Sale | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    gridContainer: {
      flex: 1,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    gridItem: {
      flex: 0.48,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    productsIcon: {
      backgroundColor: '#FFF8DC',
    },
    customersIcon: {
      backgroundColor: '#E6F3FF',
    },
    suppliersIcon: {
      backgroundColor: '#FFF8DC',
    },
    salesIcon: {
      backgroundColor: '#F0FFF0',
    },
    invoicesIcon: {
      backgroundColor: '#E8F5E8',
    },
    detailedInvoiceModal: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '95%',
      maxWidth: 500,
      maxHeight: '90%',
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
    itemWithImage: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 2,
    },
    itemImage: {
      width: 30,
      height: 30,
      borderRadius: 4,
      marginLeft: 8,
      backgroundColor: '#F5F5F5',
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
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
    },
    returnedBadge: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    returnedText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
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
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: width * 0.9,
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
    },
    closeButton: {
      padding: 5,
    },
    searchContainer: {
      marginBottom: 20,
    },
    listContainer: {
      maxHeight: 400,
    },
    listItem: {
      backgroundColor: '#f9f9f9',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 5,
    },
    listItemSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    invoiceDetails: {
      backgroundColor: '#F8F9FA',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    invoiceItemsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5865F2',
      marginBottom: 8,
      textAlign: 'right',
    },
    invoiceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    invoiceItemName: {
      fontSize: 12,
      color: '#333',
      flex: 1,
      textAlign: 'right',
    },
    invoiceItemQty: {
      fontSize: 12,
      color: '#666',
      marginLeft: 8,
    },
  });

  const inquiryItems = [
    {
      title: 'استعلام المنتجات',
      icon: Package,
      iconStyle: styles.productsIcon,
      color: '#B8860B',
      type: 'products',
    },
    {
      title: 'استعلام العملاء',
      icon: Users,
      iconStyle: styles.customersIcon,
      color: '#1E90FF',
      type: 'customers',
    },
    {
      title: 'استعلام الموردين',
      icon: Truck,
      iconStyle: styles.suppliersIcon,
      color: '#DAA520',
      type: 'suppliers',
    },
    {
      title: 'استعلام المبيعات',
      icon: ShoppingCart,
      iconStyle: styles.salesIcon,
      color: '#228B22',
      type: 'sales',
    },
    {
      title: 'استعلام الفواتير',
      icon: Receipt,
      iconStyle: styles.invoicesIcon,
      color: '#10B981',
      type: 'invoices',
    },
  ];

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < inquiryItems.length; i += 2) {
      const FirstIcon = inquiryItems[i].icon;
      const SecondIcon = inquiryItems[i + 1]?.icon;
      
      rows.push(
        <View key={i} style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
              setSelectedInquiry(inquiryItems[i].type);
              setShowModal(true);
            }}
          >
            <View style={[styles.iconContainer, inquiryItems[i].iconStyle]}>
              <FirstIcon size={24} color={inquiryItems[i].color} />
            </View>
            <Text style={styles.itemTitle}>{inquiryItems[i].title}</Text>
          </TouchableOpacity>

          {i + 1 < inquiryItems.length && (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                setSelectedInquiry(inquiryItems[i + 1].type);
                setShowModal(true);
              }}
            >
              <View style={[styles.iconContainer, inquiryItems[i + 1].iconStyle]}>
                <SecondIcon size={24} color={inquiryItems[i + 1].color} />
              </View>
              <Text style={styles.itemTitle}>{inquiryItems[i + 1].title}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  const getModalTitle = () => {
    switch (selectedInquiry) {
      case 'products':
        return 'استعلام المنتجات';
      case 'customers':
        return 'استعلام العملاء';
      case 'suppliers':
        return 'استعلام الموردين';
      case 'sales':
        return 'استعلام المبيعات';
      case 'invoices':
        return 'استعلام الفواتير';
      default:
        return 'استعلام';
    }
  };

  const filterData = (data: any[], query: string) => {
    if (!query) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const getSaleStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'معلقة';
      case 'cancelled':
        return 'ملغية';
      case 'returned':
        return 'مرجعة';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'نقدي';
      case 'card': return 'بطاقة';
      case 'transfer': return 'تحويل';
      case 'credit': return 'آجل';
      default: return method;
    }
  };

  const getDebtStatusText = (sale: Sale) => {
    if (sale.remainingAmount > 0) {
      return `ذمة على العميل: ${sale.remainingAmount.toFixed(2)} ${settings.currencySymbol}`;
    } else {
      return 'مدفوعة بالكامل';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'returned': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleViewInvoiceDetails = (invoice: Sale) => {
    setSelectedDetailedInvoice(invoice);
    setShowDetailedInvoiceModal(true);
  };

  const handlePrintInvoice = async (sale: Sale) => {
    const invoiceText = `
${settings.businessNameAr}
${settings.businessAddressAr}
${settings.businessPhone}

رقم الفاتورة: ${sale.invoiceNumber}
التاريخ: ${formatDate(sale.date)}
العميل: ${sale.customer?.nameAr || 'عميل غير مسجل'}
طريقة الدفع: ${getPaymentMethodText(sale.paymentMethod)}
حالة الذمة: ${getDebtStatusText(sale)}

الأصناف:
الصنف - العدد - السعر - المجموع
${sale.items.map(item => 
  `${item.product.nameAr} - ${item.quantity} - ${item.unitPrice.toFixed(2)} - ${item.total.toFixed(2)} ${settings.currencySymbol}`
).join('\n')}

المجموع الفرعي: ${sale.subtotal.toFixed(2)} ${settings.currencySymbol}
الخصم: ${sale.discount.toFixed(2)} ${settings.currencySymbol}
الضريبة: ${sale.tax.toFixed(2)} ${settings.currencySymbol}
الإجمالي: ${sale.total.toFixed(2)} ${settings.currencySymbol}
المدفوع: ${sale.paidAmount.toFixed(2)} ${settings.currencySymbol}
المتبقي: ${sale.remainingAmount.toFixed(2)} ${settings.currencySymbol}

${settings.receiptFooterAr}
    `;

    if (Platform.OS === 'web') {
      // For web, create a new window with the invoice
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>فاتورة ${sale.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
                .invoice { max-width: 300px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 15px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .items { border-top: 1px solid #ccc; padding-top: 10px; }
                .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
                .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .item-header { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px; }
              </style>
            </head>
            <body>
              <div class="invoice">
                <div class="header">
                  <h2>${settings.businessNameAr}</h2>
                  <p>${settings.businessAddressAr}</p>
                  <p>${settings.businessPhone}</p>
                </div>
                <div class="row"><span>رقم الفاتورة:</span><span>${sale.invoiceNumber}</span></div>
                <div class="row"><span>التاريخ:</span><span>${formatDate(sale.date)}</span></div>
                <div class="row"><span>العميل:</span><span>${sale.customer?.nameAr || 'عميل غير مسجل'}</span></div>
                <div class="row"><span>طريقة الدفع:</span><span>${getPaymentMethodText(sale.paymentMethod)}</span></div>
                <div class="row"><span>حالة الذمة:</span><span>${getDebtStatusText(sale)}</span></div>
                <div class="items">
                  <h3>الأصناف:</h3>
                  <div class="item-header">
                    <div class="item-row">
                      <span>الصنف</span>
                      <span>العدد</span>
                      <span>السعر</span>
                      <span>المجموع</span>
                    </div>
                  </div>
                  ${sale.items.map(item => `
                    <div class="item-row">
                      <span>${item.product.nameAr}</span>
                      <span>${item.quantity}</span>
                      <span>${item.unitPrice.toFixed(2)}</span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="total">
                  <div class="row"><span>المجموع الفرعي:</span><span>${sale.subtotal.toFixed(2)} ${settings.currencySymbol}</span></div>
                  <div class="row"><span>الخصم:</span><span>${sale.discount.toFixed(2)} ${settings.currencySymbol}</span></div>
                  <div class="row"><span>الضريبة:</span><span>${sale.tax.toFixed(2)} ${settings.currencySymbol}</span></div>
                  <div class="row"><span>الإجمالي:</span><span>${sale.total.toFixed(2)} ${settings.currencySymbol}</span></div>
                  <div class="row"><span>المدفوع:</span><span>${sale.paidAmount.toFixed(2)} ${settings.currencySymbol}</span></div>
                  <div class="row"><span>المتبقي:</span><span>${sale.remainingAmount.toFixed(2)} ${settings.currencySymbol}</span></div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                  <p>${settings.receiptFooterAr}</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      // For mobile, use Share API
      try {
        await Share.share({
          message: invoiceText,
          title: `فاتورة ${sale.invoiceNumber}`,
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في مشاركة الفاتورة');
      }
    }
  };

  const handleReturnInvoice = (sale: Sale) => {
    Alert.alert(
      'إرجاع الفاتورة',
      `هل تريد إرجاع الفاتورة ${sale.invoiceNumber}؟\n\nسيتم:\n• إرجاع المنتجات للمخزون\n• تعديل رصيد العميل\n• خصم المبلغ من الصندوق`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إرجاع', 
          style: 'destructive',
          onPress: () => {
            try {
              // Update sale status to returned
              const updatedSale = { ...sale, status: 'returned' as const };
              console.log('Updating sale status:', updatedSale);
              updateSale(updatedSale);
              
              // Return products to stock
              sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                  console.log('Returning product to stock:', product.nameAr, 'quantity:', item.quantity);
                  updateProduct({
                    ...product,
                    stock: product.stock + item.quantity
                  });
                }
              });
              
              // Update customer balance if applicable
              if (sale.customerId && sale.customer) {
                const customer = customers.find(c => c.id === sale.customerId);
                if (customer) {
                  console.log('Updating customer balance for:', customer.nameAr, 'remainingAmount:', sale.remainingAmount);
                  updateCustomer({
                    ...customer,
                    currentBalance: Math.max(0, customer.currentBalance - sale.remainingAmount),
                    totalPurchases: Math.max(0, customer.totalPurchases - sale.total)
                  });
                }
              }

              // Add cashbox transaction for returned amount
              if (sale.paidAmount > 0) {
                addCashboxTransaction({
                  console.log('Adding cashbox transaction for return:', sale.paidAmount);
                  id: Date.now().toString(),
                  type: 'subtract',
                  amount: sale.paidAmount,
                  description: `Sale return - Invoice ${sale.invoiceNumber}`,
                  descriptionAr: `إرجاع مبيعات - فاتورة ${sale.invoiceNumber}`,
                  date: new Date(),
                  isActive: true,
                  source: 'sale',
                  referenceId: sale.id,
                });
              }
              
              setSelectedDetailedInvoice(updatedSale); // Update the local state for the modal
              setShowDetailedInvoiceModal(false);
              Alert.alert('نجح', 'تم إرجاع الفاتورة بنجاح');
            } catch (error) {
              console.error('Error during sale return:', error);
              Alert.alert('خطأ', 'فشل في إرجاع الفاتورة');
            }
          }
        },
      ]
    );
  };

  const renderInquiryContent = () => {
    let data: any[] = [];
    
    switch (selectedInquiry) {
      case 'products':
        data = products || [];
        break;
      case 'customers':
        data = customers || [];
        break;
      case 'suppliers':
        data = suppliers || [];
        break;
      case 'sales':
        data = sales || [];
        break;
      case 'invoices':
        data = sales || [];
        break;
      default:
        data = [];
    }

    const filteredData = filterData(data, searchQuery);

    return (
      <>
        <View style={styles.searchContainer}>
          <Input
            placeholder="البحث..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemTitle}>
                  {item.nameAr || item.name || item.title || item.customerName || item.supplierName || `عنصر ${index + 1}`}
                </Text>
                <Text style={styles.listItemSubtitle}>
                  {selectedInquiry === 'products' && `السعر: ${item.price || 'غير محدد'} - التصنيف: ${item.categoryAr || 'غير محدد'}`}
                  {selectedInquiry === 'customers' && `الهاتف: ${item.phone || 'غير محدد'}`}
                  {selectedInquiry === 'suppliers' && `الهاتف: ${item.phone || 'غير محدد'}`}
                  {selectedInquiry === 'sales' && `المبلغ: ${item.total || item.amount || 'غير محدد'} - العميل: ${item.customer?.nameAr || 'عميل غير مسجل'}`}
                  {selectedInquiry === 'invoices' && (
                    <TouchableOpacity onPress={() => handleViewInvoiceDetails(item)}>
                      <Text>{`رقم الفاتورة: ${item.invoiceNumber || 'غير محدد'} - المبلغ: ${item.total || 'غير محدد'} ${settings.currencySymbol} - الحالة: ${getSaleStatusText(item.status || 'غير محدد')} - العميل: ${item.customer?.nameAr || 'عميل غير مسجل'}`}</Text>
                      <Text style={{ fontSize: 12, color: '#5865F2', marginTop: 4, textAlign: 'right' }}>
                        اضغط لعرض التفاصيل الكاملة
                      </Text>
                    </TouchableOpacity>
                  )}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد بيانات'}
              </Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الاستعلامات</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {renderGridItems()}
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowModal(false);
                  setSearchQuery('');
                }}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {renderInquiryContent()}
          </View>
        </View>
      </Modal>

      {/* Detailed Invoice Modal */}
      <Modal visible={showDetailedInvoiceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.detailedInvoiceModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تفاصيل الفاتورة</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDetailedInvoiceModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedDetailedInvoice && (
              <ScrollView style={{ maxHeight: 500 }}>
                <View style={styles.invoiceHeaderSection}>
                  <Text style={styles.businessName}>{settings.businessNameAr}</Text>
                  <Text style={styles.businessInfo}>{settings.businessAddressAr}</Text>
                  <Text style={styles.businessInfo}>{settings.businessPhone}</Text>
                </View>

                <View style={styles.invoiceInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>
                      {selectedDetailedInvoice.invoiceNumber}
                      {selectedDetailedInvoice.status === 'returned' && (
                        <View style={styles.returnedBadge}>
                          <Text style={styles.returnedText}>مرجعة</Text>
                        </View>
                      )}
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedDetailedInvoice.status) }]}>
                        <Text style={styles.statusText}>{getSaleStatusText(selectedDetailedInvoice.status)}</Text>
                      </View>
                    </Text>
                    <Text style={styles.infoLabel}>رقم الفاتورة:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{formatDate(selectedDetailedInvoice.date)}</Text>
                    <Text style={styles.infoLabel}>التاريخ:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{selectedDetailedInvoice.customer?.nameAr || 'عميل غير مسجل'}</Text>
                    <Text style={styles.infoLabel}>العميل:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{getPaymentMethodText(selectedDetailedInvoice.paymentMethod)}</Text>
                    <Text style={styles.infoLabel}>طريقة الدفع:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{getDebtStatusText(selectedDetailedInvoice)}</Text>
                    <Text style={styles.infoLabel}>حالة الذمة:</Text>
                  </View>
                </View>

                <View style={styles.itemsSection}>
                  <Text style={styles.sectionTitle}>الأصناف المشتراة</Text>
                  <View style={styles.itemRow}>
                    <Text style={[styles.itemName, { fontWeight: 'bold' }]}>الصنف</Text>
                    <Text style={[styles.itemQty, { fontWeight: 'bold' }]}>العدد</Text>
                    <Text style={[styles.itemPrice, { fontWeight: 'bold' }]}>السعر</Text>
                    <Text style={[styles.itemTotal, { fontWeight: 'bold' }]}>المجموع</Text>
                  </View>
                  {selectedDetailedInvoice.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemWithImage}>
                        {item.product.image ? (
                          <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                        ) : (
                          <View style={styles.itemImage}>
                            <Package size={16} color="#999" />
                          </View>
                        )}
                        <Text style={styles.itemName}>{item.product.nameAr}</Text>
                      </View>
                      <Text style={styles.itemQty}>{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.unitPrice.toFixed(2)}</Text>
                      <Text style={styles.itemTotal}>{item.total.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalsSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedDetailedInvoice.subtotal.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedDetailedInvoice.discount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الخصم:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedDetailedInvoice.tax.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الضريبة:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.grandTotal}>{selectedDetailedInvoice.total.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedDetailedInvoice.paidAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المدفوع:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedDetailedInvoice.remainingAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المتبقي:</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button
                title="طباعة"
                onPress={() => selectedDetailedInvoice && handlePrintInvoice(selectedDetailedInvoice)}
                variant="outline"
                style={styles.modalButton}
                icon={<Printer size={16} color="#5865F2" />}
              />
              {selectedDetailedInvoice?.status !== 'returned' && (
                <Button
                  title="إرجاع"
                  onPress={() => selectedDetailedInvoice && handleReturnInvoice(selectedDetailedInvoice)}
                  variant="outline"
                  style={styles.modalButton}
                  icon={<RotateCcw size={16} color="#EF4444" />}
                />
              )}
              <Button
                title="إغلاق"
                onPress={() => setShowDetailedInvoiceModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}