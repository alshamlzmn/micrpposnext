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
import { 
  Plus, 
  Package, 
  Eye,
  X,
  Building,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  Minus,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
const { width } = Dimensions.get('window');

interface Purchase {
  id: string;
  invoiceNumber: string;
  date: Date;
  supplierId: string;
  supplier: any;
  items: Array<{ productId: string; product: any; quantity: number; unitCost: number; total: number }>;
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

export default function Purchases() {
  const { theme, t, language, suppliers, settings, products, addCashboxTransaction, updateProduct, categories } = useApp();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    supplierId: '',
    discount: '0',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'transfer' | 'credit',
    paidAmount: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product: any; quantity: number; unitCost: number }>>([]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        return String(product.categoryId) === String(selectedCategory);
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
    addPurchaseIcon: {
      backgroundColor: '#E8F5E8',
    },
    viewPurchasesIcon: {
      backgroundColor: '#E6F3FF',
    },
    purchaseReportsIcon: {
      backgroundColor: '#FFF8DC',
    },
    supplierOrdersIcon: {
      backgroundColor: '#FFE4E1',
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
    categorySelector: {
      marginBottom: 16,
    },
    categoryScroll: {
      flexGrow: 0,
    },
    categoryChip: {
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    categoryChipActive: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    categoryChipText: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    productItemContainer: {
      backgroundColor: '#F8F9FA',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addProductButtonFixed: {
      backgroundColor: '#5865F2',
      padding: 8,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 36,
      minHeight: 36,
    },
    productItemInfo: {
      flex: 1,
      alignItems: 'flex-end',
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
    totalPreview: {
      backgroundColor: '#F8F9FA',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    totalPreviewTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12,
      fontFamily: 'Cairo-Bold',
    },
    totalPreviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    totalPreviewLabel: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    totalPreviewValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    grandTotalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    paymentMethodSelector: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    paymentMethodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
    },
    paymentMethodButtonActive: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    paymentMethodButtonText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Cairo-Medium',
      color: '#333',
    },
    paymentMethodButtonTextActive: {
      color: '#FFFFFF',
    },
    productItemName: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    productItemCategory: {
      fontSize: 12,
      color: '#5865F2',
      textAlign: 'right',
      marginBottom: 2,
    },
    productItemCost: {
      fontSize: 12,
      color: '#666',
      textAlign: 'right',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    quantityButton: {
      backgroundColor: '#F5F5F5',
      padding: 8,
      borderRadius: 6,
      marginHorizontal: 4,
    },
    quantityText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginHorizontal: 12,
      minWidth: 30,
      textAlign: 'center',
    },
  });

  const addProductToPurchase = (product: any) => {
    setSelectedProducts(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, unitCost: product.cost }];
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

  const handleAddPurchase = () => {
    if (!formData.supplierId || selectedProducts.length === 0) {
      Alert.alert('خطأ', 'يرجى اختيار مورد وإضافة منتجات');
      return;
    }

    const supplier = suppliers.find(s => s.id === formData.supplierId);
    if (!supplier) {
      Alert.alert('خطأ', 'المورد غير موجود');
      return;
    }

    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    const discountAmount = (subtotal * parseFloat(formData.discount || '0')) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * settings.taxRate) / 100;
    const total = taxableAmount + taxAmount;
    const paidAmount = parseFloat(formData.paidAmount || '0');

    const purchase: Purchase = {
      id: Date.now().toString(),
      invoiceNumber: `PUR-${Date.now()}`,
      date: new Date(),
      supplierId: formData.supplierId,
      supplier,
      items: selectedProducts.map(item => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        unitCost: item.unitCost,
        total: item.quantity * item.unitCost,
      })),
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paidAmount,
      remainingAmount: total - paidAmount,
      paymentMethod: formData.paymentMethod,
      status: 'completed',
      notes: formData.notes,
    };

    // Update product stock
    selectedProducts.forEach(item => {
      updateProduct({
        ...item.product,
        stock: item.product.stock + item.quantity,
      });
    });

    // Add cashbox transaction if auto-deduct is enabled and payment was made
    if (paidAmount > 0 && settings.autoDeductPurchasesFromCashbox) {
      addCashboxTransaction({
        id: Date.now().toString(),
        type: 'subtract',
        amount: paidAmount,
        description: `Purchase payment - Invoice ${purchase.invoiceNumber}`,
        descriptionAr: `دفعة مشتريات - فاتورة ${purchase.invoiceNumber}`,
        date: new Date(),
        isActive: true,
        source: 'purchase',
        referenceId: purchase.id,
      });
    }

    setPurchases(prev => [purchase, ...prev]);
    
    // Reset form
    setFormData({
      supplierId: '',
      discount: '0',
      notes: '',
      paymentMethod: 'cash',
      paidAmount: '',
    });
    setSelectedProducts([]);
    setShowAddModal(false);
    
    Alert.alert('نجح', 'تم إضافة المشتريات بنجاح');
  };

  // Debug logging
  React.useEffect(() => {
  }, [products, categories, selectedCategory, filteredProducts, selectedProducts, formData]);

  // Calculate totals for preview
  const subtotal = selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const discountAmount = (subtotal * parseFloat(formData.discount || '0')) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * settings.taxRate) / 100;
  const total = taxableAmount + taxAmount;
  const paidAmount = parseFloat(formData.paidAmount || '0');
  const remainingAmount = total - paidAmount;

  // Check if form is valid for submission
  const isFormValid = formData.supplierId && selectedProducts.length > 0;

  const purchaseMenuItems = [
    {
      title: 'إضافة مشتريات',
      icon: Plus,
      iconStyle: styles.addPurchaseIcon,
      color: '#32CD32',
      onPress: () => {
        setShowSubMenu(false);
        setShowAddModal(true);
      },
    },
    {
      title: 'عرض المشتريات',
      icon: Eye,
      iconStyle: styles.viewPurchasesIcon,
      color: '#4169E1',
      onPress: () => {
        setShowSubMenu(false);
        setShowViewModal(true);
      },
    },
    {
      title: 'تقارير المشتريات',
      icon: FileText,
      iconStyle: styles.purchaseReportsIcon,
      color: '#DAA520',
      onPress: () => {
        setShowSubMenu(false);
        setShowReportsModal(true);
      },
    },
    {
      title: 'طلبات الموردين',
      icon: ShoppingCart,
      iconStyle: styles.supplierOrdersIcon,
      color: '#DC143C',
      onPress: () => {
        Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً');
      },
    },
  ];

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < purchaseMenuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {purchaseMenuItems.slice(i, i + 2).map((item, index) => (
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
          {purchaseMenuItems.slice(i, i + 2).length === 1 && (
            <View style={[styles.gridItem, { opacity: 0 }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المشتريات</Text>
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

      {/* Add Purchase Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة مشتريات</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                اختيار المورد *
              </Text>
              <View style={{ backgroundColor: '#F5F5F5', borderRadius: 8, marginBottom: 16 }}>
                {suppliers.map((supplier) => (
                  <TouchableOpacity
                    key={supplier.id}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      backgroundColor: formData.supplierId === supplier.id ? '#5865F2' : 'transparent',
                    }}
                    onPress={() => setFormData(prev => ({ ...prev, supplierId: supplier.id }))}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: formData.supplierId === supplier.id ? '#FFFFFF' : '#333',
                      textAlign: 'right',
                    }}>
                      {supplier.nameAr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                المنتجات
              </Text>
              
              {/* Category Filter */}
              <View style={{ marginBottom: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  <TouchableOpacity
                    style={[
                      styles.categoryChip,
                      selectedCategory === 'all' && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory('all')}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === 'all' && styles.categoryChipTextActive,
                      ]}
                    >
                      الكل
                    </Text>
                  </TouchableOpacity>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        selectedCategory === category.id && styles.categoryChipActive,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selectedCategory === category.id && styles.categoryChipTextActive,
                        ]}
                      >
                        {category.nameAr}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <ScrollView style={{ maxHeight: 150, marginBottom: 16 }}>
                {filteredProducts.length === 0 ? (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 40,
                    backgroundColor: '#F8F9FA',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                  }}>
                    <Package size={32} color="#999" />
                    <Text style={{
                      fontSize: 16,
                      color: '#666',
                      textAlign: 'center',
                      marginTop: 8,
                      fontFamily: 'Cairo-Regular',
                    }}>
                      {selectedCategory === 'all' 
                        ? 'لا توجد منتجات متاحة' 
                        : 'لا توجد منتجات في هذا التصنيف'
                      }
                    </Text>
                  </View>
                ) : (
                  filteredProducts.map((product) => (
                    <View
                      key={product.id}
                      style={styles.productItemContainer}
                    >
                      <TouchableOpacity
                        style={styles.addProductButtonFixed}
                        onPress={() => addProductToPurchase(product)}
                        activeOpacity={0.7}
                      >
                        <Plus size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      <View style={styles.productItemInfo}>
                        <Text style={styles.productItemName}>
                          {product.nameAr}
                        </Text>
                        <Text style={styles.productItemCategory}>
                          {product.categoryAr}
                        </Text>
                        <Text style={styles.productItemCost}>
                          التكلفة: {product.cost.toFixed(2)} {settings.currencySymbol}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {selectedProducts.length > 0 && (
                <View style={styles.selectedProductsSection}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                    المنتجات المحددة
                  </Text>
                  <ScrollView style={{ maxHeight: 200, marginBottom: 16 }}>
                    {selectedProducts.map((item) => (
                      <View key={item.product.id} style={styles.selectedProductItem}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 8 }}>
                          {item.product.nameAr}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#5865F2', textAlign: 'right', marginBottom: 4 }}>
                          التصنيف: {item.product.categoryAr}
                        </Text>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateProductQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={16} color="#666" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateProductQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={16} color="#666" />
                          </TouchableOpacity>
                          <Text style={{ fontSize: 14, color: '#666', marginLeft: 'auto' }}>
                            المجموع: {(item.quantity * item.unitCost).toFixed(2)} {settings.currencySymbol}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Total Preview */}
              {selectedProducts.length > 0 && (
                <View style={styles.totalPreview}>
                  <Text style={styles.totalPreviewTitle}>ملخص الفاتورة</Text>
                  <View style={styles.totalPreviewRow}>
                    <Text style={styles.totalPreviewValue}>{subtotal.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalPreviewLabel}>المجموع الفرعي:</Text>
                  </View>
                  <View style={styles.totalPreviewRow}>
                    <Text style={styles.totalPreviewValue}>{discountAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalPreviewLabel}>الخصم ({formData.discount}%):</Text>
                  </View>
                  <View style={styles.totalPreviewRow}>
                    <Text style={styles.totalPreviewValue}>{taxAmount.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={styles.totalPreviewLabel}>الضريبة ({settings.taxRate}%):</Text>
                  </View>
                  <View style={[styles.totalPreviewRow, { borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8, marginTop: 8 }]}>
                    <Text style={styles.grandTotalValue}>{total.toFixed(2)} {settings.currencySymbol}</Text>
                    <Text style={[styles.totalPreviewLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                  </View>
                  {remainingAmount > 0 && (
                    <View style={styles.totalPreviewRow}>
                      <Text style={[styles.totalPreviewValue, { color: '#EF4444' }]}>
                        {remainingAmount.toFixed(2)} {settings.currencySymbol}
                      </Text>
                      <Text style={styles.totalPreviewLabel}>المتبقي:</Text>
                    </View>
                  )}
                </View>
              )}

              <Input
                label="الخصم (%)"
                value={formData.discount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, discount: text }))}
                placeholder="0"
                keyboardType="numeric"
              />

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                طريقة الدفع
              </Text>
              <View style={styles.paymentMethodSelector}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodButton,
                    formData.paymentMethod === 'cash' && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                >
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      formData.paymentMethod === 'cash' && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    نقدي
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodButton,
                    formData.paymentMethod === 'card' && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                >
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      formData.paymentMethod === 'card' && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    بطاقة
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodButton,
                    formData.paymentMethod === 'transfer' && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, paymentMethod: 'transfer' }))}
                >
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      formData.paymentMethod === 'transfer' && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    تحويل
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodButton,
                    formData.paymentMethod === 'credit' && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit' }))}
                >
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      formData.paymentMethod === 'credit' && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    آجل
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label="المبلغ المدفوع"
                value={formData.paidAmount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, paidAmount: text }))}
                placeholder={total.toFixed(2)}
                keyboardType="numeric"
              />

              <Input
                label="ملاحظات"
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="ملاحظات إضافية"
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
                  onPress={handleAddPurchase}
                  style={styles.modalButton}
                  disabled={!isFormValid}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Purchases Modal */}
      <Modal visible={showViewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>عرض المشتريات</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowViewModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {purchases.length === 0 ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
                  <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
                    لا توجد مشتريات مسجلة حتى الآن
                  </Text>
                </View>
              ) : (
                purchases.map((purchase) => (
                  <View key={purchase.id} style={{
                    backgroundColor: '#F8F9FA',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 8 }}>
                      فاتورة #{purchase.invoiceNumber}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 4 }}>
                      المورد: {purchase.supplier.nameAr}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'right', marginBottom: 8 }}>
                      التاريخ: {purchase.date.toLocaleDateString('ar-SA')}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#5865F2', textAlign: 'right' }}>
                      المجموع: {purchase.total.toFixed(2)} {settings.currencySymbol}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Purchase Reports Modal */}
      <Modal visible={showReportsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تقارير المشتريات</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowReportsModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{
                backgroundColor: '#F8F9FA',
                padding: 16,
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#E0E0E0',
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
                  ملخص المشتريات
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#5865F2' }}>
                    {purchases.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>إجمالي المشتريات</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10B981' }}>
                    {purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>إجمالي القيمة</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EF4444' }}>
                    {purchases.reduce((sum, p) => sum + p.remainingAmount, 0).toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>المبلغ المتبقي</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}