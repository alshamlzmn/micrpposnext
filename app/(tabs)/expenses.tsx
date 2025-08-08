import React from 'react';
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
import { ArrowLeft, Menu, TrendingDown, Plus, Eye, FileText, X, DollarSign, Calendar, Tag } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
const { width } = Dimensions.get('window');

interface Expense {
  id: string;
  date: Date;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending';
  notes?: string;
}

export default function Expenses() {
  const { theme, t, language, settings, addCashboxTransaction } = useApp();
  const [showSubMenu, setShowSubMenu] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showReportsModal, setShowReportsModal] = React.useState(false);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [formData, setFormData] = React.useState({
    category: '',
    categoryAr: '',
    description: '',
    descriptionAr: '',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'transfer',
    notes: '',
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
    addExpenseIcon: {
      backgroundColor: '#E8F5E8',
    },
    viewExpensesIcon: {
      backgroundColor: '#E6F3FF',
    },
    expenseReportsIcon: {
      backgroundColor: '#FFF8DC',
    },
    categoriesIcon: {
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
    expenseCard: {
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
    expenseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    expenseCategory: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
      flex: 1,
    },
    expenseAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#EF4444',
      fontFamily: 'Cairo-Bold',
    },
    expenseDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    expenseDate: {
      fontSize: 12,
      color: '#999',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
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
    totalExpenses: {
      color: '#EF4444',
    },
    totalCount: {
      color: '#5865F2',
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
    categorySelector: {
      marginBottom: 16,
    },
    categoryOption: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      backgroundColor: '#F8F9FA',
    },
    categoryOptionSelected: {
      backgroundColor: '#5865F2',
    },
    categoryOptionText: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    categoryOptionTextSelected: {
      color: '#FFFFFF',
    },
  });

  const expenseCategories = [
    { id: 'rent', nameAr: 'إيجار', name: 'Rent' },
    { id: 'utilities', nameAr: 'مرافق', name: 'Utilities' },
    { id: 'supplies', nameAr: 'مستلزمات', name: 'Supplies' },
    { id: 'marketing', nameAr: 'تسويق', name: 'Marketing' },
    { id: 'maintenance', nameAr: 'صيانة', name: 'Maintenance' },
    { id: 'transport', nameAr: 'نقل', name: 'Transport' },
    { id: 'other', nameAr: 'أخرى', name: 'Other' },
  ];

  const expenseMenuItems = [
    {
      title: 'إضافة مصروف',
      icon: Plus,
      iconStyle: styles.addExpenseIcon,
      color: '#32CD32',
      onPress: () => {
        setShowSubMenu(false);
        setShowAddModal(true);
      },
    },
    {
      title: 'عرض المصروفات',
      icon: Eye,
      iconStyle: styles.viewExpensesIcon,
      color: '#4169E1',
      onPress: () => {
        setShowSubMenu(false);
        setShowViewModal(true);
      },
    },
    {
      title: 'تقارير المصروفات',
      icon: FileText,
      iconStyle: styles.expenseReportsIcon,
      color: '#DAA520',
      onPress: () => {
        setShowSubMenu(false);
        setShowReportsModal(true);
      },
    },
    {
      title: 'فئات المصروفات',
      icon: Tag,
      iconStyle: styles.categoriesIcon,
      color: '#DC143C',
      onPress: () => {
        Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً');
      },
    },
  ];

  const handleAddExpense = () => {
    if (!formData.categoryAr || !formData.descriptionAr || !formData.amount) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: new Date(),
      category: formData.category || formData.categoryAr,
      categoryAr: formData.categoryAr,
      description: formData.description || formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      status: 'completed',
      notes: formData.notes,
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Add cashbox transaction if auto-deduct is enabled
    if (settings.autoDeductExpensesFromCashbox) {
      addCashboxTransaction({
        id: Date.now().toString(),
        type: 'subtract',
        amount: newExpense.amount,
        description: `Expense - ${newExpense.description}`,
        descriptionAr: `مصروف - ${newExpense.descriptionAr}`,
        date: new Date(),
        isActive: true,
        source: 'expense',
        referenceId: newExpense.id,
      });
    }

    setFormData({
      category: '',
      categoryAr: '',
      description: '',
      descriptionAr: '',
      amount: '',
      paymentMethod: 'cash',
      notes: '',
    });
    setShowAddModal(false);
    Alert.alert('نجح', 'تم إضافة المصروف بنجاح');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderGridItems = () => {
    const rows = [];
    for (let i = 0; i < expenseMenuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {expenseMenuItems.slice(i, i + 2).map((item, index) => (
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
          {expenseMenuItems.slice(i, i + 2).length === 1 && (
            <View style={[styles.gridItem, { opacity: 0 }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todayExpenses = expenses.filter(expense => {
    const today = new Date();
    const expenseDate = new Date(expense.date);
    return expenseDate.toDateString() === today.toDateString();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المصروفات</Text>
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

      {/* Add Expense Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة مصروف جديد</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' }}>
                فئة المصروف *
              </Text>
              <View style={styles.categorySelector}>
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      formData.categoryAr === category.nameAr && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      category: category.name,
                      categoryAr: category.nameAr 
                    }))}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formData.categoryAr === category.nameAr && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {category.nameAr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="الوصف (العربية) *"
                value={formData.descriptionAr}
                onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionAr: text }))}
                placeholder="وصف المصروف"
              />

              <Input
                label="الوصف (English)"
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Expense description"
              />

              <Input
                label="المبلغ *"
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                placeholder="0.00"
                keyboardType="numeric"
                icon={<DollarSign size={20} color="#666" />}
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
              </View>

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
                  onPress={handleAddExpense}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Expenses Modal */}
      <Modal visible={showViewModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>عرض المصروفات</Text>
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
                <Text style={styles.summaryTitle}>ملخص المصروفات</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalExpenses]}>
                    {totalExpenses.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي المصروفات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalCount]}>
                    {expenses.length}
                  </Text>
                  <Text style={styles.summaryLabel}>عدد المصروفات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalCount]}>
                    {todayExpenses.length}
                  </Text>
                  <Text style={styles.summaryLabel}>مصروفات اليوم</Text>
                </View>
              </Card>

              {expenses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا توجد مصروفات مسجلة</Text>
                </View>
              ) : (
                expenses.map((expense) => (
                  <Card key={expense.id} style={styles.expenseCard}>
                    <View style={styles.expenseHeader}>
                      <Text style={styles.expenseCategory}>{expense.categoryAr}</Text>
                      <Text style={styles.expenseAmount}>
                        -{expense.amount.toFixed(2)} {settings.currencySymbol}
                      </Text>
                    </View>
                    <Text style={styles.expenseDescription}>
                      {expense.descriptionAr}
                    </Text>
                    <Text style={styles.expenseDate}>
                      {formatDate(expense.date)} • {
                        expense.paymentMethod === 'cash' ? 'نقدي' :
                        expense.paymentMethod === 'card' ? 'بطاقة' : 'تحويل'
                      }
                    </Text>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Expense Reports Modal */}
      <Modal visible={showReportsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تقارير المصروفات</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowReportsModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>تقرير شامل للمصروفات</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalExpenses]}>
                    {totalExpenses.toFixed(2)} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>إجمالي المصروفات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalCount]}>
                    {expenses.length}
                  </Text>
                  <Text style={styles.summaryLabel}>عدد المعاملات</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, styles.totalExpenses]}>
                    {expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'} {settings.currencySymbol}
                  </Text>
                  <Text style={styles.summaryLabel}>متوسط المصروف</Text>
                </View>
              </Card>

              {expenseCategories.map((category) => {
                const categoryExpenses = expenses.filter(e => e.categoryAr === category.nameAr);
                const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                
                if (categoryTotal === 0) return null;
                
                return (
                  <Card key={category.id} style={styles.expenseCard}>
                    <View style={styles.expenseHeader}>
                      <Text style={styles.expenseCategory}>{category.nameAr}</Text>
                      <Text style={styles.expenseAmount}>
                        {categoryTotal.toFixed(2)} {settings.currencySymbol}
                      </Text>
                    </View>
                    <Text style={styles.expenseDescription}>
                      عدد المعاملات: {categoryExpenses.length}
                    </Text>
                  </Card>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}