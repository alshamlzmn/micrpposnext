import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  Platform,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Camera,
  Plus,
  Minus,
  ShoppingCart,
  X,
  User,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Calculator,
  Trash2,
  Package,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product, Sale, SaleItem, Customer } from '@/types/global';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function POS() {
  const {
    theme,
    language,
    products,
    categories,
    customers,
    settings,
    cartItems,
    selectedCustomer,
    setSelectedCustomer,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addSale,
    user,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCamera, setShowCamera] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5865F2',
    },
    header: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    searchInput: {
      flex: 1,
    },
    cameraButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 12,
      borderRadius: 8,
    },
    content: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    categoriesContainer: {
      marginBottom: 16,
    },
    categoryScroll: {
      flexDirection: 'row',
      gap: 10,
    },
    categoryButton: {
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    categoryButtonActive: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    categoryButtonText: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Medium',
    },
    categoryButtonTextActive: {
      color: '#FFFFFF',
    },
    productGridContainer: {
      width: '100%',
      marginBottom: 16,
    },
    productsScrollContainer: {
      marginHorizontal: -16,
    },
    productPage: {
      width: width - 32,
      paddingHorizontal: 16,
      flexDirection: 'column',
    },
    productRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
    },
    productGridItem: {
      width: (width - 64) / 2 - 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: '#F5F5F5',
    },
    productName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#5865F2',
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: 'Cairo-Bold',
    },
    productStock: {
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: 'Cairo-Regular',
    },
    lowStock: {
      color: '#EF4444',
    },
    addButton: {
      backgroundColor: '#5865F2',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    centerPanel: {
      width: '100%',
      marginBottom: 16,
    },
    cartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      marginBottom: 8,
    },
    cartItemImage: {
      width: 40,
      height: 40,
      borderRadius: 6,
      marginLeft: 12,
      backgroundColor: '#F5F5F5',
    },
    cartItemInfo: {
      flex: 1,
      marginLeft: 12,
    },
    cartItemName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 2,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    cartItemPrice: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    quantityButton: {
      backgroundColor: '#E2E8F0',
      width: 32,
      height: 32,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      minWidth: 30,
      textAlign: 'center',
      fontFamily: 'Cairo-Bold',
    },
    removeButton: {
      backgroundColor: '#FEE2E2',
      padding: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    emptyCart: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      opacity: 0.5,
    },
    emptyCartText: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    rightPanel: {
      width: '100%',
      marginBottom: 16,
    },
    summaryCard: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
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
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 12,
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    discountInput: {
      marginBottom: 16,
    },
    customerSection: {
      marginBottom: 16,
    },
    customerButton: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    customerInfo: {
      flex: 1,
      alignItems: 'flex-end',
    },
    customerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    customerPhone: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    checkoutButton: {
      backgroundColor: '#5865F2',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 16,
    },
    checkoutButtonDisabled: {
      backgroundColor: '#CBD5E1',
    },
    checkoutButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
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
    customerList: {
      maxHeight: 300,
    },
    customerItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    customerItemInfo: {
      flex: 1,
      alignItems: 'flex-end',
    },
    customerItemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    customerItemPhone: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
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
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
    },
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    cameraControls: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    cameraControlButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 15,
      borderRadius: 50,
    },
  });

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = product.nameAr.toLowerCase().includes(searchLower) ||
           product.name.toLowerCase().includes(searchLower) ||
           product.barcode.includes(searchLower);
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group products into pages of 4 (2x2 grid)
  const groupProductsIntoPages = (products: Product[]) => {
    const pages = [];
    for (let i = 0; i < products.length; i += 4) {
      pages.push(products.slice(i, i + 4));
    }
    return pages;
  };

  const productPages = groupProductsIntoPages(filteredProducts);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * settings.taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setShowCamera(false);
      Alert.alert('تم', `تم إضافة ${product.nameAr} إلى السلة`);
    } else {
      Alert.alert('خطأ', 'المنتج غير موجود');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('خطأ', 'السلة فارغة');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCompleteSale = () => {
    const paidAmountNum = parseFloat(paidAmount) || 0;
    
    if (paymentMethod !== 'credit' && paidAmountNum < total) {
      Alert.alert('خطأ', 'المبلغ المدفوع أقل من الإجمالي');
      return;
    }

    const saleItems: SaleItem[] = cartItems.map(item => ({
      productId: item.product.id,
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.product.price,
      total: item.product.price * item.quantity,
    }));

    const sale: Sale = {
      id: Date.now().toString(),
      invoiceNumber: `${settings.invoicePrefix}-${settings.nextInvoiceNumber.toString().padStart(4, '0')}`,
      date: new Date(),
      customerId: selectedCustomer?.id,
      customer: selectedCustomer,
      items: saleItems,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paidAmount: paymentMethod === 'credit' ? 0 : paidAmountNum,
      remainingAmount: paymentMethod === 'credit' ? total : Math.max(0, total - paidAmountNum),
      paymentMethod,
      cashierId: user?.id || '1',
      cashier: user!,
      status: 'completed',
    };

    addSale(sale);
    clearCart();
    setDiscount(0);
    setPaidAmount('');
    setPaymentMethod('cash');
    setShowCheckoutModal(false);
    
    Alert.alert('نجح', `تم إتمام البيع بنجاح\nرقم الفاتورة: ${sale.invoiceNumber}`);
  };

  const renderProductPage = (pageProducts: Product[], pageIndex: number) => {
    const rows = [];
    for (let i = 0; i < pageProducts.length; i += 2) {
      const rowProducts = pageProducts.slice(i, i + 2);
      rows.push(
        <View key={`${pageIndex}-${i}`} style={styles.productRow}>
          {rowProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productGridItem}
              onPress={() => addToCart(product)}
              activeOpacity={0.7}
            >
              {product.image ? (
                <RNImage source={{ uri: product.image }} style={styles.productImage} />
              ) : (
                <View style={styles.productImage} />
              )}
              
              <Text style={styles.productName} numberOfLines={2}>
                {product.nameAr}
              </Text>
              
              <Text style={styles.productPrice}>
                {product.price.toFixed(2)} {settings.currencySymbol}
              </Text>
              
              <Text style={[
                styles.productStock,
                product.stock <= product.minStock && styles.lowStock
              ]}>
                المخزون: {product.stock}
              </Text>
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(product)}
              >
                <Plus size={12} color="#FFFFFF" />
                <Text style={styles.addButtonText}>إضافة</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {/* Fill empty space if odd number of products in row */}
          {rowProducts.length === 1 && (
            <View style={[styles.productGridItem, { opacity: 0 }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Input
          style={styles.searchInput}
          placeholder="البحث عن المنتجات..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color="#FFFFFF" />}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => setShowCamera(true)}
        >
          <Camera size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'all' && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'all' && styles.categoryButtonTextActive,
                ]}
              >
                الكل
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.nameAr}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={styles.productGridContainer}>
          {productPages.length === 0 ? (
            <View style={styles.emptyCart}>
              <Package size={64} color="#666" />
              <Text style={styles.emptyCartText}>لا توجد منتجات</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.productsScrollContainer}
              pagingEnabled
            >
              {productPages.map((pageProducts, pageIndex) => (
                <View key={pageIndex} style={styles.productPage}>
                  {renderProductPage(pageProducts, pageIndex)}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Cart Items */}
        <View style={styles.centerPanel}>
          <Text style={styles.cartTitle}>سلة المشتريات</Text>
          
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <ShoppingCart size={64} color="#666" />
              <Text style={styles.emptyCartText}>السلة فارغة</Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.product.id} style={styles.cartItem}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.product.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus size={16} color="#333" />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus size={16} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.product.nameAr}</Text>
                  <Text style={styles.cartItemPrice}>
                    {item.product.price.toFixed(2)} × {item.quantity} = {(item.product.price * item.quantity).toFixed(2)} {settings.currencySymbol}
                  </Text>
                </View>

                {item.product.image ? (
                  <RNImage source={{ uri: item.product.image }} style={styles.cartItemImage} />
                ) : (
                  <View style={styles.cartItemImage} />
                )}
              </View>
            ))
          )}
        </View>

        {/* Summary */}
        <View style={styles.rightPanel}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>ملخص الفاتورة</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>المجموع الفرعي:</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{discountAmount.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>الخصم ({discount}%):</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{taxAmount.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>الضريبة ({settings.taxRate}%):</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalValue}>{total.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.totalLabel}>الإجمالي:</Text>
            </View>
          </Card>

          <Input
            style={styles.discountInput}
            label="الخصم (%)"
            value={discount.toString()}
            onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
            icon={<Calculator size={20} color="#666" />}
          />
        </View>

        {/* Customer Selection */}
        <View style={styles.customerSection}>
          <TouchableOpacity
            style={styles.customerButton}
            onPress={() => setShowCustomerModal(true)}
          >
            <User size={20} color="#5865F2" />
            <View style={styles.customerInfo}>
              {selectedCustomer ? (
                <>
                  <Text style={styles.customerName}>{selectedCustomer.nameAr}</Text>
                  <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
                </>
              ) : (
                <Text style={styles.customerName}>اختيار العميل</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.checkoutButtonText}>
            الدفع ({total.toFixed(2)} {settings.currencySymbol})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.scanFrame} />
                </View>
              </CameraView>
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.cameraControlButton}
                  onPress={() => setShowCamera(false)}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                نحتاج إذن الكاميرا لمسح الباركود
              </Text>
              <Button title="منح الإذن" onPress={requestPermission} />
              <Button 
                title="إغلاق" 
                onPress={() => setShowCamera(false)} 
                variant="outline" 
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </View>
      </Modal>

      {/* Customer Selection Modal */}
      <Modal visible={showCustomerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختيار العميل</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCustomerModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.customerList}>
              <TouchableOpacity
                style={styles.customerItem}
                onPress={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
              >
                <View style={styles.customerItemInfo}>
                  <Text style={styles.customerItemName}>عميل غير مسجل</Text>
                </View>
              </TouchableOpacity>
              
              {customers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.customerItem}
                  onPress={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                >
                  <View style={styles.customerItemInfo}>
                    <Text style={styles.customerItemName}>{customer.nameAr}</Text>
                    <Text style={styles.customerItemPhone}>{customer.phone}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal visible={showCheckoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إتمام البيع</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCheckoutModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalValue}>{total.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.totalLabel}>الإجمالي:</Text>
            </View>

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8, textAlign: 'right' }}>
              طريقة الدفع
            </Text>
            <View style={styles.paymentMethodSelector}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'cash' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Text
                  style={[
                    styles.paymentMethodButtonText,
                    paymentMethod === 'cash' && styles.paymentMethodButtonTextActive,
                  ]}
                >
                  نقدي
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'card' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod('card')}
              >
                <Text
                  style={[
                    styles.paymentMethodButtonText,
                    paymentMethod === 'card' && styles.paymentMethodButtonTextActive,
                  ]}
                >
                  بطاقة
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'transfer' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod('transfer')}
              >
                <Text
                  style={[
                    styles.paymentMethodButtonText,
                    paymentMethod === 'transfer' && styles.paymentMethodButtonTextActive,
                  ]}
                >
                  تحويل
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'credit' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod('credit')}
              >
                <Text
                  style={[
                    styles.paymentMethodButtonText,
                    paymentMethod === 'credit' && styles.paymentMethodButtonTextActive,
                  ]}
                >
                  آجل
                </Text>
              </TouchableOpacity>
            </View>

            {paymentMethod !== 'credit' && (
              <Input
                label="المبلغ المدفوع"
                value={paidAmount}
                onChangeText={setPaidAmount}
                placeholder={total.toFixed(2)}
                keyboardType="numeric"
              />
            )}

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowCheckoutModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="إتمام البيع"
                onPress={handleCompleteSale}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}