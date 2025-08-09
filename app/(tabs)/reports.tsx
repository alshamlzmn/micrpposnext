import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Calendar, Download, FileText, ChartBar as BarChart3 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Platform, Share, Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function Reports() {
  const { theme, t, language, sales, products, customers, suppliers, settings, cashboxTransactions } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5865F2',
    },
    header: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 15,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
    },
    content: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 16,
    },
    periodSelector: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 4,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: '#5865F2',
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Cairo-Medium',
    },
    periodButtonTextActive: {
      color: '#FFFFFF',
    },
    periodButtonTextInactive: {
      color: '#666',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      width: (width - 48) / 2,
      marginBottom: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statTitle: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Medium',
      textAlign: 'right',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    statChange: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      justifyContent: 'flex-end',
    },
    statChangeText: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Cairo-Medium',
    },
    statChangePositive: {
      color: '#10B981',
    },
    statChangeNegative: {
      color: '#EF4444',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    chartCard: {
      marginBottom: 24,
      height: 200,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    chartPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8F9FA',
      borderRadius: 8,
      margin: 16,
    },
    chartText: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      marginTop: 8,
    },
    exportSection: {
      marginTop: 24,
    },
    exportButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    exportButton: {
      flex: 1,
    },
    summaryCard: {
      backgroundColor: '#F8F9FA',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
  });

  const periods = [
    { key: 'today', label: 'اليوم' },
    { key: 'week', label: 'أسبوع' },
    { key: 'month', label: 'شهر' },
    { key: 'year', label: 'سنة' },
  ];

  // Calculate stats based on selected period
  const today = new Date();
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.toDateString() === today.toDateString();
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const cashboxBalance = cashboxTransactions
    .filter(t => t.isActive)
    .reduce((balance, transaction) => {
      return transaction.type === 'add' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);

  // Calculate sales by payment method
  const cashSales = sales.filter(sale => sale.paymentMethod === 'cash');
  const cardSales = sales.filter(sale => sale.paymentMethod === 'card');
  const transferSales = sales.filter(sale => sale.paymentMethod === 'transfer');
  const creditSales = sales.filter(sale => sale.paymentMethod === 'credit');

  // Calculate revenue by payment method
  const cashRevenue = cashSales.reduce((sum, sale) => sum + sale.total, 0);
  const cardRevenue = cardSales.reduce((sum, sale) => sum + sale.total, 0);
  const transferRevenue = transferSales.reduce((sum, sale) => sum + sale.total, 0);
  const creditRevenue = creditSales.reduce((sum, sale) => sum + sale.total, 0);

  // Calculate cost and profit
  const totalCost = sales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemSum + (product ? product.cost * item.quantity : 0);
    }, 0);
  }, 0);
  const totalProfit = totalRevenue - totalCost;

  // Calculate inventory metrics
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.cost * product.stock), 0);
  const totalSoldQuantity = sales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  const totalReturnedQuantity = sales
    .filter(sale => sale.status === 'returned')
    .reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

  const stats = [
    {
      title: 'إجمالي المبيعات',
      value: totalSales.toString(),
      change: '+12%',
      positive: true,
      icon: ShoppingCart,
      color: '#5865F2',
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${totalRevenue.toFixed(2)} ${settings.currencySymbol}`,
      change: '+8%',
      positive: true,
      icon: DollarSign,
      color: '#10B981',
    },
    {
      title: 'متوسط قيمة الطلب',
      value: `${averageOrderValue.toFixed(2)} ${settings.currencySymbol}`,
      change: '-2%',
      positive: false,
      icon: TrendingUp,
      color: '#F59E0B',
    },
    {
      title: 'رصيد الصندوق',
      value: `${cashboxBalance.toFixed(2)} ${settings.currencySymbol}`,
      change: '+15%',
      positive: true,
      icon: DollarSign,
      color: '#8B5CF6',
    },
  ];

  const exportToPDF = async () => {
    const reportData = `
تقرير المبيعات المالي
=====================

إجمالي المبيعات: ${totalSales}
إجمالي الإيرادات: ${totalRevenue.toFixed(2)} ${settings.currencySymbol}
متوسط قيمة الطلب: ${averageOrderValue.toFixed(2)} ${settings.currencySymbol}
رصيد الصندوق: ${cashboxBalance.toFixed(2)} ${settings.currencySymbol}

ملخص شامل:
----------
إجمالي المنتجات: ${totalProducts}
إجمالي العملاء: ${totalCustomers}
إجمالي الموردين: ${suppliers.length}
منتجات منخفضة المخزون: ${lowStockProducts}
مبيعات اليوم: ${todaySales.length}

تم إنشاء التقرير في: ${new Date().toLocaleDateString('ar-SA')}
    `;

    if (Platform.OS === 'web') {
      // For web, create a downloadable file
      const element = document.createElement('a');
      const file = new Blob([reportData], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `تقرير-المبيعات-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      Alert.alert('نجح', 'تم تصدير التقرير بنجاح');
    } else {
      // For mobile, use Share API
      try {
        await Share.share({
          message: reportData,
          title: 'تقرير المبيعات المالي',
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في تصدير التقرير');
      }
    }
  };

  const exportToExcel = async () => {
    const csvData = `
التاريخ,نوع المعاملة,المبلغ,الوصف
${sales.map(sale => 
  `${sale.date.toLocaleDateString('ar-SA')},مبيعات,${sale.total},فاتورة ${sale.invoiceNumber}`
).join('\n')}
${cashboxTransactions.map(transaction => 
  `${transaction.date.toLocaleDateString('ar-SA')},${transaction.type === 'add' ? 'إيداع' : 'سحب'},${transaction.amount},${transaction.descriptionAr}`
).join('\n')}
    `;

    if (Platform.OS === 'web') {
      const element = document.createElement('a');
      const file = new Blob([csvData], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = `بيانات-المبيعات-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      Alert.alert('نجح', 'تم تصدير البيانات بنجاح');
    } else {
      try {
        await Share.share({
          message: csvData,
          title: 'بيانات المبيعات',
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في تصدير البيانات');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التقارير المالية</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key
                    ? styles.periodButtonTextActive
                    : styles.periodButtonTextInactive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <stat.icon size={20} color={stat.color} />
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View style={styles.statChange}>
                <Text
                  style={[
                    styles.statChangeText,
                    stat.positive ? styles.statChangePositive : styles.statChangeNegative,
                  ]}
                >
                  {stat.change}
                </Text>
                {stat.positive ? (
                  <TrendingUp size={12} color="#10B981" />
                ) : (
                  <TrendingDown size={12} color="#EF4444" />
                )}
              </View>
            </Card>
          ))}
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>ملخص شامل</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalProducts}</Text>
            <Text style={styles.summaryLabel}>إجمالي المنتجات</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{totalCustomers}</Text>
            <Text style={styles.summaryLabel}>إجمالي العملاء</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{suppliers.length}</Text>
            <Text style={styles.summaryLabel}>إجمالي الموردين</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{lowStockProducts}</Text>
            <Text style={styles.summaryLabel}>منتجات منخفضة المخزون</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{todaySales.length}</Text>
            <Text style={styles.summaryLabel}>مبيعات اليوم</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>اتجاه المبيعات</Text>
        <Card style={styles.chartCard}>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={32} color="#666" />
            <Text style={styles.chartText}>مخطط المبيعات</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>أفضل المنتجات</Text>
        <Card style={styles.chartCard}>
          <View style={styles.chartPlaceholder}>
            <Package size={32} color="#666" />
            <Text style={styles.chartText}>مخطط المنتجات</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>تقرير المبيعات حسب طريقة الدفع</Text>
        <Card style={{ marginBottom: 24, padding: 16 }}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {cashSales.length} ({cashRevenue.toFixed(2)} {settings.currencySymbol})
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Banknote size={16} color="#10B981" />
              <Text style={styles.summaryLabel}>المبيعات النقدية</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#5865F2' }]}>
              {cardSales.length} ({cardRevenue.toFixed(2)} {settings.currencySymbol})
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} color="#5865F2" />
              <Text style={styles.summaryLabel}>مبيعات البطاقة</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#8B5CF6' }]}>
              {transferSales.length} ({transferRevenue.toFixed(2)} {settings.currencySymbol})
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Smartphone size={16} color="#8B5CF6" />
              <Text style={styles.summaryLabel}>التحويل البنكي</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
              {creditSales.length} ({creditRevenue.toFixed(2)} {settings.currencySymbol})
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.summaryLabel}>المبيعات الآجلة</Text>
            </View>
        <Text style={styles.sectionTitle}>تقرير الأرباح والتكاليف</Text>
        <Card style={{ marginBottom: 24, padding: 16 }}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
              {totalCost.toFixed(2)} {settings.currencySymbol}
            </Text>
            <Text style={styles.summaryLabel}>إجمالي التكلفة</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#5865F2' }]}>
              {totalRevenue.toFixed(2)} {settings.currencySymbol}
            </Text>
            <Text style={styles.summaryLabel}>إجمالي المبيعات</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8, marginTop: 8 }]}>
            <Text style={[styles.summaryValue, { color: '#10B981', fontSize: 20 }]}>
              {totalProfit.toFixed(2)} {settings.currencySymbol}
            </Text>
            <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>صافي الربح</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#666' }]}>
              {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0'}%
            </Text>
            <Text style={styles.summaryLabel}>هامش الربح</Text>
          </View>
        </Card>
          </View>
        <Text style={styles.sectionTitle}>تقرير جرد المخزون</Text>
        <Card style={{ marginBottom: 24, padding: 16 }}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#5865F2' }]}>
              {totalInventoryValue.toFixed(2)} {settings.currencySymbol}
            </Text>
            <Text style={styles.summaryLabel}>إجمالي قيمة المخزون</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {totalSoldQuantity}
            </Text>
            <Text style={styles.summaryLabel}>إجمالي الكمية المباعة</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
              {totalReturnedQuantity}
            </Text>
            <Text style={styles.summaryLabel}>إجمالي الكمية المرجعة</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 16, marginBottom: 8 }]}>
            تفاصيل المنتجات
          </Text>
          <ScrollView style={{ maxHeight: 200 }}>
            {products.map((product) => {
              const soldQty = sales.reduce((sum, sale) => {
                return sum + sale.items
                  .filter(item => item.productId === product.id)
                  .reduce((itemSum, item) => itemSum + item.quantity, 0);
              }, 0);
              
              const returnedQty = sales
                .filter(sale => sale.status === 'returned')
                .reduce((sum, sale) => {
                  return sum + sale.items
                    .filter(item => item.productId === product.id)
                    .reduce((itemSum, item) => itemSum + item.quantity, 0);
                }, 0);
              
              const totalQty = product.stock + soldQty;
              const inventoryValue = product.cost * product.stock;
              
              return (
                <View key={product.id} style={{
                  backgroundColor: '#F8F9FA',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 }}>
                    {product.nameAr}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>{product.stock}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>المخزون الحالي:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>{soldQty}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>الكمية المباعة:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>{returnedQty}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>الكمية المرجعة:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#5865F2' }}>{totalQty}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>إجمالي الكمية:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, color: '#666' }}>{product.cost.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>سعر التكلفة:</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#10B981' }}>
                      {inventoryValue.toFixed(2)} {settings.currencySymbol}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>قيمة المخزون:</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Card>
        </Card>
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>تصدير التقارير</Text>
          <View style={styles.exportButtons}>
            <Button
              title="تصدير PDF"
              onPress={exportToPDF}
              variant="outline"
              style={styles.exportButton}
              icon={<Download size={16} color="#5865F2" />}
            />
            <Button
              title="تصدير Excel"
              onPress={exportToExcel}
              variant="outline"
              style={styles.exportButton}
              icon={<Download size={16} color="#5865F2" />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}