import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet, 
  TrendingDown, 
  Search, 
  Package, 
  Settings, 
  ChartBar as BarChart3, 
  FileText, 
  CircleHelp as HelpCircle, 
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Info,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function More() {
  const { theme, t, language, settings } = useApp();

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
    settingsIcon: {
      backgroundColor: '#F0F8FF',
    },
    reportsIcon: {
      backgroundColor: '#FFF8DC',
    },
    salesIcon: {
      backgroundColor: '#E8F5E8',
    },
    helpIcon: {
      backgroundColor: '#FFE4B5',
    },
    helpSection: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    helpTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      fontFamily: 'Cairo-Bold',
      textAlign: 'center',
    },
    helpItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    helpItemContent: {
      flex: 1,
      marginRight: 12,
    },
    helpItemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    helpItemDescription: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    helpItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    phoneIcon: {
      backgroundColor: '#10B981' + '20',
    },
    emailIcon: {
      backgroundColor: '#3B82F6' + '20',
    },
    whatsappIcon: {
      backgroundColor: '#25D366' + '20',
    },
    websiteIcon: {
      backgroundColor: '#8B5CF6' + '20',
    },
    aboutIcon: {
      backgroundColor: '#F59E0B' + '20',
    },
  });

  const moreMenuItems = [
    {
      title: 'الصندوق',
      icon: Wallet,
      iconStyle: styles.cashboxIcon,
      color: '#32CD32',
      onPress: () => router.push('/(tabs)/cashbox'),
    },
    {
      title: 'الفواتير الإلكترونية',
      icon: FileText,
      iconStyle: styles.salesIcon,
      color: '#5865F2',
      onPress: () => router.push('/(tabs)/invoices'),
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
    {
      title: 'الإعدادات',
      icon: Settings,
      iconStyle: styles.settingsIcon,
      color: '#4169E1',
      onPress: () => router.push('/(tabs)/settings'),
    },
    {
      title: 'التقارير',
      icon: BarChart3,
      iconStyle: styles.reportsIcon,
      color: '#DAA520',
      onPress: () => router.push('/(tabs)/reports'),
    },
    {
      title: 'المبيعات',
      icon: FileText,
      iconStyle: styles.salesIcon,
      color: '#228B22',
      onPress: () => router.push('/(tabs)/sales'),
    },
    {
      title: 'المساعدة',
      icon: HelpCircle,
      iconStyle: styles.helpIcon,
      color: '#FF8C00',
      onPress: () => {
        // Scroll to help section
      },
    },
  ];

  const helpItems = [
    {
      title: 'الدعم الفني',
      description: 'تواصل معنا للحصول على المساعدة الفنية',
      icon: Phone,
      iconStyle: styles.phoneIcon,
      color: '#10B981',
      onPress: () => {
        Alert.alert(
          'الدعم الفني',
          `رقم الدعم الفني: ${settings.businessPhone}\n\nأوقات العمل:\nالأحد - الخميس: 9:00 ص - 6:00 م\nالجمعة - السبت: مغلق`,
          [
            { text: 'إلغاء', style: 'cancel' },
            { 
              text: 'اتصال', 
              onPress: () => Linking.openURL(`tel:${settings.businessPhone}`)
            },
          ]
        );
      },
    },
    {
      title: 'البريد الإلكتروني',
      description: 'أرسل استفسارك عبر البريد الإلكتروني',
      icon: Mail,
      iconStyle: styles.emailIcon,
      color: '#3B82F6',
      onPress: () => {
        Linking.openURL(`mailto:${settings.businessEmail}?subject=استفسار عن مايكرو بوس`);
      },
    },
    {
      title: 'واتساب',
      description: 'تواصل معنا عبر الواتساب للدعم السريع',
      icon: MessageCircle,
      iconStyle: styles.whatsappIcon,
      color: '#25D366',
      onPress: () => {
        const phoneNumber = settings.businessPhone.replace(/[^0-9]/g, '');
        Linking.openURL(`https://wa.me/${phoneNumber}?text=مرحباً، أحتاج مساعدة في مايكرو بوس`);
      },
    },
    {
      title: 'الموقع الإلكتروني',
      description: 'زيارة موقعنا الإلكتروني للمزيد من المعلومات',
      icon: Globe,
      iconStyle: styles.websiteIcon,
      color: '#8B5CF6',
      onPress: () => {
        Linking.openURL(settings.businessWebsite || 'https://micropos.com');
      },
    },
    {
      title: 'حول التطبيق',
      description: 'معلومات عن الإصدار والميزات',
      icon: Info,
      iconStyle: styles.aboutIcon,
      color: '#F59E0B',
      onPress: () => {
        Alert.alert(
          'حول مايكرو بوس',
          `الإصدار: 1.0.0

نظام إدارة المتاجر الذكي

الشركة: ${settings.businessNameAr}
العنوان: ${settings.businessAddressAr}
الهاتف: ${settings.businessPhone}
البريد: ${settings.businessEmail}

الميزات:
• إدارة المبيعات والمشتريات
• إدارة المخزون والعملاء
• التقارير والإحصائيات
• إدارة الصندوق والمصروفات
• نظام نقطة البيع المتطور
• دعم الباركود والكاميرا
• طباعة الفواتير
• إدارة التصنيفات
• نظام العملاء والموردين
• تقارير مالية شاملة

© 2024 MicroPOS. جميع الحقوق محفوظة.

تم تطوير هذا التطبيق بواسطة فريق مايكرو بوس لتوفير حلول متكاملة لإدارة المتاجر والأعمال التجارية الصغيرة والمتوسطة.

للدعم الفني والاستفسارات:
هاتف: ${settings.businessPhone}
بريد إلكتروني: ${settings.businessEmail}
موقع إلكتروني: https://micropos.com

شكراً لاستخدامكم مايكرو بوس!`,
          [{ text: 'موافق' }]
        );
      },
    },
  ];

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < moreMenuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {moreMenuItems.slice(i, i + 2).map((item, index) => (
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
          {moreMenuItems.slice(i, i + 2).length === 1 && (
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
        <Text style={styles.headerTitle}>المزيد</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {renderGridItems()}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>المساعدة والدعم</Text>
          
          {helpItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.helpItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.helpItemIcon, item.iconStyle]}>
                <item.icon size={20} color={item.color} />
              </View>
              
              <View style={styles.helpItemContent}>
                <Text style={styles.helpItemTitle}>{item.title}</Text>
                <Text style={styles.helpItemDescription}>{item.description}</Text>
              </View>
              
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}