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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, DollarSign, CreditCard, Eye, UserPlus, X, Phone, Mail, MapPin, User, TrendingUp, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Customer } from '@/types/global';

const { width } = Dimensions.get('window');

export default function Customers() {
  const { theme, t, language, customers, addCustomer, updateCustomer, deleteCustomer, payCustomerDebt, settings } = useApp();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDebtsModal, setShowDebtsModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayDebtModal, setShowPayDebtModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    phone: '',
    email: '',
    address: '',
    addressAr: '',
    openingBalance: '',
  });
  const [paymentAmount, setPaymentAmount] = useState('');

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
    customerActions: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#5865F2' + '20',
    },
    deleteButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#EF4444' + '20',
    },
    payDebtButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#10B981' + '20',
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
    if (!selectedCustomer || !paymentAmount) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ الدفع');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedCustomer.currentBalance) {
      Alert.alert('خطأ', 'مبلغ الدفع غير صحيح');
      return;
    }

    payCustomerDebt(selectedCustomer.id, amount);
    setPaymentAmount('');
    setSelectedCustomer(null);
    setShowPayDebtModal(false);
    Alert.alert('نجح', 'تم تسجيل الدفع بنجاح');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>العملاء</Text>
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
                icon={<User size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم العميل"
                icon={<User size={20} color="#666" />}
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
                      <View style={styles.customerActions}>
                        {customer.currentBalance > 0 && (
                          <View style={styles.customerBadge}>
                            <Text style={styles.customerBadgeText}>ذمة</Text>
                          </View>
                        )}
                        {customer.currentBalance > 0 && (
                          <TouchableOpacity
                            style={styles.payDebtButton}
                            onPress={() => {
                              setSelectedCustomer(customer);
                              setShowPayDebtModal(true);
                            }}
                          >
                            <DollarSign size={16} color="#10B981" />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditCustomer(customer)}
                        >
                          <Edit size={16} color="#5865F2" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
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
                        <Text style={styles.customerName}>{customer.nameAr}</Text>
                        <View style={styles.customerActions}>
                          <View style={[styles.customerBadge, { backgroundColor: '#EF4444' }]}>
                            <Text style={styles.customerBadgeText}>
                              {customer.currentBalance.toFixed(2)} {settings.currencySymbol}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.payDebtButton}
                            onPress={() => {
                              setSelectedCustomer(customer);
                              setShowPayDebtModal(true);
                            }}
                          >
                            <DollarSign size={16} color="#10B981" />
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
                icon={<User size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم العميل"
                icon={<User size={20} color="#666" />}
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
                onPress={() => setShowPayDebtModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedCustomer && (
              <>
                <View style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 8 }}>
                    العميل: {selectedCustomer.nameAr}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 4 }}>
                    الهاتف: {selectedCustomer.phone}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EF4444', textAlign: 'right' }}>
                    إجمالي الذمة: {selectedCustomer.currentBalance.toFixed(2)} {settings.currencySymbol}
                  </Text>
                </View>

                <Input
                  label="مبلغ الدفع"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder={selectedCustomer.currentBalance.toFixed(2)}
                  keyboardType="numeric"
                  icon={<DollarSign size={20} color="#666" />}
                />

                <View style={styles.modalButtons}>
                  <Button
                    title="إلغاء"
                    onPress={() => setShowPayDebtModal(false)}
                    variant="outline"
                    style={styles.modalButton}
                  />
                  <Button
                    title="تسجيل الدفع"
                    onPress={handlePayDebt}
                    style={styles.modalButton}
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