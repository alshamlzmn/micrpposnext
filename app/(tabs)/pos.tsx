import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
  Platform,
  Image as RNImage, // Rename to avoid conflict with global Image constructor on web
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Camera, 
  Users, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CreditCard,
  Banknote,
  Smartphone,
  Clock,
  Check,
  Trash2,
  Calculator,
  Grid3x3,
  List,
  Package,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product, Sale, SaleItem } from '@/types/global';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function POS() {
  const { 
    theme, 
    language, 
    products, 
    customers, 
    cartItems, 
    selectedCustomer,
    setSelectedCustomer,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addSale,
    settings,
    user,
    categories,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('0');
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('amount');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    header: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: '#5865F2',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
      marginBottom: 15,
    },
    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    searchInputContainer: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchInput: {
      flex: 1,
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
      marginRight: 10,
    },
    searchIcon: {
      opacity: 0.8,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    cameraButton: {
      backgroundColor: '#10B981',
    },
    customerButton: {
      backgroundColor: '#F59E0B',
    },
    calculatorButton: {
      backgroundColor: '#8B5CF6',
    },
    cartButton: {
      backgroundColor: '#EF4444',
    },
    content: {
      flex: 1,
      flexDirection: 'column', // Always column for main content flow
      paddingHorizontal: 16, // Keep padding for overall layout
      paddingTop: 16,
    },
    // Left Panel - Products Grid
    productGridContainer: { // Renamed from leftPanel
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      width: '100%', // Always full width on mobile
      marginBottom: 16,
    },
    productPage: { // New style for each 2x2 product page
      width: width - (16 * 2), // Screen width - content padding
      height: 'auto', // Will adjust based on content
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingHorizontal: 8, // Padding within the page
    },
    productRow: { // New style for each row within a product page
      flexDirection: 'row',
      justifyContent: 'space-around', // Distribute items evenly
      marginBottom: 8, // Gap between rows
    },
    categoriesContainer: {
      marginBottom: 16,
    },
    categoriesScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    categoryChip: {
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    categoryChipActive: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    categoryChipText: {
      fontSize: 12,
      color: '#64748B',
      fontFamily: 'Cairo-Medium',
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
    },
    productsGrid: {
      flexDirection: 'row',
      // flexWrap: 'wrap', // Removed, as we're chunking into pages
      // gap: 8, // Handled by productRow and productGridItem margins
    },
    productsScrollContainer: { // New style for the horizontal ScrollView wrapping product pages
      marginBottom: 16, // Space below the product grid
      marginHorizontal: -16, // Counteract content padding to make it edge-to-edge
    },
    productGridItem: {
      width: Platform.OS === 'web'
        ? (420 - 32 - 32) / 5 // 5 columns for web (original calculation)
        : (width - (16 * 2) - (16 * 2) - 8) / 2, // (screen width - content padding - productGridContainer padding - gap) / 2
      aspectRatio: 1,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    productGridImage: {
      width: '100%',
      height: '60%',
      borderRadius: 8,
      backgroundColor: '#E2E8F0',
      marginBottom: 4,
    },
    productGridName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
      numberOfLines: 2,
    },
    productGridPrice: {
      fontSize: 8,
      color: '#5865F2',
      fontFamily: 'Cairo-Medium',
      textAlign: 'center',
    },
    // Inline styles for web <img> tags
    productGridImageWeb: {
      width: '100%', height: '60%', borderRadius: 8, backgroundColor: '#E2E8F0', marginBottom: 4,
    },
    // Center Panel - Cart Items
    centerPanel: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      width: '100%', // Always full width on mobile
      marginBottom: 16,
    },
    cartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    cartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1E293B',
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
    cartItemsList: {
      flex: 1,
    },
    cartItem: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    cartItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cartItemName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
      flex: 1,
      textAlign: 'right',
    },
    cartItemPrice: {
      fontSize: 12,
      color: '#5865F2',
      fontFamily: 'Cairo-Medium',
      marginLeft: 8,
    },
    cartItemControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 4,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    quantityButton: {
      backgroundColor: '#F8FAFC',
      borderRadius: 6,
      padding: 6,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      minWidth: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1E293B',
      minWidth: 24,
      textAlign: 'center',
      fontFamily: 'Cairo-Bold',
    },
    cartItemTotal: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#10B981',
      fontFamily: 'Cairo-Bold',
    },
    removeButton: {
      backgroundColor: '#FEE2E2',
      borderColor: '#FCA5A5',
    },
    // Right Panel - Summary & Checkout
    rightPanel: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      width: '100%', // Always full width on mobile
      marginBottom: 16,
    },
    summarySection: {
      flex: 1,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
      marginBottom: 12,
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
      color: '#64748B',
      fontFamily: 'Cairo-Regular',
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingTop: 8,
      marginTop: 8,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    customerSection: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    customerLabel: {
      fontSize: 12,
      color: '#64748B',
      fontFamily: 'Cairo-Regular',
      marginBottom: 4,
    },
    customerName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    customerPhone: {
      fontSize: 12,
      color: '#64748B',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    selectCustomerButton: {
      backgroundColor: '#5865F2',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignItems: 'center',
    },
    selectCustomerText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    checkoutButton: {
      backgroundColor: '#5865F2',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      shadowColor: '#5865F2',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
      marginTop: 16,
      marginBottom: 8,
    },
    checkoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    emptyCart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
    },
    emptyCartText: {
      fontSize: 16,
      color: '#64748B',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
      marginTop: 12,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
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
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
    },
    closeButton: {
      padding: 4,
    },
    customerList: {
      maxHeight: 300,
    },
    customerItem: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    paymentMethods: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    paymentMethod: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#E2E8F0',
    },
    paymentMethodActive: {
      backgroundColor: '#EEF2FF',
      borderColor: '#5865F2',
    },
    paymentMethodText: {
      fontSize: 14,
      color: '#64748B',
      marginTop: 8,
      fontFamily: 'Cairo-Medium',
    },
    paymentMethodTextActive: {
      color: '#5865F2',
      fontWeight: 'bold',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
    },
    checkoutModalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      maxHeight: '90%',
    },
    checkoutSummary: {
      backgroundColor: '#F8FAFC',
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    checkoutSummaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 12,
      fontFamily: 'Cairo-Bold',
    },
    checkoutSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    checkoutSummaryLabel: {
      fontSize: 14,
      color: '#64748B',
      fontFamily: 'Cairo-Regular',
    },
    checkoutSummaryValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
    },
    checkoutTotalRow: {
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingTop: 8,
      marginTop: 8,
    },
    checkoutTotalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    paymentMethodsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 12,
      textAlign: 'right',
      fontFamily: 'Cairo-Bold',
    },
    paidAmountContainer: {
      marginBottom: 16,
    },
    changeContainer: {
      backgroundColor: '#ECFDF5',
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#A7F3D0',
    },
    changeText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10B981',
      textAlign: 'center',
      fontFamily: 'Cairo-Bold',
    },
    checkoutButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    checkoutButton2: {
      flex: 1,
    },
    calculatorModal: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 300,
    },
    calculatorDisplay: {
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'flex-end',
    },
    calculatorValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
    },
    calculatorGrid: {
      gap: 8,
    },
    calculatorRow: {
      flexDirection: 'row',
      gap: 8,
    },
    calculatorButton: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    calculatorButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1E293B',
      fontFamily: 'Cairo-Bold',
    },
    operatorButton: {
      backgroundColor: '#5865F2',
    },
    operatorButtonText: {
      color: '#FFFFFF',
    },
    discountTypeSelector: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 4,
    },
    discountTypeButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    discountTypeButtonActive: {
      backgroundColor: '#5865F2',
    },
    discountTypeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Cairo-Medium',
    },
    discountTypeButtonTextActive: {
      color: '#FFFFFF',
    },
    discountTypeButtonTextInactive: {
      color: '#666',
    },
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = product.nameAr.toLowerCase().includes(searchLower) ||
           product.name.toLowerCase().includes(searchLower) ||
           product.barcode.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * parseFloat(discount || '0')) / 100
    : parseFloat(discount || '0');
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * settings.taxRate) / 100;
  const total = taxableAmount + taxAmount;
  const paidAmountNum = parseFloat(paidAmount || '0');
  const remainingAmount = Math.max(0, total - paidAmountNum);
  const changeAmount = Math.max(0, paidAmountNum - total);

  // Play sound when adding to cart
  const playAddToCartSound = () => {
    if (soundEnabled && Platform.OS === 'web') {
      // Create a simple beep sound for web
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  // Helper to chunk array for 2x2 grid display
  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };
  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find(p => 
      p.barcode === barcode || 
      p.nameAr.toLowerCase().includes(barcode.toLowerCase()) ||
      p.name.toLowerCase().includes(barcode.toLowerCase())
    );
    if (product) {
      addToCart(product);
      playAddToCartSound();
      setSearchQuery('');
      Alert.alert('تم الإضافة', `تم إضافة ${product.nameAr} للسلة`);
    } else {
      Alert.alert('خطأ', 'المنتج غير موجود');
    }
  };

  const handleCameraBarcodeScan = (data: any) => {
    if (data && data.data) {
      handleBarcodeSearch(data.data);
      setShowCameraModal(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('خطأ', 'السلة فارغة');
      return;
    }

    if (paymentMethod === 'credit' && !selectedCustomer) {
      Alert.alert('خطأ', 'يجب اختيار عميل للبيع الآجل');
      return;
    }

    if (paymentMethod !== 'credit' && paidAmountNum < total) {
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
      customer: selectedCustomer || undefined,
      items: saleItems,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paidAmount: paymentMethod === 'credit' ? 0 : paidAmountNum,
      remainingAmount: paymentMethod === 'credit' ? total : remainingAmount,
      paymentMethod,
      cashierId: user!.id,
      cashier: user!,
      status: 'completed',
    };

    addSale(sale);
    clearCart();
    setSearchQuery('');
    setPaidAmount('');
    setDiscount('0');
    setShowCheckoutModal(false);
    
    Alert.alert('نجح', `تم حفظ الفاتورة ${sale.invoiceNumber} بنجاح`);
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('تنبيه', 'الكاميرا غير متاحة في المتصفح. يرجى إدخال الباركود يدوياً');
      return;
    }

    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'يجب السماح بالوصول للكاميرا');
        return;
      }
    }

    if (!permission.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'يجب السماح بالوصول للكاميرا');
        return;
      }
    }

    setShowCameraModal(true);
  };

  const handleCalculatorPress = (value: string) => {
    if (value === 'C') {
      setCalculatorValue('');
    } else if (value === '=') {
      try {
        const result = eval(calculatorValue);
        setCalculatorValue(result.toString());
      } catch (error) {
        setCalculatorValue('خطأ');
      }
    } else if (value === '⌫') {
      setCalculatorValue(prev => prev.slice(0, -1));
    } else {
      setCalculatorValue(prev => prev + value);
    }
  };

  const calculatorButtons = [
    ['C', '⌫', '/', '×'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '', ''],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المبيعات</Text>
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="rgba(255, 255, 255, 0.8)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن منتج أو أدخل الباركود..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery) {
                  handleBarcodeSearch(searchQuery);
                }
              }}
              returnKeyType="search"
            />
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cameraButton]}
              onPress={openCamera}
            >
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.customerButton]}
              onPress={() => setShowCustomerModal(true)}
            >
              <Users size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.calculatorButton]}
              onPress={() => setShowCalculator(true)}
            >
              <Calculator size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cartButton]}
              onPress={clearCart}
            >
              <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Categories (Moved to top of content) */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
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

        {/* Products Grid (Now horizontally scrollable 2x2 pages) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScrollContainer}>
          {chunkArray(filteredProducts, 4).map((page, pageIndex) => (
            <View key={pageIndex} style={styles.productPage}>
              <View style={styles.productRow}>
                {page[0] && (
                  <TouchableOpacity
                    key={page[0].id}
                    style={styles.productGridItem}
                    onPress={() => {
                      addToCart(page[0]);
                      playAddToCartSound();
                    }}
                    activeOpacity={0.7}
                  >
                    {page[0].image ? (
                      Platform.OS === 'web' ? (
                        <img src={page[0].image} style={styles.productGridImageWeb} />
                      ) : (
                        <RNImage source={{ uri: page[0].image }} style={styles.productGridImage} />
                      )
                    ) : (
                      <View style={styles.productGridImage} />
                    )}
                    <Text style={styles.productGridName} numberOfLines={2}>
                      {page[0].nameAr}
                    </Text>
                    <Text style={styles.productGridPrice}>
                      {page[0].price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
                {page[1] && (
                  <TouchableOpacity
                    key={page[1].id}
                    style={styles.productGridItem}
                    onPress={() => {
                      addToCart(page[1]);
                      playAddToCartSound();
                    }}
                    activeOpacity={0.7}
                  >
                    {page[1].image ? (
                      Platform.OS === 'web' ? (
                        <img src={page[1].image} style={styles.productGridImageWeb} />
                      ) : (
                        <RNImage source={{ uri: page[1].image }} style={styles.productGridImage} />
                      )
                    ) : (
                      <View style={styles.productGridImage} />
                    )}
                    <Text style={styles.productGridName} numberOfLines={2}>
                      {page[1].nameAr}
                    </Text>
                    <Text style={styles.productGridPrice}>
                      {page[1].price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.productRow}>
                {page[2] && (
                  <TouchableOpacity
                    key={page[2].id}
                    style={styles.productGridItem}
                    onPress={() => {
                      addToCart(page[2]);
                      playAddToCartSound();
                    }}
                    activeOpacity={0.7}
                  >
                    {page[2].image ? (
                      Platform.OS === 'web' ? (
                        <img src={page[2].image} style={styles.productGridImageWeb} />
                      ) : (
                        <RNImage source={{ uri: page[2].image }} style={styles.productGridImage} />
                      )
                    ) : (
                      <View style={styles.productGridImage} />
                    )}
                    <Text style={styles.productGridName} numberOfLines={2}>
                      {page[2].nameAr}
                    </Text>
                    <Text style={styles.productGridPrice}>
                      {page[2].price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
                {page[3] && (
                  <TouchableOpacity
                    key={page[3].id}
                    style={styles.productGridItem}
                    onPress={() => {
                      addToCart(page[3]);
                      playAddToCartSound();
                    }}
                    activeOpacity={0.7}
                  >
                    {page[3].image ? (
                      Platform.OS === 'web' ? (
                        <img src={page[3].image} style={styles.productGridImageWeb} />
                      ) : (
                        <RNImage source={{ uri: page[3].image }} style={styles.productGridImage} />
                      )
                    ) : (
                      <View style={styles.productGridImage} />
                    )}
                    <Text style={styles.productGridName} numberOfLines={2}>
                      {page[3].nameAr}
                    </Text>
                    <Text style={styles.productGridPrice}>
                      {page[3].price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Center Panel - Cart Items */}
        <View style={styles.centerPanel}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>قائمة المنتجات المضافة إلى سلة البيع</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <ShoppingCart size={64} color="#CBD5E1" />
              <Text style={styles.emptyCartText}>السلة فارغة</Text>
            </View>
          ) : (
            <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
              {cartItems.map((item) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productGridItem}
                  onPress={() => {
                    addToCart(product);
                    playAddToCartSound();
                  }}
                  activeOpacity={0.7}
                >
                  {product.image ? (
                    Platform.OS === 'web' ? (
                      <img src={product.image} style={styles.productGridImageWeb} />
                    ) : (
                      <RNImage source={{ uri: product.image }} style={styles.productGridImage} />
                    )
                  ) : (
                    <View style={styles.productGridImage} />
                  )}
                  <Text style={styles.productGridName} numberOfLines={2}>
                    {product.nameAr}
                  </Text>
                  <Text style={styles.productGridPrice}>
                    {product.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Center Panel - Cart Items */}
        <View style={styles.centerPanel}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>قائمة المنتجات المضافة إلى سلة البيع</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <ShoppingCart size={64} color="#CBD5E1" />
              <Text style={styles.emptyCartText}>السلة فارغة</Text>
            </View>
          ) : (
            <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
              {cartItems.map((item) => (
                <View key={item.product.id} style={styles.cartItem}>
                  <View style={styles.cartItemHeader}>
                    <Text style={styles.cartItemName} numberOfLines={1}>
                      {item.product.nameAr}
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      {item.product.price.toFixed(2)} {settings.currencySymbol}
                    </Text>
                  </View>
                  
                  <View style={styles.cartItemControls}>
                    <Text style={styles.cartItemTotal}>
                      {(item.product.price * item.quantity).toFixed(2)} {settings.currencySymbol}
                    </Text>
                    
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={12} color="#64748B" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={12} color="#64748B" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.quantityButton, styles.removeButton]}
                        onPress={() => removeFromCart(item.product.id)}
                      >
                        <X size={12} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
        </View>

        {/* Right Panel - Summary & Checkout */}
        <View style={styles.rightPanel}>
          {/* Customer Section */}
          <View style={styles.customerSection}>
            <Text style={styles.customerLabel}>العميل</Text>
            {selectedCustomer ? (
              <View>
                <Text style={styles.customerName}>{selectedCustomer.nameAr}</Text>
                <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectCustomerButton}
                onPress={() => setShowCustomerModal(true)}
              >
                <Text style={styles.selectCustomerText}>اختيار عميل</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>ملخص الفاتورة</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>المجموع الفرعي</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{discountAmount.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>الخصم ({discount}%)</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{taxAmount.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={styles.summaryLabel}>الضريبة ({settings.taxRate}%)</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalValue}>{total.toFixed(2)} {settings.currencySymbol}</Text>
              <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>الإجمالي</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            style={[styles.checkoutButton, { opacity: cartItems.length === 0 ? 0.5 : 1 }]}
            onPress={() => setShowCheckoutModal(true)}
            disabled={cartItems.length === 0}
          >
            <ShoppingCart size={18} color="#FFFFFF" />
            <Text style={styles.checkoutButtonText}>الدفع</Text>
          </TouchableOpacity>
        </View>
      </View>

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
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.customerItem, { backgroundColor: selectedCustomer ? '#F8FAFC' : '#EEF2FF' }]}
              onPress={() => {
                setSelectedCustomer(null);
                setShowCustomerModal(false);
              }}
            >
              <Text style={[styles.customerName, { color: selectedCustomer ? '#64748B' : '#5865F2' }]}>
                عميل غير مسجل
              </Text>
            </TouchableOpacity>

            <ScrollView style={styles.customerList}>
              {customers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.customerItem,
                    selectedCustomer?.id === customer.id && { backgroundColor: '#EEF2FF' }
                  ]}
                  onPress={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                >
                  <Text style={styles.customerName}>{customer.nameAr}</Text>
                  <Text style={styles.customerPhone}>{customer.phone}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal visible={showCheckoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.checkoutModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>تأكيد الدفع</Text>
                <TouchableOpacity
                  style={{ padding: 8, borderRadius: 8, backgroundColor: soundEnabled ? '#10B981' : '#EF4444' }}
                  onPress={() => setSoundEnabled(!soundEnabled)}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'Cairo-Bold' }}>
                    {soundEnabled ? '🔊' : '🔇'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCheckoutModal(false)}
                >
                  <X size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.checkoutSummary}>
                <Text style={styles.checkoutSummaryTitle}>ملخص الفاتورة</Text>
                <View style={styles.checkoutSummaryRow}>
                  <Text style={styles.checkoutSummaryValue}>{subtotal.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.checkoutSummaryLabel}>المجموع الفرعي:</Text>
                </View>
                <View style={styles.checkoutSummaryRow}>
                  <Text style={styles.checkoutSummaryValue}>{discountAmount.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.checkoutSummaryLabel}>الخصم ({discount}%):</Text>
                </View>
                <View style={styles.checkoutSummaryRow}>
                  <Text style={styles.checkoutSummaryValue}>{taxAmount.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={styles.checkoutSummaryLabel}>الضريبة ({settings.taxRate}%):</Text>
                </View>
                <View style={[styles.checkoutSummaryRow, styles.checkoutTotalRow]}>
                  <Text style={styles.checkoutTotalValue}>{total.toFixed(2)} {settings.currencySymbol}</Text>
                  <Text style={[styles.checkoutSummaryLabel, { fontWeight: 'bold' }]}>الإجمالي:</Text>
                </View>
              </View>

              <Text style={styles.paymentMethodsTitle}>نوع الخصم:</Text>
              <View style={styles.discountTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.discountTypeButton,
                    discountType === 'amount' && styles.discountTypeButtonActive,
                  ]}
                  onPress={() => setDiscountType('amount')}
                >
                  <Text
                    style={[
                      styles.discountTypeButtonText,
                      discountType === 'amount'
                        ? styles.discountTypeButtonTextActive
                        : styles.discountTypeButtonTextInactive,
                    ]}
                  >
                    مبلغ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.discountTypeButton,
                    discountType === 'percentage' && styles.discountTypeButtonActive,
                  ]}
                  onPress={() => setDiscountType('percentage')}
                >
                  <Text
                    style={[
                      styles.discountTypeButtonText,
                      discountType === 'percentage'
                        ? styles.discountTypeButtonTextActive
                        : styles.discountTypeButtonTextInactive,
                    ]}
                  >
                    نسبة %
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label={`الخصم (${discountType === 'percentage' ? '%' : settings.currencySymbol})`}
                value={discount}
                onChangeText={setDiscount}
                placeholder="0"
                keyboardType="numeric"
              />

              <Text style={styles.paymentMethodsTitle}>طريقة الدفع:</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'cash' && styles.paymentMethodActive,
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Banknote size={24} color={paymentMethod === 'cash' ? '#5865F2' : '#64748B'} />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'cash' && styles.paymentMethodTextActive,
                  ]}>
                    نقدي
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'card' && styles.paymentMethodActive,
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <CreditCard size={24} color={paymentMethod === 'card' ? '#5865F2' : '#64748B'} />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'card' && styles.paymentMethodTextActive,
                  ]}>
                    بطاقة
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'transfer' && styles.paymentMethodActive,
                  ]}
                  onPress={() => setPaymentMethod('transfer')}
                >
                  <Smartphone size={24} color={paymentMethod === 'transfer' ? '#5865F2' : '#64748B'} />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'transfer' && styles.paymentMethodTextActive,
                  ]}>
                    تحويل
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'credit' && styles.paymentMethodActive,
                  ]}
                  onPress={() => setPaymentMethod('credit')}
                >
                  <Clock size={24} color={paymentMethod === 'credit' ? '#5865F2' : '#64748B'} />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'credit' && styles.paymentMethodTextActive,
                  ]}>
                    آجل
                  </Text>
                </TouchableOpacity>
              </View>

              {paymentMethod !== 'credit' && (
                <View style={styles.paidAmountContainer}>
                  <Input
                    label="المبلغ المدفوع"
                    value={paidAmount}
                    onChangeText={setPaidAmount}
                    placeholder={total.toFixed(2)}
                    keyboardType="numeric"
                  />
                </View>
              )}

              {changeAmount > 0 && (
                <View style={styles.changeContainer}>
                  <Text style={styles.changeText}>
                    الباقي للعميل: {changeAmount.toFixed(2)} {settings.currencySymbol}
                  </Text>
                </View>
              )}

              <View style={styles.checkoutButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowCheckoutModal(false)}
                  variant="outline"
                  style={styles.checkoutButton2}
                />
                <Button
                  title="تأكيد الدفع"
                  onPress={handleCheckout}
                  style={styles.checkoutButton2}
                  icon={<Check size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal visible={showCameraModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '95%', height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>مسح الباركود</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCameraModal(false)}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {Platform.OS !== 'web' && permission?.granted ? (
              <View style={{ flex: 1 }}>
                <CameraView
                  style={{ flex: 1 }}
                  facing="back"
                  onBarcodeScanned={handleCameraBarcodeScan}
                >
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View style={{
                      width: 250,
                      height: 250,
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      borderRadius: 12,
                    }} />
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 20,
                      textAlign: 'center',
                      fontFamily: 'Cairo-Bold',
                    }}>
                      وجه الكاميرا نحو الباركود
                    </Text>
                  </View>
                </CameraView>
              </View>
            ) : (
              <View style={styles.emptyCart}>
                <Camera size={48} color="#CBD5E1" />
                <Text style={styles.emptyCartText}>
                  الكاميرا غير متاحة في المتصفح
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Calculator Modal */}
      <Modal visible={showCalculator} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calculatorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الحاسبة</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCalculator(false)}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.calculatorDisplay}>
              <Text style={styles.calculatorValue}>
                {calculatorValue || '0'}
              </Text>
            </View>

            <View style={styles.calculatorGrid}>
              {calculatorButtons.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.calculatorRow}>
                  {row.map((button, buttonIndex) => {
                    if (!button) return <View key={buttonIndex} style={{ flex: 1 }} />;
                    
                    const isOperator = ['/', '×', '-', '+', '=', 'C', '⌫'].includes(button);
                    
                    return (
                      <TouchableOpacity
                        key={buttonIndex}
                        style={[
                          styles.calculatorButton,
                          isOperator && styles.operatorButton,
                        ]}
                        onPress={() => handleCalculatorPress(button)}
                      >
                        <Text
                          style={[
                            styles.calculatorButtonText,
                            isOperator && styles.operatorButtonText,
                          ]}
                        >
                          {button}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}