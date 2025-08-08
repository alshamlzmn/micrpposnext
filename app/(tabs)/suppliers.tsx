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
import { Plus, DollarSign, CreditCard, Eye, UserPlus, X, Phone, Mail, MapPin, Building, TrendingUp, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Supplier } from '@/types/global';

const { width } = Dimensions.get('window');

export default function Suppliers() {
  const { theme, t, language, suppliers, addSupplier, updateSupplier, deleteSupplier, settings } = useApp();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDebtsModal, setShowDebtsModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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
    addSupplierIcon: {
      backgroundColor: '#E8F5E8',
    },
    openingBalanceIcon: {
      backgroundColor: '#FFF8DC',
    },
    supplierDebtsIcon: {
      backgroundColor: '#FFE4E1',
    },
    viewSuppliersIcon: {
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
    supplierCard: {
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
    supplierHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    supplierName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
      flex: 1,
    },
    supplierBadge: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 12,
    },
    supplierBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    supplierInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      justifyContent: 'flex-end',
    },
    supplierInfoText: {
      fontSize: 14,
      color: '#666',
      marginRight: 8,
      fontFamily: 'Cairo-Regular',
    },
    supplierStats: {
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
    totalSuppliers: {
      color: '#5865F2',
    },
    totalDebts: {
      color: '#EF4444',
    },
    totalOrders: {
      color: '#10B981',
    },
  });

  const supplierMenuItems = [
    {
      title: 'إضافة مورد',
      icon: UserPlus,
      iconStyle: styles.addSupplierIcon,
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
      title: 'ذمم الموردين',
      icon: CreditCard,
      iconStyle: styles.supplierDebtsIcon,
      color: '#DC143C',
      onPress: () => {
        setShowSubMenu(false);
        setShowDebtsModal(true);
      },
    },
    {
      title: 'عرض الموردين',
      icon: Eye,
      iconStyle: styles.viewSuppliersIcon,
      color: '#4169E1',
      onPress: () => {
        setShowSubMenu(false);
        setShowViewModal(true);
      },
    },
  ];

  const handleAddSupplier = () => {
    if (!formData.nameAr || !formData.phone) {
      Alert.alert('خطأ', 'يرجى ملء الحقول المطلوبة');
      return;
    }

    const openingBalance = parseFloat(formData.openingBalance) || 0;

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      addressAr: formData.addressAr,
      totalOrders: 0,
      openingBalance,
      currentBalance: openingBalance,
      createdAt: new Date(),
    };

    addSupplier(newSupplier);
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
    Alert.alert('نجح', 'تم إضافة المورد بنجاح');
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      nameAr: supplier.nameAr,
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      addressAr: supplier.addressAr || '',
      openingBalance: supplier.openingBalance.toString(),
    });
    setShowEditModal(true);
  };

  const handleUpdateSupplier = () => {
    if (!formData.nameAr || !formData.phone) {
      Alert.alert('خطأ', 'يرجى ملء الحقول المطلوبة');
      return;
    }

    if (!editingSupplier) return;

    const openingBalance = parseFloat(formData.openingBalance) || 0;
    const balanceDifference = openingBalance - editingSupplier.openingBalance;

    const updatedSupplier: Supplier = {
      ...editingSupplier,
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      addressAr: formData.addressAr,
      openingBalance,
      currentBalance: editingSupplier.currentBalance + balanceDifference,
    };

    updateSupplier(updatedSupplier);
    setFormData({
      name: '',
      nameAr: '',
      phone: '',
      email: '',
      address: '',
      addressAr: '',
      openingBalance: '',
    });
    setEditingSupplier(null);
    setShowEditModal(false);
    Alert.alert('نجح', 'تم تحديث المورد بنجاح');
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف المورد ${supplier.nameAr}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            deleteSupplier(supplier.id);
            setShowViewModal(false);
            setShowViewModal(false);
            Alert.alert('نجح', 'تم حذف المورد بنجاح');
          }
        },
      ]
    );
  };

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < supplierMenuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {supplierMenuItems.slice(i, i + 2).map((item, index) => (
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
          {supplierMenuItems.slice(i, i + 2).length === 1 && (
            <View style={[styles.gridItem, { opacity: 0 }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  const totalSuppliers = suppliers.length;
  const totalDebts = suppliers.reduce((sum, supplier) => sum + supplier.currentBalance, 0);
  const totalOrders = suppliers.reduce((sum, supplier) => sum + supplier.totalOrders, 0);
  const suppliersWithDebts = suppliers.filter(supplier => supplier.currentBalance > 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الموردين</Text>
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

      {/* Add Supplier Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة مورد جديد</Text>
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
                placeholder="Supplier Name"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم المورد"
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
                placeholder="supplier@example.com"
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
                  onPress={handleAddSupplier}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Suppliers Modal */}
      <Modal visible={showViewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>قائمة الموردين</Text>
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
                <Text style={styles.summaryTitle}>ملخص الموردين</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalSuppliers]}>{totalSuppliers}</Text>
                  <Text style={styles.summaryLabel}>إجمالي الموردين</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalOrders]}>
                    {totalOrders.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي الطلبات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalDebts]}>
                    {totalDebts.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي الذمم</Text>
                </View>
              </Card>

              {suppliers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا يوجد موردين</Text>
                </View>
              ) : (
                suppliers.map((supplier) => (
                  <Card key={supplier.id} style={styles.supplierCard}>
                    <View style={styles.supplierHeader}>
                      <Text style={styles.supplierName}>{supplier.nameAr}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      {supplier.currentBalance > 0 && (
                        <View style={styles.supplierBadge}>
                          <Text style={styles.supplierBadgeText}>ذمة</Text>
                        </View>
                      )}
                        <TouchableOpacity
                          style={{ padding: 8, borderRadius: 8, backgroundColor: '#5865F2' + '20' }}
                          onPress={() => handleEditSupplier(supplier)}
                        >
                          <Edit size={16} color="#5865F2" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ padding: 8, borderRadius: 8, backgroundColor: '#EF4444' + '20' }}
                          onPress={() => handleDeleteSupplier(supplier)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.supplierInfo}>
                      <Text style={styles.supplierInfoText}>{supplier.phone}</Text>
                      <Phone size={16} color="#666" />
                    </View>
                    
                    {supplier.email && (
                      <View style={styles.supplierInfo}>
                        <Text style={styles.supplierInfoText}>{supplier.email}</Text>
                        <Mail size={16} color="#666" />
                      </View>
                    )}

                    <View style={styles.supplierStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {supplier.totalOrders.toFixed(0)} {settings.currencySymbol}
                        </Text>
                        <Text style={styles.statLabel}>إجمالي الطلبات</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, supplier.currentBalance > 0 && styles.debtValue]}>
                          {supplier.currentBalance.toFixed(2)}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الحالي</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {supplier.openingBalance.toFixed(2)}
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

      {/* Supplier Debts Modal */}
      <Modal visible={showDebtsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ذمم الموردين</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDebtsModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {suppliersWithDebts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا توجد ذمم للموردين</Text>
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
                      <Text style={[styles.summaryValue, styles.totalSuppliers]}>
                        {suppliersWithDebts.length}
                      </Text>
                      <Text style={styles.summaryLabel}>عدد الموردين المدينين</Text>
                    </View>
                  </Card>

                  {suppliersWithDebts.map((supplier) => (
                    <Card key={supplier.id} style={styles.supplierCard}>
                      <View style={styles.supplierHeader}>
                        <Text style={styles.supplierName}>{supplier.nameAr}</Text>
                        <View style={[styles.supplierBadge, { backgroundColor: '#EF4444' }]}>
                          <Text style={styles.supplierBadgeText}>
                            {supplier.currentBalance.toFixed(2)} {settings.currencySymbol}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.supplierInfo}>
                        <Text style={styles.supplierInfoText}>{supplier.phone}</Text>
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
              {suppliers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا يوجد موردين</Text>
                </View>
              ) : (
                suppliers.map((supplier) => (
                  <Card key={supplier.id} style={styles.supplierCard}>
                    <Text style={styles.supplierName}>{supplier.nameAr}</Text>
                    <View style={styles.supplierInfo}>
                      <Text style={styles.supplierInfoText}>{supplier.phone}</Text>
                      <Phone size={16} color="#666" />
                    </View>
                    <View style={styles.supplierStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {supplier.openingBalance.toFixed(2)} {settings.currencySymbol}
                        </Text>
                        <Text style={styles.statLabel}>الرصيد الافتتاحي</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, supplier.currentBalance > 0 && styles.debtValue]}>
                          {supplier.currentBalance.toFixed(2)} {settings.currencySymbol}
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

      {/* Edit Supplier Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>تعديل المورد</Text>
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
                placeholder="Supplier Name"
                icon={<Building size={20} color="#666" />}
              />

              <Input
                label="الاسم (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم المورد"
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
                placeholder="supplier@example.com"
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
                  onPress={handleUpdateSupplier}
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