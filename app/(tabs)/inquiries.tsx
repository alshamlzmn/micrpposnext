import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Package, Users, Truck, ShoppingCart, DollarSign, TrendingDown, Calendar, FileText, X, ChartBar as BarChart3 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const { width } = Dimensions.get('window');

export default function Inquiries() {
  const { theme, t, language, products, customers, suppliers, sales, settings, cashboxTransactions } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    gridContainer: {
      flex: 1,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    gridItem: {
      flex: 0.48,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    productsIcon: {
      backgroundColor: '#FFF8DC',
    },
    customersIcon: {
      backgroundColor: '#E6F3FF',
    },
    suppliersIcon: {
      backgroundColor: '#FFF8DC',
    },
    salesIcon: {
      backgroundColor: '#F0FFF0',
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: width * 0.9,
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
    },
    closeButton: {
      padding: 5,
    },
    searchContainer: {
      marginBottom: 20,
    },
    listContainer: {
      maxHeight: 400,
    },
    listItem: {
      backgroundColor: '#f9f9f9',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 5,
    },
    listItemSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  });

  const inquiryItems = [
    {
      title: 'استعلام المنتجات',
      icon: Package,
      iconStyle: styles.productsIcon,
      color: '#B8860B',
      type: 'products',
    },
    {
      title: 'استعلام العملاء',
      icon: Users,
      iconStyle: styles.customersIcon,
      color: '#1E90FF',
      type: 'customers',
    },
    {
      title: 'استعلام الموردين',
      icon: Truck,
      iconStyle: styles.suppliersIcon,
      color: '#DAA520',
      type: 'suppliers',
    },
    {
      title: 'استعلام المبيعات',
      icon: ShoppingCart,
      iconStyle: styles.salesIcon,
      color: '#228B22',
      type: 'sales',
    }
  ];

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < inquiryItems.length; i += 2) {
      const FirstIcon = inquiryItems[i].icon;
      const SecondIcon = inquiryItems[i + 1]?.icon;
      
      rows.push(
        <View key={i} style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
              setSelectedInquiry(inquiryItems[i].type);
              setShowModal(true);
            }}
          >
            <View style={[styles.iconContainer, inquiryItems[i].iconStyle]}>
              <FirstIcon size={24} color={inquiryItems[i].color} />
            </View>
            <Text style={styles.itemTitle}>{inquiryItems[i].title}</Text>
          </TouchableOpacity>

          {i + 1 < inquiryItems.length && (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                setSelectedInquiry(inquiryItems[i + 1].type);
                setShowModal(true);
              }}
            >
              <View style={[styles.iconContainer, inquiryItems[i + 1].iconStyle]}>
                <SecondIcon size={24} color={inquiryItems[i + 1].color} />
              </View>
              <Text style={styles.itemTitle}>{inquiryItems[i + 1].title}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  const getModalTitle = () => {
    switch (selectedInquiry) {
      case 'products':
        return 'استعلام المنتجات';
      case 'customers':
        return 'استعلام العملاء';
      case 'suppliers':
        return 'استعلام الموردين';
      case 'sales':
        return 'استعلام المبيعات';
      default:
        return 'استعلام';
    }
  };

  const filterData = (data: any[], query: string) => {
    if (!query) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const renderInquiryContent = () => {
    let data: any[] = [];
    
    switch (selectedInquiry) {
      case 'products':
        data = products || [];
        break;
      case 'customers':
        data = customers || [];
        break;
      case 'suppliers':
        data = suppliers || [];
        break;
      case 'sales':
        data = sales || [];
        break;
      default:
        data = [];
    }

    const filteredData = filterData(data, searchQuery);

    return (
      <>
        <View style={styles.searchContainer}>
          <Input
            placeholder="البحث..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemTitle}>
                  {item.nameAr || item.name || item.title || item.customerName || item.supplierName || `عنصر ${index + 1}`}
                </Text>
                <Text style={styles.listItemSubtitle}>
                  {selectedInquiry === 'products' && `السعر: ${item.price || 'غير محدد'} - التصنيف: ${item.categoryAr || 'غير محدد'}`}
                  {selectedInquiry === 'customers' && `الهاتف: ${item.phone || 'غير محدد'}`}
                  {selectedInquiry === 'suppliers' && `الهاتف: ${item.phone || 'غير محدد'}`}
                  {selectedInquiry === 'sales' && `المبلغ: ${item.total || item.amount || 'غير محدد'} - العميل: ${item.customer?.nameAr || 'عميل غير مسجل'}`}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد بيانات'}
              </Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الاستعلامات</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {renderGridItems()}
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowModal(false);
                  setSearchQuery('');
                }}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {renderInquiryContent()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}