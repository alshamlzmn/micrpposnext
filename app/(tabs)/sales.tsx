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
import { Search, Filter, Calendar, Eye, Printer, RotateCcw, Download, X, FileText, Image as ImageIcon, List, ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sale } from '@/types/global';

export default function Sales() {
  const { theme, t, language, sales, settings, updateSale, products, updateProduct, updateCustomer, addCashboxTransaction, customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showProductImages, setShowProductImages] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 15,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
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
    saleCard: {
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
    saleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    saleId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    saleDate: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    saleDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    saleAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
      fontFamily: 'Cairo-Bold',
    },
    saleCustomer: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    saleActions: {
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
    invoiceHeader: {
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
  });

  // Calculate stats
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.date);
    return saleDate.toDateString() === today.toDateString();
  }).length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  const filteredSales = sales.filter(sale => {
    const searchLower = searchQuery.toLowerCase();
    return sale.invoiceNumber.toLowerCase().includes(searchLower) ||
           sale.customer?.nameAr?.toLowerCase().includes(searchLower) ||
           sale.customer?.name?.toLowerCase().includes(searchLower);
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

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setShowViewModal(true);
  };

  const handlePrintSale = async (sale: Sale) => {
    const invoiceText = generateInvoiceText(sale);
    
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

  const generateInvoiceText = (sale: Sale): string => {
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

    return `
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
  };

  const handleReturnSale = (sale: Sale) => {
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
              updateSale(updatedSale);
              
              // Return products to stock
              sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
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
              
              Alert.alert('نجح', 'تم إرجاع الفاتورة بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في إرجاع الفاتورة');
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المبيعات</Text>
      </View>

      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#5865F2' + '20' }]}>
              <ShoppingBag size={20} color="#5865F2" />
            </View>
            <Text style={styles.statValue}>{totalSales}</Text>
            <Text style={styles.statLabel}>إجمالي المبيعات</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10B981' + '20' }]}>
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>إجمالي الإيرادات</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B' + '20' }]}>
              <TrendingUp size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{todaySales}</Text>
            <Text style={styles.statLabel}>مبيعات اليوم</Text>
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

        {filteredSales.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color="#666" />
            <Text style={styles.emptyText}>لا توجد مبيعات</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredSales.map((sale) => (
              <Card key={sale.id} style={styles.saleCard}>
                <View style={styles.saleHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.saleId}>
                      فاتورة #{sale.invoiceNumber}
                    </Text>
                    {sale.status === 'returned' && (
                      <View style={styles.returnedBadge}>
                        <Text style={styles.returnedText}>مرجعة</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.saleDate}>
                    {formatDate(sale.date)}
                  </Text>
                </View>

                <View style={styles.saleDetails}>
                  <Text style={styles.saleAmount}>
                    {sale.total.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.saleCustomer}>
                      {sale.customer?.nameAr || 'عميل غير مسجل'}
                    </Text>
                    <Text style={[styles.saleCustomer, { fontSize: 12, color: '#999' }]}>
                      {sale.paymentMethod === 'cash' ? 'نقدي' : 
                       sale.paymentMethod === 'card' ? 'بطاقة' :
                       sale.paymentMethod === 'transfer' ? 'تحويل' : 'آجل'}
                    </Text>
                  </View>
                </View>

                <View style={styles.saleActions}>
                  <Button
                    title="عرض"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    icon={<Eye size={16} color="#5865F2" />}
                    onPress={() => handleViewSale(sale)}
                  />
                  <Button
                    title="طباعة"
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                    icon={<Printer size={16} color="#5865F2" />}
                    onPress={() => handlePrintSale(sale)}
                  />
                  {sale.status !== 'returned' && (
                    <Button
                      title="إرجاع"
                      variant="ghost"
                      size="small"
                      style={styles.actionButton}
                      icon={<RotateCcw size={16} color="#EF4444" />}
                      onPress={() => handleReturnSale(sale)}
                    />
                  )}
                </View>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>

      {/* View Sale Modal */}
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

            {selectedSale && (
              <ScrollView style={{ maxHeight: 400 }}>
                <View style={styles.invoiceHeader}>
                  <Text style={styles.businessName}>{settings.businessNameAr}</Text>
                  <Text style={styles.businessInfo}>{settings.businessAddressAr}</Text>
                  <Text style={styles.businessInfo}>{settings.businessPhone}</Text>
                </View>

                <View style={styles.invoiceInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{selectedSale.invoiceNumber}</Text>
                    <Text style={styles.infoLabel}>رقم الفاتورة:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{formatDate(selectedSale.date)}</Text>
                    <Text style={styles.infoLabel}>التاريخ:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoValue}>{selectedSale.customer?.nameAr || 'عميل غير مسجل'}</Text>
                    <Text style={styles.infoLabel}>العميل:</Text>
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
                  {selectedSale.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      {showProductImages ? (
                        <View style={styles.itemWithImage}>
                          {item.product.image ? (
                            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                          ) : (
                            <View style={styles.itemImage} />
                          )}
                          <Text style={styles.itemName}>{item.product.nameAr}</Text>
                        </View>
                      ) : (
                        <Text style={styles.itemName}>{item.product.nameAr}</Text>
                      )}
                      <Text style={styles.itemQty}>{item.quantity}</Text>
                      <Text style={styles.itemPrice}>{item.unitPrice.toFixed(2)}</Text>
                      <Text style={styles.itemTotal}>{item.total.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalsSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedSale.subtotal.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedSale.discount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الخصم:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedSale.tax.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>الضريبة:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.grandTotal}>{selectedSale.total.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedSale.paidAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المدفوع:</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalValue}>{selectedSale.remainingAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalLabel}>المتبقي:</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <Button
                title="طباعة"
                onPress={() => selectedSale && handlePrintSale(selectedSale)}
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
    </SafeAreaView>
  );
}