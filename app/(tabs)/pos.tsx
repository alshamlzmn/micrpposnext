import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Camera, 
  Calculator, 
  User, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  DollarSign,
  Package,
  Users,
} from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product, Sale, SaleItem } from '@/types/global';

const { width, height } = Dimensions.get('window');

export default function POS() {
  const { 
    theme, 
    t, 
    language, 
    products, 
    categories, 
    cartItems, 
    selectedCustomer,
    setSelectedCustomer,
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    customers,
    addSale,
    settings,
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
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
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    searchInput: {
      flex: 1,
    },
    actionButton: {
      backgroundColor: '#FFFFFF',
      padding: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cameraButton: {
      backgroundColor: '#10B981',
    },
    calculatorButton: {
      backgroundColor: '#F59E0B',
    },
    userButton: {
      backgroundColor: '#8B5CF6',
    },
    cartButton: {
      backgroundColor: '#EF4444',
    },
    categoriesContainer: {
      marginBottom: 16,
    },
    categoryScroll: {
      flexDirection: 'row',
      gap: 10,
    },
    categoryButton: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
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
    productGridWrapper: {
      height: 280,
      marginBottom: 16,
    },
    productsScrollContainer: {
      flex: 1,
    },
    productPage: {
      width: width - 32,
      paddingHorizontal: 8,
    },
    productRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    productGridItem: {
      width: (width - 64) / 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: '#F5F5F5',
    },
    productName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
    },
    productPrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5865F2',
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: 'Cairo-Bold',
    },
    addButton: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    emptyProducts: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      margin: 8,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
      marginTop: 8,
    },
    cartSection: {
      marginBottom: 16,
    },
    cartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cartTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    cartBadge: {
      backgroundColor: '#5865F2',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      minWidth: 24,
      alignItems: 'center',
    },
    cartBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    cartContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      maxHeight: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
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
      marginRight: 12,
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
      backgroundColor: '#F5F5F5',
      padding: 6,
      borderRadius: 6,
      minWidth: 32,
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: 'bold',
      minWidth: 30,
      textAlign: 'center',
      fontFamily: 'Cairo-Bold',
    },
    removeButton: {
      backgroundColor: '#EF4444',
      padding: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    emptyCart: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    summarySection: {
      marginBottom: 16,
    },
    summaryContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 12,
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
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
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 8,
      marginTop: 8,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    bottomActions: {
      gap: 12,
      marginBottom: 16,
    },
    customerSelectButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    customerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    customerText: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Medium',
    },
    checkoutButton: {
      backgroundColor: '#10B981',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    checkoutButtonDisabled: {
      backgroundColor: '#E0E0E0',
    },
    checkoutButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
    },
    checkoutButtonTextDisabled: {
      color: '#999',
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
    customerItem: {
      backgroundColor: '#F8F9FA',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    customerItemSelected: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    customerName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    customerNameSelected: {
      color: '#FFFFFF',
    },
    customerPhone: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    customerPhoneSelected: {
      color: 'rgba(255, 255, 255, 0.8)',
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
    barcodeScannerModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerContainer: {
      width: '90%',
      height: '70%',
      borderRadius: 16,
      overflow: 'hidden',
    },
    scannerHeader: {
      backgroundColor: '#5865F2',
      padding: 16,
      alignItems: 'center',
    },
    scannerTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    camera: {
      flex: 1,
    },
    scannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#10B981',
      borderRadius: 16,
      backgroundColor: 'transparent',
    },
    scannerInstructions: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    scannerInstructionsText: {
      color: '#FFFFFF',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Cairo-Regular',
    },
    scannerActions: {
      backgroundColor: '#5865F2',
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'center',
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

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = (cartTotal * discount) / 100;
  const taxableAmount = cartTotal - discountAmount;
  const taxAmount = (taxableAmount * settings.taxRate) / 100;
  const finalTotal = taxableAmount + taxAmount;

  const renderProductPages = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptyProducts}>
          <Package size={48} color="#999" />
          <Text style={styles.emptyText}>لا توجد منتجات</Text>
        </View>
      );
    }

    const pages = [];
    for (let i = 0; i < filteredProducts.length; i += 4) {
      const pageProducts = filteredProducts.slice(i, i + 4);
      
      pages.push(
        <View key={i} style={styles.productPage}>
          {/* First row */}
          <View style={styles.productRow}>
            {pageProducts.slice(0, 2).map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productGridItem}
                onPress={() => addToCart(product)}
                activeOpacity={0.7}
              >
                {product.image ? (
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                ) : (
                  <View style={styles.productImage}>
                    <Package size={24} color="#999" />
                  </View>
                )}
                <Text style={styles.productName} numberOfLines={2}>
                  {product.nameAr}
                </Text>
                <Text style={styles.productPrice}>
                  {product.price.toFixed(2)} {settings.currencySymbol}
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>إضافة</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {/* Fill empty space if only one product in first row */}
            {pageProducts.length === 1 && (
              <View style={[styles.productGridItem, { opacity: 0 }]} />
            )}
          </View>
          
          {/* Second row */}
          {pageProducts.length > 2 && (
            <View style={styles.productRow}>
              {pageProducts.slice(2, 4).map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productGridItem}
                  onPress={() => addToCart(product)}
                  activeOpacity={0.7}
                >
                  {product.image ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImage}>
                      <Package size={24} color="#999" />
                    </View>
                  )}
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.nameAr}
                  </Text>
                  <Text style={styles.productPrice}>
                    {product.price.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addToCart(product)}
                  >
                    style={styles.addButton}
                    onPress={() => addToCart(product)}
                  >
                    <Text style={styles.addButtonText}>إضافة</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {/* Fill empty space if only one product in second row */}
              {pageProducts.length === 3 && (
                <View style={[styles.productGridItem, { opacity: 0 }]} />
              )}
            </View>
          )}
        </View>
      );
    }
    
    return pages;
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
    
    if (paymentMethod !== 'credit' && paidAmountNum < finalTotal) {
      Alert.alert('خطأ', 'المبلغ المدفوع أقل من المطلوب');
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
      subtotal: cartTotal,
      discount: discountAmount,
      tax: taxAmount,
      total: finalTotal,
      paidAmount: paymentMethod === 'credit' ? 0 : paidAmountNum,
      remainingAmount: finalTotal - paidAmountNum, // Allow negative for change due
      cashierId: '1',
      cashier: { id: '1', name: 'Admin', email: 'admin@micropos.com', role: 'admin' },
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المبيعات</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search and Action Buttons */}
        <View style={styles.searchContainer}>
          <Input
            style={styles.searchInput}
            placeholder="ابحث عن منتج أو أدخل الباركود..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<Search size={20} color="#666" />}
          />
          <TouchableOpacity 
            style={[styles.actionButton, styles.cameraButton]}
            onPress={() => {
              if (permission?.granted) {
                setShowBarcodeScanner(true);
              } else {
                requestPermission();
              }
            }}
          >
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.calculatorButton]}>
            <Calculator size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.userButton]}>
            <User size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.cartButton]}>
            <ShoppingCart size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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

        {/* Products Grid (2x2 with horizontal scroll) */}
        <View style={styles.productGridWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.productsScrollContainer}
            pagingEnabled
          >
            {renderProductPages()}
          </ScrollView>
        </View>

        {/* Cart Items */}
        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>قائمة المنتجات المضافة إلى سلة البيع</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          </View>
          
          <View style={styles.cartContainer}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCart}>
                <ShoppingCart size={48} color="#999" />
                <Text style={styles.emptyText}>السلة فارغة</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {cartItems.map((item) => (
                  <View key={item.product.id} style={styles.cartItem}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromCart(item.product.id)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={16} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={16} color="#666" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName} numberOfLines={1}>
                        {item.product.nameAr}
                      </Text>
                      <Text style={styles.cartItemPrice}>
                        {item.product.price.toFixed(2)} × {item.quantity} = {(item.product.price * item.quantity).toFixed(2)} {settings.currencySymbol}
                      </Text>
                    </View>

                    {item.product.image ? (
                      <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
                    ) : (
                      <View style={styles.cartItemImage}>
                        <Package size={20} color="#999" />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>ملخص الفاتورة</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} {settings.currencySymbol}</Text>
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
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalValue}>{finalTotal.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {/* Customer Selection */}
          <TouchableOpacity
            style={styles.customerSelectButton}
            onPress={() => setShowCustomerModal(true)}
          >
            <View style={styles.customerInfo}>
              <Users size={20} color="#5865F2" />
              <Text style={styles.customerText}>
                {selectedCustomer ? selectedCustomer.nameAr : 'اختيار العميل'}
              </Text>
            </View>
            <Text style={{ color: '#999', fontSize: 14 }}>اختياري</Text>
          </TouchableOpacity>

          {/* Checkout Button */}
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              cartItems.length === 0 && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <Text
              style={[
                styles.checkoutButtonText,
                cartItems.length === 0 && styles.checkoutButtonTextDisabled,
              ]}
            >
              الدفع ({finalTotal.toFixed(2)} {settings.currencySymbol})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

            <ScrollView style={{ maxHeight: 400 }}>
              <TouchableOpacity
                style={[
                  styles.customerItem,
                  !selectedCustomer && styles.customerItemSelected,
                ]}
                onPress={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
              >
                <Text style={[
                  styles.customerName,
                  !selectedCustomer && styles.customerNameSelected,
                ]}>
                  عميل غير مسجل
                </Text>
                <Text style={[
                  styles.customerPhone,
                  !selectedCustomer && styles.customerPhoneSelected,
                ]}>
                  بيع مباشر بدون تسجيل العميل
                </Text>
              </TouchableOpacity>

              {customers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.customerItem,
                    selectedCustomer?.id === customer.id && styles.customerItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                >
                  <Text style={[
                    styles.customerName,
                    selectedCustomer?.id === customer.id && styles.customerNameSelected,
                  ]}>
                    {customer.nameAr}
                  </Text>
                  <Text style={[
                    styles.customerPhone,
                    selectedCustomer?.id === customer.id && styles.customerPhoneSelected,
                  ]}>
                    {customer.phone}
                  </Text>
                  {customer.currentBalance > 0 && (
                    <Text style={[
                      styles.customerPhone,
                      selectedCustomer?.id === customer.id && styles.customerPhoneSelected,
                      { color: '#EF4444', fontWeight: 'bold' }
                    ]}>
                      ذمة: {customer.currentBalance.toFixed(2)} {settings.currencySymbol}
                    </Text>
                  )}
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

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>ملخص الفاتورة</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.summaryLabel}>المجموع الفرعي:</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryValue}>{discountAmount.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.summaryLabel}>الخصم:</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryValue}>{taxAmount.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.summaryLabel}>الضريبة:</Text>
                </View>
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalValue}>{finalTotal.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                </View>
              </View>

              <Input
                label="الخصم (%)"
                value={discount.toString()}
                onChangeText={(text) => setDiscount(parseFloat(text) || 0)}
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
                  placeholder={finalTotal.toFixed(2)}
                  keyboardType="numeric"
                  icon={<DollarSign size={20} color="#666" />}
                />
              )}

              {selectedCustomer && (
                <View style={{ backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 }}>
                    العميل المحدد: {selectedCustomer.nameAr}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', textAlign: 'right' }}>
                    الهاتف: {selectedCustomer.phone}
                  </Text>
                  {selectedCustomer.currentBalance > 0 && (
                    <Text style={{ fontSize: 12, color: '#EF4444', textAlign: 'right', fontWeight: 'bold' }}>
                      ذمة سابقة: {selectedCustomer.currentBalance.toFixed(2)} {settings.currencySymbol}
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>

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
                icon={<CreditCard size={16} color="#FFFFFF" />}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal visible={showBarcodeScanner} transparent animationType="fade">
        <View style={styles.barcodeScannerModal}>
          <View style={styles.scannerContainer}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>مسح الباركود</Text>
            </View>
            
            <View style={{ flex: 1, position: 'relative' }}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={(result) => {
                  const scannedProduct = products.find(p => p.barcode === result.data);
                  if (scannedProduct) {
                    addToCart(scannedProduct);
                    setShowBarcodeScanner(false);
                    Alert.alert('نجح', `تم إضافة ${scannedProduct.nameAr} إلى السلة`);
                  } else {
                    Alert.alert('غير موجود', 'المنتج غير موجود في المخزون');
                  }
                }}
              />
              
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame} />
                <View style={styles.scannerInstructions}>
                  <Text style={styles.scannerInstructionsText}>
                    وجه الكاميرا نحو الباركود
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.scannerActions}>
              <Button
                title="إغلاق"
                onPress={() => setShowBarcodeScanner(false)}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}