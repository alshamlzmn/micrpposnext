import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, DollarSign, CreditCard, Eye, UserPlus, X, Phone, Mail, MapPin, Building, TrendingUp, CreditCard as Edit, Trash2, Printer, FileText } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Customer } from '@/types/global';

const { width } = Dimensions.get('window');

export default function Customers() {
  const { theme, t, language, customers, addCustomer, updateCustomer, deleteCustomer, settings, payCustomerDebt } = useApp();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDebtsModal, setShowDebtsModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayDebtModal, setShowPayDebtModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerForDebt, setSelectedCustomerForDebt] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    phone: '',
    email: '',
    address: '',
    addressAr: '',
    openingBalance: '',
  });

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
    headerButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    content: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingTop: 20,
    },
    gridContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    gridItem: {
      width: (width - 55) / 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      fontFamily: 'Cairo-Bold',
    },
    addCustomerIcon: {
      backgroundColor: '#E8F5E8',
    },
    openingBalanceIcon: {
      backgroundColor: '#FFF8DC',
    },
    customerDebtsIcon: {
      backgroundColor: '#FFE4E1',
    },
    viewCustomersIcon: {
      backgroundColor: '#E6F3FF',
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
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
    },
    customerCard: {
      marginBottom: 16,
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    customerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    customerName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
      flex: 1,
    },
    customerBadge: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 12,
    },
    customerBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    customerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      justifyContent: 'flex-end',
    },
    customerInfoText: {
      fontSize: 14,
      color: '#666',
      marginRight: 8,
      fontFamily: 'Cairo-Regular',
    },
    customerStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
      fontFamily: 'Cairo-Regular',
    },
    debtValue: {
      color: '#EF4444',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    totalCustomers: {
      color: '#5865F2',
    },
    totalDebts: {
      color: '#EF4444',
    },
    totalPurchases: {
      color: '#10B981',
    },
  });

  const customerMenuItems = [
    {
      title: 'إضافة عميل',
      icon: UserPlus,
      iconStyle: styles.addCustomerIcon,
      color: '#32CD32',
      onPress: () => {
        setShowSubMenu(false);
        setShowAddModal(true);
      },
    },
    {
      title: 'رصيد افتتاحي',
      icon: DollarSign,
      iconStyle: styles.openingBalanceIcon,
      color: '#DAA520',
      onPress: () => {
        setShowSubMenu(false);
        setShowBalanceModal(true);
      },
    },
    {
      title: 'ذمم العملاء',
      icon: CreditCard,
      iconStyle: styles.customerDebtsIcon,
      color: '#DC143C',
      onPress: () => {
        setShowSubMenu(false);
        setShowDebtsModal(true);
      },
    },
    {
      title: 'عرض العملاء',
      icon: Eye,
      iconStyle: styles.viewCustomersIcon,
      color: '#4169E1',
      onPress: () => {
        setShowSubMenu(false);
        setShowViewModal(true);
      },
    },
  ];

  const handleAddCustomer = () => {
    if (!formData.nameAr || !formData.phone) {
      Alert.alert('خطأ', 'يرجى ملء الحقول المطلوبة');
      return;
    }

    const openingBalance = parseFloat(formData.openingBalance) || 0;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      addressAr: formData.addressAr,
      totalPurchases: 0,
      openingBalance,
      currentBalance: openingBalance,
      createdAt: new Date(),
    };

    addCustomer(newCustomer);
    setFormData({
      name: '',
      nameAr: '',
      phone: '',
      email: '',
      address: '',
      addressAr: '',
      openingBalance: '',
    });
    setShowAddModal(false);
    Alert.alert('نجح', 'تم إضافة العميل بنجاح');
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      nameAr: customer.nameAr,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      addressAr: customer.addressAr || '',
      openingBalance: customer.openingBalance.toString(),
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = () => {
    if (!formData.nameAr || !formData.phone) {
      Alert.alert('خطأ', 'يرجى ملء الحقول المطلوبة');
      return;
    }

    if (!editingCustomer) return;

    const openingBalance = parseFloat(formData.openingBalance) || 0;
    const balanceDifference = openingBalance - editingCustomer.openingBalance;

    const updatedCustomer: Customer = {
      ...editingCustomer,
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      addressAr: formData.addressAr,
      openingBalance,
      currentBalance: editingCustomer.currentBalance + balanceDifference,
    };

    updateCustomer(updatedCustomer);
    setFormData({
      name: '',
      nameAr: '',
      phone: '',
      email: '',
      address: '',
      addressAr: '',
      openingBalance: '',
    });
    setEditingCustomer(null);
    setShowEditModal(false);
    Alert.alert('نجح', 'تم تحديث العميل بنجاح');
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف العميل ${customer.nameAr}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            deleteCustomer(customer.id);
            setShowViewModal(false);
            Alert.alert('نجح', 'تم حذف العميل بنجاح');
          }
        },
      ]
    );
  };

  const handlePayDebt = () => {
    if (!selectedCustomerForDebt || !paymentAmount) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ السداد');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      Alert.alert('خطأ', 'مبلغ السداد يجب أن يكون أكبر من صفر');
      return;
    }

    if (amount > selectedCustomerForDebt.currentBalance) {
      Alert.alert('خطأ', 'مبلغ السداد لا يمكن أن يكون أكبر من الذمة المستحقة');
      return;
    }

    payCustomerDebt(selectedCustomerForDebt.id, amount);
    
    Alert.alert('نجح', `تم سداد ${amount.toFixed(2)} ${settings.currencySymbol} من ذمة ${selectedCustomerForDebt.nameAr}`);
    
    setShowPayDebtModal(false);
    setSelectedCustomerForDebt(null);
    setPaymentAmount('');
  };

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < customerMenuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {customerMenuItems.slice(i, i + 2).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, item.iconStyle]}>
                <item.icon size={30} color={item.color} />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          {/* Fill empty space if odd number of items */}
          {customerMenuItems.slice(i, i + 2).length === 1 && (
            <View style={[styles.gridItem, { opacity: 0 }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  const totalCustomers = customers.length;
  const totalDebts = customers.reduce((sum, customer) => sum + customer.currentBalance, 0);
  const totalPurchases = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);
  const customersWithDebts = customers.filter(customer => customer.currentBalance > 0);

  const handlePrintAllCustomers = async () => {
    const reportHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تقرير العملاء الشامل</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              direction: rtl; 
              text-align: right; 
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .report { 
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
            .summary { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 10px; 
              margin-bottom: 30px; 
              border: 1px solid #e0e0e0;
            }
            .summary h2 { 
              color: #333; 
              margin-bottom: 15px; 
              text-align: center;
            }
            .summary-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .summary-item { 
              text-align: center; 
              padding: 15px; 
              background: white; 
              border-radius: 8px; 
              border: 1px solid #e0e0e0;
            }
            .summary-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #5865F2; 
              margin-bottom: 5px;
            }
            .summary-label { 
              color: #666; 
              font-size: 14px;
            }
            .customers-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px; 
            }
            .customers-table th, .customers-table td { 
              border: 1px solid #ddd; 
              padding: 12px; 
              text-align: center; 
            }
            .customers-table th { 
              background: #5865F2; 
              color: white; 
              font-weight: bold; 
            }
            .customers-table tr:nth-child(even) { 
              background: #f9f9f9; 
            }
            .debt-amount { 
              color: #EF4444; 
              font-weight: bold; 
            }
            .no-debt { 
              color: #10B981; 
            }
            .section-title { 
              color: #333; 
              font-size: 20px; 
              margin: 30px 0 15px; 
              border-bottom: 2px solid #e0e0e0; 
              padding-bottom: 10px;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
              border-top: 1px solid #e0e0e0; 
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="report">
            <div class="header">
              <h1>${settings.businessNameAr}</h1>
              <div>${settings.businessAddressAr}</div>
              <div>هاتف: ${settings.businessPhone}</div>
              <div>بريد إلكتروني: ${settings.businessEmail}</div>
            </div>

            <div class="summary">
              <h2>ملخص العملاء</h2>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${totalCustomers}</div>
                  <div class="summary-label">إجمالي العملاء</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${totalPurchases.toFixed(2)} ${settings.currencySymbol}</div>
                  <div class="summary-label">إجمالي المشتريات</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${totalDebts.toFixed(2)} ${settings.currencySymbol}</div>
                  <div class="summary-label">إجمالي الذمم</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${totalCustomers > 0 ? (totalPurchases / totalCustomers).toFixed(2) : '0.00'} ${settings.currencySymbol}</div>
                  <div class="summary-label">متوسط المشتريات</div>
                </div>
              </div>
            </div>

            <h3 class="section-title">قائمة العملاء التفصيلية</h3>
            <table class="customers-table">
              <thead>
                <tr>
                  <th>اسم العميل</th>
                  <th>رقم الهاتف</th>
                  <th>البريد الإلكتروني</th>
                  <th>إجمالي المشتريات</th>
                  <th>الرصيد الحالي</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${customers.map(customer => `
                  <tr>
                    <td>${customer.nameAr}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email || '-'}</td>
                    <td>${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}</td>
                    <td class="${customer.currentBalance > 0 ? 'debt-amount' : 'no-debt'}">
                      ${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}
                    </td>
                    <td class="${customer.currentBalance > 0 ? 'debt-amount' : 'no-debt'}">
                      ${customer.currentBalance > 0 ? 'مدين' : 'سليم'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            ${customersWithDebts.length > 0 ? `
              <h3 class="section-title">العملاء المدينون (${customersWithDebts.length})</h3>
              <table class="customers-table">
                <thead>
                  <tr>
                    <th>اسم العميل</th>
                    <th>رقم الهاتف</th>
                    <th>مبلغ الذمة</th>
                    <th>إجمالي المشتريات</th>
                  </tr>
                </thead>
                <tbody>
                  ${customersWithDebts.map(customer => `
                    <tr>
                      <td>${customer.nameAr}</td>
                      <td>${customer.phone}</td>
                      <td class="debt-amount">${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}</td>
                      <td>${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            <div class="footer">
              <div><strong>تاريخ التقرير:</strong> ${new Date().toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
              <div style="margin-top: 10px;">${settings.receiptFooterAr}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const reportText = `
تقرير العملاء الشامل
==================

${settings.businessNameAr}
${settings.businessAddressAr}
${settings.businessPhone}

ملخص العملاء:
============
إجمالي العملاء: ${totalCustomers}
إجمالي المشتريات: ${totalPurchases.toFixed(2)} ${settings.currencySymbol}
إجمالي الذمم: ${totalDebts.toFixed(2)} ${settings.currencySymbol}
متوسط المشتريات: ${totalCustomers > 0 ? (totalPurchases / totalCustomers).toFixed(2) : '0.00'} ${settings.currencySymbol}

قائمة العملاء:
=============
${customers.map(customer => `
العميل: ${customer.nameAr}
الهاتف: ${customer.phone}
البريد: ${customer.email || '-'}
إجمالي المشتريات: ${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}
الرصيد الحالي: ${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}
الحالة: ${customer.currentBalance > 0 ? 'مدين' : 'سليم'}
-------------------`).join('\n')}

${customersWithDebts.length > 0 ? `
العملاء المدينون (${customersWithDebts.length}):
========================
${customersWithDebts.map(customer => `
${customer.nameAr} - ${customer.phone}
مبلغ الذمة: ${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}
إجمالي المشتريات: ${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}
-------------------`).join('\n')}
` : ''}

تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
${settings.receiptFooterAr}
    `;

    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      try {
        await Share.share({
          message: reportText,
          title: 'تقرير العملاء الشامل',
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في مشاركة التقرير');
      }
    }
  };

  const handlePrintSingleCustomer = async (customer: Customer) => {
    const customerHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>بيانات العميل - ${customer.nameAr}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              direction: rtl; 
              text-align: right; 
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .customer-report { 
              max-width: 600px; 
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
              font-size: 24px;
            }
            .customer-info { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 10px; 
              margin-bottom: 20px; 
            }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 10px; 
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .info-label { 
              font-weight: bold; 
              color: #333; 
            }
            .info-value { 
              color: #666; 
            }
            .debt-value { 
              color: #EF4444; 
              font-weight: bold; 
            }
            .no-debt { 
              color: #10B981; 
              font-weight: bold; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
              border-top: 1px solid #e0e0e0; 
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="customer-report">
            <div class="header">
              <h1>بيانات العميل</h1>
              <div>${settings.businessNameAr}</div>
              <div>${settings.businessAddressAr}</div>
              <div>هاتف: ${settings.businessPhone}</div>
            </div>

            <div class="customer-info">
              <div class="info-row">
                <span class="info-value">${customer.nameAr}</span>
                <span class="info-label">اسم العميل:</span>
              </div>
              <div class="info-row">
                <span class="info-value">${customer.phone}</span>
                <span class="info-label">رقم الهاتف:</span>
              </div>
              ${customer.email ? `
                <div class="info-row">
                  <span class="info-value">${customer.email}</span>
                  <span class="info-label">البريد الإلكتروني:</span>
                </div>
              ` : ''}
              ${customer.addressAr ? `
                <div class="info-row">
                  <span class="info-value">${customer.addressAr}</span>
                  <span class="info-label">العنوان:</span>
                </div>
              ` : ''}
              <div class="info-row">
                <span class="info-value">${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}</span>
                <span class="info-label">إجمالي المشتريات:</span>
              </div>
              <div class="info-row">
                <span class="info-value">${customer.openingBalance.toFixed(2)} ${settings.currencySymbol}</span>
                <span class="info-label">الرصيد الافتتاحي:</span>
              </div>
              <div class="info-row">
                <span class="info-value ${customer.currentBalance > 0 ? 'debt-value' : 'no-debt'}">
                  ${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}
                </span>
                <span class="info-label">الرصيد الحالي:</span>
              </div>
              <div class="info-row">
                <span class="info-value ${customer.currentBalance > 0 ? 'debt-value' : 'no-debt'}">
                  ${customer.currentBalance > 0 ? 'مدين' : 'سليم'}
                </span>
                <span class="info-label">حالة الحساب:</span>
              </div>
              <div class="info-row">
                <span class="info-value">${customer.createdAt.toLocaleDateString('ar-SA')}</span>
                <span class="info-label">تاريخ التسجيل:</span>
              </div>
            </div>

            <div class="footer">
              <div><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
              <div style="margin-top: 10px;">${settings.receiptFooterAr}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const customerText = `
بيانات العميل
============

${settings.businessNameAr}
${settings.businessAddressAr}
${settings.businessPhone}

معلومات العميل:
===============
اسم العميل: ${customer.nameAr}
رقم الهاتف: ${customer.phone}
البريد الإلكتروني: ${customer.email || '-'}
العنوان: ${customer.addressAr || '-'}

المعلومات المالية:
==================
إجمالي المشتريات: ${customer.totalPurchases.toFixed(2)} ${settings.currencySymbol}
الرصيد الافتتاحي: ${customer.openingBalance.toFixed(2)} ${settings.currencySymbol}
الرصيد الحالي: ${customer.currentBalance.toFixed(2)} ${settings.currencySymbol}
حالة الحساب: ${customer.currentBalance > 0 ? 'مدين' : 'سليم'}
تاريخ التسجيل: ${customer.createdAt.toLocaleDateString('ar-SA')}

تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}
${settings.receiptFooterAr}
    `;

    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(customerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      try {
        await Share.share({
          message: customerText,
          title: `بيانات العميل - ${customer.nameAr}`,
        });
      } catch (error) {
        Alert.alert('خطأ', 'فشل في مشاركة بيانات العميل');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>العملاء</Text>
        <View style={styles.headerButtons}>
          <Button
            title="طباعة التقرير"
            onPress={handlePrintAllCustomers}
            icon={<FileText size={16} color="#FFFFFF" />}
            size="small"
          />
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showSubMenu ? (
          <View style={styles.gridContainer}>
            {renderGridItems()}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <Button
              title="العودة للقائمة الرئيسية"
              onPress={() => setShowSubMenu(true)}
              variant="outline"
            />
          </View>
        )}
      </ScrollView>

      {/* Add Customer Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة عميل جديد</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Input
                label="الاسم (English)"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Customer Name"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم العميل"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="رقم الهاتف *"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="+966501234567"
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#666" />}
              />

              <Input
                label="البريد الإلكتروني"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="customer@example.com"
                keyboardType="email-address"
                icon={<Mail size={20} color="#666" />}
              />

              <Input
                label="العنوان (English)"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="Address"
                icon={<MapPin size={20} color="#666" />}
              />

              <Input
                label="العنوان (العربية)"
                value={formData.addressAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, addressAr: text }))}
                placeholder="العنوان"
                icon={<MapPin size={20} color="#666" />}
              />

              <Input
                label="الرصيد الافتتاحي"
                value={formData.openingBalance}
                onChangeText={(text) => setFormData(prev => ({ ...prev, openingBalance: text }))}
                placeholder="0.00"
                keyboardType="numeric"
                icon={<DollarSign size={20} color="#666" />}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowAddModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="إضافة"
                  onPress={handleAddCustomer}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Customers Modal */}
      <Modal visible={showViewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>قائمة العملاء</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowViewModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {/* Summary Card */}
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>ملخص العملاء</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalCustomers]}>{totalCustomers}</Text>
                  <Text style={styles.summaryLabel}>إجمالي العملاء</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalPurchases]}>
                    {totalPurchases.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي المشتريات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalDebts]}>
                    {totalDebts.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي الذمم</Text>
                </View>
              </Card>

              {customers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا يوجد عملاء</Text>
                </View>
              ) : (
                customers.map((customer) => (
                  <Card key={customer.id} style={styles.customerCard}>
                    <View style={styles.customerHeader}>
                      <Text style={styles.customerName}>{customer.nameAr}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        {customer.currentBalance > 0 && (
                          <View style={styles.customerBadge}>
                            <Text style={styles.customerBadgeText}>ذمة</Text>
                          </View>
                        )}
                        <TouchableOpacity
                          style={{ padding: 8, borderRadius: 8, backgroundColor: '#5865F2' + '20' }}
                          onPress={() => handleEditCustomer(customer)}
                        >
                          <Edit size={16} color="#5865F2" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ padding: 8, borderRadius: 8, backgroundColor: '#10B981' + '20' }}
                          onPress={() => handlePrintSingleCustomer(customer)}
                        >
                          <Printer size={16} color="#10B981" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ padding: 8, borderRadius: 8, backgroundColor: '#EF4444' + '20' }}
                          onPress={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* زر سداد الذمة الكبير والواضح */}
                    {customer.currentBalance > 0 && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#10B981',
                          paddingVertical: 16,
                          paddingHorizontal: 20,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          marginBottom: 16,
                          shadowColor: '#10B981',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 4,
                        }}
                        onPress={() => {
                          setSelectedCustomerForDebt(customer);
                          setShowPayDebtModal(true);
                        }}
                      >
                        <Text style={{
                          color: '#FFFFFF',
                          fontSize: 16,
                          fontWeight: 'bold',
                          fontFamily: 'Cairo-Bold',
                        }}>
                          سداد
                        </Text>
                        <Text style={{
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 'bold',
                          fontFamily: 'Cairo-Bold',
                        }}>
                          سداد الذمة ({customer.currentBalance.toFixed(2)} {settings.currencySymbol})
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerInfoText}>{customer.phone}</Text>
                      <Phone size={16} color="#666" />
                    </View>
                    
                    {customer.email && (
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerInfoText}>{customer.email}</Text>
                        <Mail size={16} color="#666" />
                      </View>
                    )}

                    <View style={styles.customerStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {customer.totalPurchases.toFixed(0)} {settings.currencySymbol}
                        </Text>
                        <Text style={styles.statLabel}>إجمالي المشتريات</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, customer.currentBalance > 0 && styles.debtValue]}>
                          {customer.currentBalance.toFixed(2)}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الحالي</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {customer.openingBalance.toFixed(2)}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الافتتاحي</Text>
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Customer Debts Modal */}
      <Modal visible={showDebtsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ذمم العملاء</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDebtsModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {customersWithDebts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا توجد ذمم للعملاء</Text>
                </View>
              ) : (
                <>
                  <Card style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>ملخص الذمم</Text>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryValue, styles.totalDebts]}>
                        {totalDebts.toFixed(2)} {settings.currencySymbol}
                      </Text>
                      <Text style={styles.summaryLabel}>إجمالي الذمم</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryValue, styles.totalCustomers]}>
                        {customersWithDebts.length}
                      </Text>
                      <Text style={styles.summaryLabel}>عدد العملاء المدينين</Text>
                    </View>
                  </Card>

                  {customersWithDebts.map((customer) => (
                    <Card key={customer.id} style={styles.customerCard}>
                      <View style={styles.customerHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.customerName}>{customer.nameAr}</Text>
                          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 }}>
                            <View style={[styles.customerBadge, { backgroundColor: '#EF4444' }]}>
                              <Text style={styles.customerBadgeText}>
                                {customer.currentBalance.toFixed(2)} {settings.currencySymbol}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{ 
                                padding: 10, 
                                borderRadius: 8, 
                                backgroundColor: '#10B981',
                                minWidth: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onPress={() => {
                                setSelectedCustomerForDebt(customer);
                                setShowPayDebtModal(true);
                              }}
                            >
                              <Text style={{
                                color: '#FFFFFF',
                                fontSize: 12,
                                fontWeight: 'bold',
                                fontFamily: 'Cairo-Bold',
                              }}>
                                سداد
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{ 
                              padding: 10, 
                              borderRadius: 8, 
                              backgroundColor: '#10B981',
                              minWidth: 40,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onPress={() => handlePrintSingleCustomer(customer)}
                          >
                            <Printer size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerInfoText}>{customer.phone}</Text>
                        <Phone size={16} color="#666" />
                      </View>
                    </Card>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Opening Balance Modal */}
      <Modal visible={showBalanceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الأرصدة الافتتاحية</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowBalanceModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {customers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا يوجد عملاء</Text>
                </View>
              ) : (
                customers.map((customer) => (
                  <Card key={customer.id} style={styles.customerCard}>
                    <Text style={styles.customerName}>{customer.nameAr}</Text>
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerInfoText}>{customer.phone}</Text>
                      <Phone size={16} color="#666" />
                    </View>
                    <View style={styles.customerStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {customer.openingBalance.toFixed(2)} {settings.currencySymbol}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الافتتاحي</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, customer.currentBalance > 0 && styles.debtValue]}>
                          {customer.currentBalance.toFixed(2)} {settings.currencySymbol}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الحالي</Text>
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>تعديل العميل</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Input
                label="الاسم (English)"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Customer Name"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم العميل"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="رقم الهاتف *"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="+966501234567"
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#666" />}
              />

              <Input
                label="البريد الإلكتروني"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="customer@example.com"
                keyboardType="email-address"
                icon={<Mail size={20} color="#666" />}
              />

              <Input
                label="العنوان (English)"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="Address"
                icon={<MapPin size={20} color="#666" />}
              />

              <Input
                label="العنوان (العربية)"
                value={formData.addressAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, addressAr: text }))}
                placeholder="العنوان"
                icon={<MapPin size={20} color="#666" />}
              />

              <Input
                label="الرصيد الافتتاحي"
                value={formData.openingBalance}
                onChangeText={(text) => setFormData(prev => ({ ...prev, openingBalance: text }))}
                placeholder="0.00"
                keyboardType="numeric"
                icon={<DollarSign size={20} color="#666" />}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowEditModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="حفظ"
                  onPress={handleUpdateCustomer}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Pay Debt Modal */}
      <Modal visible={showPayDebtModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>سداد ذمة العميل</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowPayDebtModal(false);
                  setSelectedCustomerForDebt(null);
                  setPaymentAmount('');
                }}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedCustomerForDebt && (
              <>
                <View style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'right', marginBottom: 8 }}>
                    العميل: {selectedCustomerForDebt.nameAr}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#EF4444', fontWeight: 'bold', textAlign: 'right' }}>
                    الذمة المستحقة: {selectedCustomerForDebt.currentBalance.toFixed(2)} {settings.currencySymbol}
                  </Text>
                </View>

                <Input
                  label="مبلغ السداد *"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder={`الحد الأقصى: ${selectedCustomerForDebt.currentBalance.toFixed(2)}`}
                  keyboardType="numeric"
                  icon={<DollarSign size={20} color="#666" />}
                />

                <View style={styles.modalButtons}>
                  <Button
                    title="إلغاء"
                    onPress={() => {
                      setShowPayDebtModal(false);
                      setSelectedCustomerForDebt(null);
                      setPaymentAmount('');
                    }}
                    variant="outline"
                    style={styles.modalButton}
                  />
                  <Button
                    title="سداد"
                    onPress={handlePayDebt}
                    style={styles.modalButton}
                    icon={<DollarSign size={16} color="#FFFFFF" />}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}