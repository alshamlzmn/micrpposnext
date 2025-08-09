import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Plus, CreditCard as Edit, Trash2, TriangleAlert as AlertTriangle, Package, Camera, X, Upload, Tag } from 'lucide-react-native';
import { QrCode } from 'lucide-react-native';
import JsBarcode from 'jsbarcode';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product, Category } from '@/types/global';
import * as DocumentPicker from 'expo-document-picker';

export default function Inventory() {
  const { theme, t, language, products, categories, addProduct, updateProduct, deleteProduct, addCategory, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [barcodeData, setBarcodeData] = useState({
    code: '',
    productName: '',
  });
  const [generatedBarcode, setGeneratedBarcode] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    barcode: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    categoryId: '',
    description: '',
    descriptionAr: '',
    taxRate: '',
    image: '',
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      backgroundColor: '#FFFFFF',
      padding: 16,
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
    productCard: {
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
    productHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: '#F5F5F5',
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    productCategory: {
      fontSize: 12,
      color: '#666',
      marginBottom: 2,
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    productBarcode: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    productActions: {
      alignItems: 'center',
      gap: 8,
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
    lowStockIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    productDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    productPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5865F2',
      fontFamily: 'Cairo-Bold',
    },
    productCost: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    stockContainer: {
      alignItems: 'flex-end',
    },
    stockText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Cairo-SemiBold',
    },
    stockLabel: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    lowStock: {
      color: '#EF4444',
    },
    normalStock: {
      color: '#10B981',
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
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
    },
    formRow: {
      flexDirection: 'row',
      gap: 12,
    },
    formField: {
      flex: 1,
    },
    imageSection: {
      marginBottom: 16,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 12,
    },
    selectedImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
      marginBottom: 12,
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      borderStyle: 'dashed',
    },
    imageButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    imageButton: {
      flex: 1,
    },
    picker: {
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      marginBottom: 16,
    },
    pickerItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    pickerItemText: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    pickerItemSelected: {
      backgroundColor: '#5865F2',
    },
    pickerItemTextSelected: {
      color: '#FFFFFF',
    },
    barcodeContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    barcodeImage: {
      width: 250,
      height: 100,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    barcodeText: {
      fontSize: 14,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'center',
    },
    generateButtons: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    generateButton: {
      flex: 1,
    },
  });

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = product.nameAr.toLowerCase().includes(searchLower) ||
           product.name.toLowerCase().includes(searchLower) ||
           product.barcode.includes(searchLower) ||
           product.categoryAr.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameAr: '',
      barcode: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      categoryId: '',
      description: '',
      descriptionAr: '',
      taxRate: settings.taxRate.toString(),
      image: '',
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      barcode: product.barcode,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      categoryId: product.categoryId,
      description: product.description || '',
      descriptionAr: product.descriptionAr || '',
      taxRate: (product.taxRate || 15).toString(),
      image: product.image || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!formData.nameAr || !formData.barcode || !formData.price || !formData.categoryId) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const selectedCat = categories.find(c => c.id === formData.categoryId);
    
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name || formData.nameAr,
      nameAr: formData.nameAr,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 5,
      categoryId: formData.categoryId,
      category: selectedCat?.name || '',
      categoryAr: selectedCat?.nameAr || '',
      description: formData.description,
      descriptionAr: formData.descriptionAr,
      taxRate: parseFloat(formData.taxRate) || 15,
      image: formData.image,
    };

    if (editingProduct) {
      updateProduct(productData);
      Alert.alert('نجح', 'تم تحديث المنتج بنجاح');
    } else {
      addProduct(productData);
      Alert.alert('نجح', 'تم إضافة المنتج بنجاح');
    }

    setShowProductModal(false);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف المنتج ${product.nameAr}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            deleteProduct(product.id);
            Alert.alert('نجح', 'تم حذف المنتج بنجاح');
          }
        },
      ]
    );
  };

  const handleAddCategory = () => {
    if (!categoryForm.nameAr) {
      Alert.alert('خطأ', 'يرجى إدخال اسم التصنيف');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name || categoryForm.nameAr,
      nameAr: categoryForm.nameAr,
      description: categoryForm.description,
      descriptionAr: categoryForm.descriptionAr,
      createdAt: new Date(),
    };

    addCategory(newCategory);
    setCategoryForm({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
    });
    setShowCategoryModal(false);
    Alert.alert('نجح', 'تم إضافة التصنيف بنجاح');
  };

  const handleSelectImage = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use a file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              setFormData(prev => ({ ...prev, image: e.target.result }));
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else {
        // For mobile, use DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'image/*',
          copyToCacheDirectory: true,
        });
        
        if (!result.canceled && result.assets[0]) {
          setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
        }
      }
    } catch (error) {
      // Fallback to sample images
      const sampleImages = [
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
        'https://images.pexels.com/photos/1649772/pexels-photo-1649772.jpeg',
        'https://images.pexels.com/photos/1649773/pexels-photo-1649773.jpeg',
        'https://images.pexels.com/photos/1649774/pexels-photo-1649774.jpeg',
      ];
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      setFormData(prev => ({ ...prev, image: randomImage }));
    }
  };

  const handleGenerateBarcode = () => {
    if (!barcodeData.code) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الباركود');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeData.code, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
      });
      setGeneratedBarcode(canvas.toDataURL());
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إنشاء الباركود');
    }
  };

  const generateRandomBarcode = () => {
    const randomCode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    setBarcodeData(prev => ({ ...prev, code: randomCode }));
  };

  const handlePrintBarcode = () => {
    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>طباعة الباركود</title>
              <style>
                body { 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0; 
                  font-family: Arial, sans-serif;
                }
                .barcode-container {
                  text-align: center;
                  padding: 20px;
                  border: 1px solid #ccc;
                }
                .barcode-text {
                  margin-top: 10px;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                <img src="${generatedBarcode}" alt="Barcode" />
                <div class="barcode-text">
                  ${barcodeData.productName ? `${barcodeData.productName}<br>` : ''}
                  ${barcodeData.code}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      Alert.alert('معلومات', 'الطباعة متاحة على الويب فقط');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المخزون</Text>
        <View style={styles.headerButtons}>
          <Button
            title="تصنيف"
            onPress={() => setShowCategoryModal(true)}
            icon={<Tag size={16} color="#FFFFFF" />}
            size="small"
          />
          <Button
            title="باركود"
            onPress={() => setShowBarcodeModal(true)}
            icon={<QrCode size={16} color="#FFFFFF" />}
            size="small"
          />
          <Button
            title="منتج"
            onPress={handleAddProduct}
            icon={<Plus size={16} color="#FFFFFF" />}
            size="small"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.filterContainer}>
          <Input
            style={styles.searchInput}
            placeholder="البحث في المنتجات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<Search size={20} color="#666" />}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#666" />
          </TouchableOpacity>
        </View>

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

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#666" />
            <Text style={styles.emptyText}>لا توجد منتجات</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  {product.image ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImage} />
                  )}
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.nameAr}
                    </Text>
                    <Text style={styles.productCategory}>
                      {product.categoryAr}
                    </Text>
                    <Text style={styles.productBarcode}>
                      الباركود: {product.barcode}
                    </Text>
                  </View>

                  <View style={styles.productActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditProduct(product)}
                    >
                      <Edit size={16} color="#5865F2" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteProduct(product)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                    {product.stock <= product.minStock && (
                      <View style={styles.lowStockIndicator}>
                        <AlertTriangle size={16} color="#F59E0B" />
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.productDetails}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      {product.price.toFixed(2)} {settings.currencySymbol}
                    </Text>
                    <Text style={styles.productCost}>
                      التكلفة: {product.cost.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.stockContainer}>
                    <Text style={[
                      styles.stockText,
                      product.stock <= product.minStock ? styles.lowStock : styles.normalStock
                    ]}>
                      {product.stock}
                    </Text>
                    <Text style={styles.stockLabel}>في المخزون</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Product Modal */}
      <Modal visible={showProductModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowProductModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.imageSection}>
                <View style={styles.imageContainer}>
                  {formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.selectedImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Camera size={32} color="#666" />
                      <Text style={{ color: '#666', marginTop: 8, fontFamily: 'Cairo-Regular' }}>
                        اختر صورة
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.imageButtons}>
                  <Button
                    title="اختيار صورة"
                    onPress={handleSelectImage}
                    variant="outline"
                    size="small"
                    style={styles.imageButton}
                    icon={<Upload size={16} color="#5865F2" />}
                  />
                  {formData.image && (
                    <Button
                      title="إزالة"
                      onPress={() => setFormData(prev => ({ ...prev, image: '' }))}
                      variant="outline"
                      size="small"
                      style={styles.imageButton}
                    />
                  )}
                </View>
              </View>

              <Input
                label="اسم المنتج (العربية) *"
                value={formData.nameAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nameAr: text }))}
                placeholder="اسم المنتج"
              />

              <Input
                label="اسم المنتج (English)"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Product Name"
              />

              <Input
                label="الباركود *"
                value={formData.barcode}
                onChangeText={(text) => setFormData(prev => ({ ...prev, barcode: text }))}
                placeholder="1234567890123"
              />

              <Text style={{ fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, textAlign: 'right', fontFamily: 'Cairo-Medium' }}>
                التصنيف *
              </Text>
              <View style={styles.picker}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.pickerItem,
                      formData.categoryId === category.id && styles.pickerItemSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        formData.categoryId === category.id && styles.pickerItemTextSelected,
                      ]}
                    >
                      {category.nameAr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formRow}>
                <Input
                  label="السعر *"
                  value={formData.price}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                  placeholder="0.00"
                  keyboardType="numeric"
                  style={styles.formField}
                />
                <Input
                  label="التكلفة"
                  value={formData.cost}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, cost: text }))}
                  placeholder="0.00"
                  keyboardType="numeric"
                  style={styles.formField}
                />
              </View>

              <View style={styles.formRow}>
                <Input
                  label="المخزون"
                  value={formData.stock}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
                  placeholder="0"
                  keyboardType="numeric"
                  style={styles.formField}
                />
                <Input
                  label="الحد الأدنى"
                  value={formData.minStock}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, minStock: text }))}
                  placeholder="5"
                  keyboardType="numeric"
                  style={styles.formField}
                />
              </View>

              <Input
                label="معدل الضريبة (%)"
                value={formData.taxRate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, taxRate: text }))}
                placeholder="15"
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowProductModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="حفظ"
                  onPress={handleSaveProduct}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة تصنيف جديد</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              label="اسم التصنيف (العربية) *"
              value={categoryForm.nameAr}
              onChangeText={(text) => setCategoryForm(prev => ({ ...prev, nameAr: text }))}
              placeholder="اسم التصنيف"
            />

            <Input
              label="اسم التصنيف (English)"
              value={categoryForm.name}
              onChangeText={(text) => setCategoryForm(prev => ({ ...prev, name: text }))}
              placeholder="Category Name"
            />

            <Input
              label="الوصف (العربية)"
              value={categoryForm.descriptionAr}
              onChangeText={(text) => setCategoryForm(prev => ({ ...prev, descriptionAr: text }))}
              placeholder="وصف التصنيف"
            />

            <Input
              label="الوصف (English)"
              value={categoryForm.description}
              onChangeText={(text) => setCategoryForm(prev => ({ ...prev, description: text }))}
              placeholder="Category Description"
            />

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowCategoryModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="إضافة"
                onPress={handleAddCategory}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Barcode Generator Modal */}
      <Modal visible={showBarcodeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>صانع الباركود</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowBarcodeModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <Input
                label="رقم الباركود"
                value={barcodeData.code}
                onChangeText={(text) => setBarcodeData(prev => ({ ...prev, code: text }))}
                placeholder="أدخل رقم الباركود"
                keyboardType="numeric"
              />

              <Input
                label="اسم المنتج (للملصق)"
                value={barcodeData.productName}
                onChangeText={(text) => setBarcodeData(prev => ({ ...prev, productName: text }))}
                placeholder="اسم المنتج"
              />

              <View style={styles.generateButtons}>
                <Button
                  title="إنشاء باركود"
                  onPress={handleGenerateBarcode}
                  variant="outline"
                  style={styles.generateButton}
                />
                <Button
                  title="رقم عشوائي"
                  onPress={generateRandomBarcode}
                  variant="outline"
                  style={styles.generateButton}
                />
              </View>

              {generatedBarcode && (
                <View style={styles.barcodeContainer}>
                  <Image 
                    source={{ uri: generatedBarcode }} 
                    style={styles.barcodeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.barcodeText}>
                    {barcodeData.productName && `${barcodeData.productName}\n`}
                    {barcodeData.code}
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="إغلاق"
                onPress={() => setShowBarcodeModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              {generatedBarcode && (
                <Button
                  title="طباعة"
                  onPress={handlePrintBarcode}
                  style={styles.modalButton}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}