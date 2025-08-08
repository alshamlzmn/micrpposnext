import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  Wallet, 
  TrendingDown, 
  Search,
  Calculator
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { theme, t, language, user, products, sales, customers, suppliers } = useApp();

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
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
    },
    notificationBadge: {
      backgroundColor: '#FFD700',
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationText: {
      color: '#000',
      fontSize: 12,
      fontWeight: 'bold',
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
    salesIcon: {
      backgroundColor: '#FFE4B5',
    },
    purchasesIcon: {
      backgroundColor: '#E6F3FF',
    },
    customersIcon: {
      backgroundColor: '#F0F8FF',
    },
    suppliersIcon: {
      backgroundColor: '#FFF8DC',
    },
    cashboxIcon: {
      backgroundColor: '#F0FFF0',
    },
    expensesIcon: {
      backgroundColor: '#FFE4E1',
    },
    inventoryIcon: {
      backgroundColor: '#F5F5DC',
    },
    inquiriesIcon: {
      backgroundColor: '#E0E6FF',
    },
  });

  const menuItems = [
    {
      title: 'المبيعات',
      icon: ShoppingCart,
      iconStyle: styles.salesIcon,
      color: '#FF8C00',
      onPress: () => router.push('/(tabs)/pos'),
    },
    {
      title: 'المشتريات',
      icon: Package,
      iconStyle: styles.purchasesIcon,
      color: '#4169E1',
      onPress: () => router.push('/(tabs)/purchases'),
    },
    {
      title: 'العملاء',
      icon: Users,
      iconStyle: styles.customersIcon,
      color: '#1E90FF',
      onPress: () => router.push('/(tabs)/customers'),
    },
    {
      title: 'الموردين',
      icon: Truck,
      iconStyle: styles.suppliersIcon,
      color: '#DAA520',
      onPress: () => router.push('/(tabs)/suppliers'),
    },
    {
      title: 'الصندوق',
      icon: Wallet,
      iconStyle: styles.cashboxIcon,
      color: '#32CD32',
      onPress: () => router.push('/(tabs)/cashbox'),
    },
    {
      title: 'المصروفات',
      icon: TrendingDown,
      iconStyle: styles.expensesIcon,
      color: '#DC143C',
      onPress: () => router.push('/(tabs)/expenses'),
    },
    {
      title: 'المخزون',
      icon: Package,
      iconStyle: styles.inventoryIcon,
      color: '#B8860B',
      onPress: () => router.push('/(tabs)/inventory'),
    },
    {
      title: 'الاستعلامات',
      icon: Search,
      iconStyle: styles.inquiriesIcon,
      color: '#6A5ACD',
      onPress: () => router.push('/(tabs)/inquiries'),
    },
  ];

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < menuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {menuItems.slice(i, i + 2).map((item, index) => (
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
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MicroPOS</Text>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>1</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {renderGridItems()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}