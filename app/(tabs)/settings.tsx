import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Building, 
  Receipt, 
  Percent,
  DollarSign,
  Save,
  ChevronRight,
  X,
  Wallet,
  Package,
  TrendingDown,
  Download,
  Upload,
  Database,
  HardDrive,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  const { theme, t, language, setLanguage, toggleTheme, user, settings, updateSettings, exportData, importData } = useApp();
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showCashboxModal, setShowCashboxModal] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    businessName: settings.businessName,
    businessNameAr: settings.businessNameAr,
    businessAddress: settings.businessAddress,
    businessAddressAr: settings.businessAddressAr,
    businessPhone: settings.businessPhone,
    businessEmail: settings.businessEmail,
    businessWebsite: settings.businessWebsite || '',
  });
  const [taxForm, setTaxForm] = useState({
    taxRate: settings.taxRate.toString(),
    currency: settings.currency,
    currencySymbol: settings.currencySymbol,
    invoicePrefix: settings.invoicePrefix,
    nextInvoiceNumber: settings.nextInvoiceNumber.toString(),
  });
  const [cashboxForm, setCashboxForm] = useState({
    autoAddSalesToCashbox: settings.autoAddSalesToCashbox,
    autoDeductPurchasesFromCashbox: settings.autoDeductPurchasesFromCashbox,
    autoDeductExpensesFromCashbox: settings.autoDeductExpensesFromCashbox,
  });

  const handleExportData = async () => {
    try {
      await exportData();
      Alert.alert('نجح', 'تم تصدير النسخة الاحتياطية بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تصدير النسخة الاحتياطية');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'تأكيد الاستيراد',
      'سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'استيراد',
          style: 'destructive',
          onPress: async () => {
            try {
              await importData();
              Alert.alert('نجح', 'تم استيراد البيانات بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'فشل في استيراد البيانات');
            }
          },
        },
      ]
    );
  };

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
      backgroundColor: '#FFFFFF',
      padding: 16,
    },
    userSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#5865F2',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
    },
    userRole: {
      fontSize: 14,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 12,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      marginBottom: 8,
    },
    menuItemIcon: {
      marginLeft: 12,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 2,
      fontFamily: 'Cairo-Medium',
      textAlign: 'right',
    },
    menuItemSubtitle: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    menuItemAction: {
      marginRight: 8,
    },
    languageSelector: {
      flexDirection: 'row',
      gap: 8,
    },
    languageButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      alignItems: 'center',
    },
    languageButtonActive: {
      backgroundColor: '#5865F2',
      borderColor: '#5865F2',
    },
    languageButtonText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Cairo-Medium',
    },
    languageButtonTextActive: {
      color: '#FFFFFF',
    },
    languageButtonTextInactive: {
      color: '#333',
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
    currencyPreview: {
      backgroundColor: '#F8F9FA',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      alignItems: 'center',
    },
    currencyPreviewText: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Medium',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    switchLabel: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Medium',
      flex: 1,
      textAlign: 'right',
      marginRight: 12,
    },
    switchDescription: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
      marginTop: 4,
    },
  });

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    const languages = {
      en: { code: 'en' as const, name: 'English', isRTL: false },
      ar: { code: 'ar' as const, name: 'العربية', isRTL: true },
    };
    setLanguage(languages[langCode]);
  };

  const handleSaveBusinessInfo = () => {
    updateSettings(businessForm);
    setShowBusinessModal(false);
  };

  const handleSaveTaxSettings = () => {
    updateSettings({
      taxRate: parseFloat(taxForm.taxRate) || 15,
      currency: taxForm.currency,
      currencySymbol: taxForm.currencySymbol,
      invoicePrefix: taxForm.invoicePrefix,
      nextInvoiceNumber: parseInt(taxForm.nextInvoiceNumber) || 1001,
    });
    setShowTaxModal(false);
  };

  const handleSaveCashboxSettings = () => {
    updateSettings(cashboxForm);
    setShowCashboxModal(false);
  };

  const menuSections = [
    {
      title: 'إدارة البيانات',
      items: [
        {
          title: 'حفظ نسخة احتياطية',
          subtitle: 'تصدير جميع البيانات إلى ملف JSON',
          icon: Download,
          onPress: handleExportData,
        },
        {
          title: 'استعادة نسخة احتياطية',
          subtitle: 'استيراد البيانات من ملف JSON',
          icon: Upload,
          onPress: handleImportData,
        },
        {
          title: 'قاعدة البيانات المحلية',
          subtitle: 'البيانات محفوظة محلياً - تعمل أوفلاين',
          icon: Database,
          custom: (
            <View style={{
              backgroundColor: '#10B981',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 'bold',
                fontFamily: 'Cairo-Bold',
              }}>
                متصل
              </Text>
            </View>
          ),
        },
      ],
    },
    {
      title: 'معلومات الشركة',
      items: [
        {
          title: 'معلومات الشركة',
          subtitle: 'اسم الشركة والعنوان والاتصال',
          icon: Building,
          onPress: () => setShowBusinessModal(true),
        },
        {
          title: 'الضرائب والعملة',
          subtitle: `الضريبة: ${settings.taxRate}% • العملة: ${settings.currencySymbol}`,
          icon: Percent,
          onPress: () => setShowTaxModal(true),
        },
        {
          title: 'إعدادات الصندوق',
          subtitle: 'إعدادات الإضافة والخصم التلقائي',
          icon: Wallet,
          onPress: () => setShowCashboxModal(true),
        },
      ],
    },
    {
      title: 'الإعدادات العامة',
      items: [
        {
          title: 'اللغة',
          subtitle: 'اختر لغة التطبيق',
          icon: Globe,
          custom: (
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language.code === 'en' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language.code === 'en'
                      ? styles.languageButtonTextActive
                      : styles.languageButtonTextInactive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language.code === 'ar' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('ar')}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language.code === 'ar'
                      ? styles.languageButtonTextActive
                      : styles.languageButtonTextInactive,
                  ]}
                >
                  عر
                </Text>
              </TouchableOpacity>
            </View>
          ),
        },
        {
          title: 'المظهر',
          subtitle: theme.isDark ? 'المظهر الداكن' : 'المظهر الفاتح',
          icon: theme.isDark ? Moon : Sun,
          custom: (
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: '#5865F2' }}
              thumbColor={theme.isDark ? '#FFFFFF' : '#F4F3F4'}
            />
          ),
        },
      ],
    },
    {
      title: 'الأمان',
      items: [
        {
          title: 'الأدوار والصلاحيات',
          subtitle: 'إدارة صلاحيات المستخدمين',
          icon: Shield,
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعدادات</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <User size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>مدير النظام</Text>
        </View>

        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card padding={0}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  disabled={!!item.custom}
                >
                  <View style={styles.menuItemAction}>
                    {item.custom || (
                      <ChevronRight size={16} color="#666" />
                    )}
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.menuItemIcon}>
                    <item.icon size={20} color="#5865F2" />
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>

      {/* Business Info Modal */}
      <Modal visible={showBusinessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>معلومات الشركة</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowBusinessModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Input
                label="اسم الشركة (العربية)"
                value={businessForm.businessNameAr}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessNameAr: text }))}
                placeholder="اسم الشركة"
              />

              <Input
                label="اسم الشركة (English)"
                value={businessForm.businessName}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessName: text }))}
                placeholder="Business Name"
              />

              <Input
                label="عنوان الشركة (العربية)"
                value={businessForm.businessAddressAr}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessAddressAr: text }))}
                placeholder="عنوان الشركة"
              />

              <Input
                label="عنوان الشركة (English)"
                value={businessForm.businessAddress}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessAddress: text }))}
                placeholder="Business Address"
              />

              <Input
                label="هاتف الشركة"
                value={businessForm.businessPhone}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessPhone: text }))}
                placeholder="+966112345678"
                keyboardType="phone-pad"
              />

              <Input
                label="بريد الشركة الإلكتروني"
                value={businessForm.businessEmail}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessEmail: text }))}
                placeholder="info@business.com"
                keyboardType="email-address"
              />

              <Input
                label="الموقع الإلكتروني"
                value={businessForm.businessWebsite}
                onChangeText={(text) => setBusinessForm(prev => ({ ...prev, businessWebsite: text }))}
                placeholder="https://www.business.com"
                keyboardType="url"
              />

              <View style={styles.modalButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowBusinessModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="حفظ"
                  onPress={handleSaveBusinessInfo}
                  style={styles.modalButton}
                  icon={<Save size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Tax Settings Modal */}
      <Modal visible={showTaxModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>الضرائب والعملة</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowTaxModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Input
                label="معدل الضريبة الافتراضي (%)"
                value={taxForm.taxRate}
                onChangeText={(text) => setTaxForm(prev => ({ ...prev, taxRate: text }))}
                placeholder="15"
                keyboardType="numeric"
              />

              <Input
                label="العملة"
                value={taxForm.currency}
                onChangeText={(text) => setTaxForm(prev => ({ ...prev, currency: text }))}
                placeholder="SAR"
              />

              <Input
                label="رمز العملة"
                value={taxForm.currencySymbol}
                onChangeText={(text) => setTaxForm(prev => ({ ...prev, currencySymbol: text }))}
                placeholder="ريال"
              />

              <View style={styles.currencyPreview}>
                <Text style={styles.currencyPreviewText}>
                  مثال: 100.00 {taxForm.currencySymbol}
                </Text>
              </View>

              <Input
                label="بادئة رقم الفاتورة"
                value={taxForm.invoicePrefix}
                onChangeText={(text) => setTaxForm(prev => ({ ...prev, invoicePrefix: text }))}
                placeholder="INV"
              />

              <Input
                label="رقم الفاتورة التالي"
                value={taxForm.nextInvoiceNumber}
                onChangeText={(text) => setTaxForm(prev => ({ ...prev, nextInvoiceNumber: text }))}
                placeholder="1001"
                keyboardType="numeric"
              />

              <View style={styles.currencyPreview}>
                <Text style={styles.currencyPreviewText}>
                  مثال: {taxForm.invoicePrefix}-{taxForm.nextInvoiceNumber.padStart(4, '0')}
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <Button
                  title="إلغاء"
                  onPress={() => setShowTaxModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title="حفظ"
                  onPress={handleSaveTaxSettings}
                  style={styles.modalButton}
                  icon={<Save size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Cashbox Settings Modal */}
      <Modal visible={showCashboxModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إعدادات الصندوق</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCashboxModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Switch
                value={cashboxForm.autoAddSalesToCashbox}
                onValueChange={(value) => setCashboxForm(prev => ({ ...prev, autoAddSalesToCashbox: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={cashboxForm.autoAddSalesToCashbox ? '#FFFFFF' : '#F4F3F4'}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>إضافة مبالغ المبيعات للصندوق تلقائياً</Text>
                <Text style={styles.switchDescription}>
                  عند تفعيل هذا الخيار، ستتم إضافة مبالغ المبيعات المدفوعة للصندوق تلقائياً
                </Text>
              </View>
            </View>

            <View style={styles.switchContainer}>
              <Switch
                value={cashboxForm.autoDeductPurchasesFromCashbox}
                onValueChange={(value) => setCashboxForm(prev => ({ ...prev, autoDeductPurchasesFromCashbox: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={cashboxForm.autoDeductPurchasesFromCashbox ? '#FFFFFF' : '#F4F3F4'}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>خصم مبالغ المشتريات من الصندوق تلقائياً</Text>
                <Text style={styles.switchDescription}>
                  عند تفعيل هذا الخيار، ستتم خصم مبالغ المشتريات المدفوعة من الصندوق تلقائياً
                </Text>
              </View>
            </View>

            <View style={styles.switchContainer}>
              <Switch
                value={cashboxForm.autoDeductExpensesFromCashbox}
                onValueChange={(value) => setCashboxForm(prev => ({ ...prev, autoDeductExpensesFromCashbox: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={cashboxForm.autoDeductExpensesFromCashbox ? '#FFFFFF' : '#F4F3F4'}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>خصم مبالغ المصروفات من الصندوق تلقائياً</Text>
                <Text style={styles.switchDescription}>
                  عند تفعيل هذا الخيار، ستتم خصم مبالغ المصروفات من الصندوق تلقائياً
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowCashboxModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="حفظ"
                onPress={handleSaveCashboxSettings}
                style={styles.modalButton}
                icon={<Save size={16} color="#FFFFFF" />}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}